#!/usr/bin/env python3
"""
Fix Superset Graph Chart - Metric 'weight' does not exist error

The issue: The chart is configured with "metric": "weight" but 'weight'
is not registered as a metric in the dataset. For ECharts Graph charts,
we need to either:
1. Register 'weight' as a metric in the dataset
2. Use an aggregate like SUM(weight) or MAX(weight)
3. Or simply use source_category/target_category without a metric

This script fixes the chart by using COUNT(*) as the metric instead,
or by adding 'weight' as a metric to the dataset.

Usage:
    python3 scripts/fix-superset-graph-chart.py

Created: 2026-01-11
"""

import requests
import json
import re
import sys

# Configuration
SUPERSET_URL = "http://74.50.97.243:8088"
USERNAME = "admin"
PASSWORD = "EventsHive2025!"

# Target resources
CHART_ID = 179  # Israeli Tech Network Graph
DATASET_ID = 66  # notalone.v_network_graph_edges


class SupersetSessionClient:
    """Superset client using session-based (cookie) authentication"""

    def __init__(self, base_url, username, password):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.session.timeout = 60
        self.username = username
        self.password = password
        self.csrf_token = None

    def login(self):
        """Login via web form to get session cookie"""
        # Get login page
        resp = self.session.get(f"{self.base_url}/login/")
        if resp.status_code != 200:
            print(f"Failed to get login page: {resp.status_code}")
            return False

        # Extract CSRF token from form
        match = re.search(r'name="csrf_token"[^>]*value="([^"]+)"', resp.text)
        form_csrf = match.group(1) if match else None

        if not form_csrf:
            print("Could not find CSRF token in login form")
            return False

        # Submit login form
        resp = self.session.post(
            f"{self.base_url}/login/",
            data={
                "username": self.username,
                "password": self.password,
                "csrf_token": form_csrf
            },
            allow_redirects=True
        )

        if resp.status_code != 200:
            print(f"Login failed: {resp.status_code}")
            return False

        # Get API CSRF token
        resp = self.session.get(f"{self.base_url}/api/v1/security/csrf_token/")
        if resp.status_code == 200:
            self.csrf_token = resp.json().get("result")
            print("[OK] Logged in successfully")
            return True

        print(f"Failed to get API CSRF token: {resp.status_code}")
        return False

    def refresh_csrf(self):
        """Refresh CSRF token"""
        resp = self.session.get(f"{self.base_url}/api/v1/security/csrf_token/")
        if resp.status_code == 200:
            self.csrf_token = resp.json().get("result")
            return True
        return False

    def _headers(self):
        headers = {"Content-Type": "application/json"}
        if self.csrf_token:
            headers["X-CSRFToken"] = self.csrf_token
        return headers

    def get(self, endpoint):
        """HTTP GET"""
        return self.session.get(
            f"{self.base_url}{endpoint}",
            headers=self._headers()
        )

    def post(self, endpoint, data):
        """HTTP POST"""
        self.refresh_csrf()
        return self.session.post(
            f"{self.base_url}{endpoint}",
            headers=self._headers(),
            json=data
        )

    def put(self, endpoint, data):
        """HTTP PUT"""
        self.refresh_csrf()
        return self.session.put(
            f"{self.base_url}{endpoint}",
            headers=self._headers(),
            json=data
        )


def get_dataset_info(client, dataset_id):
    """Get dataset columns and metrics"""
    resp = client.get(f"/api/v1/dataset/{dataset_id}")
    if resp.status_code != 200:
        print(f"Failed to get dataset: {resp.status_code}")
        return None

    result = resp.json().get("result", {})

    print("\n--- Dataset Info ---")
    print(f"ID: {result.get('id')}")
    print(f"Table Name: {result.get('table_name')}")
    print(f"Schema: {result.get('schema')}")

    # Columns
    columns = result.get("columns", [])
    print(f"\nColumns ({len(columns)}):")
    for col in columns:
        print(f"  - {col.get('column_name')} ({col.get('type')})")

    # Metrics
    metrics = result.get("metrics", [])
    print(f"\nMetrics ({len(metrics)}):")
    for m in metrics:
        print(f"  - {m.get('metric_name')}: {m.get('expression')}")

    return result


def get_chart_info(client, chart_id):
    """Get current chart configuration"""
    resp = client.get(f"/api/v1/chart/{chart_id}")
    if resp.status_code != 200:
        print(f"Failed to get chart: {resp.status_code}")
        return None

    result = resp.json().get("result", {})

    print("\n--- Chart Info ---")
    print(f"ID: {result.get('id')}")
    print(f"Name: {result.get('slice_name')}")
    print(f"Viz Type: {result.get('viz_type')}")

    params_str = result.get("params", "{}")
    try:
        params = json.loads(params_str)
        print(f"\nParams:")
        for k, v in params.items():
            print(f"  {k}: {v}")
    except:
        print(f"  Raw params: {params_str[:500]}")

    return result


def add_weight_metric_to_dataset(client, dataset_id):
    """Add 'weight' as a metric to the dataset"""
    print("\n[+] Adding 'weight' metric to dataset...")

    # First get current dataset state
    resp = client.get(f"/api/v1/dataset/{dataset_id}")
    if resp.status_code != 200:
        print(f"  Failed to get dataset: {resp.status_code}")
        return False

    dataset = resp.json().get("result", {})

    # Check if weight metric already exists
    existing_metrics = dataset.get("metrics", [])
    for m in existing_metrics:
        if m.get("metric_name") == "weight":
            print("  'weight' metric already exists")
            return True

    # Create new metric
    new_metric = {
        "metric_name": "weight",
        "expression": "weight",  # Just reference the column
        "metric_type": "count",
        "verbose_name": "Edge Weight",
        "description": "Weight of the network edge connection"
    }

    # Use dataset metrics endpoint
    resp = client.post(f"/api/v1/dataset/{dataset_id}/metric/", new_metric)

    if resp.status_code in [200, 201]:
        print("  Successfully added 'weight' metric")
        return True
    else:
        print(f"  Failed to add metric: {resp.status_code}")
        print(f"  Response: {resp.text[:500]}")
        return False


