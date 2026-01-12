#!/usr/bin/env python3
"""
Fix Superset dataset 65 (v_web3_companies) by adding missing columns and metrics.
Run this inside the Superset container:
  docker exec superset python3 /tmp/fix-superset-dataset-65.py
"""
import sqlite3
from datetime import datetime

# PostgreSQL to Superset type mapping
pg_to_superset = {
    "uuid": "UUID",
    "character varying": "VARCHAR(255)",
    "text": "TEXT",
    "integer": "INTEGER",
    "bigint": "BIGINT",
    "date": "DATE",
    "timestamp with time zone": "TIMESTAMP",
    "jsonb": "JSON",
    "USER-DEFINED": "VARCHAR"  # ENUM types
}

# All columns from PostgreSQL v_web3_companies view (29 columns)
pg_columns = [
    ("id", "uuid"),
    ("airtable_id", "character varying"),
    ("company_name", "character varying"),
    ("legal_name", "character varying"),
    ("founded_year", "integer"),
    ("shutdown_year", "integer"),
    ("company_type", "USER-DEFINED"),
    ("stage", "USER-DEFINED"),
    ("status", "USER-DEFINED"),
    ("sector", "character varying"),
    ("sectors", "jsonb"),
    ("technologies", "jsonb"),
    ("hq_location", "USER-DEFINED"),
    ("description", "text"),
    ("total_raised_usd", "bigint"),
    ("last_valuation_usd", "bigint"),
    ("exit_value_usd", "bigint"),
    ("exit_type", "USER-DEFINED"),
    ("exit_date", "date"),
    ("employee_count_peak", "integer"),
    ("employee_count_current", "integer"),
    ("website", "character varying"),
    ("linkedin_url", "character varying"),
    ("x_account", "character varying"),
    ("crunchbase_url", "character varying"),
    ("tags", "jsonb"),
    ("notes", "text"),
    ("created_at", "timestamp with time zone"),
    ("updated_at", "timestamp with time zone"),
]

def main():
    conn = sqlite3.connect("/app/superset_home/superset.db")
    cursor = conn.cursor()

    # Get existing columns
    cursor.execute("SELECT column_name FROM table_columns WHERE table_id=65")
    existing = {row[0] for row in cursor.fetchall()}
    print(f"Existing columns: {len(existing)}")

    # Get max id for table_columns
    cursor.execute("SELECT MAX(id) FROM table_columns")
    max_id = cursor.fetchone()[0] or 0

    # Add missing columns
    added = 0
    for col_name, pg_type in pg_columns:
        if col_name not in existing:
            max_id += 1
            superset_type = pg_to_superset.get(pg_type, "VARCHAR(255)")
            now = datetime.now().isoformat()

            cursor.execute("""
                INSERT INTO table_columns
                (id, table_id, column_name, type, groupby, filterable, is_dttm, created_on, changed_on)
                VALUES (?, 65, ?, ?, 1, 1, 0, ?, ?)
            """, (max_id, col_name, superset_type, now, now))
            print(f"  Added column: {col_name} ({superset_type})")
            added += 1

    print(f"\nAdded {added} columns")

    # Check if count metric exists
    cursor.execute("SELECT id FROM sql_metrics WHERE table_id=65 AND metric_name='count'")
    if not cursor.fetchone():
        # Get max metric id
        cursor.execute("SELECT MAX(id) FROM sql_metrics")
        max_metric_id = cursor.fetchone()[0] or 0
        max_metric_id += 1
        now = datetime.now().isoformat()

        cursor.execute("""
            INSERT INTO sql_metrics
            (id, table_id, metric_name, verbose_name, metric_type, expression, description, created_on, changed_on)
            VALUES (?, 65, 'count', 'Count', 'count', 'COUNT(*)', 'Row count', ?, ?)
        """, (max_metric_id, now, now))
        print("Added count metric")

    conn.commit()

    # Verify
    cursor.execute("SELECT COUNT(*) FROM table_columns WHERE table_id=65")
    final_count = cursor.fetchone()[0]
    print(f"\nFinal column count: {final_count}")

    cursor.execute("SELECT COUNT(*) FROM sql_metrics WHERE table_id=65")
    metric_count = cursor.fetchone()[0]
    print(f"Final metric count: {metric_count}")

    conn.close()
    print("\nDone!")

if __name__ == "__main__":
    main()
