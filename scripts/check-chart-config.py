#!/usr/bin/env python3
"""Check chart configuration for dataset 65 charts."""
import sqlite3
import json

conn = sqlite3.connect("/app/superset_home/superset.db")
cursor = conn.cursor()

# Get chart details for 167, 168, 171, 172, 173
cursor.execute("""
    SELECT id, slice_name, viz_type, params, datasource_id, datasource_type
    FROM slices
    WHERE id IN (167, 168, 171, 172, 173)
""")
rows = cursor.fetchall()
print("Chart details:")
for row in rows:
    params = json.loads(row[3]) if row[3] else {}
    print(f"\nChart {row[0]}: {row[1]}")
    print(f"  datasource_id: {row[4]}, datasource_type: {row[5]}")
    print(f"  viz_type: {row[2]}")
    metrics = params.get("metrics", [])
    print(f"  metrics: {metrics}")
    groupby = params.get("groupby", [])
    print(f"  groupby: {groupby}")
    filters = params.get("adhoc_filters", [])
    print(f"  adhoc_filters: {len(filters)} filters")
conn.close()
