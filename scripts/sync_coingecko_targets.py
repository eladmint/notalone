#!/usr/bin/env python3
"""
CoinGecko Data Sync for Investment Targets

Fetches token data from CoinGecko API and populates/updates the
notalone_investment_targets table for post-TGE project screening.

Usage:
    python scripts/sync_coingecko_targets.py --discover     # Find new candidates
    python scripts/sync_coingecko_targets.py --update       # Update existing targets
    python scripts/sync_coingecko_targets.py --full         # Both discover + update

Environment:
    COINGECKO_API_KEY - Optional, for higher rate limits
"""

import os
import sys
import json
import time
import argparse
import subprocess
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
import urllib.request
import urllib.error

# Configuration
COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3"
COINGECKO_PRO_URL = "https://pro-api.coingecko.com/api/v3"

# Tier 1 Filter Criteria (from sourcing plan)
MIN_DAILY_VOLUME_USD = 500_000
MAX_FDV_USD = 100_000_000
MIN_CIRCULATING_PERCENT = 10

# Rate limiting
REQUESTS_PER_MINUTE = 10  # Free tier limit
REQUEST_DELAY = 60 / REQUESTS_PER_MINUTE

# Priority sectors mapping from CoinGecko categories
SECTOR_MAPPING = {
    'real-world-assets': 'RWA',
    'rwa': 'RWA',
    'tokenized-real-world-assets': 'RWA',
    'artificial-intelligence': 'DeAI',
    'ai-agents': 'DeAI',
    'decentralized-finance-defi': 'DeFi',
    'defi': 'DeFi',
    'lending-borrowing': 'DeFi',
    'dex': 'DeFi',
    'derivatives': 'DeFi',
    'stablecoins': 'Stablecoins',
    'payments': 'Stablecoins',
    'bitcoin-ecosystem': 'BTCfi',
    'layer-1': 'Infrastructure',
    'layer-2': 'Infrastructure',
    'infrastructure': 'Infrastructure',
    'interoperability': 'Infrastructure',
    'privacy-coins': 'Privacy',
    'zero-knowledge-zk': 'Privacy',
}

# Kill sectors
KILL_SECTORS = {
    'gaming', 'play-to-earn', 'metaverse', 'nft', 'meme-coins',
    'gambling', 'adult', 'fan-token'
}

# Exchanges with perpetual futures
PERP_EXCHANGES = {
    'binance', 'okx', 'bybit', 'bitget', 'htx', 'kucoin',
    'gate', 'mexc', 'dydx', 'hyperliquid'
}

@dataclass
class TokenData:
    """Parsed token data from CoinGecko"""
    coingecko_id: str
    symbol: str
    name: str
    current_price: float
    market_cap: int
    fdv: int
    total_volume: int
    circulating_supply: float
    total_supply: float
    circulating_percent: float
    ath: float
    ath_date: str
    ath_drawdown: float
    price_change_30d: float
    price_change_90d: float
    categories: List[str]
    exchanges: List[str]
    sector: str
    has_perp: bool
    perp_exchanges: List[str]


def api_request(endpoint: str, params: Dict = None) -> Dict:
    """Make API request to CoinGecko with rate limiting"""
    api_key = os.environ.get('COINGECKO_API_KEY')

    if api_key:
        base_url = COINGECKO_PRO_URL
        headers = {'x-cg-pro-api-key': api_key}
    else:
        base_url = COINGECKO_BASE_URL
        headers = {}

    url = f"{base_url}{endpoint}"
    if params:
        query = '&'.join(f"{k}={v}" for k, v in params.items())
        url = f"{url}?{query}"

    headers['Accept'] = 'application/json'

    req = urllib.request.Request(url, headers=headers)

    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        if e.code == 429:
            print(f"Rate limited, waiting 60s...")
            time.sleep(60)
            return api_request(endpoint, params)
        raise
    finally:
        time.sleep(REQUEST_DELAY)


def fetch_markets_page(page: int = 1, per_page: int = 250) -> List[Dict]:
    """Fetch a page of market data"""
    params = {
        'vs_currency': 'usd',
        'order': 'volume_desc',
        'per_page': per_page,
        'page': page,
        'sparkline': 'false',
        'price_change_percentage': '24h,30d'
    }
    return api_request('/coins/markets', params)


def fetch_coin_details(coin_id: str) -> Dict:
    """Fetch detailed coin data including exchanges"""
    params = {
        'localization': 'false',
        'tickers': 'true',
        'market_data': 'true',
        'community_data': 'false',
        'developer_data': 'false'
    }
    return api_request(f'/coins/{coin_id}', params)


