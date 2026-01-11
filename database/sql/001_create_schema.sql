-- ============================================================================
-- Israeli Tech Ecosystem PostgreSQL Schema for XNode3
-- Migration from Airtable to PostgreSQL
-- ============================================================================
-- Database: calendar_monitoring
-- Schema: notalone
-- Table Prefix: notalone_
-- Version: 1.0
-- Created: 2026-01-11
-- ============================================================================

-- Create schema
CREATE SCHEMA IF NOT EXISTS notalone;

-- Set search path for this session
SET search_path TO notalone, public;

-- ============================================================================
-- CUSTOM TYPES (ENUMS)
-- ============================================================================

-- Institution types
CREATE TYPE notalone.institution_type AS ENUM (
    'University',
    'Research Institute',
    'Military Unit',
    'Accelerator',
    'Government Program'
);

CREATE TYPE notalone.institution_subtype AS ENUM (
    'Technical',
    'Business School',
    'Intelligence',
    'Special Forces',
    'Incubator',
    'Cyber Foundry'
);

CREATE TYPE notalone.prestige_tier AS ENUM (
    'Tier 1',
    'Tier 2',
    'Tier 3'
);

-- Company types
CREATE TYPE notalone.company_type AS ENUM (
    'Startup',
    'Corporation',
    'Acquirer',
    'VC Fund',
    'Accelerator',
    'Government',
    'University'
);

CREATE TYPE notalone.company_stage AS ENUM (
    'Pre-Seed',
    'Seed',
    'Series A',
    'Series B',
    'Series C',
    'Series D',
    'Series E',
    'Growth',
    'Public',
    'Acquired',
    'Shut Down'
);

CREATE TYPE notalone.company_status AS ENUM (
    'Active',
    'Acquired',
    'Shut Down',
    'IPO'
);

CREATE TYPE notalone.exit_type AS ENUM (
    'IPO',
    'Acquisition',
    'Shut Down',
    'Active',
    'Acqui-hire'
);

-- People types
CREATE TYPE notalone.person_type AS ENUM (
    'Founder',
    'Investor',
    'Executive',
    'Engineer',
    'Advisor',
    'Operator',
    'Academic'
);

CREATE TYPE notalone.current_role_type AS ENUM (
    'Managing Partner',
    'Executive Chairman',
    'Founder & CEO',
    'Founder & CTO',
    'CEO',
    'CTO',
    'VP R&D',
    'VP Product',
    'Chairman',
    'Advisor',
    'Co-founder',
    'Co-founder & CEO',
    'Professor',
    'Founder',
    'Founding Partner',
    'Investor',
    'Partner',
    'General Partner',
    'Independent'
);

CREATE TYPE notalone.lp_potential AS ENUM (
    'Hot',
    'Warm',
    'Cold',
    'Not Relevant',
    'Already LP'
);

CREATE TYPE notalone.lp_segment AS ENUM (
    'Frustrated Allocator',
    'Exit Millionaire',
    'Crypto Curious Traditional',
    'Crypto OG',
    'Connector'
);

CREATE TYPE notalone.net_worth_range AS ENUM (
    '$100M+',
    '$50-100M',
    '$20-50M',
    '$5-20M',
    '$1-5M',
    '<$1M',
    'Unknown'
);

-- Employment types
CREATE TYPE notalone.role_type AS ENUM (
    'Founder',
    'Co-founder',
    'C-Suite',
    'VP',
    'Director',
    'Manager',
    'Senior IC',
    'IC',
    'Intern',
    'Advisor',
    'Board Member'
);

CREATE TYPE notalone.exit_reason AS ENUM (
    'Still There',
    'Founded Company',
    'Joined Another',
    'Acquired Out',
    'Laid Off',
    'Retired',
    'Unknown'
);

-- Education types
CREATE TYPE notalone.degree_type AS ENUM (
    'Bachelor',
    'BSc',
    'Master',
    'MSc',
    'PhD',
    'MBA',
    'Certificate',
    'Dropout',
    'Postdoc',
    'Professor'
);

-- Military types
CREATE TYPE notalone.military_rank AS ENUM (
    'Private',
    'Corporal',
    'Sergeant',
    'Lieutenant',
    'Captain',
    'Major',
    'Lt. Colonel',
    'Colonel',
    'Brigadier General',
    'General'
);

