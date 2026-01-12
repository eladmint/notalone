#!/usr/bin/env python3
"""
Create ECharts Graph Chart in Superset via REST API

This script:
1. Authenticates to Superset
2. Creates/finds the database connection
3. Creates a dataset from v_network_graph_edges view
4. Creates an ECharts Graph chart
5. Adds the chart to Dashboard 18 (8200 Network)

Superset URL: http://74.50.97.243:8088
Credentials: admin / EventsHive2025!
"""

import requests
import json
import sys
from urllib.parse import urljoin

# Configuration
SUPERSET_URL = "http://74.50.97.243:8088"
USERNAME = "admin"
PASSWORD = "EventsHive2025!"
DB_URI = "postgresql://postgres:notalone2026@172.17.0.1:5433/calendar_monitoring"
SCHEMA = "notalone"
VIEW_NAME = "v_network_graph_edges"

class SupersetAPI:
    def __init__(self, base_url, username, password):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.access_token = None
        self.csrf_token = None
        self.username = username
        self.password = password

    def _url(self, endpoint):
        return f"{self.base_url}{endpoint}"

    def _headers(self, include_csrf=True):
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
        if self.access_token:
            headers["Authorization"] = f"Bearer {self.access_token}"
        if include_csrf and self.csrf_token:
            headers["X-CSRFToken"] = self.csrf_token
        return headers

    def get_csrf_token(self):
        """Get CSRF token from Superset"""
        resp = self.session.get(
            self._url("/api/v1/security/csrf_token/"),
            headers=self._headers(include_csrf=False)
        )
        if resp.status_code == 200:
            self.csrf_token = resp.json().get("result")
            print(f"[OK] Got CSRF token")
            return True
        else:
            print(f"[ERROR] Failed to get CSRF token: {resp.status_code}")
            print(resp.text)
            return False

    def login(self):
        """Login to Superset and get access token"""
        # Get CSRF token first
        self.get_csrf_token()

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
            print(f"[OK] Logged in successfully")
            # Refresh CSRF token after login
            self.get_csrf_token()
            return True
        else:
            print(f"[ERROR] Login failed: {resp.status_code}")
            print(resp.text)
            return False

    def list_databases(self):
        """List all database connections"""
        resp = self.session.get(
            self._url("/api/v1/database/"),
            headers=self._headers()
        )
        if resp.status_code == 200:
            return resp.json()
        else:
            print(f"[ERROR] Failed to list databases: {resp.status_code}")
            print(resp.text)
            return None

    def create_database(self, name, uri):
        """Create a new database connection"""
        resp = self.session.post(
            self._url("/api/v1/database/"),
            headers=self._headers(),
            json={
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
                    "schemas_allowed_for_file_upload": ["notalone"]
                })
            }
        )
        if resp.status_code == 201:
            data = resp.json()
            print(f"[OK] Created database: {name} (ID: {data.get('id')})")
            return data
        else:
            print(f"[WARNING] Database creation returned {resp.status_code}")
            print(resp.text)
            return resp.json() if resp.text else None

    def get_database_by_name(self, name):
        """Find database by name"""
        databases = self.list_databases()
        if databases and databases.get("result"):
            for db in databases["result"]:
                if db.get("database_name") == name:
                    return db
        return None

    def list_datasets(self):
        """List all datasets"""
        resp = self.session.get(
            self._url("/api/v1/dataset/"),
            headers=self._headers()
        )
        if resp.status_code == 200:
            return resp.json()
        else:
            print(f"[ERROR] Failed to list datasets: {resp.status_code}")
            return None

    def create_dataset(self, database_id, schema, table_name):
        """Create a dataset from a table/view"""
        resp = self.session.post(
            self._url("/api/v1/dataset/"),
            headers=self._headers(),
            json={
                "database": database_id,
                "schema": schema,
                "table_name": table_name
            }
        )
        if resp.status_code == 201:
            data = resp.json()
            print(f"[OK] Created dataset: {table_name} (ID: {data.get('id')})")
            return data
        else:
            print(f"[WARNING] Dataset creation returned {resp.status_code}")
            print(resp.text)
            # Try to get existing dataset
            return self.get_dataset_by_name(table_name, schema)

    def get_dataset_by_name(self, table_name, schema=None):
        """Find dataset by table name"""
        datasets = self.list_datasets()
        if datasets and datasets.get("result"):
            for ds in datasets["result"]:
                if ds.get("table_name") == table_name:
                    if schema is None or ds.get("schema") == schema:
                        return ds
        return None

    def list_charts(self):
        """List all charts"""
        resp = self.session.get(
            self._url("/api/v1/chart/"),
            headers=self._headers()
        )
        if resp.status_code == 200:
            return resp.json()
        else:
            print(f"[ERROR] Failed to list charts: {resp.status_code}")
            return None

    def create_graph_chart(self, name, dataset_id, dashboard_ids=None):
        """Create an ECharts Graph chart"""
        params = {
            "datasource": f"{dataset_id}__table",
            "viz_type": "graph_chart",
            "source": "source",
            "target": "target",
            "source_category": "category",
            "target_category": "category",
            "metric": {
                "expressionType": "SIMPLE",
                "column": {"column_name": "weight", "type": "INTEGER"},
                "aggregate": "SUM",
                "label": "SUM(weight)"
            },
            "adhoc_filters": [],
            "row_limit": 1000,
            "layout": "force",
            "roam": True,
            "draggable": True,
            "selected_mode": "single",
            "show_symbol_threshold": 0,
            "edge_width": 2,
            "edge_length": 400,
            "gravity": 0.2,
            "friction": 0.6,
            "repulsion": 1000,
            "show_legend": True,
            "legend_orientation": "horizontal",
            "legend_margin": 20
        }

        chart_data = {
            "slice_name": name,
            "viz_type": "graph_chart",
            "datasource_id": dataset_id,
            "datasource_type": "table",
            "params": json.dumps(params),
            "cache_timeout": 86400
        }

        if dashboard_ids:
            chart_data["dashboards"] = dashboard_ids

        resp = self.session.post(
            self._url("/api/v1/chart/"),
            headers=self._headers(),
            json=chart_data
        )
        if resp.status_code == 201:
            data = resp.json()
            print(f"[OK] Created chart: {name} (ID: {data.get('id')})")
            return data
        else:
            print(f"[ERROR] Chart creation failed: {resp.status_code}")
            print(resp.text)
            return None

    def list_dashboards(self):
        """List all dashboards"""
        resp = self.session.get(
            self._url("/api/v1/dashboard/"),
            headers=self._headers()
        )
        if resp.status_code == 200:
            return resp.json()
        else:
            print(f"[ERROR] Failed to list dashboards: {resp.status_code}")
            return None

    def create_dashboard(self, title, slug=None):
        """Create a new dashboard"""
        dashboard_data = {
            "dashboard_title": title,
            "published": True
        }
        if slug:
            dashboard_data["slug"] = slug

        resp = self.session.post(
            self._url("/api/v1/dashboard/"),
            headers=self._headers(),
            json=dashboard_data
        )
        if resp.status_code == 201:
            data = resp.json()
            print(f"[OK] Created dashboard: {title} (ID: {data.get('id')})")
            return data
        else:
            print(f"[WARNING] Dashboard creation returned {resp.status_code}")
            print(resp.text)
            return None

    def get_dashboard(self, dashboard_id):
        """Get dashboard details"""
        resp = self.session.get(
            self._url(f"/api/v1/dashboard/{dashboard_id}"),
            headers=self._headers()
        )
        if resp.status_code == 200:
            return resp.json()
        else:
            print(f"[ERROR] Failed to get dashboard {dashboard_id}: {resp.status_code}")
            return None

    def add_chart_to_dashboard(self, dashboard_id, chart_id):
        """Add a chart to a dashboard's position_json"""
        # Get current dashboard
        dashboard = self.get_dashboard(dashboard_id)
        if not dashboard:
            print(f"[ERROR] Dashboard {dashboard_id} not found")
            return False

        result = dashboard.get("result", {})
        position_json = result.get("position_json")

        if position_json:
            try:
                positions = json.loads(position_json)
            except:
                positions = {}
        else:
            positions = {
                "DASHBOARD_VERSION_KEY": "v2",
                "ROOT_ID": {"children": ["GRID_ID"], "id": "ROOT_ID", "type": "ROOT"},
                "GRID_ID": {"children": [], "id": "GRID_ID", "type": "GRID", "parents": ["ROOT_ID"]}
            }

        # Add chart component
        chart_component_id = f"CHART-{chart_id}"
        positions[chart_component_id] = {
            "children": [],
            "id": chart_component_id,
            "meta": {
                "chartId": chart_id,
                "height": 50,
                "sliceName": f"Network Graph {chart_id}",
                "uuid": "",
                "width": 12
            },
            "type": "CHART",
            "parents": ["ROOT_ID", "GRID_ID", "ROW-network"]
        }

        # Add row if not exists
        if "ROW-network" not in positions:
            positions["ROW-network"] = {
                "children": [chart_component_id],
                "id": "ROW-network",
                "meta": {"background": "BACKGROUND_TRANSPARENT"},
                "type": "ROW",
                "parents": ["ROOT_ID", "GRID_ID"]
            }
            # Add row to grid
            if "GRID_ID" in positions and "children" in positions["GRID_ID"]:
                if "ROW-network" not in positions["GRID_ID"]["children"]:
                    positions["GRID_ID"]["children"].append("ROW-network")
        else:
            # Add chart to existing row
            if chart_component_id not in positions["ROW-network"]["children"]:
                positions["ROW-network"]["children"].append(chart_component_id)

        # Update dashboard
        resp = self.session.put(
            self._url(f"/api/v1/dashboard/{dashboard_id}"),
            headers=self._headers(),
            json={
                "position_json": json.dumps(positions)
            }
        )

        if resp.status_code == 200:
            print(f"[OK] Added chart {chart_id} to dashboard {dashboard_id}")
            return True
        else:
            print(f"[ERROR] Failed to update dashboard: {resp.status_code}")
            print(resp.text)
            return False