def map_sector(categories: List[str]) -> str:
    """Map CoinGecko categories to investment sectors"""
    for cat in categories:
        cat_lower = cat.lower().replace(' ', '-')
        if cat_lower in SECTOR_MAPPING:
            return SECTOR_MAPPING[cat_lower]
    return 'Other'


def is_kill_sector(categories: List[str]) -> bool:
    """Check if token is in a kill sector"""
    for cat in categories:
        cat_lower = cat.lower().replace(' ', '-')
        if any(kill in cat_lower for kill in KILL_SECTORS):
            return True
    return False


def extract_exchanges(tickers: List[Dict]) -> Tuple[List[str], bool, List[str]]:
    """Extract exchange info and perp availability"""
    exchanges = set()
    perp_exchanges = set()

    for ticker in tickers:
        exchange = ticker.get('market', {}).get('identifier', '').lower()
        if exchange:
            exchanges.add(exchange)

            # Check if it's a perpetual market
            target = ticker.get('target', '').lower()
            if 'perp' in target or 'usdt' in target:
                if exchange in PERP_EXCHANGES:
                    perp_exchanges.add(exchange)

    has_perp = len(perp_exchanges) > 0
    return list(exchanges), has_perp, list(perp_exchanges)


def parse_token_data(market: Dict, details: Dict = None) -> TokenData:
    """Parse API response into TokenData"""
    circulating = market.get('circulating_supply') or 0
    total = market.get('total_supply') or circulating or 1
    circulating_pct = (circulating / total * 100) if total > 0 else 0

    ath = market.get('ath', 0) or 0
    current = market.get('current_price', 0) or 0
    ath_drawdown = ((ath - current) / ath * 100) if ath > 0 else 0

    categories = details.get('categories', []) if details else []
    tickers = details.get('tickers', []) if details else []

    exchanges, has_perp, perp_exch = extract_exchanges(tickers)

    return TokenData(
        coingecko_id=market.get('id', ''),
        symbol=market.get('symbol', '').upper(),
        name=market.get('name', ''),
        current_price=current,
        market_cap=market.get('market_cap') or 0,
        fdv=market.get('fully_diluted_valuation') or 0,
        total_volume=market.get('total_volume') or 0,
        circulating_supply=circulating,
        total_supply=total,
        circulating_percent=circulating_pct,
        ath=ath,
        ath_date=market.get('ath_date', '')[:10] if market.get('ath_date') else None,
        ath_drawdown=ath_drawdown,
        price_change_30d=market.get('price_change_percentage_30d_in_currency') or 0,
        price_change_90d=0,  # Need separate API call
        categories=categories,
        exchanges=exchanges,
        sector=map_sector(categories),
        has_perp=has_perp,
        perp_exchanges=perp_exch
    )


def passes_tier1_filters(token: TokenData) -> Tuple[bool, str]:
    """Apply Tier 1 screening filters"""

    # Volume check
    if token.total_volume < MIN_DAILY_VOLUME_USD:
        return False, f"Volume ${token.total_volume:,} < ${MIN_DAILY_VOLUME_USD:,}"

    # FDV check (skip if 0, means no data)
    if token.fdv > 0 and token.fdv > MAX_FDV_USD:
        return False, f"FDV ${token.fdv:,} > ${MAX_FDV_USD:,}"

    # Circulating supply check
    if token.circulating_percent < MIN_CIRCULATING_PERCENT:
        return False, f"Circulating {token.circulating_percent:.1f}% < {MIN_CIRCULATING_PERCENT}%"

    # Sector check
    if is_kill_sector(token.categories):
        return False, f"Kill sector: {token.categories}"

    return True, "Passed"


def calculate_screening_score(token: TokenData) -> int:
    """Calculate Tier 2 screening score (0-100)"""
    score = 0

    # Token Performance (20 points) - based on ATH drawdown
    if token.ath_drawdown >= 70:
        score += 20
    elif token.ath_drawdown >= 50:
        score += 15
    elif token.ath_drawdown >= 30:
        score += 10
    else:
        score += 5

    # Sector Alignment (15 points)
    priority_sectors = {'RWA', 'DeAI', 'DeFi', 'Stablecoins', 'BTCfi', 'Infrastructure', 'Privacy'}
    if token.sector in priority_sectors:
        score += 15
    elif token.sector != 'Other':
        score += 10
    else:
        score += 5

    # Hedging Feasibility (10 points)
    if token.has_perp and len(token.perp_exchanges) >= 2:
        score += 10
    elif token.has_perp:
        score += 5

    # Volume/Liquidity (15 points)
    if token.total_volume >= 10_000_000:
        score += 15
    elif token.total_volume >= 5_000_000:
        score += 10
    elif token.total_volume >= 1_000_000:
        score += 7
    else:
        score += 3

    # FDV Sweet Spot (15 points) - $10M-$50M is ideal
    if 10_000_000 <= token.fdv <= 50_000_000:
        score += 15
    elif token.fdv <= 100_000_000:
        score += 10
    else:
        score += 5

    # Base score for passing Tier 1 (25 points)
    score += 25

    return min(score, 100)