CREATE TYPE notalone.military_role AS ENUM (
    'Developer',
    'Officer',
    'Commander',
    'Team Leader'
);

CREATE TYPE notalone.service_type AS ENUM (
    'Mandatory',
    'Career Officer',
    'Reserves'
);

-- Investment types
CREATE TYPE notalone.investment_type AS ENUM (
    'Angel',
    'Seed',
    'Series A',
    'Series B+',
    'Growth',
    'LP Commitment',
    'Secondary',
    'SPV',
    'VC'
);

CREATE TYPE notalone.round_type AS ENUM (
    'Pre-Seed',
    'Seed',
    'Series A',
    'Series B',
    'Series C',
    'Series D',
    'Series E',
    'Growth',
    'Bridge',
    'IPO',
    'SPAC'
);

-- Board position types
CREATE TYPE notalone.board_position_type AS ENUM (
    'Board Member',
    'Board Observer',
    'Chairman',
    'Independent Director',
    'Advisory Board'
);

-- Connection types
CREATE TYPE notalone.connection_type AS ENUM (
    'Co-Founders',
    'Co-Founder',
    'Former Colleagues',
    'Colleague',
    'Investor-Founder',
    'Investor',
    'Mentor-Mentee',
    'Co-investors',
    'Board Colleagues',
    'Military',
    'Military Cohort',
    'University Classmates',
    'Academic',
    'Family',
    'Friends',
    'Professional'
);

CREATE TYPE notalone.connection_strength AS ENUM (
    'Strong',
    'Medium',
    'Weak',
    'Unknown'
);

-- Acquisition types
CREATE TYPE notalone.deal_type AS ENUM (
    'Full Acquisition',
    'Acquisition',
    'Acqui-hire',
    'Merger',
    'Asset Purchase'
);

CREATE TYPE notalone.acquirer_type AS ENUM (
    'Big Tech',
    'Fintech',
    'Crypto',
    'Hardware',
    'Private Equity',
    'Cyber'
);

-- LP Prospect types
CREATE TYPE notalone.prospect_status AS ENUM (
    'Identified',
    'Researching',
    'Outreach Planned',
    'Contacted',
    'Meeting Scheduled',
    'Met',
    'Follow-up',
    'Soft Commit',
    'Hard Commit',
    'Wired',
    'Passed',
    'Not Now',
    'Target',
    'Active Lead'
);

CREATE TYPE notalone.warmth_score AS ENUM (
    'Hot',
    'Warm',
    'Cold'
);

-- Location type
CREATE TYPE notalone.location AS ENUM (
    'Tel Aviv',
    'Herzliya',
    'Haifa',
    'Jerusalem',
    'Rehovot',
    'Beer Sheva',
    'Ramat Gan',
    'NYC',
    'SF Bay Area',
    'London',
    'Multiple',
    'Other Israel',
    'Other US',
    'Other'
);

-- ============================================================================
-- CORE ENTITY TABLES
-- ============================================================================

-- Table 1: Institutions
-- Universities, military units, accelerators, research institutes
CREATE TABLE notalone.notalone_institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id VARCHAR(20) UNIQUE,  -- For migration tracking

    -- Core fields
    institution_name VARCHAR(255) NOT NULL,
    full_name VARCHAR(500),
    type notalone.institution_type,
    subtype notalone.institution_subtype,
    location notalone.location,
    founded_year INTEGER CHECK (founded_year >= 1800 AND founded_year <= 2100),
    prestige_tier notalone.prestige_tier,

    -- Rich text
    notable_programs TEXT,
    description TEXT,
    notes TEXT,

    -- URLs
    website VARCHAR(500),

    -- Metadata
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 2: Companies
-- Startups, corporations, VC funds, accelerators
CREATE TABLE notalone.notalone_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id VARCHAR(20) UNIQUE,

    -- Core fields
    company_name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(500),
    founded_year INTEGER CHECK (founded_year >= 1900 AND founded_year <= 2100),
    shutdown_year INTEGER CHECK (shutdown_year >= 1900 AND shutdown_year <= 2100),
    company_type notalone.company_type,
    stage notalone.company_stage,
    status notalone.company_status,

    -- Industry
    sector VARCHAR(100),  -- Primary sector
    sectors JSONB DEFAULT '[]'::jsonb,  -- All sectors as array
    technologies JSONB DEFAULT '[]'::jsonb,  -- Technologies as array

    -- Location
    hq_location notalone.location,

    -- Description
    description TEXT,

    -- Financials (stored in USD cents for precision)
    total_raised_usd BIGINT,  -- In cents
    last_valuation_usd BIGINT,
    exit_value_usd BIGINT,
    exit_type notalone.exit_type,
    exit_date DATE,

    -- Employee counts
    employee_count_peak INTEGER,
    employee_count_current INTEGER,

    -- URLs
    website VARCHAR(500),
    linkedin_url VARCHAR(500),
    x_account VARCHAR(500),
    crunchbase_url VARCHAR(500),

    -- Metadata
    tags JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 3: People
