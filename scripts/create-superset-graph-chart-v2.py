#!/usr/bin/env python3
"""
Create ECharts Graph Chart in Superset via REST API - Version 2

Uses simpler chart configuration that is more likely to work with Superset API.
"""

import requests
import json
import sys
import time

# Configuration
SUPERSET_URL = "http://74.50.97.243:8088"
USERNAME = "admin"
PASSWORD = "EventsHive2025!"

class SupersetClient:
    def __init__(self, base_url, username, password):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.username = username
        self.password = password
        self.access_token = None
        self.refresh_token = None
        self.csrf_token = None

    def _url(self, endpoint):
        return f"{self.base_url}{endpoint}"

    def _headers(self):
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
        if self.access_token:
            headers["Authorization"] = f"Bearer {self.access_token}"
        if self.csrf_token:
            headers["X-CSRFToken"] = self.csrf_token
        return headers

    def refresh_csrf(self):
        """Refresh CSRF token"""
        try:
            resp = self.session.get(
                self._url("/api/v1/security/csrf_token/"),
                headers=self._headers()
            )
            if resp.status_code == 200:
                self.csrf_token = resp.json().get("result")
                return True
        except Exception as e:
            print(f"CSRF refresh error: {e}")
        return False

    def login(self):
        """Authenticate with Superset"""
        # First get CSRF
        resp = self.session.get(self._url("/api/v1/security/csrf_token/"))
        if resp.status_code == 200:
            self.csrf_token = resp.json().get("result")

        # Login
        resp = self.session.post(
            self._url("/api/v1/security/login"),
            headers=self._headers(),
            json={
                "username": self.username,
                "password": self.password,
                "provider": "db",
                "refresh": True
            }
        )

        if resp.status_code == 200:
            data = resp.json()
            self.access_token = data.get("access_token")
            self.refresh_token = data.get("refresh_token")
            self.refresh_csrf()
            print(f"[OK] Logged in as {self.username}")
            return True
        else:
            print(f"[ERROR] Login failed: {resp.status_code} - {resp.text}")
            return False

    def api_get(self, endpoint):
        """Make authenticated GET request"""
        resp = self.session.get(self._url(endpoint), headers=self._headers())
        return resp

    def api_post(self, endpoint, data):
        """Make authenticated POST request"""
        self.refresh_csrf()
        resp = self.session.post(self._url(endpoint), headers=self._headers(), json=data)
        return resp

    def api_put(self, endpoint, data):
        """Make authenticated PUT request"""
        self.refresh_csrf()
        resp = self.session.put(self._url(endpoint), headers=self._headers(), json=data)
        return resp


