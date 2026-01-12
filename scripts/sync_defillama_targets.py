#!/usr/bin/env python3
"""
DefiLlama Data Sync for Investment Targets

Fetches TVL, revenue, and protocol metrics from DefiLlama API
to enrich investment targets with on-chain data.

Usage:
    python scripts/sync_defillama_targets.py --protocols   # Sync protocol TVL data
    python scripts/sync_defillama_targets.py --fees        # Sync fee/revenue data
    python scripts/sync_defillama_targets.py --full        # Both

DefiLlama API is free and has no rate limits.
"""

import os
import sys
import json
import time
import argparse
import subprocess
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import urllib.request
import urllib.error

# DefiLlama API endpoints (all free, no auth required)
DEFILLAMA_BASE = "https://api.llama.fi"
DEFILLAMA_FEES = "https://api.llama.fi/summary/fees"
DEFILLAMA_REVENUE = "https://api.llama.fi/summary/revenue"

# Sector mapping from DefiLlama categories
SECTOR_MAPPING = {
    'Lending': 'DeFi',
    'Dexes': 'DeFi',
    'Derivatives': 'DeFi',
    'CDP': 'DeFi',
    'Yield': 'DeFi',
    'Yield Aggregator': 'DeFi',
    'Liquid Staking': 'DeFi',
    'Bridge': 'Infrastructure',
    'Chain': 'Infrastructure',
    'RWA': 'RWA',
    'Payments': 'Stablecoins',
    'Stablecoins': 'Stablecoins',
    'Privacy': 'Privacy',
    'AI': 'DeAI',
}


def api_request(url: str) -> Dict:
    """Make API request to DefiLlama"""
    req = urllib.request.Request(url)
    req.add_header('Accept', 'application/json')

    try:
        with urllib.request.urlopen(req, timeout=60) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code}: {url}")
        raise


def fetch_protocols() -> List[Dict]:
    """Fetch all protocols with TVL data"""
    print("Fetching protocols from DefiLlama...")
    data = api_request(f"{DEFILLAMA_BASE}/protocols")
    print(f"Found {len(data)} protocols")
    return data


def fetch_protocol_detail(slug: str) -> Dict:
    """Fetch detailed protocol data"""
    return api_request(f"{DEFILLAMA_BASE}/protocol/{slug}")


def fetch_fees_data() -> Dict:
    """Fetch protocol fees data"""
    print("Fetching fees data...")
    return api_request(DEFILLAMA_FEES)


def fetch_revenue_data() -> Dict:
    """Fetch protocol revenue data"""
    print("Fetching revenue data...")
    return api_request(DEFILLAMA_REVENUE)


def map_sector(category: str) -> str:
    """Map DefiLlama category to investment sector"""
    if category in SECTOR_MAPPING:
        return SECTOR_MAPPING[category]
    return 'Other'


def get_existing_targets() -> Dict[str, str]:
    """Get existing targets mapped by defillama_slug"""
    cmd = '''ssh eladm@74.50.97.243 "PGPASSWORD=notalone2026 psql -h 172.17.0.1 -p 5433 -U postgres -d calendar_monitoring -t -c \\"SELECT id, defillama_slug FROM notalone.notalone_investment_targets WHERE defillama_slug IS NOT NULL;\\""'''

    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)

    if result.returncode != 0:
        return {}

    targets = {}
    for line in result.stdout.strip().split('\n'):
        if '|' in line:
            parts = line.split('|')
            if len(parts) >= 2:
                target_id = parts[0].strip()
                slug = parts[1].strip()
                if slug:
                    targets[slug] = target_id

    return targets


def get_existing_by_symbol() -> Dict[str, str]:
    """Get existing targets mapped by token symbol"""
    cmd = '''ssh eladm@74.50.97.243 "PGPASSWORD=notalone2026 psql -h 172.17.0.1 -p 5433 -U postgres -d calendar_monitoring -t -c \\"SELECT id, token_symbol FROM notalone.notalone_investment_targets WHERE token_symbol IS NOT NULL;\\""'''

    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)

    if result.returncode != 0:
        return {}

    targets = {}
    for line in result.stdout.strip().split('\n'):
        if '|' in line:
            parts = line.split('|')
            if len(parts) >= 2:
                target_id = parts[0].strip()
                symbol = parts[1].strip().upper()
                if symbol:
                    targets[symbol] = target_id

    return targets


