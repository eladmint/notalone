#!/usr/bin/env python3
"""
Import Airtable backup data into PostgreSQL.
Generates SQL INSERT statements from JSON backup files.

Two modes:
1. Base tables (people, companies, institutions) - no FK resolution needed
2. Junction tables - requires FK resolution from airtable_id to uuid

Usage:
    # Full import (generates SQL that resolves FKs at runtime)
    python import_data.py > import.sql 2> import_errors.log
    cat import.sql | ssh eladm@74.50.97.243 "sudo nixos-container run events-hive -- psql -h /var/run/postgresql -p 5433 -U postgres -d calendar_monitoring"

    # Check for skipped records
    cat import_errors.log
"""

import json
import os
import sys
from pathlib import Path

# Track skipped records for logging
skipped_records = []

def log_skip(table, record_id, reason):
    """Log a skipped record to stderr."""
    msg = f"SKIPPED: {table} record {record_id} - {reason}"
    skipped_records.append(msg)
    print(msg, file=sys.stderr)

BACKUP_DIR = Path(__file__).parent.parent / "database" / "airtable-backup"

# Airtable ID to PostgreSQL UUID resolution using subqueries
def resolve_person_fk(airtable_ids):
    """Generate subquery to resolve person airtable_id to uuid."""
    if not airtable_ids:
        return "NULL"
    airtable_id = airtable_ids[0] if isinstance(airtable_ids, list) else airtable_ids
    return f"(SELECT id FROM notalone.notalone_people WHERE airtable_id = '{airtable_id}')"

def resolve_company_fk(airtable_ids):
    """Generate subquery to resolve company airtable_id to uuid."""
    if not airtable_ids:
        return "NULL"
    airtable_id = airtable_ids[0] if isinstance(airtable_ids, list) else airtable_ids
    return f"(SELECT id FROM notalone.notalone_companies WHERE airtable_id = '{airtable_id}')"

def resolve_institution_fk(airtable_ids):
    """Generate subquery to resolve institution airtable_id to uuid."""
    if not airtable_ids:
        return "NULL"
    airtable_id = airtable_ids[0] if isinstance(airtable_ids, list) else airtable_ids
    return f"(SELECT id FROM notalone.notalone_institutions WHERE airtable_id = '{airtable_id}')"

def escape_sql(value, as_jsonb=False):
    """Escape a value for SQL.

    Args:
        value: The value to escape
        as_jsonb: If True and value is a string, convert comma-separated string to JSON array
    """
    if value is None:
        return "NULL"
    if isinstance(value, bool):
        return "TRUE" if value else "FALSE"
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, list):
        # Convert to PostgreSQL array or JSONB
        return "'" + json.dumps(value).replace("'", "''") + "'::jsonb"
    if isinstance(value, dict):
        return "'" + json.dumps(value).replace("'", "''") + "'::jsonb"
    # String
    if as_jsonb and isinstance(value, str):
        # Convert comma-separated string to JSON array
        items = [item.strip() for item in value.split(',') if item.strip()]
        return "'" + json.dumps(items).replace("'", "''") + "'::jsonb"
    return "'" + str(value).replace("'", "''") + "'"

def load_json(filename):
    """Load JSON file from backup directory."""
    filepath = BACKUP_DIR / filename
    if not filepath.exists():
        return []
    with open(filepath) as f:
        return json.load(f)

def import_institutions():
    """Generate SQL for institutions."""
    data = load_json("institutions.json")
    print("-- Importing institutions")
    for record in data:
        fields = record.get("fields", {})
        sql = f"""INSERT INTO notalone.notalone_institutions
            (airtable_id, institution_name, full_name, type, subtype, location, founded_year, prestige_tier, notable_programs, notes)
            VALUES (
                {escape_sql(record['id'])},
                {escape_sql(fields.get('Institution Name'))},
                {escape_sql(fields.get('Full Name'))},
                {escape_sql(fields.get('Type'))}::notalone.institution_type,
                {escape_sql(fields.get('Subtype'))}::notalone.institution_subtype,
                {escape_sql(fields.get('Location'))}::notalone.location,
                {escape_sql(fields.get('Founded Year'))},
                {escape_sql(fields.get('Prestige Tier'))}::notalone.prestige_tier,
                {escape_sql(fields.get('Notable Programs'))},
                {escape_sql(fields.get('Notes'))}
            ) ON CONFLICT (airtable_id) DO NOTHING;"""
        print(sql)
    print(f"-- Inserted {len(data)} institutions\n")