def generate_insert_sql(token: TokenData, tier1_passed: bool, tier1_reason: str, score: int) -> str:
    """Generate SQL INSERT statement"""

    def escape(s):
        if s is None:
            return 'NULL'
        return "'" + str(s).replace("'", "''") + "'"

    def to_json(lst):
        return "'" + json.dumps(lst) + "'::jsonb"

    sector_val = f"'{token.sector}'::investment_sector" if token.sector else 'NULL'

    sql = f"""
INSERT INTO notalone.notalone_investment_targets (
    project_name, token_symbol, coingecko_id, sector,
    current_price, market_cap_usd, fdv_usd, daily_volume_usd,
    circulating_supply, total_supply, circulating_percent,
    ath_price, ath_date, ath_drawdown_percent,
    price_30d_change_percent,
    cex_listings, has_perp_futures, perp_exchanges,
    tier1_passed, tier1_fail_reason, screening_score,
    pipeline_stage, deal_source, last_price_update
)
SELECT
    {escape(token.name)},
    {escape(token.symbol)},
    {escape(token.coingecko_id)},
    {sector_val},
    {token.current_price},
    {token.market_cap or 'NULL'},
    {token.fdv or 'NULL'},
    {token.total_volume or 'NULL'},
    {int(token.circulating_supply) if token.circulating_supply else 'NULL'},
    {int(token.total_supply) if token.total_supply else 'NULL'},
    {token.circulating_percent:.2f},
    {token.ath or 'NULL'},
    {escape(token.ath_date) if token.ath_date else 'NULL'}::date,
    {token.ath_drawdown:.2f},
    {token.price_change_30d:.2f},
    {to_json(token.exchanges[:20])},
    {str(token.has_perp).lower()},
    {to_json(token.perp_exchanges)},
    {str(tier1_passed).lower()},
    {escape(tier1_reason) if not tier1_passed else 'NULL'},
    {score if tier1_passed else 'NULL'},
    'Discovered'::investment_pipeline_stage,
    'CoinGecko automated scan',
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM notalone.notalone_investment_targets
    WHERE coingecko_id = {escape(token.coingecko_id)}
);
"""
    return sql.strip()


def generate_update_sql(token: TokenData) -> str:
    """Generate SQL UPDATE statement for existing targets"""

    def to_json(lst):
        return "'" + json.dumps(lst) + "'::jsonb"

    sql = f"""
UPDATE notalone.notalone_investment_targets SET
    current_price = {token.current_price},
    market_cap_usd = {token.market_cap or 'NULL'},
    fdv_usd = {token.fdv or 'NULL'},
    daily_volume_usd = {token.total_volume or 'NULL'},
    ath_drawdown_percent = {token.ath_drawdown:.2f},
    price_30d_change_percent = {token.price_change_30d:.2f},
    cex_listings = {to_json(token.exchanges[:20])},
    has_perp_futures = {str(token.has_perp).lower()},
    perp_exchanges = {to_json(token.perp_exchanges)},
    last_price_update = NOW(),
    updated_at = NOW()
WHERE coingecko_id = '{token.coingecko_id}';
"""
    return sql.strip()


def execute_sql(sql: str) -> bool:
    """Execute SQL on XNode3 via SSH"""
    cmd = f'''ssh eladm@74.50.97.243 "PGPASSWORD=notalone2026 psql -h 172.17.0.1 -p 5433 -U postgres -d calendar_monitoring -c \\"{sql}\\""'''
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
        return result.returncode == 0
    except Exception as e:
        print(f"SQL execution error: {e}")
        return False