def generate_tvl_update_sql(protocol: Dict, target_id: str = None, symbol_match: str = None) -> str:
    """Generate SQL to update TVL data"""

    tvl = int(protocol.get('tvl', 0) or 0)
    tvl_change = protocol.get('change_1d', 0) or 0

    # Calculate 30d change from chainTvls if available
    tvl_30d_change = protocol.get('change_30d', 0) or 0

    slug = protocol.get('slug', '')
    category = protocol.get('category', 'Other')
    sector = map_sector(category)

    # Get chains
    chains = protocol.get('chains', [])

    def escape(s):
        if s is None:
            return 'NULL'
        return "'" + str(s).replace("'", "''") + "'"

    if target_id:
        # Update existing target by ID
        sql = f"""
UPDATE notalone.notalone_investment_targets SET
    tvl_usd = {tvl},
    tvl_30d_change_percent = {tvl_30d_change:.2f},
    defillama_slug = {escape(slug)},
    updated_at = NOW()
WHERE id = '{target_id}';
"""
    elif symbol_match:
        # Update by symbol match
        sql = f"""
UPDATE notalone.notalone_investment_targets SET
    tvl_usd = {tvl},
    tvl_30d_change_percent = {tvl_30d_change:.2f},
    defillama_slug = {escape(slug)},
    updated_at = NOW()
WHERE UPPER(token_symbol) = '{symbol_match.upper()}'
  AND defillama_slug IS NULL;
"""
    else:
        return ""

    return sql.strip()


def generate_new_target_sql(protocol: Dict) -> str:
    """Generate SQL to create new target from DefiLlama protocol"""

    name = protocol.get('name', '')
    symbol = protocol.get('symbol', '').upper() if protocol.get('symbol') else None
    slug = protocol.get('slug', '')
    category = protocol.get('category', 'Other')
    sector = map_sector(category)

    tvl = int(protocol.get('tvl', 0) or 0)
    tvl_30d_change = protocol.get('change_30d', 0) or 0

    chains = protocol.get('chains', [])
    chain = chains[0] if chains else None

    url = protocol.get('url', '')
    twitter = protocol.get('twitter', '')
    gecko_id = protocol.get('gecko_id', '')

    def escape(s):
        if s is None:
            return 'NULL'
        return "'" + str(s).replace("'", "''") + "'"

    sector_val = f"'{sector}'::investment_sector" if sector else "'Other'::investment_sector"

    sql = f"""
INSERT INTO notalone.notalone_investment_targets (
    project_name, token_symbol, defillama_slug, coingecko_id,
    sector, chain, website, twitter,
    tvl_usd, tvl_30d_change_percent,
    pipeline_stage, deal_source, tier1_passed
)
SELECT
    {escape(name)},
    {escape(symbol)},
    {escape(slug)},
    {escape(gecko_id) if gecko_id else 'NULL'},
    {sector_val},
    {escape(chain)},
    {escape(url)},
    {escape(twitter)},
    {tvl},
    {tvl_30d_change:.2f},
    'Discovered'::investment_pipeline_stage,
    'DefiLlama TVL scan',
    FALSE
WHERE NOT EXISTS (
    SELECT 1 FROM notalone.notalone_investment_targets
    WHERE defillama_slug = {escape(slug)}
       OR (token_symbol IS NOT NULL AND UPPER(token_symbol) = {escape(symbol) if symbol else "''"})
);
"""
    return sql.strip()


def generate_fees_update_sql(protocol_name: str, fees_24h: float, fees_30d: float, target_id: str) -> str:
    """Generate SQL to update fees/revenue data"""

    monthly_fees = int(fees_30d) if fees_30d else None
    monthly_revenue = int(fees_30d * 0.3) if fees_30d else None  # Estimate 30% protocol revenue

    sql = f"""
UPDATE notalone.notalone_investment_targets SET
    monthly_fees_usd = {monthly_fees if monthly_fees else 'NULL'},
    monthly_revenue_usd = {monthly_revenue if monthly_revenue else 'NULL'},
    updated_at = NOW()
WHERE id = '{target_id}';
"""
    return sql.strip()


def sync_protocols(min_tvl: int = 1_000_000, create_new: bool = False) -> List[str]:
    """Sync TVL data for protocols"""
    print(f"\n=== Syncing protocols (min TVL: ${min_tvl:,}) ===\n")

    protocols = fetch_protocols()

    # Filter by TVL
    filtered = [p for p in protocols if (p.get('tvl') or 0) >= min_tvl]
    print(f"Found {len(filtered)} protocols with TVL >= ${min_tvl:,}")

    # Get existing targets
    existing_by_slug = get_existing_targets()
    existing_by_symbol = get_existing_by_symbol()

    print(f"Existing targets by slug: {len(existing_by_slug)}")
    print(f"Existing targets by symbol: {len(existing_by_symbol)}")

    sql_statements = []
    updated = 0
    created = 0

    for protocol in filtered:
        slug = protocol.get('slug', '')
        symbol = (protocol.get('symbol') or '').upper()
        name = protocol.get('name', '')
        tvl = protocol.get('tvl', 0)

        # Try to match existing target
        if slug in existing_by_slug:
            sql = generate_tvl_update_sql(protocol, target_id=existing_by_slug[slug])
            if sql:
                sql_statements.append(sql)
                updated += 1
                print(f"  Updated (slug): {name} - ${tvl/1e6:.1f}M TVL")

        elif symbol and symbol in existing_by_symbol:
            sql = generate_tvl_update_sql(protocol, target_id=existing_by_symbol[symbol])
            if sql:
                sql_statements.append(sql)
                updated += 1
                print(f"  Updated (symbol): {name} ({symbol}) - ${tvl/1e6:.1f}M TVL")

        elif create_new:
            # Create new target
            sql = generate_new_target_sql(protocol)
            if sql:
                sql_statements.append(sql)
                created += 1
                print(f"  Created: {name} ({symbol or 'no token'}) - ${tvl/1e6:.1f}M TVL")

    print(f"\nUpdated: {updated}, Created: {created}")
    return sql_statements