def import_companies():
    """Generate SQL for companies."""
    data = load_json("companies.json")
    print("-- Importing companies")
    for record in data:
        fields = record.get("fields", {})
        # Handle currency conversion (store in cents)
        total_raised = fields.get('Total Raised')
        if total_raised:
            total_raised = int(float(total_raised) * 100)
        exit_value = fields.get('Exit Value')
        if exit_value:
            exit_value = int(float(exit_value) * 100)

        sql = f"""INSERT INTO notalone.notalone_companies
            (airtable_id, company_name, founded_year, shutdown_year, company_type, stage, status,
             sector, hq_location, description, total_raised_usd, exit_value_usd, exit_type, exit_date,
             website, x_account, notes)
            VALUES (
                {escape_sql(record['id'])},
                {escape_sql(fields.get('Company Name'))},
                {escape_sql(fields.get('Founded Year'))},
                {escape_sql(fields.get('Shutdown Year'))},
                {escape_sql(fields.get('Company Type'))}::notalone.company_type,
                {escape_sql(fields.get('Stage'))}::notalone.company_stage,
                {escape_sql(fields.get('Status'))}::notalone.company_status,
                {escape_sql(fields.get('Sector'))},
                {escape_sql(fields.get('HQ Location'))}::notalone.location,
                {escape_sql(fields.get('Description'))},
                {escape_sql(total_raised)},
                {escape_sql(exit_value)},
                {escape_sql(fields.get('Exit Type'))}::notalone.exit_type,
                {escape_sql(fields.get('Exit Date'))}::date,
                {escape_sql(fields.get('Website'))},
                {escape_sql(fields.get('X account'))},
                {escape_sql(fields.get('Notes'))}
            ) ON CONFLICT (airtable_id) DO NOTHING;"""
        print(sql)
    print(f"-- Inserted {len(data)} companies\n")

def import_people():
    """Generate SQL for people."""
    data = load_json("people.json")
    print("-- Importing people")
    for record in data:
        fields = record.get("fields", {})

        # Handle boolean conversion
        is_8200 = fields.get('Is 8200 Alumni', False)
        if isinstance(is_8200, str):
            is_8200 = is_8200.upper() == 'TRUE'

        is_talpiot = fields.get('Is Talpiot Alumni', False)
        if isinstance(is_talpiot, str):
            is_talpiot = is_talpiot.upper() == 'TRUE'

        is_technion = fields.get('Is Technion Alumni', False)
        if isinstance(is_technion, str):
            is_technion = is_technion.upper() == 'TRUE'

        # Convert comma-separated tags to JSON array
        tags_value = escape_sql(fields.get('Tags'), as_jsonb=True) if fields.get('Tags') else "'[]'::jsonb"

        sql = f"""INSERT INTO notalone.notalone_people
            (airtable_id, name, person_current_role, primary_type, secondary_types,
             is_8200_alumni, is_talpiot_alumni, is_technion_alumni,
             lp_potential, lp_segment, estimated_net_worth, location, tags, notes)
            VALUES (
                {escape_sql(record['id'])},
                {escape_sql(fields.get('Name'))},
                {escape_sql(fields.get('Current Role'))}::notalone.current_role_type,
                {escape_sql(fields.get('Primary Type'))}::notalone.person_type,
                {escape_sql(fields.get('Secondary Types', []))},
                {escape_sql(is_8200)},
                {escape_sql(is_talpiot)},
                {escape_sql(is_technion)},
                {escape_sql(fields.get('LP Potential'))}::notalone.lp_potential,
                {escape_sql(fields.get('LP Segment'))}::notalone.lp_segment,
                {escape_sql(fields.get('Estimated Net Worth'))}::notalone.net_worth_range,
                {escape_sql(fields.get('Location'))}::notalone.location,
                {tags_value},
                {escape_sql(fields.get('Notes'))}
            ) ON CONFLICT (airtable_id) DO NOTHING;"""
        print(sql)
    print(f"-- Inserted {len(data)} people\n")

