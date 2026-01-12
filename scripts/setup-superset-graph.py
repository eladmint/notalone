#!/usr/bin/env python3
"""
Setup Superset Network Graph Chart
Run this ON the XNode3 server where Superset is at localhost:8088
"""

import requests
import json

SUPERSET_URL = "http://localhost:8088"
USERNAME = "admin"
PASSWORD = "EventsHive2025!"

session = requests.Session()

def login():
    """Login and get access token"""
    # Get CSRF token first
    csrf_resp = session.get(f"{SUPERSET_URL}/api/v1/security/csrf_token/")
    csrf_token = csrf_resp.json().get("result", "")

    # Login
    login_resp = session.post(
        f"{SUPERSET_URL}/api/v1/security/login",
        json={"username": USERNAME, "password": PASSWORD, "provider": "db", "refresh": True},
        headers={"X-CSRFToken": csrf_token}
    )

    if login_resp.status_code == 200:
        token = login_resp.json().get("access_token")
        session.headers.update({"Authorization": f"Bearer {token}"})
        print(f"[OK] Logged in successfully")
        return True
    else:
        print(f"[ERROR] Login failed: {login_resp.text}")
        return False

def get_csrf():
    """Get fresh CSRF token"""
    resp = session.get(f"{SUPERSET_URL}/api/v1/security/csrf_token/")
    return resp.json().get("result", "")

def create_database():
    """Create PostgreSQL database connection"""
    csrf = get_csrf()

    # Check if already exists
    resp = session.get(f"{SUPERSET_URL}/api/v1/database/")
    existing = resp.json().get("result", [])
    for db in existing:
        if "notalone" in db.get("database_name", "").lower() or "postgres" in db.get("database_name", "").lower():
            print(f"[OK] Database already exists: {db['database_name']} (ID: {db['id']})")
            return db["id"]

    # Create new
    resp = session.post(
        f"{SUPERSET_URL}/api/v1/database/",
        json={
            "database_name": "Notalone PostgreSQL",
            "sqlalchemy_uri": "postgresql://postgres:notalone2026@172.17.0.1:5433/calendar_monitoring",
            "expose_in_sqllab": True,
            "allow_ctas": True,
            "allow_cvas": True,
            "allow_dml": True,
            "extra": json.dumps({"schemas_allowed_for_file_upload": ["notalone"]})
        },
        headers={"X-CSRFToken": csrf}
    )

    if resp.status_code in [200, 201]:
        db_id = resp.json().get("id")
        print(f"[OK] Database created (ID: {db_id})")
        return db_id
    else:
        print(f"[ERROR] Database creation failed: {resp.text}")
        return None

def create_dataset(db_id):
    """Create dataset from network edges view"""
    csrf = get_csrf()

    # Check if exists
    resp = session.get(f"{SUPERSET_URL}/api/v1/dataset/")
    existing = resp.json().get("result", [])
    for ds in existing:
        if "network" in ds.get("table_name", "").lower():
            print(f"[OK] Dataset already exists: {ds['table_name']} (ID: {ds['id']})")
            return ds["id"]

    # Create dataset
    resp = session.post(
        f"{SUPERSET_URL}/api/v1/dataset/",
        json={
            "database": db_id,
            "schema": "notalone",
            "table_name": "v_network_graph_edges"
        },
        headers={"X-CSRFToken": csrf}
    )

    if resp.status_code in [200, 201]:
        ds_id = resp.json().get("id")
        print(f"[OK] Dataset created (ID: {ds_id})")
        return ds_id
    else:
        print(f"[ERROR] Dataset creation failed: {resp.text}")
        return None

def create_chart(ds_id):
    """Create ECharts Graph chart"""
    csrf = get_csrf()

    # Chart params - NO metric field to avoid the error
    params = {
        "datasource": f"{ds_id}__table",
        "viz_type": "graph_chart",
        "source": "source",
        "target": "target",
        "source_category": "category",
        "target_category": "category",
        "layout": "force",
        "roam": True,
        "draggable": True,
        "selected_mode": "single",
        "show_legend": True,
        "legend_orientation": "top",
        "repulsion": 1000,
        "gravity": 0.2,
        "friction": 0.6,
        "edge_length": 400,
        "row_limit": 500
    }

    resp = session.post(
        f"{SUPERSET_URL}/api/v1/chart/",
        json={
            "slice_name": "Israeli Tech Network Graph",
            "viz_type": "graph_chart",
            "datasource_id": ds_id,
            "datasource_type": "table",
            "params": json.dumps(params),
            "query_context": json.dumps({
                "datasource": {"id": ds_id, "type": "table"},
                "queries": [{"columns": ["source", "target", "category"]}]
            })
        },
        headers={"X-CSRFToken": csrf}
    )

    if resp.status_code in [200, 201]:
        chart_id = resp.json().get("id")
        print(f"[OK] Chart created (ID: {chart_id})")
        print(f"    URL: {SUPERSET_URL}/explore/?slice_id={chart_id}")
        return chart_id
    else:
        print(f"[ERROR] Chart creation failed: {resp.text}")
        return None

def main():
    print("=" * 50)
    print("Superset Network Graph Setup")
    print("=" * 50)

    if not login():
        return

    print("\n[1] Creating database connection...")
    db_id = create_database()
    if not db_id:
        return

    print("\n[2] Creating dataset...")
    ds_id = create_dataset(db_id)
    if not ds_id:
        return

    print("\n[3] Creating graph chart...")
    chart_id = create_chart(ds_id)

    print("\n" + "=" * 50)
    print("DONE!")
    print("=" * 50)
    if chart_id:
        print(f"\nChart URL: {SUPERSET_URL}/explore/?slice_id={chart_id}")
        print(f"Dashboard: {SUPERSET_URL}/superset/dashboard/18/")

if __name__ == "__main__":
    main()