-- Founders, executives, investors, advisors
CREATE TABLE notalone.notalone_people (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id VARCHAR(20) UNIQUE,

    -- Core identity
    name VARCHAR(255) NOT NULL,
    hebrew_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),

    -- Current position
    person_current_role notalone.current_role_type,
    current_company_id UUID REFERENCES notalone.notalone_companies(id),

    -- Types
    primary_type notalone.person_type,
    secondary_types JSONB DEFAULT '[]'::jsonb,

    -- Alumni flags (critical for Israeli ecosystem)
    is_8200_alumni BOOLEAN DEFAULT FALSE,
    is_talpiot_alumni BOOLEAN DEFAULT FALSE,
    is_technion_alumni BOOLEAN DEFAULT FALSE,

    -- LP attributes
    lp_potential notalone.lp_potential,
    lp_segment notalone.lp_segment,
    estimated_net_worth notalone.net_worth_range,

    -- Location
    location notalone.location,

    -- Demographics
    birth_year INTEGER CHECK (birth_year >= 1940 AND birth_year <= 2010),

    -- URLs
    linkedin_url VARCHAR(500),
    twitter_handle VARCHAR(100),
    photo_url VARCHAR(500),

    -- Metadata
    tags JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- JUNCTION / RELATIONSHIP TABLES
-- ============================================================================

-- Table 4: Employment History
-- CRITICAL: Tracks who worked where, when (talent flow analysis)
CREATE TABLE notalone.notalone_employment_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id VARCHAR(20) UNIQUE,

    -- Core relationships
    person_id UUID NOT NULL REFERENCES notalone.notalone_people(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES notalone.notalone_companies(id) ON DELETE CASCADE,

    -- Role details
    role_title VARCHAR(255),
    role_type notalone.role_type,
    department VARCHAR(100),
    seniority VARCHAR(50),

    -- Timeline
    start_date DATE,
    end_date DATE,  -- NULL = current

    -- Computed/derived
    is_founder BOOLEAN DEFAULT FALSE,
    is_current BOOLEAN DEFAULT FALSE,  -- Managed by application
    tenure_months INTEGER,  -- Calculated on insert/update

    -- Transition tracking
    exit_reason notalone.exit_reason,
    next_company_id UUID REFERENCES notalone.notalone_companies(id),
    equity_outcome VARCHAR(50),

    -- Achievement
    notable_achievement TEXT,

    -- Data quality
    source VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Constraint: no duplicate person-company-role combinations
    UNIQUE(person_id, company_id, role_title, start_date)
);

-- Table 5: Education Records
-- Academic history linking People to Institutions
CREATE TABLE notalone.notalone_education_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id VARCHAR(20) UNIQUE,

    -- Relationships
    person_id UUID REFERENCES notalone.notalone_people(id) ON DELETE CASCADE,
    person_name VARCHAR(255),  -- For Airtable migration (text field)
    institution_id UUID REFERENCES notalone.notalone_institutions(id) ON DELETE SET NULL,

    -- Degree details
    degree_type notalone.degree_type,
    field_of_study VARCHAR(255),
    specialization VARCHAR(255),

    -- Timeline
    start_year INTEGER CHECK (start_year >= 1950 AND start_year <= 2100),
    end_year INTEGER CHECK (end_year >= 1950 AND end_year <= 2100),
    completed BOOLEAN DEFAULT TRUE,

    -- Achievements
    honors VARCHAR(255),
    thesis_topic TEXT,
    notable_achievement TEXT,

    -- Advisor relationship
    advisor_id UUID REFERENCES notalone.notalone_people(id),

    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 6: Military Service