def main():
    print("=" * 70)
    print("Superset ECharts Graph Chart Setup - v2")
    print("=" * 70)

    client = SupersetClient(SUPERSET_URL, USERNAME, PASSWORD)

    # Step 1: Login
    print("\n[1] Logging in...")
    if not client.login():
        sys.exit(1)

    # Step 2: List databases
    print("\n[2] Checking databases...")
    resp = client.api_get("/api/v1/database/")
    if resp.status_code == 200:
        dbs = resp.json()
        print(f"Found {dbs.get('count', 0)} databases:")
        for db in dbs.get("result", []):
            print(f"  - ID {db.get('id')}: {db.get('database_name')}")
    else:
        print(f"Error: {resp.status_code}")

    # Step 3: List datasets
    print("\n[3] Checking datasets...")
    resp = client.api_get("/api/v1/dataset/")
    if resp.status_code == 200:
        datasets = resp.json()
        print(f"Found {datasets.get('count', 0)} datasets:")
        network_dataset = None
        for ds in datasets.get("result", []):
            table_name = ds.get("table_name", "")
            print(f"  - ID {ds.get('id')}: {table_name} (schema: {ds.get('schema')})")
            if "network_graph_edges" in table_name:
                network_dataset = ds
                print(f"    ^ Found target dataset!")
    else:
        print(f"Error: {resp.status_code}")

    if not network_dataset:
        print("\n[ERROR] Dataset v_network_graph_edges not found!")
        print("Please create it first or check the database connection.")
        sys.exit(1)

    dataset_id = network_dataset.get("id")
    print(f"\nUsing dataset ID: {dataset_id}")

    # Step 4: Check dashboards
    print("\n[4] Checking dashboards...")
    resp = client.api_get("/api/v1/dashboard/")
    if resp.status_code == 200:
        dashboards = resp.json()
        print(f"Found {dashboards.get('count', 0)} dashboards:")
        target_dashboard = None
        for d in dashboards.get("result", []):
            title = d.get("dashboard_title", "")
            print(f"  - ID {d.get('id')}: {title}")
            if "8200" in title or "Network" in title:
                target_dashboard = d
    else:
        print(f"Error: {resp.status_code}")

    # Create dashboard if not exists
    dashboard_id = None
    if target_dashboard:
        dashboard_id = target_dashboard.get("id")
        print(f"\nUsing existing dashboard ID: {dashboard_id}")
    else:
        print("\n[4b] Creating dashboard...")
        resp = client.api_post("/api/v1/dashboard/", {
            "dashboard_title": "8200 Network Graph",
            "published": True
        })
        if resp.status_code == 201:
            dashboard_id = resp.json().get("id")
            print(f"Created dashboard ID: {dashboard_id}")
        else:
            print(f"Dashboard creation: {resp.status_code} - {resp.text}")

    # Step 5: Get dataset columns
    print("\n[5] Getting dataset column info...")
    resp = client.api_get(f"/api/v1/dataset/{dataset_id}")
    if resp.status_code == 200:
        ds_detail = resp.json().get("result", {})
        columns = ds_detail.get("columns", [])
        print(f"Dataset columns: {[c.get('column_name') for c in columns]}")
    else:
        print(f"Error getting dataset: {resp.status_code}")

    # Step 6: Create Graph Chart
    print("\n[6] Creating Graph Chart...")

    # Simplified chart params for graph_chart
    # Based on Superset ECharts Graph chart requirements
    chart_params = {
        "datasource": f"{dataset_id}__table",
        "viz_type": "graph_chart",

        # Source and target columns (required for graph)
        "source": "source",
        "target": "target",

        # Optional: category for node coloring
        "source_category": "category",

        # Metric for edge weight
        "metric": "weight",

        # Graph layout settings
        "layout": "force",
        "roam": True,
        "draggable": True,

        # Force layout parameters
        "repulsion": 1000,
        "gravity": 0.2,
        "friction": 0.6,
        "edge_length": 400,

        # Row limit
        "row_limit": 500,

        # Legend
        "show_legend": True,
        "legend_orientation": "horizontal"
    }

    chart_data = {
        "slice_name": "Israeli Tech Network Graph",
        "viz_type": "graph_chart",
        "datasource_id": dataset_id,
        "datasource_type": "table",
        "params": json.dumps(chart_params),
        "query_context": None,
        "cache_timeout": None
    }

    if dashboard_id:
        chart_data["dashboards"] = [dashboard_id]

    print(f"Chart data: {json.dumps(chart_data, indent=2)}")

    resp = client.api_post("/api/v1/chart/", chart_data)
    print(f"\nCreate chart response: {resp.status_code}")
    print(resp.text[:500] if resp.text else "No response body")

    if resp.status_code == 201:
        chart_result = resp.json()
        chart_id = chart_result.get("id")
        print(f"\n[SUCCESS] Chart created with ID: {chart_id}")
        print(f"\nChart URL: {SUPERSET_URL}/explore/?slice_id={chart_id}")
        if dashboard_id:
            print(f"Dashboard URL: {SUPERSET_URL}/superset/dashboard/{dashboard_id}/")
    elif resp.status_code == 500:
        # Try alternative viz_type
        print("\n[6b] Trying alternative chart type (echarts_graph)...")
        chart_params["viz_type"] = "echarts_graph"
        chart_data["viz_type"] = "echarts_graph"
        chart_data["params"] = json.dumps(chart_params)

        resp = client.api_post("/api/v1/chart/", chart_data)
        print(f"Response: {resp.status_code} - {resp.text[:500] if resp.text else ''}")

        if resp.status_code != 201:
            # Try yet another format
            print("\n[6c] Trying simple table chart first to verify API...")
            simple_chart = {
                "slice_name": "Network Test",
                "viz_type": "table",
                "datasource_id": dataset_id,
                "datasource_type": "table",
                "params": json.dumps({
                    "datasource": f"{dataset_id}__table",
                    "viz_type": "table",
                    "query_mode": "raw",
                    "all_columns": ["source", "target", "category", "weight"],
                    "row_limit": 100
                })
            }
            resp = client.api_post("/api/v1/chart/", simple_chart)
            print(f"Simple chart response: {resp.status_code}")
            if resp.status_code == 201:
                print("[OK] Table chart created - API is working")
                print("Graph chart may require specific configuration.")
    else:
        print(f"\n[WARNING] Unexpected response: {resp.status_code}")

    # Print summary
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print(f"""
Database ID: 4 (Notalone Graph Network)
Dataset ID: {dataset_id} (v_network_graph_edges)
Dashboard ID: {dashboard_id if dashboard_id else 'Not created'}

To manually create the Graph chart in Superset UI:
1. Go to: {SUPERSET_URL}/chart/add
2. Select dataset: v_network_graph_edges
3. Choose visualization: Graph Chart (ECharts)
4. Configure:
   - Source: source
   - Target: target
   - Source Category: category
   - Metric: weight (or COUNT(*))
   - Layout: Force
   - Repulsion: 1000
   - Enable: Roam, Draggable
5. Save chart
6. Add to dashboard: 8200 Network Graph
    """)


if __name__ == "__main__":
    main()
