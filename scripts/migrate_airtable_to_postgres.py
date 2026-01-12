#!/usr/bin/env python3
"""
Migrate Notalone data from Airtable to PostgreSQL on XNode3.

Usage:
    python migrate_airtable_to_postgres.py --dry-run    # Preview migration
    python migrate_airtable_to_postgres.py              # Execute migration

Requirements:
    pip install psycopg2-binary pyairtable python-dotenv
"""

import os
import sys
import json
import argparse
from datetime import datetime
from pathlib import Path

try:
    import psycopg2
    from psycopg2.extras import execute_values
except ImportError:
    print("Install psycopg2: pip install psycopg2-binary")
    sys.exit(1)

try:
    from pyairtable import Api
except ImportError:
    print("Install pyairtable: pip install pyairtable")
    sys.exit(1)

# Configuration
AIRTABLE_BASE_ID = "appa39H33O8CmM01t"
AIRTABLE_API_KEY = os.environ.get("AIRTABLE_API_KEY")

# XNode3 PostgreSQL connection
PG_CONFIG = {
    "host": "74.50.97.243",
    "port": 5432,
    "database": "calendar_monitoring",
    "user": os.environ.get("XNODE3_PG_USER", "notalone_user"),
    "password": os.environ.get("XNODE3_PG_PASSWORD"),
}

# Table mappings: Airtable table ID -> (name, postgres_table)
TABLE_MAPPINGS = {
    "tbl99OI9v2ZnF7XmK": ("Institutions", "notalone.institutions"),
    "tbluQaieDFsMztLFV": ("Companies", "notalone.companies"),
    "tbl6ROVRtAadOLlhe": ("People", "notalone.people"),
    "tbl7d2Vj6dYlLmktI": ("Employment History", "notalone.employment_history"),
    "tbl48OdXbC2PcCjgh": ("Education Records", "notalone.education_records"),
    "tbluYsfYdCKRJhu5V": ("Military Service", "notalone.military_service"),
    "tbl1Yo8DOMJv98d4k": ("Investment Relationships", "notalone.investment_relationships"),
    "tblIkfJksjZpiWOR0": ("Board Positions", "notalone.board_positions"),
    "tblZMB7cWtudEETlW": ("Funding Rounds", "notalone.funding_rounds"),
    "tbl8PKKLuxaToIpic": ("Acquisitions", "notalone.acquisitions"),
    "tblS0fyGLHJ9hslNT": ("Co-Founder Relationships", "notalone.cofounder_relationships"),
    "tblsC3z0LSqfEiVA3": ("Person Connections", "notalone.person_connections"),
    "tblPH9D0sEFqrEoxh": ("LP Prospects", "notalone.lp_prospects"),
}


def parse_currency(value):
    """Convert Airtable currency to cents (integer)."""
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return int(value * 100)
    return None


def extract_first_linked(value):
    """Extract first linked record ID from Airtable link field."""
    if value is None:
        return None
    if isinstance(value, list) and len(value) > 0:
        return value[0]
    return value


def transform_institution(record):
    """Transform Airtable institution record to PostgreSQL row."""
    fields = record.get("fields", {})
    return {
        "airtable_id": record["id"],
        "name": fields.get("Institution Name"),
        "full_name": fields.get("Full Name"),
        "type": fields.get("Type"),
        "subtype": fields.get("Subtype"),
        "location": fields.get("Location"),
        "founded_year": fields.get("Founded Year"),
        "prestige_tier": fields.get("Prestige Tier"),
        "notable_programs": fields.get("Notable Programs"),
        "notes": fields.get("Notes"),
    }


