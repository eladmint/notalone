#!/usr/bin/env python3
"""
Recreate Superset Dashboard 20 (Israel Web3 Ecosystem)
After Superset was reset, this script recreates all required configuration.

Run: python3 scripts/recreate-superset-dashboard.py
"""

import requests
import json
import time

# Configuration
SUPERSET_URL = "http://74.50.97.243:8088"
SUPERSET_USER = "admin"
SUPERSET_PASS = "EventsHive2025!"

# PostgreSQL connection details
PG_HOST = "74.50.97.243"
PG_PORT = "5433"
PG_DATABASE = "calendar_monitoring"
PG_USER = "postgres"
PG_PASSWORD = "notalone2026"

def get_session():
    """Login and get authenticated session"""
    session = requests.Session()

    # Login
    login_resp = session.post(
        f"{SUPERSET_URL}/api/v1/security/login",
        json={"username": SUPERSET_USER, "password": SUPERSET_PASS, "provider": "db"},
        timeout=30
    )

    if login_resp.status_code != 200:
        raise Exception(f"Login failed: {login_resp.text}")

    token = login_resp.json()["access_token"]
    session.headers["Authorization"] = f"Bearer {token}"

    # Get CSRF token
    csrf_resp = session.get(f"{SUPERSET_URL}/api/v1/security/csrf_token/", timeout=30)
    if csrf_resp.status_code == 200:
        csrf_token = csrf_resp.json().get("result")
        if csrf_token:
            session.headers["X-CSRFToken"] = csrf_token

    return session


def create_database_connection(session):
    """Create PostgreSQL database connection"""
    print("\n1. Creating PostgreSQL database connection...")

    sqlalchemy_uri = f"postgresql://{PG_USER}:{PG_PASSWORD}@{PG_HOST}:{PG_PORT}/{PG_DATABASE}"

    payload = {
        "database_name": "Notalone PostgreSQL",
        "sqlalchemy_uri": sqlalchemy_uri,
        "expose_in_sqllab": True,
        "allow_ctas": False,
        "allow_cvas": False,
        "allow_dml": False,
        "allow_run_async": True,
        "extra": json.dumps({
            "metadata_params": {},
            "engine_params": {},
            "metadata_cache_timeout": {},
            "schemas_allowed_for_file_upload": []
        })
    }

    resp = session.post(f"{SUPERSET_URL}/api/v1/database/", json=payload, timeout=30)

    if resp.status_code == 201:
        db_id = resp.json()["id"]
        print(f"   Created database connection ID: {db_id}")
        return db_id
    else:
        print(f"   Failed: {resp.status_code} - {resp.text}")
        # Check if it already exists
        list_resp = session.get(f"{SUPERSET_URL}/api/v1/database/", timeout=30)
        if list_resp.status_code == 200:
            for db in list_resp.json().get("result", []):
                if "Notalone" in db.get("database_name", ""):
                    print(f"   Found existing database ID: {db['id']}")
                    return db["id"]
        return None


def create_dataset(session, db_id):
    """Create dataset for v_web3_companies view"""
    print("\n2. Creating dataset for v_web3_companies...")

    payload = {
        "database": db_id,
        "schema": "notalone",
        "table_name": "v_web3_companies",
        "owners": [1]
    }

    resp = session.post(f"{SUPERSET_URL}/api/v1/dataset/", json=payload, timeout=30)

    if resp.status_code == 201:
        ds_id = resp.json()["id"]
        print(f"   Created dataset ID: {ds_id}")
        return ds_id
    else:
        print(f"   Failed: {resp.status_code} - {resp.text}")
        return None