-- IDF service records (especially Unit 8200 alumni)
CREATE TABLE notalone.notalone_military_service (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id VARCHAR(20) UNIQUE,

    -- Relationships
    person_id UUID REFERENCES notalone.notalone_people(id) ON DELETE CASCADE,
    person_name VARCHAR(255),  -- For migration
    unit_id UUID REFERENCES notalone.notalone_institutions(id) ON DELETE SET NULL,
    unit_name VARCHAR(255),  -- Denormalized for convenience

    -- Service details
    role notalone.military_role,
    role_description VARCHAR(255),
    specialization VARCHAR(255),
    highest_rank notalone.military_rank,

    -- Timeline
    start_year INTEGER CHECK (start_year >= 1948 AND start_year <= 2100),
    end_year INTEGER CHECK (end_year >= 1948 AND end_year <= 2100),
    service_type notalone.service_type,
    unit_cohort_year INTEGER,

    -- Achievement
    notable_achievement TEXT,
    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 7: Investment Relationships
-- Angel and VC investments
CREATE TABLE notalone.notalone_investment_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id VARCHAR(20) UNIQUE,

    -- Investor (person or entity)
    investor_person_id UUID REFERENCES notalone.notalone_people(id) ON DELETE CASCADE,
    investor_entity_id UUID REFERENCES notalone.notalone_companies(id) ON DELETE SET NULL,

    -- Target
    target_company_id UUID REFERENCES notalone.notalone_companies(id) ON DELETE CASCADE,
    target_fund_id UUID REFERENCES notalone.notalone_companies(id),  -- For LP investments

    -- Investment details
    investment_type notalone.investment_type,
    round notalone.round_type,
    investment_date DATE,
    amount_usd BIGINT,  -- In cents
    ownership_percent DECIMAL(5,2),

    -- Role
    is_lead_investor BOOLEAN DEFAULT FALSE,
    has_board_seat BOOLEAN DEFAULT FALSE,

    -- Exit
    exit_date DATE,
    exit_value_usd BIGINT,  -- In cents

    -- Metadata
    source_of_deal VARCHAR(255),
    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 8: Board Positions
-- Board memberships
CREATE TABLE notalone.notalone_board_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id VARCHAR(20) UNIQUE,

    -- Relationships
    person_id UUID REFERENCES notalone.notalone_people(id) ON DELETE CASCADE,
    person_name VARCHAR(255),  -- For migration
    company_id UUID REFERENCES notalone.notalone_companies(id) ON DELETE CASCADE,

    -- Position details
    position VARCHAR(255),
    position_type notalone.board_position_type,
    appointed_by VARCHAR(255),
    committees JSONB DEFAULT '[]'::jsonb,

    -- Timeline
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,  -- Managed by application

    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 9: Funding Rounds
-- Company fundraising history
CREATE TABLE notalone.notalone_funding_rounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id VARCHAR(20) UNIQUE,

    -- Core
    name VARCHAR(255),  -- e.g., "Wiz Series A"
    company_id UUID NOT NULL REFERENCES notalone.notalone_companies(id) ON DELETE CASCADE,

    -- Round details
    round_name notalone.round_type,
    round_type notalone.round_type,
    round_date DATE,

    -- Financials (in USD cents)
    amount_raised_usd BIGINT,
    pre_money_valuation_usd BIGINT,
    post_money_valuation_usd BIGINT,

    -- Investors
    lead_investor VARCHAR(255),  -- Text for now
    lead_investor_id UUID REFERENCES notalone.notalone_companies(id),
    other_investors JSONB DEFAULT '[]'::jsonb,  -- Array of names

    -- Links
    press_release_url VARCHAR(500),
    source VARCHAR(255),
    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 10: Acquisitions
-- M&A activity ($68B+ exit value tracked)
CREATE TABLE notalone.notalone_acquisitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id VARCHAR(20) UNIQUE,

    -- Parties
    acquirer_name VARCHAR(255),  -- Text for external acquirers
    acquirer_id UUID REFERENCES notalone.notalone_companies(id),
    target_id UUID NOT NULL REFERENCES notalone.notalone_companies(id) ON DELETE CASCADE,

    -- Deal details
    acquisition_date DATE,
    deal_value_usd BIGINT,  -- In cents
    deal_type notalone.deal_type,
    acquirer_type notalone.acquirer_type,
    payment_types JSONB DEFAULT '[]'::jsonb,  -- ['Cash', 'Stock', etc.]

    -- Strategic context
    strategic_rationale TEXT,
    target_status_post VARCHAR(100),
    integration_success VARCHAR(50),

    -- People
    key_people_acquired JSONB DEFAULT '[]'::jsonb,  -- Array of names
    key_people_departed JSONB DEFAULT '[]'::jsonb,

    -- Links
    press_release_url VARCHAR(500),
    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 11: Co-Founder Relationships
-- Explicit co-founder pairs for network analysis
CREATE TABLE notalone.notalone_cofounder_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id VARCHAR(20) UNIQUE,

    -- People (using names for flexibility)
    person_1_name VARCHAR(255) NOT NULL,
    person_1_id UUID REFERENCES notalone.notalone_people(id),
    person_2_name VARCHAR(255),
    person_2_id UUID REFERENCES notalone.notalone_people(id),

    -- Company context
    company_name VARCHAR(255),
    company_id UUID REFERENCES notalone.notalone_companies(id),

    -- Relationship details
    relationship_type VARCHAR(100) DEFAULT 'Co-Founders',
    relationship_origin VARCHAR(255),
    start_date DATE,
    still_working_together BOOLEAN,
    relationship_status VARCHAR(50),

    -- Subsequent work
    subsequent_collaborations JSONB DEFAULT '[]'::jsonb,

    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Prevent duplicate pairs (order-independent)
    CONSTRAINT unique_cofounder_pair CHECK (
        person_1_name < person_2_name OR person_2_name IS NULL
    )
);