def sync_fees() -> List[str]:
    """Sync fees/revenue data"""
    print("\n=== Syncing fees data ===\n")

    # Get existing targets with DefiLlama slugs
    existing = get_existing_targets()

    if not existing:
        print("No existing targets with DefiLlama slugs")
        return []

    # Fetch fees data
    fees_data = fetch_fees_data()
    protocols = fees_data.get('protocols', [])

    print(f"Found {len(protocols)} protocols with fees data")

    # Create lookup by name/slug
    fees_lookup = {}
    for p in protocols:
        name = p.get('name', '').lower()
        fees_lookup[name] = p

    sql_statements = []
    matched = 0

    for slug, target_id in existing.items():
        slug_lower = slug.lower()

        # Try to find in fees data
        if slug_lower in fees_lookup:
            p = fees_lookup[slug_lower]
            fees_24h = p.get('total24h', 0) or 0
            fees_30d = p.get('total30d', 0) or 0

            if fees_30d > 0:
                sql = generate_fees_update_sql(p.get('name'), fees_24h, fees_30d, target_id)
                sql_statements.append(sql)
                matched += 1
                print(f"  Updated fees: {p.get('name')} - ${fees_30d/1e6:.2f}M monthly")

    print(f"\nMatched fees for {matched} protocols")
    return sql_statements


def main():
    parser = argparse.ArgumentParser(description='Sync DefiLlama data to investment targets')
    parser.add_argument('--protocols', action='store_true', help='Sync protocol TVL data')
    parser.add_argument('--fees', action='store_true', help='Sync fees/revenue data')
    parser.add_argument('--full', action='store_true', help='Both protocols and fees')
    parser.add_argument('--min-tvl', type=int, default=1_000_000, help='Minimum TVL to include')
    parser.add_argument('--create-new', action='store_true', help='Create new targets from DefiLlama')
    parser.add_argument('--dry-run', action='store_true', help='Print SQL without executing')
    parser.add_argument('--output', type=str, help='Output SQL to file')
    args = parser.parse_args()

    if not any([args.protocols, args.fees, args.full]):
        args.full = True

    all_sql = []

    if args.protocols or args.full:
        all_sql.extend(sync_protocols(args.min_tvl, args.create_new))

    if args.fees or args.full:
        all_sql.extend(sync_fees())

    if not all_sql:
        print("No SQL statements generated")
        return

    combined_sql = '\n\n'.join(all_sql)

    if args.output:
        with open(args.output, 'w') as f:
            f.write(combined_sql)
        print(f"\nSQL written to {args.output}")

    if args.dry_run:
        print("\n=== DRY RUN - SQL Preview ===\n")
        print(combined_sql[:5000])
        if len(combined_sql) > 5000:
            print(f"\n... ({len(combined_sql)} total characters)")
        return

    # Execute SQL
    print("\n=== Executing SQL ===\n")

    temp_file = '/tmp/defillama_sync.sql'
    with open(temp_file, 'w') as f:
        f.write(combined_sql)

    cmd = f'cat {temp_file} | ssh eladm@74.50.97.243 "PGPASSWORD=notalone2026 psql -h 172.17.0.1 -p 5433 -U postgres -d calendar_monitoring"'
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=120)

    print(result.stdout)
    if result.stderr:
        print("Errors:", result.stderr)

    # Verify
    verify_cmd = '''ssh eladm@74.50.97.243 "PGPASSWORD=notalone2026 psql -h 172.17.0.1 -p 5433 -U postgres -d calendar_monitoring -c \\"SELECT COUNT(*) as total, COUNT(tvl_usd) as with_tvl, COUNT(monthly_fees_usd) as with_fees FROM notalone.notalone_investment_targets;\\""'''
    result = subprocess.run(verify_cmd, shell=True, capture_output=True, text=True, timeout=30)
    print("\n=== Data Coverage ===")
    print(result.stdout)


if __name__ == '__main__':
    main()