def import_employment_history():
    """Generate SQL for employment history with FK resolution."""
    data = load_json("employment_history.json")
    print("-- Importing employment history (with FK resolution)")
    imported = 0
    for record in data:
        fields = record.get("fields", {})

        is_founder = fields.get('Is Founder', False)
        if isinstance(is_founder, str):
            is_founder = is_founder.upper() == 'TRUE'

        is_current = fields.get('Is Current', False)
        if isinstance(is_current, str):
            is_current = is_current.upper() == 'TRUE'

        # Check for required FKs
        person_ref = fields.get('Person')
        company_ref = fields.get('Company')

        if not person_ref:
            log_skip("employment_history", record['id'], f"Missing Person FK (Name: {fields.get('Name', 'unknown')})")
            continue
        if not company_ref:
            log_skip("employment_history", record['id'], f"Missing Company FK (Person: {fields.get('Name', 'unknown')}, Role: {fields.get('Role', 'unknown')})")
            continue

        # Resolve FKs using subqueries
        person_id_sql = resolve_person_fk(person_ref)
        company_id_sql = resolve_company_fk(company_ref)

        sql = f"""INSERT INTO notalone.notalone_employment_history
            (airtable_id, person_id, company_id, role_title, start_date, end_date, is_founder, is_current, notable_achievement, notes)
            SELECT
                {escape_sql(record['id'])},
                {person_id_sql},
                {company_id_sql},
                {escape_sql(fields.get('Role'))},
                {escape_sql(fields.get('Start Date'))}::date,
                {escape_sql(fields.get('End Date'))}::date,
                {escape_sql(is_founder)},
                {escape_sql(is_current)},
                {escape_sql(fields.get('Notable Achievement'))},
                {escape_sql(fields.get('Notes'))}
            WHERE {person_id_sql} IS NOT NULL AND {company_id_sql} IS NOT NULL
            ON CONFLICT (airtable_id) DO NOTHING;"""
        print(sql)
        imported += 1
    print(f"-- Attempted {imported} employment records (skipped {len(data) - imported})\n")

def import_education_records():
    """Generate SQL for education records with FK resolution."""
    data = load_json("education_records.json")
    print("-- Importing education records (with FK resolution)")
    for record in data:
        fields = record.get("fields", {})

        # Resolve FKs using subqueries
        institution_id_sql = resolve_institution_fk(fields.get('Institution'))
        # Person field is a name in this table, resolve by name
        person_name = fields.get('Person') or fields.get('Name')
        person_id_sql = f"(SELECT id FROM notalone.notalone_people WHERE name = {escape_sql(person_name)} LIMIT 1)" if person_name else "NULL"

        sql = f"""INSERT INTO notalone.notalone_education_records
            (airtable_id, person_id, institution_id, degree_type, field_of_study, start_year, end_year, notable_achievement)
            VALUES (
                {escape_sql(record['id'])},
                {person_id_sql},
                {institution_id_sql},
                {escape_sql(fields.get('Degree Type'))}::notalone.degree_type,
                {escape_sql(fields.get('Field of Study'))},
                {escape_sql(fields.get('Start Year'))},
                {escape_sql(fields.get('End Year'))},
                {escape_sql(fields.get('Notable Achievement'))}
            ) ON CONFLICT (airtable_id) DO NOTHING;"""
        print(sql)
    print(f"-- Inserted {len(data)} education records\n")