-- Table 12: Person Connections
-- Network edges - how people know each other
CREATE TABLE notalone.notalone_person_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id VARCHAR(20) UNIQUE,

    -- People
    person_1_name VARCHAR(255) NOT NULL,
    person_1_id UUID REFERENCES notalone.notalone_people(id),
    person_2_name VARCHAR(255),
    person_2_id UUID REFERENCES notalone.notalone_people(id),

    -- Connection details
    connection_type notalone.connection_type,
    connection_strength notalone.connection_strength,

    -- Origin context
    origin_company_id UUID REFERENCES notalone.notalone_companies(id),
    origin_institution_id UUID REFERENCES notalone.notalone_institutions(id),
    first_connected_year INTEGER,
    last_interaction_date DATE,

    -- Actionable
    can_request_intro BOOLEAN DEFAULT FALSE,

    -- Source
    source VARCHAR(255),
    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 13: LP Prospects
-- LP fundraising pipeline with status tracking
CREATE TABLE notalone.notalone_lp_prospects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airtable_id VARCHAR(20) UNIQUE,

    -- Core
    person_name VARCHAR(255) NOT NULL,
    person_id UUID REFERENCES notalone.notalone_people(id),

    -- Status tracking
    segment notalone.lp_segment,
    priority_tier VARCHAR(50),
    status notalone.prospect_status,
    warmth_score notalone.warmth_score,

    -- Capacity (in USD cents)
    estimated_capacity_usd BIGINT,
    target_commitment_usd BIGINT,
    actual_commitment_usd BIGINT,
    check_size_min_usd BIGINT,
    check_size_max_usd BIGINT,

    -- Source of wealth
    source_of_wealth JSONB DEFAULT '[]'::jsonb,
    recent_liquidity_event VARCHAR(500),

    -- Intro path
    warm_intro_path TEXT,
    intro_person_id UUID REFERENCES notalone.notalone_people(id),

    -- Alignment
    investment_thesis_match TEXT,
    interests_alignment JSONB DEFAULT '[]'::jsonb,
    concerns JSONB DEFAULT '[]'::jsonb,

    -- Activity tracking
    outreach_date DATE,
    last_contact DATE,
    next_action TEXT,
    next_action_date DATE,
    assigned_to VARCHAR(100),

    -- Notes
    meeting_notes TEXT,
    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SUPPORTING TABLES
-- ============================================================================

-- Interactions Log (for LP outreach tracking)
CREATE TABLE notalone.notalone_interactions_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relationships
    person_id UUID REFERENCES notalone.notalone_people(id),
    lp_prospect_id UUID REFERENCES notalone.notalone_lp_prospects(id),

    -- Interaction details
    interaction_type VARCHAR(50) NOT NULL,
    interaction_date DATE NOT NULL,
    subject VARCHAR(500),
    summary TEXT,
    outcome VARCHAR(50),

    -- Follow-up
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,

    -- Metadata
    logged_by VARCHAR(100),
    attachments JSONB DEFAULT '[]'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Institutions indexes
