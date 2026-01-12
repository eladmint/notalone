#!/usr/bin/env python3
"""
Create ECharts Graph Chart in Superset via REST API

This is the working version that uses session-based authentication
(web login) instead of JWT tokens, which is more reliable.

Usage:
    python3 scripts/create-superset-graph-chart-final.py

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

# Pre-existing resources (from Superset SQLite database)
DATASET_ID = 66  # notalone.v_network_graph_edges
DASHBOARD_ID = 18  # Notalone - 8200 Network & People


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


def create_graph_chart(client, dataset_id, chart_name):
    """Create ECharts Graph chart"""
    params = {
        "datasource": f"{dataset_id}__table",
        "viz_type": "graph_chart",

        # Required columns
        "source": "source",
        "target": "target",

        # Category for node coloring
        "source_category": "category",
        "target_category": "category",

        # Edge weight
        "metric": "weight",

        # Layout
        "layout": "force",
        "roam": True,
        "draggable": True,

        # Force physics
        "repulsion": 1000,
        "gravity": 0.2,
        "friction": 0.6,
        "edge_length": 400,

        # Legend
        "show_legend": True,
        "legend_orientation": "horizontal",

        # Limits
        "row_limit": 500
    }

    chart_data = {
        "slice_name": chart_name,
        "viz_type": "graph_chart",
        "datasource_id": dataset_id,
        "datasource_type": "table",
        "params": json.dumps(params)
    }

    resp = client.post("/api/v1/chart/", chart_data)

    if resp.status_code == 201:
        return resp.json().get("id")
    else:
        print(f"Chart creation failed: {resp.status_code}")
        print(f"Response: {resp.text}")
        return None


def add_chart_to_dashboard(client, chart_id, dashboard_id):
    """Add chart to dashboard"""
    # Update chart's dashboards field
    resp = client.put(f"/api/v1/chart/{chart_id}", {"dashboards": [dashboard_id]})
    if resp.status_code != 200:
        print(f"Warning: Could not update chart dashboards: {resp.text[:200]}")

    # Get current dashboard layout
    resp = client.get(f"/api/v1/dashboard/{dashboard_id}")
    if resp.status_code != 200:
        print(f"Could not get dashboard: {resp.text[:200]}")
        return False

    dashboard = resp.json().get("result", {})
    position_json = dashboard.get("position_json", "{}")

    try:
        positions = json.loads(position_json) if position_json else {}
    except:
        positions = {}

    # Initialize layout if empty
    if not positions or "ROOT_ID" not in positions:
        positions = {
            "DASHBOARD_VERSION_KEY": "v2",
            "ROOT_ID": {"children": ["GRID_ID"], "id": "ROOT_ID", "type": "ROOT"},
            "GRID_ID": {"children": [], "id": "GRID_ID", "type": "GRID", "parents": ["ROOT_ID"]}
        }

    # Add row for chart
    row_id = "ROW-network-graph"
    chart_comp_id = f"CHART-{chart_id}"

    if row_id not in positions:
        positions[row_id] = {
            "children": [],
            "id": row_id,
            "meta": {"background": "BACKGROUND_TRANSPARENT"},
            "type": "ROW",
            "parents": ["ROOT_ID", "GRID_ID"]
        }
        if "children" not in positions["GRID_ID"]:
            positions["GRID_ID"]["children"] = []
        if row_id not in positions["GRID_ID"]["children"]:
            positions["GRID_ID"]["children"].append(row_id)

    # Add chart component
    positions[chart_comp_id] = {
        "children": [],
        "id": chart_comp_id,
        "meta": {
            "chartId": chart_id,
            "height": 60,
            "sliceName": "Network Graph",
            "width": 12
        },
        "type": "CHART",
        "parents": ["ROOT_ID", "GRID_ID", row_id]
    }

    if chart_comp_id not in positions[row_id]["children"]:
        positions[row_id]["children"].append(chart_comp_id)

    # Update dashboard
    resp = client.put(
        f"/api/v1/dashboard/{dashboard_id}",
        {"position_json": json.dumps(positions)}
    )

    return resp.status_code == 200


def main():
    print("=" * 60)
    print("SUPERSET ECHART GRAPH SETUP")
    print("=" * 60)
    print(f"\nSuperset URL: {SUPERSET_URL}")
    print(f"Dataset ID: {DATASET_ID}")
    print(f"Dashboard ID: {DASHBOARD_ID}")

    client = SupersetSessionClient(SUPERSET_URL, USERNAME, PASSWORD)

    # Login
    print("\n[1] Logging in...")
    if not client.login():
        sys.exit(1)

    # Create chart
    print("\n[2] Creating Graph Chart...")
    chart_id = create_graph_chart(
        client,
        DATASET_ID,
        "Israeli Tech Network Graph"
    )

    if not chart_id:
        print("Failed to create chart")
        sys.exit(1)

    print(f"    Created Chart ID: {chart_id}")

    # Add to dashboard
    print(f"\n[3] Adding to Dashboard {DASHBOARD_ID}...")
    if add_chart_to_dashboard(client, chart_id, DASHBOARD_ID):
        print("    Chart added to dashboard")
    else:
        print("    Warning: Could not add to dashboard layout")

    # Summary
    print("\n" + "=" * 60)
    print("SUCCESS")
    print("=" * 60)
    print(f"""
Chart ID: {chart_id}
Dashboard ID: {DASHBOARD_ID}

URLs:
- Chart: {SUPERSET_URL}/explore/?slice_id={chart_id}
- Dashboard: {SUPERSET_URL}/superset/dashboard/{DASHBOARD_ID}/

Graph Configuration:
- Source Column: source
- Target Column: target
- Category Column: category
- Weight/Metric: weight
- Layout: Force-directed
- Repulsion: 1000
- Roam: Enabled
- Draggable: Enabled
    """)


if __name__ == "__main__":
    main()
