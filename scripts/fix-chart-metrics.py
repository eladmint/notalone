#!/usr/bin/env python3
"""
Fix charts 167, 168, 171, 172 by adding the count metric.
These charts have empty metrics arrays which causes them to fail.
"""
import sqlite3
import json

conn = sqlite3.connect("/app/superset_home/superset.db")
cursor = conn.cursor()

# Charts to fix and their required metrics
charts_to_fix = {
    167: {"metrics": ["count"]},  # Big number - needs count
    168: {"metrics": ["count"]},  # Big number - needs count
    171: {"metrics": ["count"]},  # Pie chart - needs count
    172: {"metrics": ["count"]},  # Pie chart - needs count
}

for chart_id, updates in charts_to_fix.items():
    # Get current params
    cursor.execute("SELECT params FROM slices WHERE id = ?", (chart_id,))
    row = cursor.fetchone()
    if not row:
        print(f"Chart {chart_id} not found")
        continue

    params = json.loads(row[0]) if row[0] else {}
    print(f"\nChart {chart_id} before:")
    print(f"  metrics: {params.get('metrics', [])}")

    # Update params with metrics
    for key, value in updates.items():
        params[key] = value

    # Save updated params
    cursor.execute("UPDATE slices SET params = ? WHERE id = ?",
                   (json.dumps(params), chart_id))
    print(f"Chart {chart_id} after:")
    print(f"  metrics: {params.get('metrics', [])}")

conn.commit()
print("\nAll charts updated!")

# Verify
print("\n--- Verification ---")
cursor.execute("""
    SELECT id, slice_name, params
    FROM slices
    WHERE id IN (167, 168, 171, 172, 173)
""")
for row in cursor.fetchall():
    params = json.loads(row[2]) if row[2] else {}
    print(f"Chart {row[0]} ({row[1]}): metrics = {params.get('metrics', [])}")

conn.close()