CREATE INDEX idx_institutions_type ON notalone.notalone_institutions(type);
CREATE INDEX idx_institutions_location ON notalone.notalone_institutions(location);
CREATE INDEX idx_institutions_name_search ON notalone.notalone_institutions USING gin(to_tsvector('english', institution_name));

-- Companies indexes
CREATE INDEX idx_companies_status ON notalone.notalone_companies(status);
CREATE INDEX idx_companies_stage ON notalone.notalone_companies(stage);
CREATE INDEX idx_companies_sector ON notalone.notalone_companies(sector);
CREATE INDEX idx_companies_founded_year ON notalone.notalone_companies(founded_year);
CREATE INDEX idx_companies_exit_date ON notalone.notalone_companies(exit_date);
CREATE INDEX idx_companies_type ON notalone.notalone_companies(company_type);
CREATE INDEX idx_companies_technologies ON notalone.notalone_companies USING gin(technologies);
CREATE INDEX idx_companies_sectors ON notalone.notalone_companies USING gin(sectors);
CREATE INDEX idx_companies_tags ON notalone.notalone_companies USING gin(tags);
CREATE INDEX idx_companies_name_search ON notalone.notalone_companies USING gin(to_tsvector('english', company_name));

-- People indexes
CREATE INDEX idx_people_primary_type ON notalone.notalone_people(primary_type);
CREATE INDEX idx_people_lp_potential ON notalone.notalone_people(lp_potential);
CREATE INDEX idx_people_lp_segment ON notalone.notalone_people(lp_segment);
CREATE INDEX idx_people_8200_alumni ON notalone.notalone_people(is_8200_alumni) WHERE is_8200_alumni = TRUE;
CREATE INDEX idx_people_talpiot_alumni ON notalone.notalone_people(is_talpiot_alumni) WHERE is_talpiot_alumni = TRUE;
CREATE INDEX idx_people_technion_alumni ON notalone.notalone_people(is_technion_alumni) WHERE is_technion_alumni = TRUE;
CREATE INDEX idx_people_current_company ON notalone.notalone_people(current_company_id);
CREATE INDEX idx_people_location ON notalone.notalone_people(location);
CREATE INDEX idx_people_net_worth ON notalone.notalone_people(estimated_net_worth);
CREATE INDEX idx_people_name_search ON notalone.notalone_people USING gin(to_tsvector('english', name));
CREATE INDEX idx_people_tags ON notalone.notalone_people USING gin(tags);

-- Employment History indexes (CRITICAL for talent flow analysis)
CREATE INDEX idx_employment_person ON notalone.notalone_employment_history(person_id);
CREATE INDEX idx_employment_company ON notalone.notalone_employment_history(company_id);
CREATE INDEX idx_employment_is_current ON notalone.notalone_employment_history(is_current) WHERE is_current = TRUE;
CREATE INDEX idx_employment_is_founder ON notalone.notalone_employment_history(is_founder) WHERE is_founder = TRUE;
CREATE INDEX idx_employment_start_date ON notalone.notalone_employment_history(start_date);
CREATE INDEX idx_employment_end_date ON notalone.notalone_employment_history(end_date);
CREATE INDEX idx_employment_timeline ON notalone.notalone_employment_history(person_id, start_date, end_date);
CREATE INDEX idx_employment_company_timeline ON notalone.notalone_employment_history(company_id, start_date, end_date);
CREATE INDEX idx_employment_role_type ON notalone.notalone_employment_history(role_type);
CREATE INDEX idx_employment_next_company ON notalone.notalone_employment_history(next_company_id);

-- Education indexes
CREATE INDEX idx_education_person ON notalone.notalone_education_records(person_id);
CREATE INDEX idx_education_institution ON notalone.notalone_education_records(institution_id);
CREATE INDEX idx_education_degree ON notalone.notalone_education_records(degree_type);
CREATE INDEX idx_education_field ON notalone.notalone_education_records(field_of_study);