def discover_candidates(pages: int = 4) -> List[str]:
    """Discover new investment candidates from CoinGecko"""
    print(f"\n=== Discovering candidates (top {pages * 250} by volume) ===\n")

    sql_statements = []
    candidates_found = 0
    candidates_passed = 0

    for page in range(1, pages + 1):
        print(f"Fetching page {page}...")
        markets = fetch_markets_page(page)

        for market in markets:
            token = parse_token_data(market)

            # Apply Tier 1 filters
            passed, reason = passes_tier1_filters(token)

            if passed:
                # Get detailed data for candidates
                try:
                    details = fetch_coin_details(token.coingecko_id)
                    token = parse_token_data(market, details)
                    passed, reason = passes_tier1_filters(token)
                except Exception as e:
                    print(f"  Error fetching {token.symbol}: {e}")
                    continue

            if passed:
                score = calculate_screening_score(token)
                candidates_passed += 1
                print(f"  + {token.symbol}: ${token.fdv/1e6:.1f}M FDV, ${token.total_volume/1e6:.1f}M vol, {token.ath_drawdown:.0f}% down, score={score}")

            # Generate SQL for all tokens (to avoid re-checking)
            score = calculate_screening_score(token) if passed else 0
            sql = generate_insert_sql(token, passed, reason, score)
            sql_statements.append(sql)
            candidates_found += 1

    print(f"\nFound {candidates_passed} candidates passing Tier 1 out of {candidates_found} tokens")
    return sql_statements


def update_existing_targets() -> List[str]:
    """Update market data for existing targets"""
    print("\n=== Updating existing targets ===\n")

    # Get existing coingecko_ids
    cmd = '''ssh eladm@74.50.97.243 "PGPASSWORD=notalone2026 psql -h 172.17.0.1 -p 5433 -U postgres -d calendar_monitoring -t -c \\"SELECT coingecko_id FROM notalone.notalone_investment_targets WHERE coingecko_id IS NOT NULL;\\""'''
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)

    if result.returncode != 0:
        print("Failed to fetch existing targets")
        return []

    coingecko_ids = [line.strip() for line in result.stdout.split('\n') if line.strip()]
    print(f"Found {len(coingecko_ids)} existing targets to update")

    sql_statements = []

    for cg_id in coingecko_ids:
        try:
            # Fetch from markets endpoint (cheaper)
            markets = api_request('/coins/markets', {
                'vs_currency': 'usd',
                'ids': cg_id,
                'sparkline': 'false'
            })

            if markets:
                token = parse_token_data(markets[0])
                sql = generate_update_sql(token)
                sql_statements.append(sql)
                print(f"  Updated {token.symbol}")
        except Exception as e:
            print(f"  Error updating {cg_id}: {e}")

    return sql_statements


def main():
    parser = argparse.ArgumentParser(description='Sync CoinGecko data to investment targets')
    parser.add_argument('--discover', action='store_true', help='Discover new candidates')
    parser.add_argument('--update', action='store_true', help='Update existing targets')
    parser.add_argument('--full', action='store_true', help='Both discover and update')
    parser.add_argument('--pages', type=int, default=4, help='Number of pages to scan (250 tokens each)')
    parser.add_argument('--dry-run', action='store_true', help='Print SQL without executing')
    parser.add_argument('--output', type=str, help='Output SQL to file')
    args = parser.parse_args()

    if not any([args.discover, args.update, args.full]):
        args.full = True  # Default to full sync

    all_sql = []

    if args.discover or args.full:
        all_sql.extend(discover_candidates(args.pages))

    if args.update or args.full:
        all_sql.extend(update_existing_targets())

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

    # Write to temp file and execute
    temp_file = '/tmp/coingecko_sync.sql'
    with open(temp_file, 'w') as f:
        f.write(combined_sql)

    cmd = f'cat {temp_file} | ssh eladm@74.50.97.243 "PGPASSWORD=notalone2026 psql -h 172.17.0.1 -p 5433 -U postgres -d calendar_monitoring"'
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=120)

    print(result.stdout)
    if result.stderr:
        print("Errors:", result.stderr)

    # Verify
    verify_cmd = '''ssh eladm@74.50.97.243 "PGPASSWORD=notalone2026 psql -h 172.17.0.1 -p 5433 -U postgres -d calendar_monitoring -c \\"SELECT pipeline_stage, tier1_passed, COUNT(*) FROM notalone.notalone_investment_targets GROUP BY 1, 2 ORDER BY 1;\\""'''
    result = subprocess.run(verify_cmd, shell=True, capture_output=True, text=True, timeout=30)
    print("\n=== Current Pipeline Status ===")
    print(result.stdout)


if __name__ == '__main__':
    main()