def import_military_service():
    """Generate SQL for military service with FK resolution."""
    data = load_json("military_service.json")
    print("-- Importing military service (with FK resolution)")
    for record in data:
        fields = record.get("fields", {})

        # Person field is a name, resolve by name
        person_name = fields.get('Person') or fields.get('Name')
        person_id_sql = f"(SELECT id FROM notalone.notalone_people WHERE name = {escape_sql(person_name)} LIMIT 1)" if person_name else "NULL"

        # Unit field is a name (e.g., 'Unit 8200'), resolve by institution name
        unit_name = fields.get('Unit')
        unit_id_sql = f"(SELECT id FROM notalone.notalone_institutions WHERE institution_name = {escape_sql(unit_name)})" if unit_name else "NULL"

        sql = f"""INSERT INTO notalone.notalone_military_service
            (airtable_id, person_id, unit_id, role, highest_rank, start_year, end_year, notable_achievement, notes)
            VALUES (
                {escape_sql(record['id'])},
                {person_id_sql},
                {unit_id_sql},
                {escape_sql(fields.get('Role'))}::notalone.military_role,
                {escape_sql(fields.get('Highest Rank'))}::notalone.military_rank,
                {escape_sql(fields.get('Start Year'))},
                {escape_sql(fields.get('End Year'))},
                {escape_sql(fields.get('Notable Achievement'))},
                {escape_sql(fields.get('Notes'))}
            ) ON CONFLICT (airtable_id) DO NOTHING;"""
        print(sql)
    print(f"-- Inserted {len(data)} military service records\n")

def import_investment_relationships():
    """Generate SQL for investment relationships with FK resolution."""
    data = load_json("investment_relationships.json")
    print("-- Importing investment relationships (with FK resolution)")
    for record in data:
        fields = record.get("fields", {})
        amount = fields.get('Amount')
        if amount:
            amount = int(float(amount) * 100)  # Convert to cents

        # Resolve FKs using subqueries
        investor_person_id_sql = resolve_person_fk(fields.get('Investor'))
        target_company_id_sql = resolve_company_fk(fields.get('Company'))

        sql = f"""INSERT INTO notalone.notalone_investment_relationships
            (airtable_id, investor_person_id, target_company_id, investment_type, round, investment_date, amount_usd, is_lead_investor, has_board_seat, notes)
            VALUES (
                {escape_sql(record['id'])},
                {investor_person_id_sql},
                {target_company_id_sql},
                {escape_sql(fields.get('Investment Type'))}::notalone.investment_type,
                {escape_sql(fields.get('Round'))}::notalone.round_type,
                {escape_sql(fields.get('Date'))}::date,
                {escape_sql(amount)},
                {escape_sql(fields.get('Lead Investor', False))},
                {escape_sql(fields.get('Board Seat', False))},
                {escape_sql(fields.get('Notes'))}
            ) ON CONFLICT (airtable_id) DO NOTHING;"""
        print(sql)
    print(f"-- Inserted {len(data)} investment relationships\n")

def import_board_positions():
    """Generate SQL for board positions with FK resolution."""
    data = load_json("board_positions.json")
    print("-- Importing board positions (with FK resolution)")
    for record in data:
        fields = record.get("fields", {})
        is_current = fields.get('Is Current', False)
        if isinstance(is_current, str):
            is_current = is_current.upper() == 'TRUE'

        # Resolve FKs - Person is a name, Company is airtable ID
        person_name = fields.get('Person') or fields.get('Name')
        person_id_sql = f"(SELECT id FROM notalone.notalone_people WHERE name = {escape_sql(person_name)} LIMIT 1)" if person_name else "NULL"
        company_id_sql = resolve_company_fk(fields.get('Company'))

        sql = f"""INSERT INTO notalone.notalone_board_positions
            (airtable_id, person_id, company_id, position, start_date, end_date, is_current, notes)
            VALUES (
                {escape_sql(record['id'])},
                {person_id_sql},
                {company_id_sql},
                {escape_sql(fields.get('Position'))},
                {escape_sql(fields.get('Start Date'))}::date,
                {escape_sql(fields.get('End Date'))}::date,
                {escape_sql(is_current)},
                {escape_sql(fields.get('Notes'))}
            ) ON CONFLICT (airtable_id) DO NOTHING;"""
        print(sql)
    print(f"-- Inserted {len(data)} board positions\n")

