#!/usr/bin/env python3
"""
Fix all charts using dataset 65 that have empty metrics.
"""
import sqlite3
import json

conn = sqlite3.connect("/app/superset_home/superset.db")
cursor = conn.cursor()

# Get all charts using dataset 65
cursor.execute("""
    SELECT id, slice_name, viz_type, params
    FROM slices
    WHERE datasource_id = 65 AND datasource_type = 'table'
""")
rows = cursor.fetchall()

print("Fixing charts with empty metrics...")

for row in rows:
    chart_id = row[0]
    chart_name = row[1]
    viz_type = row[2]
    params = json.loads(row[3]) if row[3] else {}

    metrics = params.get("metrics", [])
    if not metrics:
        # Determine appropriate metric based on viz_type
        if viz_type == "big_number_total":
            # Check chart name to determine metric
            if "Raised" in chart_name or "Value" in chart_name or "Valuation" in chart_name:
                # Sum metric for monetary values
                params["metric"] = {
                    "expressionType": "SQL",
                    "sqlExpression": "SUM(COALESCE(total_raised_usd, 0))",
                    "label": "Total Raised"
                }
                print(f"Chart {chart_id} ({chart_name}): Added SUM(total_raised_usd) metric")
            else:
                params["metrics"] = ["count"]
                print(f"Chart {chart_id} ({chart_name}): Added count metric")
        elif viz_type == "table":
            # Table charts need all_columns, not metrics
            if not params.get("all_columns"):
                params["all_columns"] = ["company_name", "stage", "status", "sector", "total_raised_usd", "founded_year"]
                print(f"Chart {chart_id} ({chart_name}): Added all_columns")
        else:
            params["metrics"] = ["count"]
            print(f"Chart {chart_id} ({chart_name}): Added count metric")

        # Save updated params
        cursor.execute("UPDATE slices SET params = ? WHERE id = ?",
                       (json.dumps(params), chart_id))
    else:
        print(f"Chart {chart_id} ({chart_name}): Already has metrics")

conn.commit()

# Verify
print("\n--- Final Verification ---")
cursor.execute("""
    SELECT id, slice_name, viz_type, params
    FROM slices
    WHERE datasource_id = 65 AND datasource_type = 'table'
""")
for row in cursor.fetchall():
    params = json.loads(row[3]) if row[3] else {}
    print(f"Chart {row[0]} ({row[1]}):")
    print(f"  metrics: {params.get('metrics', [])}")
    if params.get('metric'):
        print(f"  metric: {params.get('metric')}")
    if params.get('all_columns'):
        print(f"  all_columns: {params.get('all_columns')}")

conn.close()
print("\nDone!")
