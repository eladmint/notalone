#!/usr/bin/env python3
"""
Import companies from Collider DB markdown file to PostgreSQL.

Parses docs/research/israel/cllider-db.md and generates SQL inserts
for companies not already in the database.

Usage:
    python scripts/import_collider_companies.py --dry-run    # Preview SQL
    python scripts/import_collider_companies.py --generate   # Generate SQL file
    python scripts/import_collider_companies.py --execute    # Run on server
"""

import re
import json
import argparse
import subprocess
from pathlib import Path
from typing import List, Dict, Optional
from dataclasses import dataclass

# Category mapping: Collider category -> (company_type, sector)
CATEGORY_MAP = {
    # Web3 VCs & Accelerators
    'Web3 VC & Accelerator': ('VC Fund', 'Crypto/Web3'),
    'Web3 VC & Accelerator , VC': ('VC Fund', 'Crypto/Web3'),
    'VC': ('VC Fund', 'Crypto/Web3'),

    # Core Infrastructure
    'Layer 1': ('Startup', 'Crypto/Web3'),
    'Layer 2': ('Startup', 'Crypto/Web3'),
    'Blockchain & Infra': ('Startup', 'Crypto/Web3'),

    # DeFi & Trading
    'DeFi': ('Startup', 'Crypto/Web3'),
    'Trading & Investing': ('Startup', 'Crypto/Web3'),

    # Security & Compliance
    'Security & Compliance': ('Startup', 'Crypto/Web3'),

    # Wallets
    'Wallet': ('Startup', 'Crypto/Web3'),

    # NFT & Gaming
    'NFT': ('Startup', 'Crypto/Web3'),
    'Gaming': ('Startup', 'Crypto/Web3'),

    # Tokenization & RWA
    'Tokenization': ('Startup', 'Crypto/Web3'),

    # Marketing & Services
    'Marketing': ('Startup', 'Crypto/Web3'),
    'Tax & Accounting': ('Startup', 'Crypto/Web3'),

    # DAO & Governance
    'Governance & DAO': ('Startup', 'Crypto/Web3'),

    # Launchpads
    'Launchpad': ('Startup', 'Crypto/Web3'),

    # Other
    'Other': ('Startup', 'Crypto/Web3'),
    '-': ('Startup', 'Crypto/Web3'),
}

# Known companies already in database (will be fetched dynamically)
EXISTING_COMPANIES = set()

@dataclass
class Company:
    """Represents a company from Collider DB."""
    name: str
    category: str
    description: str
    website: Optional[str]
    tags: List[str]

    @property
    def company_type(self) -> str:
        return CATEGORY_MAP.get(self.category, ('Startup', 'Crypto/Web3'))[0]

    @property
    def sector(self) -> str:
        return CATEGORY_MAP.get(self.category, ('Startup', 'Crypto/Web3'))[1]

    @property
    def normalized_name(self) -> str:
        """Normalize company name for comparison."""
        name = self.name.lower().strip()
        # Remove common suffixes
        for suffix in ['.io', '.xyz', '.ai', '.com', ' ltd.', ' ltd', ' inc.', ' inc']:
            name = name.replace(suffix, '')
        return name