def create_charts(session, ds_id):
    """Create all charts for the dashboard"""
    print("\n3. Creating charts...")

    charts = [
        {
            "name": "Total Web3 Companies",
            "viz_type": "big_number_total",
            "params": {
                "datasource": f"{ds_id}__table",
                "viz_type": "big_number_total",
                "metric": {"expressionType": "SIMPLE", "column": {"column_name": "id"}, "aggregate": "COUNT"},
                "header_font_size": 0.4,
                "subheader_font_size": 0.15
            }
        },
        {
            "name": "Active Companies",
            "viz_type": "big_number_total",
            "params": {
                "datasource": f"{ds_id}__table",
                "viz_type": "big_number_total",
                "metric": {"expressionType": "SIMPLE", "column": {"column_name": "id"}, "aggregate": "COUNT"},
                "adhoc_filters": [{"expressionType": "SIMPLE", "subject": "status", "operator": "==", "comparator": "Active", "clause": "WHERE"}]
            }
        },
        {
            "name": "Total Raised",
            "viz_type": "big_number_total",
            "params": {
                "datasource": f"{ds_id}__table",
                "viz_type": "big_number_total",
                "metric": {"expressionType": "SIMPLE", "column": {"column_name": "total_funding_usd"}, "aggregate": "SUM"},
                "y_axis_format": "$,.0f"
            }
        },
        {
            "name": "Companies by Stage",
            "viz_type": "pie",
            "params": {
                "datasource": f"{ds_id}__table",
                "viz_type": "pie",
                "groupby": ["stage"],
                "metric": {"expressionType": "SIMPLE", "column": {"column_name": "id"}, "aggregate": "COUNT"},
                "donut": True,
                "show_labels": True
            }
        },
        {
            "name": "Companies by Status",
            "viz_type": "pie",
            "params": {
                "datasource": f"{ds_id}__table",
                "viz_type": "pie",
                "groupby": ["status"],
                "metric": {"expressionType": "SIMPLE", "column": {"column_name": "id"}, "aggregate": "COUNT"},
                "donut": True,
                "show_labels": True
            }
        },
        {
            "name": "Founded by Year",
            "viz_type": "echarts_timeseries_bar",
            "params": {
                "datasource": f"{ds_id}__table",
                "viz_type": "echarts_timeseries_bar",
                "x_axis": "founded_year",
                "metrics": [{"expressionType": "SIMPLE", "column": {"column_name": "id"}, "aggregate": "COUNT"}],
                "row_limit": 50
            }
        },
        {
            "name": "Top Companies",
            "viz_type": "table",
            "params": {
                "datasource": f"{ds_id}__table",
                "viz_type": "table",
                "all_columns": ["company_name", "status", "stage", "founded_year", "total_funding_usd"],
                "order_by_cols": ["[\"total_funding_usd\", false]"],
                "row_limit": 20
            }
        }
    ]

    chart_ids = []
    for chart in charts:
        payload = {
            "slice_name": chart["name"],
            "viz_type": chart["viz_type"],
            "datasource_id": ds_id,
            "datasource_type": "table",
            "params": json.dumps(chart["params"]),
            "owners": [1]
        }

        resp = session.post(f"{SUPERSET_URL}/api/v1/chart/", json=payload, timeout=30)

        if resp.status_code == 201:
            chart_id = resp.json()["id"]
            chart_ids.append(chart_id)
            print(f"   Created chart '{chart['name']}' ID: {chart_id}")
        else:
            print(f"   Failed to create '{chart['name']}': {resp.status_code} - {resp.text[:200]}")

    return chart_ids


def create_dashboard(session, chart_ids):
    """Create the Israel Web3 Ecosystem dashboard"""
    print("\n4. Creating dashboard...")

    # Build position JSON for the charts
    positions = {"DASHBOARD_VERSION_KEY": "v2", "ROOT_ID": {"type": "ROOT", "id": "ROOT_ID", "children": ["GRID_ID"]}}

    # Simple grid layout
    positions["GRID_ID"] = {"type": "GRID", "id": "GRID_ID", "children": []}

    for i, chart_id in enumerate(chart_ids):
        row = i // 3
        col = (i % 3) * 4
        chart_key = f"CHART-{chart_id}"
        positions["GRID_ID"]["children"].append(chart_key)
        positions[chart_key] = {
            "type": "CHART",
            "id": chart_key,
            "meta": {"chartId": chart_id, "width": 4, "height": 50}
        }

    payload = {
        "dashboard_title": "Israel Web3 Ecosystem",
        "slug": "israel-web3-ecosystem",
        "owners": [1],
        "position_json": json.dumps(positions),
        "json_metadata": json.dumps({
            "timed_refresh_immune_slices": [],
            "expanded_slices": {},
            "refresh_frequency": 0,
            "color_scheme": "supersetColors"
        })
    }

    resp = session.post(f"{SUPERSET_URL}/api/v1/dashboard/", json=payload, timeout=30)

    if resp.status_code == 201:
        dash_id = resp.json()["id"]
        print(f"   Created dashboard ID: {dash_id}")
        print(f"   URL: {SUPERSET_URL}/superset/dashboard/{dash_id}/")
        return dash_id
    else:
        print(f"   Failed: {resp.status_code} - {resp.text}")
        return None


def main():
    print("=" * 60)
    print("Recreating Superset Dashboard: Israel Web3 Ecosystem")
    print("=" * 60)

    try:
        session = get_session()
        print("Logged in successfully")

        # Step 1: Create database connection
        db_id = create_database_connection(session)
        if not db_id:
            print("\nFailed to create database connection. Aborting.")
            return

        # Wait for database to be available
        time.sleep(2)

        # Step 2: Create dataset
        ds_id = create_dataset(session, db_id)
        if not ds_id:
            print("\nFailed to create dataset. Aborting.")
            return

        # Wait for dataset to sync columns
        print("\n   Waiting for dataset to sync columns...")
        time.sleep(5)

        # Step 3: Create charts
        chart_ids = create_charts(session, ds_id)
        if not chart_ids:
            print("\nFailed to create any charts. Aborting.")
            return

        # Step 4: Create dashboard
        dash_id = create_dashboard(session, chart_ids)

        print("\n" + "=" * 60)
        print("SUMMARY")
        print("=" * 60)
        print(f"Database Connection ID: {db_id}")
        print(f"Dataset ID: {ds_id}")
        print(f"Chart IDs: {chart_ids}")
        print(f"Dashboard ID: {dash_id}")
        print(f"\nDashboard URL: {SUPERSET_URL}/superset/dashboard/{dash_id}/")
        print("=" * 60)

    except Exception as e:
        print(f"\nError: {e}")
        raise


if __name__ == "__main__":
    main()
