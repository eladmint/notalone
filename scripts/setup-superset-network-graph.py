#!/usr/bin/env python3
"""
Complete Superset Setup for Network Graph Visualization

This script sets up everything needed for the ECharts Graph Chart:
1. Database connection to PostgreSQL
2. Dataset from v_network_graph_edges view
3. Dashboard for network visualization
4. ECharts Graph chart

Run this script whenever Superset needs to be reconfigured.

Usage:
    python3 scripts/setup-superset-network-graph.py
"""

import requests
import json
import sys
import time

# ============================================================================
# Configuration
# ============================================================================
SUPERSET_URL = "http://74.50.97.243:8088"
USERNAME = "admin"
PASSWORD = "EventsHive2025!"

# Database connection - PostgreSQL inside Docker/NixOS container
# 172.17.0.1 is the Docker bridge network gateway (host from container perspective)
DB_NAME = "Notalone Israeli Tech Ecosystem"
DB_URI = "postgresql://postgres:notalone2026@172.17.0.1:5433/calendar_monitoring"
DB_SCHEMA = "notalone"

# View to use for network graph
NETWORK_VIEW = "v_network_graph_edges"

# Dashboard and chart names
DASHBOARD_TITLE = "8200 Network & People"
DASHBOARD_SLUG = "notalone-8200-network"
CHART_NAME = "Israeli Tech Ecosystem Network Graph"


class SupersetAPI:
    """Superset REST API client with automatic token management"""

    def __init__(self, base_url, username, password):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.session.timeout = 30
        self.username = username
        self.password = password
        self.access_token = None
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
        """Get fresh CSRF token"""
        try:
            resp = self.session.get(
                self._url("/api/v1/security/csrf_token/"),
                headers=self._headers()
            )
            if resp.status_code == 200:
                self.csrf_token = resp.json().get("result")
                return True
        except Exception as e:
            print(f"  CSRF error: {e}")
        return False

    def login(self):
        """Authenticate and get access token"""
        print("[1] Authenticating to Superset...")

        # Get initial CSRF token
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
            self.refresh_csrf()
            print(f"    OK - Logged in as {self.username}")
            return True
        else:
            print(f"    FAILED - {resp.status_code}: {resp.text}")
            return False

    def get(self, endpoint):
        """HTTP GET with auth"""
        return self.session.get(self._url(endpoint), headers=self._headers())

    def post(self, endpoint, data):
        """HTTP POST with auth and fresh CSRF"""
        self.refresh_csrf()
        return self.session.post(self._url(endpoint), headers=self._headers(), json=data)

    def put(self, endpoint, data):
        """HTTP PUT with auth and fresh CSRF"""
        self.refresh_csrf()
        return self.session.put(self._url(endpoint), headers=self._headers(), json=data)


def create_database_connection(api, name, uri):
    """Create or get database connection"""
    print("\n[2] Setting up database connection...")

    # Check existing
    resp = api.get("/api/v1/database/")
    if resp.status_code == 200:
        for db in resp.json().get("result", []):
            if db.get("database_name") == name:
                print(f"    Found existing: ID {db.get('id')}")
                return db.get("id")

    # Create new
    resp = api.post("/api/v1/database/", {
        "database_name": name,
        "sqlalchemy_uri": uri,
        "expose_in_sqllab": True,
        "allow_ctas": True,
        "allow_cvas": True,
        "allow_dml": False,
        "allow_run_async": True,
        "extra": json.dumps({
            "metadata_params": {},
            "engine_params": {},
            "metadata_cache_timeout": {},
            "schemas_allowed_for_file_upload": [DB_SCHEMA]
        })
    })

    if resp.status_code == 201:
        db_id = resp.json().get("id")
        print(f"    Created database connection: ID {db_id}")
        return db_id
    else:
        print(f"    FAILED - {resp.status_code}: {resp.text}")

        # Try with unique name if duplicate
        if "already exists" in resp.text:
            unique_name = f"{name} ({int(time.time()) % 10000})"
            print(f"    Retrying with unique name: {unique_name}")
            return create_database_connection(api, unique_name, uri)

        return None


def create_dataset(api, database_id, schema, table_name):
    """Create or get dataset for a table/view"""
    print(f"\n[3] Creating dataset for {schema}.{table_name}...")

    # Check existing
    resp = api.get("/api/v1/dataset/")
    if resp.status_code == 200:
        for ds in resp.json().get("result", []):
            if ds.get("table_name") == table_name and ds.get("schema") == schema:
                print(f"    Found existing: ID {ds.get('id')}")
                return ds.get("id")

    # Create new
    resp = api.post("/api/v1/dataset/", {
        "database": database_id,
        "schema": schema,
        "table_name": table_name
    })

    if resp.status_code == 201:
        ds_id = resp.json().get("id")
        print(f"    Created dataset: ID {ds_id}")
        return ds_id
    else:
        print(f"    FAILED - {resp.status_code}: {resp.text}")
        return None


