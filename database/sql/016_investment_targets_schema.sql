-- Investment Targets Schema for Post-TGE Project Tracking
-- Generated: 2026-01-12
-- Purpose: Track post-TGE OTC investment opportunities (80% of fund)

SET search_path TO notalone;

-- =====================
-- ENUM TYPES
-- =====================

-- Pipeline stages
DO $$ BEGIN
    CREATE TYPE investment_pipeline_stage AS ENUM (
        'Discovered',      -- Found via screening
        'Screening',       -- Applying Tier 1/2 filters
        'Evaluating',      -- Passed screening, initial review
        'Due Diligence',   -- Full DD in progress
        'IC Review',       -- Ready for investment committee
        'Negotiating',     -- Terms being discussed
        'Term Sheet',      -- Term sheet sent/received
        'Closing',         -- Final legal/ops
        'Invested',        -- Deal closed
        'Passed',          -- Rejected
        'On Hold'          -- Paused for later
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Deal types
DO $$ BEGIN
    CREATE TYPE deal_type AS ENUM (
        'OTC Primary',     -- Direct from treasury
        'OTC Secondary',   -- From early investors
        'SAFT',            -- Pre-TGE agreement
        'Equity + Token',  -- Combined deal
        'Token Warrant',   -- Future token rights
        'Direct Purchase'  -- Market buy
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Investment decision
DO $$ BEGIN
    CREATE TYPE investment_decision AS ENUM (
        'Invested',
        'Passed - Sector',
        'Passed - Team',
        'Passed - Valuation',
        'Passed - Liquidity',
        'Passed - Terms',
        'Passed - Competition',
        'Passed - Other',
        'On Hold'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Priority sectors
DO $$ BEGIN
    CREATE TYPE investment_sector AS ENUM (
        'RWA',              -- Real World Assets
        'DeAI',             -- Decentralized AI
        'DeFi',             -- Decentralized Finance
        'Stablecoins',      -- Stablecoins & Payments
        'BTCfi',            -- Bitcoin DeFi
        'Infrastructure',   -- L1/L2/Infra
        'Trading Infra',    -- DEX, derivatives, etc.
        'Privacy',          -- Privacy tech
        'Consumer',         -- Non-gaming consumer
        'Other'             -- Everything else
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =====================
-- MAIN TABLE
-- =====================

CREATE TABLE IF NOT EXISTS notalone_investment_targets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Core Identity
    project_name VARCHAR(255) NOT NULL,
    token_symbol VARCHAR(20),
    token_address VARCHAR(100),
    chain VARCHAR(50),
    website VARCHAR(255),
    twitter VARCHAR(100),
    discord VARCHAR(255),
    github VARCHAR(255),
    company_id UUID REFERENCES notalone_companies(id),  -- Link to existing company if Israeli

    -- Sector & Classification
    sector investment_sector DEFAULT 'Other',
    subsector VARCHAR(100),
    one_liner TEXT,  -- What they do in 1 sentence
    deal_type deal_type,

    -- Token Metrics (updated regularly via API)
    tge_date DATE,
    fdv_usd BIGINT,
    market_cap_usd BIGINT,
    circulating_supply BIGINT,
    total_supply BIGINT,
    circulating_percent DECIMAL(5,2),
    daily_volume_usd BIGINT,
    weekly_volume_avg_usd BIGINT,
    ath_price DECIMAL(30,18),
    ath_date DATE,
    current_price DECIMAL(30,18),
    ath_drawdown_percent DECIMAL(5,2),
    price_30d_change_percent DECIMAL(8,2),
    price_90d_change_percent DECIMAL(8,2),
    last_price_update TIMESTAMPTZ,

    -- On-Chain Metrics
    tvl_usd BIGINT,
    tvl_30d_change_percent DECIMAL(8,2),
    monthly_active_users INTEGER,
    daily_active_users INTEGER,
    monthly_transactions INTEGER,
    monthly_revenue_usd BIGINT,
    monthly_fees_usd BIGINT,
    treasury_usd BIGINT,
    treasury_runway_months INTEGER,

    -- Exchange & Liquidity
    cex_listings JSONB DEFAULT '[]',  -- ["Binance", "Coinbase", "OKX"]
    dex_listings JSONB DEFAULT '[]',  -- ["Uniswap", "Curve"]
    has_perp_futures BOOLEAN DEFAULT FALSE,
    perp_exchanges JSONB DEFAULT '[]',  -- ["Binance", "Bybit", "dYdX"]
    liquidity_score INTEGER CHECK (liquidity_score >= 0 AND liquidity_score <= 100),

    -- Token Unlocks
    next_unlock_date DATE,
    next_unlock_amount BIGINT,
    next_unlock_percent DECIMAL(5,2),
    vesting_end_date DATE,
    unlock_schedule JSONB DEFAULT '[]',  -- Full schedule

    -- External IDs (for API sync)
    coingecko_id VARCHAR(100),
    coinmarketcap_id VARCHAR(100),
    defillama_slug VARCHAR(100),
    rootdata_id VARCHAR(100),
    token_unlocks_id VARCHAR(100),

    -- Team Assessment
    team_members JSONB DEFAULT '[]',  -- [{name, role, linkedin, background}]
    team_is_doxxed BOOLEAN DEFAULT TRUE,
    team_previous_exits JSONB DEFAULT '[]',
    team_red_flags TEXT,
    team_score INTEGER CHECK (team_score >= 0 AND team_score <= 10),

    -- Screening Scores
    tier1_passed BOOLEAN DEFAULT FALSE,
    tier1_fail_reason TEXT,
    screening_score INTEGER CHECK (screening_score >= 0 AND screening_score <= 100),
    score_treasury_pressure INTEGER,
    score_token_performance INTEGER,
    score_growth_gap INTEGER,
    score_sector_alignment INTEGER,
    score_team_quality INTEGER,
    score_hedging_feasibility INTEGER,
    score_unlock_schedule INTEGER,
    last_scored_at TIMESTAMPTZ,

    -- Pipeline Tracking
    pipeline_stage investment_pipeline_stage DEFAULT 'Discovered',
    deal_source VARCHAR(255),  -- "CoinGecko scan", "STIX", "Warm intro", etc.
    source_contact VARCHAR(255),
    assigned_analyst VARCHAR(100),
    first_contact_date DATE,
    last_contact_date DATE,
    next_action TEXT,
    next_action_date DATE,

    -- Deal Terms (when in negotiation)
    offered_discount_percent DECIMAL(5,2),
    target_discount_percent DECIMAL(5,2),
    proposed_vesting_months INTEGER,
    proposed_cliff_months INTEGER,
    proposed_tge_unlock_percent DECIMAL(5,2),
    proposed_check_size_usd BIGINT,
    min_check_size_usd BIGINT,
    max_check_size_usd BIGINT,
    lead_investor VARCHAR(255),
    co_investors JSONB DEFAULT '[]',

    -- Investment Thesis
    investment_thesis TEXT,
    bull_case TEXT,
    bear_case TEXT,
    key_risks TEXT,
    value_add_opportunity TEXT,  -- How Notalone can help
    competitive_landscape TEXT,
    comparable_deals JSONB DEFAULT '[]',  -- Similar deals for reference

    -- Decision
    decision investment_decision,
    decision_date DATE,
    decision_reason TEXT,
    ic_notes TEXT,

    -- Post-Investment (if invested)
    invested_amount_usd BIGINT,
    invested_date DATE,
    cost_basis DECIMAL(30,18),
    tokens_acquired BIGINT,
    current_value_usd BIGINT,
    realized_pnl_usd BIGINT,
    unrealized_pnl_usd BIGINT,
    hedge_position JSONB,  -- Current hedge details

    -- Metadata
    tags JSONB DEFAULT '[]',
    attachments JSONB DEFAULT '[]',  -- [{name, url, type}]
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- =====================
-- INDEXES
-- =====================

-- Pipeline & Status
CREATE INDEX IF NOT EXISTS idx_targets_pipeline ON notalone_investment_targets(pipeline_stage);
CREATE INDEX IF NOT EXISTS idx_targets_decision ON notalone_investment_targets(decision);
CREATE INDEX IF NOT EXISTS idx_targets_next_action ON notalone_investment_targets(next_action_date);

-- Screening & Scoring
CREATE INDEX IF NOT EXISTS idx_targets_tier1 ON notalone_investment_targets(tier1_passed);
CREATE INDEX IF NOT EXISTS idx_targets_score ON notalone_investment_targets(screening_score DESC);
CREATE INDEX IF NOT EXISTS idx_targets_sector ON notalone_investment_targets(sector);

-- Market Data (for filtering/sorting)
CREATE INDEX IF NOT EXISTS idx_targets_fdv ON notalone_investment_targets(fdv_usd);
CREATE INDEX IF NOT EXISTS idx_targets_volume ON notalone_investment_targets(daily_volume_usd DESC);
CREATE INDEX IF NOT EXISTS idx_targets_tvl ON notalone_investment_targets(tvl_usd DESC);
CREATE INDEX IF NOT EXISTS idx_targets_drawdown ON notalone_investment_targets(ath_drawdown_percent DESC);

-- External IDs (for API sync)
CREATE INDEX IF NOT EXISTS idx_targets_coingecko ON notalone_investment_targets(coingecko_id);
CREATE INDEX IF NOT EXISTS idx_targets_defillama ON notalone_investment_targets(defillama_slug);

-- Token Symbol (for quick lookup)
CREATE INDEX IF NOT EXISTS idx_targets_symbol ON notalone_investment_targets(token_symbol);

-- Full-text search on project name
CREATE INDEX IF NOT EXISTS idx_targets_name_search ON notalone_investment_targets USING gin(to_tsvector('english', project_name));

-- =====================
-- TRIGGER FOR updated_at
-- =====================

CREATE OR REPLACE FUNCTION update_targets_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS targets_update_timestamp ON notalone_investment_targets;
CREATE TRIGGER targets_update_timestamp
    BEFORE UPDATE ON notalone_investment_targets
    FOR EACH ROW
    EXECUTE FUNCTION update_targets_timestamp();

-- =====================
-- VIEWS FOR DASHBOARDS
-- =====================

-- Active Pipeline View
CREATE OR REPLACE VIEW v_investment_pipeline AS
SELECT
    id,
    project_name,
    token_symbol,
    sector,
    pipeline_stage,
    screening_score,
    fdv_usd / 1000000 as fdv_millions,
    daily_volume_usd / 1000000 as volume_millions,
    ath_drawdown_percent,
    offered_discount_percent,
    proposed_check_size_usd / 1000000 as check_size_millions,
    assigned_analyst,
    next_action,
    next_action_date,
    days_in_pipeline
FROM notalone_investment_targets,
     LATERAL (SELECT EXTRACT(DAY FROM NOW() - created_at)::INTEGER as days_in_pipeline) d
WHERE pipeline_stage NOT IN ('Passed', 'Invested')
ORDER BY
    CASE pipeline_stage
        WHEN 'Closing' THEN 1
        WHEN 'Term Sheet' THEN 2
        WHEN 'Negotiating' THEN 3
        WHEN 'IC Review' THEN 4
        WHEN 'Due Diligence' THEN 5
        WHEN 'Evaluating' THEN 6
        WHEN 'Screening' THEN 7
        ELSE 8
    END,
    screening_score DESC NULLS LAST;

-- Screening Candidates View (high score, not yet in DD)
CREATE OR REPLACE VIEW v_screening_candidates AS
SELECT
    id,
    project_name,
    token_symbol,
    sector,
    one_liner,
    screening_score,
    tier1_passed,
    fdv_usd / 1000000 as fdv_millions,
    daily_volume_usd / 1000000 as volume_millions,
    tvl_usd / 1000000 as tvl_millions,
    ath_drawdown_percent,
    has_perp_futures,
    treasury_runway_months,
    next_unlock_date,
    deal_source,
    created_at
FROM notalone_investment_targets
WHERE pipeline_stage IN ('Discovered', 'Screening', 'Evaluating')
  AND tier1_passed = TRUE
  AND screening_score >= 60
ORDER BY screening_score DESC;

-- Portfolio View (invested deals)
CREATE OR REPLACE VIEW v_investment_portfolio AS
SELECT
    id,
    project_name,
    token_symbol,
    sector,
    invested_date,
    invested_amount_usd / 1000000 as invested_millions,
    cost_basis,
    current_price,
    tokens_acquired,
    current_value_usd / 1000000 as current_value_millions,
    unrealized_pnl_usd / 1000000 as unrealized_pnl_millions,
    CASE WHEN invested_amount_usd > 0
         THEN ((current_value_usd - invested_amount_usd)::DECIMAL / invested_amount_usd * 100)
         ELSE 0
    END as roi_percent,
    proposed_vesting_months,
    proposed_cliff_months,
    vesting_end_date,
    hedge_position
FROM notalone_investment_targets
WHERE decision = 'Invested'
ORDER BY invested_date DESC;

-- =====================
-- SAMPLE DATA CATEGORIES
-- =====================

-- Insert sector reference (for Superset filters)
INSERT INTO notalone_investment_targets (project_name, token_symbol, sector, pipeline_stage, one_liner)
VALUES
    ('_SECTOR_RWA', NULL, 'RWA', 'Passed', 'Sector placeholder for filtering'),
    ('_SECTOR_DeAI', NULL, 'DeAI', 'Passed', 'Sector placeholder for filtering'),
    ('_SECTOR_DeFi', NULL, 'DeFi', 'Passed', 'Sector placeholder for filtering'),
    ('_SECTOR_BTCfi', NULL, 'BTCfi', 'Passed', 'Sector placeholder for filtering'),
    ('_SECTOR_Infrastructure', NULL, 'Infrastructure', 'Passed', 'Sector placeholder for filtering')
ON CONFLICT DO NOTHING;

-- Clean up placeholder rows (they're just for enum reference)
DELETE FROM notalone_investment_targets WHERE project_name LIKE '_SECTOR_%';

-- =====================
-- VERIFICATION
-- =====================

SELECT
    'notalone_investment_targets' as table_name,
    COUNT(*) as row_count
FROM notalone_investment_targets;

SELECT
    schemaname,
    tablename,
    indexname
FROM pg_indexes
WHERE tablename = 'notalone_investment_targets'
ORDER BY indexname;