def import_funding_rounds():
    """Generate SQL for funding rounds with FK resolution."""
    data = load_json("funding_rounds.json")
    print("-- Importing funding rounds (with FK resolution)")
    for record in data:
        fields = record.get("fields", {})
        amount = fields.get('Amount')
        if amount:
            amount = int(float(amount) * 100)
        pre_money = fields.get('Pre-Money Valuation')
        if pre_money:
            pre_money = int(float(pre_money) * 100)

        # Resolve FK
        company_id_sql = resolve_company_fk(fields.get('Company'))

        sql = f"""INSERT INTO notalone.notalone_funding_rounds
            (airtable_id, company_id, name, round_name, round_type, round_date, amount_raised_usd, pre_money_valuation_usd,
             lead_investor, other_investors, notes)
            SELECT
                {escape_sql(record['id'])},
                {company_id_sql},
                {escape_sql(fields.get('Name'))},
                {escape_sql(fields.get('Round Name'))}::notalone.round_type,
                {escape_sql(fields.get('Round Type'))}::notalone.round_type,
                {escape_sql(fields.get('Date'))}::date,
                {escape_sql(amount)},
                {escape_sql(pre_money)},
                {escape_sql(fields.get('Lead Investor'))},
                {escape_sql(fields.get('Other Investors', []))},
                {escape_sql(fields.get('Notes'))}
            WHERE {company_id_sql} IS NOT NULL
            ON CONFLICT (airtable_id) DO NOTHING;"""
        print(sql)
    print(f"-- Inserted {len(data)} funding rounds\n")

def import_acquisitions():
    """Generate SQL for acquisitions with FK resolution."""
    data = load_json("acquisitions.json")
    print("-- Importing acquisitions (with FK resolution)")
    for record in data:
        fields = record.get("fields", {})
        deal_value = fields.get('Deal Value')
        if deal_value:
            deal_value = int(float(deal_value) * 100)

        # Resolve FK - Target is company airtable ID (required)
        target_id_sql = resolve_company_fk(fields.get('Target'))

        sql = f"""INSERT INTO notalone.notalone_acquisitions
            (airtable_id, target_id, acquirer_name, acquisition_date, deal_value_usd, deal_type, acquirer_type,
             strategic_rationale, key_people_acquired, notes)
            SELECT
                {escape_sql(record['id'])},
                {target_id_sql},
                {escape_sql(fields.get('Acquirer'))},
                {escape_sql(fields.get('Date'))}::date,
                {escape_sql(deal_value)},
                {escape_sql(fields.get('Deal Type'))}::notalone.deal_type,
                {escape_sql(fields.get('Acquirer Type'))}::notalone.acquirer_type,
                {escape_sql(fields.get('Strategic Rationale'))},
                {escape_sql(fields.get('Key People Acquired', []))},
                {escape_sql(fields.get('Notes'))}
            WHERE {target_id_sql} IS NOT NULL
            ON CONFLICT (airtable_id) DO NOTHING;"""
        print(sql)
    print(f"-- Inserted {len(data)} acquisitions\n")

def import_cofounder_relationships():
    """Generate SQL for co-founder relationships with FK resolution."""
    data = load_json("cofounder_relationships.json")
    print("-- Importing co-founder relationships (with FK resolution)")
    for record in data:
        fields = record.get("fields", {})

        # Get names - ensure person_1 < person_2 alphabetically to satisfy constraint
        p1_name = fields.get('Person 1')
        p2_name = fields.get('Person 2')
        company_name = fields.get('Company')

        # Swap if needed to satisfy unique_cofounder_pair constraint
        if p1_name and p2_name and p1_name > p2_name:
            p1_name, p2_name = p2_name, p1_name

        person_1_id_sql = f"(SELECT id FROM notalone.notalone_people WHERE name = {escape_sql(p1_name)} LIMIT 1)" if p1_name else "NULL"
        person_2_id_sql = f"(SELECT id FROM notalone.notalone_people WHERE name = {escape_sql(p2_name)} LIMIT 1)" if p2_name else "NULL"
        company_id_sql = f"(SELECT id FROM notalone.notalone_companies WHERE company_name = {escape_sql(company_name)} LIMIT 1)" if company_name else "NULL"

        sql = f"""INSERT INTO notalone.notalone_cofounder_relationships
            (airtable_id, person_1_name, person_1_id, person_2_name, person_2_id, company_name, company_id, relationship_type, start_date, notes)
            VALUES (
                {escape_sql(record['id'])},
                {escape_sql(p1_name)},
                {person_1_id_sql},
                {escape_sql(p2_name)},
                {person_2_id_sql},
                {escape_sql(company_name)},
                {company_id_sql},
                {escape_sql(fields.get('Relationship Type'))},
                {escape_sql(fields.get('Start Date'))}::date,
                {escape_sql(fields.get('Notes'))}
            ) ON CONFLICT (airtable_id) DO NOTHING;"""
        print(sql)
    print(f"-- Inserted {len(data)} co-founder relationships\n")