def create_dashboard(api, title, slug):
    """Create or get dashboard"""
    print(f"\n[4] Creating dashboard: {title}...")

    # Check existing
    resp = api.get("/api/v1/dashboard/")
    if resp.status_code == 200:
        for d in resp.json().get("result", []):
            if d.get("dashboard_title") == title or d.get("slug") == slug:
                print(f"    Found existing: ID {d.get('id')}")
                return d.get("id")

    # Create new
    resp = api.post("/api/v1/dashboard/", {
        "dashboard_title": title,
        "slug": slug,
        "published": True
    })

    if resp.status_code == 201:
        d_id = resp.json().get("id")
        print(f"    Created dashboard: ID {d_id}")
        return d_id
    else:
        print(f"    Warning - {resp.status_code}: {resp.text}")
        # If slug exists, try without slug
        if "slug" in resp.text.lower():
            resp = api.post("/api/v1/dashboard/", {
                "dashboard_title": f"{title} ({int(time.time()) % 1000})",
                "published": True
            })
            if resp.status_code == 201:
                d_id = resp.json().get("id")
                print(f"    Created dashboard with alternate name: ID {d_id}")
                return d_id
        return None


def create_graph_chart(api, name, dataset_id, dashboard_ids=None):
    """Create ECharts Graph chart"""
    print(f"\n[5] Creating Graph Chart: {name}...")

    # Check existing charts
    resp = api.get("/api/v1/chart/")
    if resp.status_code == 200:
        for c in resp.json().get("result", []):
            if c.get("slice_name") == name:
                print(f"    Found existing chart: ID {c.get('id')}")
                return c.get("id")

    # Chart parameters for ECharts Graph
    # The key is using the correct viz_type and params format
    params = {
        "datasource": f"{dataset_id}__table",
        "viz_type": "graph_chart",

        # Required columns for graph
        "source": "source",
        "target": "target",

        # Category for node coloring (optional)
        "source_category": "category",
        "target_category": "category",

        # Metric for edge weight
        "metric": {
            "expressionType": "SIMPLE",
            "column": {
                "column_name": "weight",
                "type": "INTEGER"
            },
            "aggregate": "SUM",
            "label": "SUM(weight)"
        },

        # Graph layout
        "layout": "force",
        "roam": True,
        "draggable": True,
        "selected_mode": "single",

        # Force layout physics
        "repulsion": 1000,
        "gravity": 0.2,
        "friction": 0.6,
        "edge_length": 400,

        # Visual settings
        "edge_width": 2,
        "show_symbol_threshold": 0,

        # Legend
        "show_legend": True,
        "legend_orientation": "horizontal",
        "legend_margin": 20,

        # Filters and limits
        "adhoc_filters": [],
        "row_limit": 500
    }

    chart_data = {
        "slice_name": name,
        "viz_type": "graph_chart",
        "datasource_id": dataset_id,
        "datasource_type": "table",
        "params": json.dumps(params),
        "cache_timeout": None,
        "query_context": None
    }

    if dashboard_ids:
        chart_data["dashboards"] = dashboard_ids

    resp = api.post("/api/v1/chart/", chart_data)

    if resp.status_code == 201:
        chart_id = resp.json().get("id")
        print(f"    Created chart: ID {chart_id}")
        return chart_id
    else:
        print(f"    Warning - {resp.status_code}: {resp.text}")

        # Try simpler params if complex ones fail
        print("    Trying simplified chart params...")
        simple_params = {
            "datasource": f"{dataset_id}__table",
            "viz_type": "graph_chart",
            "source": "source",
            "target": "target",
            "metric": "weight",
            "layout": "force",
            "row_limit": 500,
            "roam": True
        }

        chart_data["params"] = json.dumps(simple_params)
        resp = api.post("/api/v1/chart/", chart_data)

        if resp.status_code == 201:
            chart_id = resp.json().get("id")
            print(f"    Created chart with simple params: ID {chart_id}")
            return chart_id

        # Last resort: create a table chart to verify API works
        print("    Creating table chart as fallback...")
        table_params = {
            "datasource": f"{dataset_id}__table",
            "viz_type": "table",
            "query_mode": "raw",
            "all_columns": ["source", "target", "category", "weight"],
            "row_limit": 100
        }

        chart_data["slice_name"] = f"{name} - Table View"
        chart_data["viz_type"] = "table"
        chart_data["params"] = json.dumps(table_params)

        resp = api.post("/api/v1/chart/", chart_data)
        if resp.status_code == 201:
            chart_id = resp.json().get("id")
            print(f"    Created table chart: ID {chart_id}")
            print(f"    Note: Graph chart needs manual creation in UI")
            return chart_id

        return None