-- Military Service indexes
CREATE INDEX idx_military_person ON notalone.notalone_military_service(person_id);
CREATE INDEX idx_military_unit ON notalone.notalone_military_service(unit_id);
CREATE INDEX idx_military_years ON notalone.notalone_military_service(start_year, end_year);

-- Investment indexes
CREATE INDEX idx_investment_investor_person ON notalone.notalone_investment_relationships(investor_person_id);
CREATE INDEX idx_investment_target ON notalone.notalone_investment_relationships(target_company_id);
CREATE INDEX idx_investment_type ON notalone.notalone_investment_relationships(investment_type);
CREATE INDEX idx_investment_date ON notalone.notalone_investment_relationships(investment_date);
CREATE INDEX idx_investment_lead ON notalone.notalone_investment_relationships(is_lead_investor) WHERE is_lead_investor = TRUE;

-- Board positions indexes
CREATE INDEX idx_board_person ON notalone.notalone_board_positions(person_id);
CREATE INDEX idx_board_company ON notalone.notalone_board_positions(company_id);
CREATE INDEX idx_board_current ON notalone.notalone_board_positions(is_current) WHERE is_current = TRUE;

-- Funding rounds indexes
CREATE INDEX idx_funding_company ON notalone.notalone_funding_rounds(company_id);
CREATE INDEX idx_funding_round_date ON notalone.notalone_funding_rounds(round_date);
CREATE INDEX idx_funding_round_type ON notalone.notalone_funding_rounds(round_type);
CREATE INDEX idx_funding_amount ON notalone.notalone_funding_rounds(amount_raised_usd);

-- Acquisitions indexes
CREATE INDEX idx_acquisitions_target ON notalone.notalone_acquisitions(target_id);
CREATE INDEX idx_acquisitions_acquirer ON notalone.notalone_acquisitions(acquirer_id);
CREATE INDEX idx_acquisitions_date ON notalone.notalone_acquisitions(acquisition_date);
CREATE INDEX idx_acquisitions_value ON notalone.notalone_acquisitions(deal_value_usd);

-- Co-founder relationships indexes
CREATE INDEX idx_cofounder_person1 ON notalone.notalone_cofounder_relationships(person_1_id);
CREATE INDEX idx_cofounder_person2 ON notalone.notalone_cofounder_relationships(person_2_id);
CREATE INDEX idx_cofounder_company ON notalone.notalone_cofounder_relationships(company_id);

-- Person connections indexes (for network traversal)
CREATE INDEX idx_connections_person1 ON notalone.notalone_person_connections(person_1_id);
CREATE INDEX idx_connections_person2 ON notalone.notalone_person_connections(person_2_id);
CREATE INDEX idx_connections_type ON notalone.notalone_person_connections(connection_type);
CREATE INDEX idx_connections_strength ON notalone.notalone_person_connections(connection_strength);
CREATE INDEX idx_connections_intro ON notalone.notalone_person_connections(can_request_intro) WHERE can_request_intro = TRUE;

-- LP Prospects indexes
CREATE INDEX idx_lp_prospect_person ON notalone.notalone_lp_prospects(person_id);
CREATE INDEX idx_lp_prospect_status ON notalone.notalone_lp_prospects(status);
CREATE INDEX idx_lp_prospect_segment ON notalone.notalone_lp_prospects(segment);
CREATE INDEX idx_lp_prospect_warmth ON notalone.notalone_lp_prospects(warmth_score);
CREATE INDEX idx_lp_prospect_next_action ON notalone.notalone_lp_prospects(next_action_date);
CREATE INDEX idx_lp_prospect_intro ON notalone.notalone_lp_prospects(intro_person_id);

-- Interactions log indexes
CREATE INDEX idx_interactions_person ON notalone.notalone_interactions_log(person_id);
CREATE INDEX idx_interactions_prospect ON notalone.notalone_interactions_log(lp_prospect_id);
CREATE INDEX idx_interactions_date ON notalone.notalone_interactions_log(interaction_date);
CREATE INDEX idx_interactions_followup ON notalone.notalone_interactions_log(follow_up_date) WHERE follow_up_required = TRUE;

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION notalone.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_institutions_updated_at
    BEFORE UPDATE ON notalone.notalone_institutions
    FOR EACH ROW EXECUTE FUNCTION notalone.update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON notalone.notalone_companies
    FOR EACH ROW EXECUTE FUNCTION notalone.update_updated_at_column();