def transform_company(record):
    """Transform Airtable company record to PostgreSQL row."""
    fields = record.get("fields", {})
    return {
        "airtable_id": record["id"],
        "name": fields.get("Company Name"),
        "founded_year": fields.get("Founded Year"),
        "shutdown_year": fields.get("Shutdown Year"),
        "company_type": fields.get("Company Type"),
        "stage": fields.get("Stage"),
        "status": fields.get("Status"),
        "sector": fields.get("Sector"),
        "technologies": fields.get("Technologies"),
        "hq_location": fields.get("HQ Location"),
        "description": fields.get("Description"),
        "total_raised": parse_currency(fields.get("Total Raised")),
        "exit_value": parse_currency(fields.get("Exit Value")),
        "exit_type": fields.get("Exit Type"),
        "exit_date": fields.get("Exit Date"),
        "website": fields.get("Website"),
        "twitter_handle": fields.get("X account"),
        "tags": fields.get("Tags", "").split(",") if fields.get("Tags") else None,
        "notes": fields.get("Notes"),
    }


def transform_person(record):
    """Transform Airtable person record to PostgreSQL row."""
    fields = record.get("fields", {})
    return {
        "airtable_id": record["id"],
        "name": fields.get("Name"),
        "current_role": fields.get("Current Role"),
        "current_company_id": None,  # Will be resolved in second pass
        "primary_type": fields.get("Primary Type"),
        "secondary_types": fields.get("Secondary Types"),
        "is_8200_alumni": fields.get("Is 8200 Alumni", False),
        "is_talpiot_alumni": fields.get("Is Talpiot Alumni") == "TRUE",
        "is_technion_alumni": fields.get("Is Technion Alumni", False),
        "lp_potential": fields.get("LP Potential"),
        "lp_segment": fields.get("LP Segment"),
        "estimated_net_worth": fields.get("Estimated Net Worth"),
        "location": fields.get("Location"),
        "tags": fields.get("Tags"),
        "notes": fields.get("Notes"),
    }


def transform_employment(record):
    """Transform Airtable employment record to PostgreSQL row."""
    fields = record.get("fields", {})
    return {
        "airtable_id": record["id"],
        "person_id": None,  # Resolved in second pass
        "company_id": None,  # Resolved in second pass
        "role_title": fields.get("Role"),
        "start_date": fields.get("Start Date"),
        "end_date": fields.get("End Date"),
        "is_founder": fields.get("Is Founder", False),
        "is_current": fields.get("Is Current", False),
        "notable_achievement": fields.get("Notable Achievement"),
        "notes": fields.get("Notes"),
    }


def export_to_json(api, output_dir):
    """Export all Airtable tables to JSON files for backup."""
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    base = api.base(AIRTABLE_BASE_ID)

    for table_id, (name, _) in TABLE_MAPPINGS.items():
        print(f"Exporting {name}...")
        table = base.table(table_id)
        records = table.all()

        filename = name.lower().replace(" ", "_") + ".json"
        filepath = output_dir / filename

        with open(filepath, "w") as f:
            json.dump(records, f, indent=2, default=str)

        print(f"  -> {len(records)} records saved to {filename}")