def import_person_connections():
    """Generate SQL for person connections with FK resolution."""
    data = load_json("person_connections.json")
    print("-- Importing person connections (with FK resolution)")
    for record in data:
        fields = record.get("fields", {})

        # Get names and resolve FKs
        p1_name = fields.get('Person 1')
        p2_name = fields.get('Person 2')
        person_1_id_sql = f"(SELECT id FROM notalone.notalone_people WHERE name = {escape_sql(p1_name)} LIMIT 1)" if p1_name else "NULL"
        person_2_id_sql = f"(SELECT id FROM notalone.notalone_people WHERE name = {escape_sql(p2_name)} LIMIT 1)" if p2_name else "NULL"

        sql = f"""INSERT INTO notalone.notalone_person_connections
            (airtable_id, person_1_name, person_1_id, person_2_name, person_2_id, connection_type, connection_strength, source, notes)
            VALUES (
                {escape_sql(record['id'])},
                {escape_sql(p1_name)},
                {person_1_id_sql},
                {escape_sql(p2_name)},
                {person_2_id_sql},
                {escape_sql(fields.get('Connection Type'))}::notalone.connection_type,
                {escape_sql(fields.get('Strength'))}::notalone.connection_strength,
                {escape_sql(fields.get('Source'))},
                {escape_sql(fields.get('Notes'))}
            ) ON CONFLICT (airtable_id) DO NOTHING;"""
        print(sql)
    print(f"-- Inserted {len(data)} person connections\n")

def import_lp_prospects():
    """Generate SQL for LP prospects with FK resolution."""
    data = load_json("lp_prospects.json")
    print("-- Importing LP prospects (with FK resolution)")
    for record in data:
        fields = record.get("fields", {})
        check_min = fields.get('Check Size Min')
        if check_min:
            check_min = int(float(check_min) * 100)
        check_max = fields.get('Check Size Max')
        if check_max:
            check_max = int(float(check_max) * 100)

        # Get name and resolve FK
        person_name = fields.get('Person')
        person_id_sql = f"(SELECT id FROM notalone.notalone_people WHERE name = {escape_sql(person_name)} LIMIT 1)" if person_name else "NULL"

        sql = f"""INSERT INTO notalone.notalone_lp_prospects
            (airtable_id, person_name, person_id, segment, priority_tier, status, warmth_score,
             check_size_min_usd, check_size_max_usd, warm_intro_path, investment_thesis_match, next_action, notes)
            VALUES (
                {escape_sql(record['id'])},
                {escape_sql(person_name)},
                {person_id_sql},
                {escape_sql(fields.get('Segment'))}::notalone.lp_segment,
                {escape_sql(fields.get('Priority Tier'))},
                {escape_sql(fields.get('Status'))}::notalone.prospect_status,
                {escape_sql(fields.get('Warmth Score'))}::notalone.warmth_score,
                {escape_sql(check_min)},
                {escape_sql(check_max)},
                {escape_sql(fields.get('Intro Path'))},
                {escape_sql(fields.get('Investment Thesis Match'))},
                {escape_sql(fields.get('Next Action'))},
                {escape_sql(fields.get('Notes'))}
            ) ON CONFLICT (airtable_id) DO NOTHING;"""
        print(sql)
    print(f"-- Inserted {len(data)} LP prospects\n")

def main():
    print("-- Notalone Data Import")
    print("-- Generated from Airtable backup")
    print("-- " + "=" * 50)
    print("")
    print("SET search_path TO notalone, public;")
    print("")

    # Import in dependency order
    import_institutions()
    import_companies()
    import_people()
    import_employment_history()
    import_education_records()
    import_military_service()
    import_investment_relationships()
    import_board_positions()
    import_funding_rounds()
    import_acquisitions()
    import_cofounder_relationships()
    import_person_connections()
    import_lp_prospects()

    print("-- Import complete!")

if __name__ == "__main__":
    main()