def parse_collider_db(filepath: Path) -> List[Company]:
    """Parse the Collider DB markdown file."""
    companies = []
    content = filepath.read_text()
    lines = content.split('\n')

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # Look for pattern: non-empty line followed by "Category" on next line
        if line and i + 1 < len(lines) and lines[i + 1].strip() == 'Category':
            company_name = line
            company_data = {'name': company_name}

            # Parse the company block
            i += 2  # Skip company name and "Category"

            # Skip blank line after "Category"
            while i < len(lines) and not lines[i].strip():
                i += 1

            # Get category value
            if i < len(lines):
                company_data['category'] = lines[i].strip()
                i += 1

            # Skip to "Description"
            while i < len(lines) and lines[i].strip() != 'Description':
                i += 1

            if i < len(lines):
                i += 1  # Skip "Description"

            # Skip blank line
            while i < len(lines) and not lines[i].strip():
                i += 1

            # Collect description until "website"
            desc_lines = []
            while i < len(lines) and lines[i].strip() != 'website':
                if lines[i].strip():
                    desc_lines.append(lines[i].strip())
                i += 1
            company_data['description'] = ' '.join(desc_lines)

            # Skip "website"
            if i < len(lines) and lines[i].strip() == 'website':
                i += 1

            # Skip blank line
            while i < len(lines) and not lines[i].strip():
                i += 1

            # Get website URL
            if i < len(lines):
                url = lines[i].strip()
                if url.startswith('http'):
                    company_data['website'] = url
                i += 1

            # Skip to "Tag"
            while i < len(lines) and lines[i].strip() != 'Tag':
                i += 1

            if i < len(lines):
                i += 1  # Skip "Tag"

            # Skip blank line
            while i < len(lines) and not lines[i].strip():
                i += 1

            # Collect tags until next company (non-empty line followed by "Category")
            tags = []
            while i < len(lines):
                line = lines[i].strip()
                # Check if we hit the next company
                if line and i + 1 < len(lines) and lines[i + 1].strip() == 'Category':
                    break
                if line and line != 'Category' and line != 'Description' and line != 'website' and line != 'Tag':
                    # Split tags by semicolon if present
                    if ';' in line:
                        tags.extend([t.strip() for t in line.split(';') if t.strip()])
                    else:
                        tags.append(line)
                i += 1

            company_data['tags'] = tags

            # Create company object
            companies.append(create_company(company_data))
        else:
            i += 1

    return companies


def create_company(data: Dict) -> Company:
    """Create a Company object from parsed data."""
    return Company(
        name=data.get('name', ''),
        category=data.get('category', 'Other'),
        description=data.get('description', ''),
        website=data.get('website'),
        tags=data.get('tags', [])
    )


def fetch_existing_companies() -> set:
    """Fetch existing company names from database."""
    cmd = '''ssh eladm@74.50.97.243 "PGPASSWORD=notalone2026 psql -h 172.17.0.1 -p 5433 -U postgres -d calendar_monitoring -t -c \\"SELECT company_name FROM notalone.notalone_companies;\\""'''
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
        if result.returncode == 0:
            companies = {line.strip().lower() for line in result.stdout.split('\n') if line.strip()}
            return companies
    except Exception as e:
        print(f"Warning: Could not fetch existing companies: {e}")
    return set()


def normalize_for_comparison(name: str) -> str:
    """Normalize company name for duplicate detection."""
    name = name.lower().strip()
    # Remove common suffixes
    for suffix in ['.io', '.xyz', '.ai', '.com', '.network', '.finance', '.protocol',
                   ' ltd.', ' ltd', ' inc.', ' inc', ' labs', ' network', ' protocol']:
        name = name.replace(suffix, '')
    # Remove special chars
    name = re.sub(r'[^\w\s]', '', name)
    return name.strip()


def is_duplicate(company: Company, existing: set) -> bool:
    """Check if company already exists in database."""
    normalized = normalize_for_comparison(company.name)

    for existing_name in existing:
        if normalize_for_comparison(existing_name) == normalized:
            return True

    return False


def escape_sql(s: str) -> str:
    """Escape string for SQL."""
    if s is None:
        return 'NULL'
    # Escape single quotes
    s = s.replace("'", "''")
    return f"'{s}'"


def generate_sql(companies: List[Company], existing: set) -> str:
    """Generate SQL INSERT statements for new companies."""
    sql_lines = [
        "-- Import companies from Collider DB",
        "-- Generated by import_collider_companies.py",
        "-- Date: 2026-01-12",
        "",
        "SET search_path TO notalone;",
        "",
    ]

    new_count = 0
    skip_count = 0

    for company in companies:
        if is_duplicate(company, existing):
            sql_lines.append(f"-- SKIPPED (duplicate): {company.name}")
            skip_count += 1
            continue

        tags_json = json.dumps(company.tags) if company.tags else '[]'

        # Use INSERT WHERE NOT EXISTS to avoid duplicates
        sql = f"""
INSERT INTO notalone_companies (
    id, company_name, company_type, sector, status,
    description, website, hq_location, tags, notes
)
SELECT
    gen_random_uuid(),
    {escape_sql(company.name)},
    {escape_sql(company.company_type)}::company_type,
    {escape_sql(company.sector)},
    'Active'::company_status,
    {escape_sql(company.description[:500] if company.description else None)},
    {escape_sql(company.website)},
    'Tel Aviv'::location,
    {escape_sql(tags_json)}::jsonb,
    'Source: Collider DB import 2026-01'
WHERE NOT EXISTS (
    SELECT 1 FROM notalone_companies WHERE LOWER(company_name) = LOWER({escape_sql(company.name)})
);
"""
        sql_lines.append(sql.strip())
        sql_lines.append("")
        new_count += 1

        # Also add to existing set to prevent duplicates within import
        existing.add(company.name.lower())

    sql_lines.append(f"-- Summary: {new_count} new companies, {skip_count} skipped duplicates")

    return '\n'.join(sql_lines)