def migrate_to_postgres(api, conn, dry_run=False):
    """Migrate all data from Airtable to PostgreSQL."""
    cursor = conn.cursor()

    # Track Airtable ID -> PostgreSQL ID mappings
    id_mappings = {}

    # Phase 1: Migrate core entities (Institutions, Companies, People)
    print("\n=== Phase 1: Core Entities ===")

    # Institutions
    base = api.base(AIRTABLE_BASE_ID)
    institutions = base.table("tbl99OI9v2ZnF7XmK").all()
    print(f"\nMigrating {len(institutions)} institutions...")

    for record in institutions:
        data = transform_institution(record)
        if dry_run:
            print(f"  [DRY RUN] Would insert: {data['name']}")
        else:
            cursor.execute("""
                INSERT INTO notalone.institutions
                (airtable_id, name, full_name, type, subtype, location,
                 founded_year, prestige_tier, notable_programs, notes)
                VALUES (%(airtable_id)s, %(name)s, %(full_name)s, %(type)s,
                        %(subtype)s, %(location)s, %(founded_year)s,
                        %(prestige_tier)s, %(notable_programs)s, %(notes)s)
                RETURNING id
            """, data)
            pg_id = cursor.fetchone()[0]
            id_mappings[record["id"]] = ("institutions", pg_id)

    # Companies
    companies = base.table("tbluQaieDFsMztLFV").all()
    print(f"\nMigrating {len(companies)} companies...")

    for record in companies:
        data = transform_company(record)
        if dry_run:
            print(f"  [DRY RUN] Would insert: {data['name']}")
        else:
            cursor.execute("""
                INSERT INTO notalone.companies
                (airtable_id, name, founded_year, shutdown_year, company_type,
                 stage, status, sector, technologies, hq_location, description,
                 total_raised, exit_value, exit_type, exit_date, website,
                 twitter_handle, tags, notes)
                VALUES (%(airtable_id)s, %(name)s, %(founded_year)s,
                        %(shutdown_year)s, %(company_type)s, %(stage)s,
                        %(status)s, %(sector)s, %(technologies)s, %(hq_location)s,
                        %(description)s, %(total_raised)s, %(exit_value)s,
                        %(exit_type)s, %(exit_date)s, %(website)s,
                        %(twitter_handle)s, %(tags)s, %(notes)s)
                RETURNING id
            """, data)
            pg_id = cursor.fetchone()[0]
            id_mappings[record["id"]] = ("companies", pg_id)

    # People
    people = base.table("tbl6ROVRtAadOLlhe").all()
    print(f"\nMigrating {len(people)} people...")

    for record in people:
        data = transform_person(record)
        if dry_run:
            print(f"  [DRY RUN] Would insert: {data['name']}")
        else:
            cursor.execute("""
                INSERT INTO notalone.people
                (airtable_id, name, current_role, primary_type, secondary_types,
                 is_8200_alumni, is_talpiot_alumni, is_technion_alumni,
                 lp_potential, lp_segment, estimated_net_worth, location,
                 tags, notes)
                VALUES (%(airtable_id)s, %(name)s, %(current_role)s,
                        %(primary_type)s, %(secondary_types)s, %(is_8200_alumni)s,
                        %(is_talpiot_alumni)s, %(is_technion_alumni)s,
                        %(lp_potential)s, %(lp_segment)s, %(estimated_net_worth)s,
                        %(location)s, %(tags)s, %(notes)s)
                RETURNING id
            """, data)
            pg_id = cursor.fetchone()[0]
            id_mappings[record["id"]] = ("people", pg_id)

    if not dry_run:
        conn.commit()
        print(f"\nPhase 1 complete. {len(id_mappings)} records migrated.")

    # Phase 2: Migrate relationship tables (using ID mappings)
    print("\n=== Phase 2: Relationship Tables ===")
    # ... (additional migration code for relationship tables)

    return id_mappings


def main():
    parser = argparse.ArgumentParser(description="Migrate Notalone from Airtable to PostgreSQL")
    parser.add_argument("--dry-run", action="store_true", help="Preview without executing")
    parser.add_argument("--export-only", action="store_true", help="Only export to JSON")
    parser.add_argument("--output-dir", default="database/airtable-backup", help="JSON backup directory")
    args = parser.parse_args()

    if not AIRTABLE_API_KEY:
        print("Error: Set AIRTABLE_API_KEY environment variable")
        sys.exit(1)

    api = Api(AIRTABLE_API_KEY)

    if args.export_only:
        export_to_json(api, args.output_dir)
        return

    if not PG_CONFIG["password"]:
        print("Error: Set XNODE3_PG_PASSWORD environment variable")
        sys.exit(1)

    print(f"Connecting to PostgreSQL at {PG_CONFIG['host']}...")
    conn = psycopg2.connect(**PG_CONFIG)

    try:
        migrate_to_postgres(api, conn, dry_run=args.dry_run)
    finally:
        conn.close()


if __name__ == "__main__":
    main()