CREATE TRIGGER update_people_updated_at
    BEFORE UPDATE ON notalone.notalone_people
    FOR EACH ROW EXECUTE FUNCTION notalone.update_updated_at_column();

CREATE TRIGGER update_employment_updated_at
    BEFORE UPDATE ON notalone.notalone_employment_history
    FOR EACH ROW EXECUTE FUNCTION notalone.update_updated_at_column();

CREATE TRIGGER update_education_updated_at
    BEFORE UPDATE ON notalone.notalone_education_records
    FOR EACH ROW EXECUTE FUNCTION notalone.update_updated_at_column();

CREATE TRIGGER update_military_updated_at
    BEFORE UPDATE ON notalone.notalone_military_service
    FOR EACH ROW EXECUTE FUNCTION notalone.update_updated_at_column();

CREATE TRIGGER update_investment_updated_at
    BEFORE UPDATE ON notalone.notalone_investment_relationships
    FOR EACH ROW EXECUTE FUNCTION notalone.update_updated_at_column();

CREATE TRIGGER update_board_updated_at
    BEFORE UPDATE ON notalone.notalone_board_positions
    FOR EACH ROW EXECUTE FUNCTION notalone.update_updated_at_column();

CREATE TRIGGER update_funding_updated_at
    BEFORE UPDATE ON notalone.notalone_funding_rounds
    FOR EACH ROW EXECUTE FUNCTION notalone.update_updated_at_column();

CREATE TRIGGER update_acquisitions_updated_at
    BEFORE UPDATE ON notalone.notalone_acquisitions
    FOR EACH ROW EXECUTE FUNCTION notalone.update_updated_at_column();

CREATE TRIGGER update_cofounder_updated_at
    BEFORE UPDATE ON notalone.notalone_cofounder_relationships
    FOR EACH ROW EXECUTE FUNCTION notalone.update_updated_at_column();

CREATE TRIGGER update_connections_updated_at
    BEFORE UPDATE ON notalone.notalone_person_connections
    FOR EACH ROW EXECUTE FUNCTION notalone.update_updated_at_column();

CREATE TRIGGER update_lp_prospects_updated_at
    BEFORE UPDATE ON notalone.notalone_lp_prospects
    FOR EACH ROW EXECUTE FUNCTION notalone.update_updated_at_column();

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON SCHEMA notalone IS 'Israeli Tech Ecosystem database - migrated from Airtable';

COMMENT ON TABLE notalone.notalone_institutions IS 'Universities, military units (8200, Talpiot), accelerators, research institutes';
COMMENT ON TABLE notalone.notalone_companies IS 'Startups, corporations, VC funds, accelerators - 28+ tracked';
COMMENT ON TABLE notalone.notalone_people IS 'Founders, executives, investors, advisors - 33+ tracked';
COMMENT ON TABLE notalone.notalone_employment_history IS 'CRITICAL: Who worked where, when - 57+ records for talent flow analysis';
COMMENT ON TABLE notalone.notalone_education_records IS 'Academic history linking People to Institutions';
COMMENT ON TABLE notalone.notalone_military_service IS 'IDF service records, especially Unit 8200 alumni (80% of cyber founders)';
COMMENT ON TABLE notalone.notalone_investment_relationships IS 'Angel and VC investments';
COMMENT ON TABLE notalone.notalone_board_positions IS 'Board memberships and advisory positions';
COMMENT ON TABLE notalone.notalone_funding_rounds IS 'Company fundraising history';
COMMENT ON TABLE notalone.notalone_acquisitions IS 'M&A activity - 13 tracked with $68B+ exit value';
COMMENT ON TABLE notalone.notalone_cofounder_relationships IS 'Explicit co-founder pairs for network analysis';
COMMENT ON TABLE notalone.notalone_person_connections IS 'Network edges - how people know each other';
COMMENT ON TABLE notalone.notalone_lp_prospects IS 'LP fundraising pipeline with status tracking';

-- Key ecosystem patterns
COMMENT ON COLUMN notalone.notalone_companies.tags IS 'Key tags: Modu Effect (failed startup spawned 12+ companies), 8200 Origin, Check Point Mafia';
COMMENT ON COLUMN notalone.notalone_people.is_8200_alumni IS 'Unit 8200 alumni - 80% of Israeli cyber founders have this background';