def main():
    print("=" * 60)
    print("Superset ECharts Graph Chart Setup")
    print("=" * 60)

    api = SupersetAPI(SUPERSET_URL, USERNAME, PASSWORD)

    # Step 1: Login
    print("\n[Step 1] Authenticating...")
    if not api.login():
        print("Failed to login. Exiting.")
        sys.exit(1)

    # Step 2: Create/find database
    print("\n[Step 2] Setting up database connection...")
    db_name = "Notalone Graph Network"
    db = api.create_database(db_name, DB_URI)

    # If db already exists, try to find it
    if db is None or "message" in db:
        print("Database may already exist, searching...")
        dbs = api.list_databases()
        if dbs:
            print(f"Found {dbs.get('count', 0)} databases")
            for db_item in dbs.get("result", []):
                print(f"  - ID {db_item.get('id')}: {db_item.get('database_name')}")

        # Try to create with different name
        import time
        db_name = f"Notalone Network {int(time.time()) % 10000}"
        print(f"Trying with unique name: {db_name}")
        db = api.create_database(db_name, DB_URI)

    if not db or not db.get("id"):
        print("[ERROR] Could not create or find database connection")
        print("Please check if the database connection exists in Superset UI")

        # Provide manual fallback
        print("\n" + "=" * 60)
        print("MANUAL SETUP INSTRUCTIONS")
        print("=" * 60)
        print("""
1. Go to: http://74.50.97.243:8088
2. Login: admin / EventsHive2025!
3. Settings > Database Connections > + Database
4. Select PostgreSQL
5. Connection string: postgresql://postgres:notalone2026@172.17.0.1:5433/calendar_monitoring
6. Save and test connection

Then run this script again.
        """)
        sys.exit(1)

    db_id = db.get("id")
    print(f"Database ID: {db_id}")

    # Step 3: Create dataset
    print("\n[Step 3] Creating dataset from view...")
    dataset = api.create_dataset(db_id, SCHEMA, VIEW_NAME)
    if not dataset:
        # Try to find existing
        dataset = api.get_dataset_by_name(VIEW_NAME, SCHEMA)

    if not dataset or not dataset.get("id"):
        print("[ERROR] Could not create dataset")
        sys.exit(1)

    dataset_id = dataset.get("id")
    print(f"Dataset ID: {dataset_id}")

    # Step 4: Create or find dashboard
    print("\n[Step 4] Setting up dashboard...")
    dashboard_title = "8200 Network & People"
    dashboards = api.list_dashboards()
    dashboard = None

    if dashboards and dashboards.get("result"):
        for d in dashboards["result"]:
            if "8200" in d.get("dashboard_title", "") or "Network" in d.get("dashboard_title", ""):
                dashboard = d
                print(f"Found existing dashboard: {d.get('dashboard_title')} (ID: {d.get('id')})")
                break

    if not dashboard:
        dashboard = api.create_dashboard(dashboard_title, "notalone-8200-network")
        if not dashboard:
            print("[WARNING] Could not create dashboard, will create chart without dashboard assignment")

    dashboard_id = dashboard.get("id") if dashboard else None
    dashboard_ids = [dashboard_id] if dashboard_id else []

    # Step 5: Create Graph Chart
    print("\n[Step 5] Creating ECharts Graph Chart...")
    chart = api.create_graph_chart(
        name="Israeli Tech Ecosystem Network Graph",
        dataset_id=dataset_id,
        dashboard_ids=dashboard_ids
    )

    if chart:
        chart_id = chart.get("id")
        print(f"\n[SUCCESS] Chart created with ID: {chart_id}")

        # Step 6: Add to dashboard layout
        if dashboard_id:
            print("\n[Step 6] Adding chart to dashboard layout...")
            api.add_chart_to_dashboard(dashboard_id, chart_id)

        print("\n" + "=" * 60)
        print("SETUP COMPLETE")
        print("=" * 60)
        print(f"""
Chart URL: {SUPERSET_URL}/explore/?slice_id={chart_id}
Dashboard URL: {SUPERSET_URL}/superset/dashboard/{dashboard_id}/ (if dashboard exists)

To modify the chart:
1. Go to Chart URL above
2. Adjust settings:
   - Layout: force (for force-directed graph)
   - Repulsion: 1000 (spread out nodes)
   - Roam: enabled (zoom/pan)
   - Draggable: enabled (move nodes)
3. Save changes
        """)
    else:
        print("\n[ERROR] Failed to create chart")
        sys.exit(1)


if __name__ == "__main__":
    main()