def update_dashboard_layout(api, dashboard_id, chart_id):
    """Add chart to dashboard layout"""
    print(f"\n[6] Adding chart to dashboard layout...")

    resp = api.get(f"/api/v1/dashboard/{dashboard_id}")
    if resp.status_code != 200:
        print(f"    Failed to get dashboard: {resp.status_code}")
        return False

    result = resp.json().get("result", {})
    position_json = result.get("position_json", "{}")

    try:
        positions = json.loads(position_json) if position_json else {}
    except:
        positions = {}

    # Initialize layout if empty
    if not positions or "ROOT_ID" not in positions:
        positions = {
            "DASHBOARD_VERSION_KEY": "v2",
            "ROOT_ID": {
                "children": ["GRID_ID"],
                "id": "ROOT_ID",
                "type": "ROOT"
            },
            "GRID_ID": {
                "children": [],
                "id": "GRID_ID",
                "type": "GRID",
                "parents": ["ROOT_ID"]
            }
        }

    # Add row for chart
    row_id = "ROW-network-graph"
    chart_comp_id = f"CHART-{chart_id}"

    positions[row_id] = {
        "children": [chart_comp_id],
        "id": row_id,
        "meta": {"background": "BACKGROUND_TRANSPARENT"},
        "type": "ROW",
        "parents": ["ROOT_ID", "GRID_ID"]
    }

    positions[chart_comp_id] = {
        "children": [],
        "id": chart_comp_id,
        "meta": {
            "chartId": chart_id,
            "height": 60,
            "sliceName": CHART_NAME,
            "width": 12
        },
        "type": "CHART",
        "parents": ["ROOT_ID", "GRID_ID", row_id]
    }

    # Add row to grid children
    if "GRID_ID" in positions:
        grid = positions["GRID_ID"]
        if "children" not in grid:
            grid["children"] = []
        if row_id not in grid["children"]:
            grid["children"].append(row_id)

    # Update dashboard
    resp = api.put(f"/api/v1/dashboard/{dashboard_id}", {
        "position_json": json.dumps(positions)
    })

    if resp.status_code == 200:
        print(f"    OK - Chart added to dashboard layout")
        return True
    else:
        print(f"    Warning - {resp.status_code}: {resp.text}")
        return False


def main():
    print("=" * 70)
    print("SUPERSET NETWORK GRAPH SETUP")
    print("=" * 70)
    print(f"\nSuperset URL: {SUPERSET_URL}")
    print(f"Database: {DB_NAME}")
    print(f"Schema: {DB_SCHEMA}")
    print(f"View: {NETWORK_VIEW}")

    # Initialize API client
    api = SupersetAPI(SUPERSET_URL, USERNAME, PASSWORD)

    # Step 1: Authenticate
    if not api.login():
        print("\n[ERROR] Authentication failed!")
        sys.exit(1)

    # Step 2: Create database connection
    db_id = create_database_connection(api, DB_NAME, DB_URI)
    if not db_id:
        print("\n[ERROR] Failed to create database connection!")
        sys.exit(1)

    # Step 3: Create dataset
    dataset_id = create_dataset(api, db_id, DB_SCHEMA, NETWORK_VIEW)
    if not dataset_id:
        print("\n[ERROR] Failed to create dataset!")
        print("Make sure the view exists in PostgreSQL:")
        print(f"  Schema: {DB_SCHEMA}")
        print(f"  View: {NETWORK_VIEW}")
        sys.exit(1)

    # Step 4: Create dashboard
    dashboard_id = create_dashboard(api, DASHBOARD_TITLE, DASHBOARD_SLUG)

    # Step 5: Create chart
    dashboard_ids = [dashboard_id] if dashboard_id else None
    chart_id = create_graph_chart(api, CHART_NAME, dataset_id, dashboard_ids)

    # Step 6: Update dashboard layout
    if dashboard_id and chart_id:
        update_dashboard_layout(api, dashboard_id, chart_id)

    # Summary
    print("\n" + "=" * 70)
    print("SETUP COMPLETE")
    print("=" * 70)
    print(f"""
Resources Created:
  Database Connection: ID {db_id}
  Dataset: ID {dataset_id}
  Dashboard: ID {dashboard_id if dashboard_id else 'Not created'}
  Chart: ID {chart_id if chart_id else 'Not created'}

URLs:
  Superset Home: {SUPERSET_URL}
  SQL Lab: {SUPERSET_URL}/sqllab/
  Dashboard: {SUPERSET_URL}/superset/dashboard/{dashboard_id}/ (if created)
  Chart: {SUPERSET_URL}/explore/?slice_id={chart_id} (if created)

If the Graph chart was not created automatically, create it manually:
  1. Go to {SUPERSET_URL}/chart/add
  2. Select dataset: {NETWORK_VIEW}
  3. Choose: Chart Type > Graph Chart (ECharts)
  4. Configure:
     - Source: source
     - Target: target
     - Source Category: category
     - Metric: weight (SUM)
     - Layout: Force
     - Repulsion: 1000
     - Roam: True
     - Draggable: True
  5. Save and add to dashboard
    """)

    return {
        "database_id": db_id,
        "dataset_id": dataset_id,
        "dashboard_id": dashboard_id,
        "chart_id": chart_id
    }


if __name__ == "__main__":
    result = main()
    if not result.get("chart_id"):
        sys.exit(1)