def main():
    parser = argparse.ArgumentParser(description='Import Collider DB companies to PostgreSQL')
    parser.add_argument('--dry-run', action='store_true', help='Preview companies to import')
    parser.add_argument('--generate', action='store_true', help='Generate SQL file')
    parser.add_argument('--execute', action='store_true', help='Execute on server')
    args = parser.parse_args()

    # Find the collider DB file
    base_path = Path(__file__).parent.parent
    collider_file = base_path / 'docs' / 'research' / 'israel' / 'cllider-db.md'

    if not collider_file.exists():
        print(f"Error: Collider DB not found at {collider_file}")
        return 1

    print(f"Parsing {collider_file}...")
    companies = parse_collider_db(collider_file)
    print(f"Found {len(companies)} companies in Collider DB")

    # Fetch existing companies
    print("Fetching existing companies from database...")
    existing = fetch_existing_companies()
    print(f"Found {len(existing)} existing companies in database")

    # Find new companies
    new_companies = [c for c in companies if not is_duplicate(c, existing)]
    print(f"\nNew companies to import: {len(new_companies)}")

    if args.dry_run or (not args.generate and not args.execute):
        print("\n=== Companies to Import ===")
        for c in new_companies[:20]:  # Show first 20
            print(f"  - {c.name} ({c.category}) -> {c.company_type}")
        if len(new_companies) > 20:
            print(f"  ... and {len(new_companies) - 20} more")

        print("\n=== Duplicate Companies (skipped) ===")
        duplicates = [c for c in companies if is_duplicate(c, existing)]
        for c in duplicates[:10]:
            print(f"  - {c.name}")
        if len(duplicates) > 10:
            print(f"  ... and {len(duplicates) - 10} more")
        return 0

    # Generate SQL
    sql = generate_sql(companies, existing)

    if args.generate:
        output_file = base_path / 'database' / 'sql' / '009_import_collider_companies.sql'
        output_file.write_text(sql)
        print(f"\nSQL file generated: {output_file}")
        print(f"Review and execute manually:")
        print(f"  cat {output_file} | ssh eladm@74.50.97.243 'PGPASSWORD=notalone2026 psql -h 172.17.0.1 -p 5433 -U postgres -d calendar_monitoring'")
        return 0

    if args.execute:
        print("\nExecuting SQL on server...")
        # Write to temp file and execute
        temp_file = Path('/tmp/import_collider.sql')
        temp_file.write_text(sql)

        # Copy to server
        scp_cmd = f"scp {temp_file} eladm@74.50.97.243:/tmp/"
        subprocess.run(scp_cmd, shell=True, check=True)

        # Execute
        exec_cmd = '''ssh eladm@74.50.97.243 "PGPASSWORD=notalone2026 psql -h 172.17.0.1 -p 5433 -U postgres -d calendar_monitoring -f /tmp/import_collider.sql"'''
        result = subprocess.run(exec_cmd, shell=True, capture_output=True, text=True)
        print(result.stdout)
        if result.stderr:
            print("Errors:", result.stderr)

        # Verify
        verify_cmd = '''ssh eladm@74.50.97.243 "PGPASSWORD=notalone2026 psql -h 172.17.0.1 -p 5433 -U postgres -d calendar_monitoring -c \\"SELECT COUNT(*) as total_companies FROM notalone.notalone_companies;\\""'''
        result = subprocess.run(verify_cmd, shell=True, capture_output=True, text=True)
        print("\nVerification:", result.stdout)

        return 0


if __name__ == '__main__':
    exit(main())
