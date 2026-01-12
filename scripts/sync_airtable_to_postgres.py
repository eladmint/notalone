#!/usr/bin/env python3
"""
Sync missing data from Airtable JSON backup to PostgreSQL.
Handles employment history, board positions, and investment relationships.

Usage:
    python scripts/sync_airtable_to_postgres.py

Requirements:
    pip install psycopg2-binary
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime

try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
except ImportError:
    print("ERROR: psycopg2 not installed. Run: pip install psycopg2-binary")
    sys.exit(1)

# Configuration
PG_CONFIG = {
    "host": os.environ.get("PG_HOST", "74.50.97.243"),
    "port": int(os.environ.get("PG_PORT", "5433")),
    "database": os.environ.get("PG_DATABASE", "calendar_monitoring"),
    "user": os.environ.get("PG_USER", "postgres"),
    "password": os.environ.get("PG_PASSWORD", "notalone2026")
}

BACKUP_DIR = Path(__file__).parent.parent / "database" / "airtable-backup"


def load_json_backup(filename):
    """Load JSON backup file."""
    filepath = BACKUP_DIR / filename
    if not filepath.exists():
        print(f"  WARNING: File not found: {filepath}")
        return []
    with open(filepath, 'r') as f:
        return json.load(f)


def get_person_mapping(conn):
    """Build mapping of person names to PostgreSQL UUIDs."""
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT id, name, airtable_id FROM notalone.notalone_people")

    name_to_id = {}
    airtable_to_id = {}

    for row in cursor.fetchall():
        if row['name']:
            name_to_id[row['name'].strip()] = row['id']
        if row['airtable_id']:
            airtable_to_id[row['airtable_id']] = row['id']

    return name_to_id, airtable_to_id


def get_company_mapping(conn):
    """Build mapping of company Airtable IDs to PostgreSQL UUIDs."""
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT id, company_name, airtable_id FROM notalone.notalone_companies")

    name_to_id = {}
    airtable_to_id = {}

    for row in cursor.fetchall():
        if row['company_name']:
            name_to_id[row['company_name'].strip()] = row['id']
        if row['airtable_id']:
            airtable_to_id[row['airtable_id']] = row['id']

    return name_to_id, airtable_to_id


def parse_date(date_str):
    """Parse date string from Airtable format."""
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        try:
            return datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%fZ").date()
        except ValueError:
            return None


def sync_employment_history(conn, person_name_map, person_airtable_map, company_airtable_map):
    """Sync employment history from Airtable backup."""
    print("\n" + "="*60)
    print("SYNCING: Employment History")
    print("="*60)

    data = load_json_backup("employment_history.json")
    cursor = conn.cursor()

    # Get existing airtable_ids
    cursor.execute("SELECT airtable_id FROM notalone.notalone_employment_history WHERE airtable_id IS NOT NULL")
    existing_ids = {row[0] for row in cursor.fetchall()}
    print(f"  Existing records in DB: {len(existing_ids)}")
    print(f"  Records in Airtable backup: {len(data)}")

    synced = 0
    skipped = 0
    errors = []

    for record in data:
        fields = record.get("fields", {})
        airtable_id = record["id"]

        # Skip if already exists
        if airtable_id in existing_ids:
            skipped += 1
            continue

        # Resolve person
        person_name = fields.get("Name", "").strip()
        person_airtable_ids = fields.get("Person", [])

        person_id = None
        if person_airtable_ids:
            person_id = person_airtable_map.get(person_airtable_ids[0])
        if not person_id and person_name:
            person_id = person_name_map.get(person_name)

        if not person_id:
            errors.append(f"{airtable_id}: Person not found - '{person_name}'")
            continue

        # Resolve company
        company_airtable_ids = fields.get("Company", [])
        company_id = None
        if company_airtable_ids:
            company_id = company_airtable_map.get(company_airtable_ids[0])

        if not company_id:
            errors.append(f"{airtable_id}: Company not found for {person_name}")
            continue

        # Insert record
        try:
            cursor.execute("""
                INSERT INTO notalone.notalone_employment_history
                (airtable_id, person_id, company_id, role_title, start_date, end_date,
                 is_founder, is_current, notable_achievement, notes)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (airtable_id) DO NOTHING
            """, (
                airtable_id,
                person_id,
                company_id,
                fields.get("Role"),
                parse_date(fields.get("Start Date")),
                parse_date(fields.get("End Date")),
                fields.get("Is Founder", False),
                fields.get("Is Current", False),
                fields.get("Notable Achievement"),
                fields.get("Notes")
            ))
            if cursor.rowcount > 0:
                synced += 1
        except Exception as e:
            errors.append(f"{airtable_id}: {str(e)}")
            conn.rollback()
            continue

    conn.commit()

    print(f"\n  Results:")
    print(f"    Synced: {synced}")
    print(f"    Skipped (already exist): {skipped}")
    print(f"    Errors: {len(errors)}")

    if errors and len(errors) <= 10:
        print(f"\n  Error details:")
        for error in errors:
            print(f"    - {error}")
    elif errors:
        print(f"\n  First 10 errors:")
        for error in errors[:10]:
            print(f"    - {error}")

    return synced, skipped, len(errors)


def sync_board_positions(conn, person_name_map, person_airtable_map, company_airtable_map):
    """Sync board positions from Airtable backup."""
    print("\n" + "="*60)
    print("SYNCING: Board Positions")
    print("="*60)

    data = load_json_backup("board_positions.json")
    cursor = conn.cursor()

    # Get existing airtable_ids
    cursor.execute("SELECT airtable_id FROM notalone.notalone_board_positions WHERE airtable_id IS NOT NULL")
    existing_ids = {row[0] for row in cursor.fetchall()}
    print(f"  Existing records in DB: {len(existing_ids)}")
    print(f"  Records in Airtable backup: {len(data)}")

    synced = 0
    skipped = 0
    errors = []

    for record in data:
        fields = record.get("fields", {})
        airtable_id = record["id"]

        if airtable_id in existing_ids:
            skipped += 1
            continue

        # Resolve person
        person_name = fields.get("Person") or fields.get("Name", "")
        if isinstance(person_name, list):
            person_name = person_name[0] if person_name else ""
        person_name = person_name.strip()

        person_airtable_ids = fields.get("Person ID", [])

        person_id = None
        if person_airtable_ids:
            person_id = person_airtable_map.get(person_airtable_ids[0])
        if not person_id and person_name:
            person_id = person_name_map.get(person_name)

        if not person_id:
            errors.append(f"{airtable_id}: Person not found - '{person_name}'")
            continue

        # Resolve company
        company_airtable_ids = fields.get("Company", [])
        company_id = None
        if company_airtable_ids:
            company_id = company_airtable_map.get(company_airtable_ids[0])

        if not company_id:
            errors.append(f"{airtable_id}: Company not found")
            continue

        try:
            cursor.execute("""
                INSERT INTO notalone.notalone_board_positions
                (airtable_id, person_id, company_id, position, start_date, end_date, is_current, notes)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (airtable_id) DO NOTHING
            """, (
                airtable_id,
                person_id,
                company_id,
                fields.get("Position"),
                parse_date(fields.get("Start Date")),
                parse_date(fields.get("End Date")),
                fields.get("Is Current", False),
                fields.get("Notes")
            ))
            if cursor.rowcount > 0:
                synced += 1
        except Exception as e:
            errors.append(f"{airtable_id}: {str(e)}")
            conn.rollback()
            continue

    conn.commit()

    print(f"\n  Results:")
    print(f"    Synced: {synced}")
    print(f"    Skipped (already exist): {skipped}")
    print(f"    Errors: {len(errors)}")

    if errors:
        print(f"\n  Errors:")
        for error in errors[:10]:
            print(f"    - {error}")

    return synced, skipped, len(errors)


def sync_investment_relationships(conn, person_name_map, person_airtable_map, company_airtable_map):
    """Sync investment relationships from Airtable backup."""
    print("\n" + "="*60)
    print("SYNCING: Investment Relationships")
    print("="*60)

    data = load_json_backup("investment_relationships.json")
    cursor = conn.cursor()

    # Get existing airtable_ids
    cursor.execute("SELECT airtable_id FROM notalone.notalone_investment_relationships WHERE airtable_id IS NOT NULL")
    existing_ids = {row[0] for row in cursor.fetchall()}
    print(f"  Existing records in DB: {len(existing_ids)}")
    print(f"  Records in Airtable backup: {len(data)}")

    synced = 0
    skipped = 0
    errors = []

    for record in data:
        fields = record.get("fields", {})
        airtable_id = record["id"]

        if airtable_id in existing_ids:
            skipped += 1
            continue

        # Resolve investor person
        investor_airtable_ids = fields.get("Investor", [])
        investor_person_id = None
        if investor_airtable_ids:
            investor_person_id = person_airtable_map.get(investor_airtable_ids[0])

        if not investor_person_id:
            errors.append(f"{airtable_id}: Investor person not found")
            continue

        # Resolve target company
        company_airtable_ids = fields.get("Company", [])
        target_company_id = None
        if company_airtable_ids:
            target_company_id = company_airtable_map.get(company_airtable_ids[0])

        if not target_company_id:
            errors.append(f"{airtable_id}: Target company not found")
            continue

        # Parse amount (convert to cents if present)
        amount_usd = fields.get("Amount")
        if amount_usd:
            amount_usd = int(float(amount_usd) * 100)

        try:
            cursor.execute("""
                INSERT INTO notalone.notalone_investment_relationships
                (airtable_id, investor_person_id, target_company_id, investment_type,
                 round, investment_date, amount_usd, is_lead_investor, has_board_seat, notes)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (airtable_id) DO NOTHING
            """, (
                airtable_id,
                investor_person_id,
                target_company_id,
                fields.get("Investment Type"),
                fields.get("Round"),
                parse_date(fields.get("Date")),
                amount_usd,
                fields.get("Lead Investor", False),
                fields.get("Board Seat", False),
                fields.get("Notes")
            ))
            if cursor.rowcount > 0:
                synced += 1
        except Exception as e:
            errors.append(f"{airtable_id}: {str(e)}")
            conn.rollback()
            continue

    conn.commit()

    print(f"\n  Results:")
    print(f"    Synced: {synced}")
    print(f"    Skipped (already exist): {skipped}")
    print(f"    Errors: {len(errors)}")

    if errors:
        print(f"\n  Errors:")
        for error in errors[:10]:
            print(f"    - {error}")

    return synced, skipped, len(errors)


def print_summary(results):
    """Print final summary."""
    print("\n" + "="*60)
    print("SYNC COMPLETE - SUMMARY")
    print("="*60)

    total_synced = 0
    total_skipped = 0
    total_errors = 0

    for table, (synced, skipped, errors) in results.items():
        print(f"\n  {table}:")
        print(f"    Synced:  {synced}")
        print(f"    Skipped: {skipped}")
        print(f"    Errors:  {errors}")
        total_synced += synced
        total_skipped += skipped
        total_errors += errors

    print(f"\n  TOTALS:")
    print(f"    New records added: {total_synced}")
    print(f"    Already existed:   {total_skipped}")
    print(f"    Errors:            {total_errors}")
    print("="*60)


def main():
    print("="*60)
    print("Airtable to PostgreSQL Sync")
    print("="*60)
    print(f"\nConnecting to PostgreSQL at {PG_CONFIG['host']}:{PG_CONFIG['port']}...")

    try:
        conn = psycopg2.connect(**PG_CONFIG)
        print("  Connected successfully!")
    except Exception as e:
        print(f"  ERROR: Failed to connect - {e}")
        sys.exit(1)

    try:
        # Build mappings
        print("\nBuilding person and company mappings...")
        person_name_map, person_airtable_map = get_person_mapping(conn)
        company_name_map, company_airtable_map = get_company_mapping(conn)
        print(f"  People:    {len(person_name_map)} by name, {len(person_airtable_map)} by Airtable ID")
        print(f"  Companies: {len(company_name_map)} by name, {len(company_airtable_map)} by Airtable ID")

        # Sync tables
        results = {}

        results["Employment History"] = sync_employment_history(
            conn, person_name_map, person_airtable_map, company_airtable_map
        )

        results["Board Positions"] = sync_board_positions(
            conn, person_name_map, person_airtable_map, company_airtable_map
        )

        results["Investment Relationships"] = sync_investment_relationships(
            conn, person_name_map, person_airtable_map, company_airtable_map
        )

        # Print summary
        print_summary(results)

    finally:
        conn.close()
        print("\nConnection closed.")


if __name__ == "__main__":
    main()