def update_chart_metric(client, chart_id, use_count=False):
    """Update chart to fix the metric issue"""
    print("\n[+] Updating chart configuration...")

    # Get current chart
    resp = client.get(f"/api/v1/chart/{chart_id}")
    if resp.status_code != 200:
        print(f"  Failed to get chart: {resp.status_code}")
        return False

    chart = resp.json().get("result", {})
    params_str = chart.get("params", "{}")

    try:
        params = json.loads(params_str)
    except:
        params = {}

    # Fix the metric configuration
    # For ECharts Graph, we can either:
    # 1. Remove metric entirely (optional for graph charts)
    # 2. Use COUNT(*) aggregate
    # 3. Use a proper metric expression

    if use_count:
        # Use COUNT(*) as aggregation
        params["metric"] = {
            "expressionType": "SIMPLE",
            "column": None,
            "aggregate": "COUNT",
            "label": "COUNT(*)"
        }
    else:
        # Use the weight column directly with MAX aggregation
        # This is the proper way to reference a column as metric
        params["metric"] = {
            "expressionType": "SIMPLE",
            "column": {
                "column_name": "weight",
                "type": "INTEGER"
            },
            "aggregate": "MAX",
            "label": "weight"
        }

    # Update chart
    update_data = {
        "params": json.dumps(params)
    }

    resp = client.put(f"/api/v1/chart/{chart_id}", update_data)

    if resp.status_code == 200:
        print("  Chart updated successfully")
        return True
    else:
        print(f"  Failed to update chart: {resp.status_code}")
        print(f"  Response: {resp.text[:500]}")
        return False


def fix_chart_with_adhoc_metric(client, chart_id):
    """Fix chart by using adhoc_metrics instead of metric string"""
    print("\n[+] Fixing chart with adhoc_metrics...")

    # Get current chart
    resp = client.get(f"/api/v1/chart/{chart_id}")
    if resp.status_code != 200:
        print(f"  Failed to get chart: {resp.status_code}")
        return False

    chart = resp.json().get("result", {})
    params_str = chart.get("params", "{}")

    try:
        params = json.loads(params_str)
    except:
        params = {}

    print(f"  Current metric value: {params.get('metric')}")

    # For ECharts Graph chart, the metric should be an adhoc metric
    # Remove the string 'weight' and replace with proper structure

    # Option 1: Remove metric entirely (graphs work without it)
    if "metric" in params:
        del params["metric"]

    # Add edge_weight as the value field using adhoc metrics
    params["adhoc_metrics"] = [{
        "aggregate": "MAX",
        "column": {
            "column_name": "weight",
            "type": "INTEGER"
        },
        "expressionType": "SIMPLE",
        "hasCustomLabel": True,
        "label": "Edge Weight",
        "optionName": "metric_weight"
    }]

    # Or use edge_weight directly if supported
    params["edge_weight"] = "weight"

    # Ensure other required params
    params["source"] = "source"
    params["target"] = "target"
    params["source_category"] = "category"
    params["target_category"] = "category"

    # Update chart
    update_data = {
        "params": json.dumps(params)
    }

    resp = client.put(f"/api/v1/chart/{chart_id}", update_data)

    if resp.status_code == 200:
        print("  Chart updated successfully with adhoc_metrics")
        return True
    else:
        print(f"  Failed to update chart: {resp.status_code}")
        print(f"  Response: {resp.text[:500]}")
        return False


def main():
    print("=" * 60)
    print("FIX SUPERSET GRAPH CHART")
    print("Resolving: Metric 'weight' does not exist")
    print("=" * 60)
    print(f"\nSuperset URL: {SUPERSET_URL}")
    print(f"Chart ID: {CHART_ID}")
    print(f"Dataset ID: {DATASET_ID}")

    client = SupersetSessionClient(SUPERSET_URL, USERNAME, PASSWORD)

    # Login
    print("\n[1] Logging in...")
    if not client.login():
        sys.exit(1)

    # Get current state
    print("\n[2] Getting current configuration...")
    dataset_info = get_dataset_info(client, DATASET_ID)
    chart_info = get_chart_info(client, CHART_ID)

    if not dataset_info or not chart_info:
        print("\nFailed to get current state")
        sys.exit(1)

    # Try to fix with adhoc metrics approach
    print("\n[3] Applying fix...")
    success = fix_chart_with_adhoc_metric(client, CHART_ID)

    if not success:
        # Fallback: Try to update metric to COUNT(*)
        print("\n[4] Trying fallback fix with COUNT(*)...")
        success = update_chart_metric(client, CHART_ID, use_count=True)

    # Verify fix
    print("\n[5] Verifying fix...")
    get_chart_info(client, CHART_ID)

    # Summary
    print("\n" + "=" * 60)
    if success:
        print("FIX APPLIED")
    else:
        print("FIX FAILED - May need manual intervention")
    print("=" * 60)
    print(f"""
Chart URL: {SUPERSET_URL}/explore/?slice_id={CHART_ID}
Dashboard URL: {SUPERSET_URL}/superset/dashboard/18/

If still failing, try in the Superset UI:
1. Open the chart in Edit mode
2. Go to the "Data" tab
3. For "Metric", select COUNT(*) or create an adhoc metric
4. Or remove the metric field entirely (optional for graph charts)
    """)


if __name__ == "__main__":
    main()
