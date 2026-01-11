-- ===========================================
-- Notalone PostgreSQL Schema
-- Israeli Tech Ecosystem Database
-- ===========================================
--
-- Target: XNode3 (74.50.97.243)
-- Database: PostgreSQL
-- Schema: notalone
--
-- Migration from Airtable Base: appa39H33O8CmM01t
--
-- Execute order:
--   1. Run this entire file to create schema and tables
--   2. Run migration script to populate data
--   3. Run views creation (at bottom of file)
-- ===========================================

-- Create schema (isolated from events_hive)
CREATE SCHEMA IF NOT EXISTS notalone;

-- Set search path for this session
SET search_path TO notalone;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- TABLE: institutions
-- Universities, military units, accelerators
-- ===========================================
DROP TABLE IF EXISTS notalone.institutions CASCADE;
CREATE TABLE notalone.institutions (
    id SERIAL PRIMARY KEY,
    airtable_id VARCHAR(20) UNIQUE,
    name VARCHAR(255) NOT NULL,
    full_name VARCHAR(500),
    type VARCHAR(50) CHECK (type IN ('University', 'Research Institute', 'Military Unit', 'Accelerator')),
    subtype VARCHAR(50) CHECK (subtype IN ('Technical', 'Business School', 'Intelligence', 'Incubator', 'Cyber Foundry', NULL)),
    location VARCHAR(100),
    founded_year INTEGER,
    prestige_tier VARCHAR(20),
    notable_programs TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_institutions_type ON notalone.institutions(type);
CREATE INDEX idx_institutions_name ON notalone.institutions(name);

COMMENT ON TABLE notalone.institutions IS 'Academic institutions, military units, and accelerators';

-- ===========================================
-- TABLE: companies
-- Startups, VC funds, corporations
-- ===========================================
DROP TABLE IF EXISTS notalone.companies CASCADE;
CREATE TABLE notalone.companies (
    id SERIAL PRIMARY KEY,
    airtable_id VARCHAR(20) UNIQUE,
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    founded_year INTEGER,
    shutdown_year INTEGER,
    company_type VARCHAR(50) CHECK (company_type IN ('Startup', 'VC Fund', 'Corporation', 'Acquirer', 'Accelerator', NULL)),
    stage VARCHAR(50) CHECK (stage IN ('Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Growth', 'Public', 'Acquired', 'Shut Down', 'Active', NULL)),
    status VARCHAR(50) CHECK (status IN ('Active', 'Acquired', 'Shut Down', 'IPO', NULL)),
    sector VARCHAR(100),
    technologies TEXT[],
    hq_location VARCHAR(100),
    description TEXT,
    total_raised BIGINT,  -- Stored in USD cents
    exit_value BIGINT,    -- Stored in USD cents
    exit_type VARCHAR(50) CHECK (exit_type IN ('IPO', 'Acquisition', 'Shut Down', 'Active', NULL)),
    exit_date DATE,
    website VARCHAR(500),
    twitter_handle VARCHAR(100),
    tags TEXT[],
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_companies_type ON notalone.companies(company_type);
CREATE INDEX idx_companies_sector ON notalone.companies(sector);
CREATE INDEX idx_companies_status ON notalone.companies(status);
CREATE INDEX idx_companies_name ON notalone.companies(name);

COMMENT ON TABLE notalone.companies IS 'Companies including startups, funds, and acquirers';

-- ===========================================
-- TABLE: people
-- Founders, investors, executives, advisors
-- ===========================================
DROP TABLE IF EXISTS notalone.people CASCADE;
CREATE TABLE notalone.people (
    id SERIAL PRIMARY KEY,
    airtable_id VARCHAR(20) UNIQUE,
    name VARCHAR(255) NOT NULL,
    hebrew_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    linkedin_url VARCHAR(500),
    twitter_handle VARCHAR(100),
    photo_url VARCHAR(500),
    birth_year INTEGER,
    current_role VARCHAR(100),
    current_company_id INTEGER REFERENCES notalone.companies(id) ON DELETE SET NULL,
    primary_type VARCHAR(50) CHECK (primary_type IN ('Investor', 'Founder', 'Academic', 'Executive', 'Advisor', NULL)),
    secondary_types TEXT[],
    is_8200_alumni BOOLEAN DEFAULT FALSE,
    is_talpiot_alumni BOOLEAN DEFAULT FALSE,
    is_technion_alumni BOOLEAN DEFAULT FALSE,
    lp_potential VARCHAR(20) CHECK (lp_potential IN ('Hot', 'Warm', 'Cold', 'Not Relevant', NULL)),
    lp_segment VARCHAR(100),
    estimated_net_worth VARCHAR(50),
    location VARCHAR(100),
    tags TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_people_lp_potential ON notalone.people(lp_potential);
CREATE INDEX idx_people_primary_type ON notalone.people(primary_type);
CREATE INDEX idx_people_is_8200 ON notalone.people(is_8200_alumni) WHERE is_8200_alumni = TRUE;
CREATE INDEX idx_people_name ON notalone.people(name);
CREATE INDEX idx_people_current_company ON notalone.people(current_company_id);

COMMENT ON TABLE notalone.people IS 'All individuals in the ecosystem - founders, investors, executives';

-- ===========================================
-- TABLE: employment_history
-- Who worked where and when
-- ===========================================
DROP TABLE IF EXISTS notalone.employment_history CASCADE;
CREATE TABLE notalone.employment_history (
    id SERIAL PRIMARY KEY,
    airtable_id VARCHAR(20) UNIQUE,
    person_id INTEGER REFERENCES notalone.people(id) ON DELETE CASCADE,
    company_id INTEGER REFERENCES notalone.companies(id) ON DELETE CASCADE,
    role_title VARCHAR(200),
    role_type VARCHAR(100),
    start_date DATE,
    end_date DATE,
    is_founder BOOLEAN DEFAULT FALSE,
    is_current BOOLEAN DEFAULT FALSE,
    notable_achievement TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_employment_person ON notalone.employment_history(person_id);
CREATE INDEX idx_employment_company ON notalone.employment_history(company_id);
CREATE INDEX idx_employment_current ON notalone.employment_history(is_current) WHERE is_current = TRUE;
CREATE INDEX idx_employment_founder ON notalone.employment_history(is_founder) WHERE is_founder = TRUE;

COMMENT ON TABLE notalone.employment_history IS 'Employment relationships between people and companies';

-- ===========================================
-- TABLE: education_records
-- Academic history
-- ===========================================
DROP TABLE IF EXISTS notalone.education_records CASCADE;
CREATE TABLE notalone.education_records (
    id SERIAL PRIMARY KEY,
    airtable_id VARCHAR(20) UNIQUE,
    person_id INTEGER REFERENCES notalone.people(id) ON DELETE CASCADE,
    person_name VARCHAR(255),  -- Fallback if person not linked
    institution_id INTEGER REFERENCES notalone.institutions(id) ON DELETE SET NULL,
    degree_type VARCHAR(50) CHECK (degree_type IN ('PhD', 'BSc', 'MSc', 'Professor', 'MBA', NULL)),
    field_of_study VARCHAR(200),
    start_year INTEGER,
    end_year INTEGER,
    notable_achievement TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_education_person ON notalone.education_records(person_id);
CREATE INDEX idx_education_institution ON notalone.education_records(institution_id);

COMMENT ON TABLE notalone.education_records IS 'Educational background of people';

-- ===========================================
-- TABLE: military_service
-- Military/intelligence service history
-- ===========================================
DROP TABLE IF EXISTS notalone.military_service CASCADE;
CREATE TABLE notalone.military_service (
    id SERIAL PRIMARY KEY,
    airtable_id VARCHAR(20) UNIQUE,
    person_id INTEGER REFERENCES notalone.people(id) ON DELETE CASCADE,
    person_name VARCHAR(255),  -- Fallback if person not linked
    unit VARCHAR(100),
    role VARCHAR(100),
    start_year INTEGER,
    end_year INTEGER,
    highest_rank VARCHAR(50),
    notable_achievement TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_military_person ON notalone.military_service(person_id);
CREATE INDEX idx_military_unit ON notalone.military_service(unit);

COMMENT ON TABLE notalone.military_service IS 'Military service records, especially 8200 and Talpiot';

-- ===========================================
-- TABLE: investment_relationships
-- Who invested in what
-- ===========================================
DROP TABLE IF EXISTS notalone.investment_relationships CASCADE;
CREATE TABLE notalone.investment_relationships (
    id SERIAL PRIMARY KEY,
    airtable_id VARCHAR(20) UNIQUE,
    investor_id INTEGER REFERENCES notalone.people(id) ON DELETE CASCADE,
    company_id INTEGER REFERENCES notalone.companies(id) ON DELETE CASCADE,
    investment_type VARCHAR(50),
    round VARCHAR(50),
    amount BIGINT,  -- Stored in USD cents
    investment_date DATE,
    is_lead_investor BOOLEAN DEFAULT FALSE,
    has_board_seat BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_investment_investor ON notalone.investment_relationships(investor_id);
CREATE INDEX idx_investment_company ON notalone.investment_relationships(company_id);

COMMENT ON TABLE notalone.investment_relationships IS 'Investment relationships between people/entities and companies';

-- ===========================================
-- TABLE: board_positions
-- Board memberships
-- ===========================================
DROP TABLE IF EXISTS notalone.board_positions CASCADE;
CREATE TABLE notalone.board_positions (
    id SERIAL PRIMARY KEY,
    airtable_id VARCHAR(20) UNIQUE,
    person_id INTEGER REFERENCES notalone.people(id) ON DELETE CASCADE,
    person_name VARCHAR(255),  -- Fallback
    company_id INTEGER REFERENCES notalone.companies(id) ON DELETE CASCADE,
    position VARCHAR(200),
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_board_person ON notalone.board_positions(person_id);
CREATE INDEX idx_board_company ON notalone.board_positions(company_id);

COMMENT ON TABLE notalone.board_positions IS 'Board and advisory positions';

-- ===========================================
-- TABLE: funding_rounds
-- Company fundraising history
-- ===========================================
DROP TABLE IF EXISTS notalone.funding_rounds CASCADE;
CREATE TABLE notalone.funding_rounds (
    id SERIAL PRIMARY KEY,
    airtable_id VARCHAR(20) UNIQUE,
    company_id INTEGER REFERENCES notalone.companies(id) ON DELETE CASCADE,
    round_name VARCHAR(100),
    round_type VARCHAR(50),
    amount BIGINT,  -- Stored in USD cents
    round_date DATE,
    pre_money_valuation BIGINT,  -- Stored in USD cents
    lead_investor VARCHAR(255),
    other_investors TEXT[],
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_funding_company ON notalone.funding_rounds(company_id);
CREATE INDEX idx_funding_date ON notalone.funding_rounds(round_date);
CREATE INDEX idx_funding_type ON notalone.funding_rounds(round_type);

COMMENT ON TABLE notalone.funding_rounds IS 'Funding rounds for companies';

-- ===========================================
-- TABLE: acquisitions
-- M&A activity
-- ===========================================
DROP TABLE IF EXISTS notalone.acquisitions CASCADE;
CREATE TABLE notalone.acquisitions (
    id SERIAL PRIMARY KEY,
    airtable_id VARCHAR(20) UNIQUE,
    acquirer_name VARCHAR(255),
    acquirer_id INTEGER REFERENCES notalone.companies(id) ON DELETE SET NULL,
    target_id INTEGER REFERENCES notalone.companies(id) ON DELETE CASCADE,
    deal_value BIGINT,  -- Stored in USD cents
    acquisition_date DATE,
    deal_type VARCHAR(100),
    acquirer_type VARCHAR(100),
    strategic_rationale TEXT,
    key_people_acquired TEXT[],
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_acquisition_target ON notalone.acquisitions(target_id);
CREATE INDEX idx_acquisition_date ON notalone.acquisitions(acquisition_date);

COMMENT ON TABLE notalone.acquisitions IS 'Acquisition and M&A history';

-- ===========================================
-- TABLE: cofounder_relationships
-- Co-founder pairs
-- ===========================================
DROP TABLE IF EXISTS notalone.cofounder_relationships CASCADE;
CREATE TABLE notalone.cofounder_relationships (
    id SERIAL PRIMARY KEY,
    airtable_id VARCHAR(20) UNIQUE,
    person1_name VARCHAR(255),
    person1_id INTEGER REFERENCES notalone.people(id) ON DELETE SET NULL,
    person2_name VARCHAR(255),
    person2_id INTEGER REFERENCES notalone.people(id) ON DELETE SET NULL,
    company_name VARCHAR(255),
    company_id INTEGER REFERENCES notalone.companies(id) ON DELETE SET NULL,
    relationship_type VARCHAR(100),
    start_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cofounder_person1 ON notalone.cofounder_relationships(person1_id);
CREATE INDEX idx_cofounder_person2 ON notalone.cofounder_relationships(person2_id);
CREATE INDEX idx_cofounder_company ON notalone.cofounder_relationships(company_id);

COMMENT ON TABLE notalone.cofounder_relationships IS 'Co-founder relationships for network analysis';

-- ===========================================
-- TABLE: person_connections
-- Network edges between people
-- ===========================================
DROP TABLE IF EXISTS notalone.person_connections CASCADE;
CREATE TABLE notalone.person_connections (
    id SERIAL PRIMARY KEY,
    airtable_id VARCHAR(20) UNIQUE,
    person1_name VARCHAR(255),
    person1_id INTEGER REFERENCES notalone.people(id) ON DELETE SET NULL,
    person2_name VARCHAR(255),
    person2_id INTEGER REFERENCES notalone.people(id) ON DELETE SET NULL,
    connection_type VARCHAR(100),
    strength VARCHAR(20) CHECK (strength IN ('Strong', 'Medium', 'Weak', NULL)),
    source TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_connection_person1 ON notalone.person_connections(person1_id);
CREATE INDEX idx_connection_person2 ON notalone.person_connections(person2_id);
CREATE INDEX idx_connection_type ON notalone.person_connections(connection_type);

COMMENT ON TABLE notalone.person_connections IS 'Network connections between people';

-- ===========================================
-- TABLE: lp_prospects
-- LP fundraising pipeline
-- ===========================================
DROP TABLE IF EXISTS notalone.lp_prospects CASCADE;
CREATE TABLE notalone.lp_prospects (
    id SERIAL PRIMARY KEY,
    airtable_id VARCHAR(20) UNIQUE,
    person_name VARCHAR(255),
    person_id INTEGER REFERENCES notalone.people(id) ON DELETE SET NULL,
    segment VARCHAR(100),
    priority_tier VARCHAR(50),
    status VARCHAR(50),
    warmth_score VARCHAR(20),
    intro_path TEXT,
    check_size_min BIGINT,  -- Stored in USD cents
    check_size_max BIGINT,  -- Stored in USD cents
    investment_thesis_match TEXT,
    last_contact DATE,
    next_action TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lp_person ON notalone.lp_prospects(person_id);
CREATE INDEX idx_lp_segment ON notalone.lp_prospects(segment);
CREATE INDEX idx_lp_status ON notalone.lp_prospects(status);
CREATE INDEX idx_lp_warmth ON notalone.lp_prospects(warmth_score);

COMMENT ON TABLE notalone.lp_prospects IS 'LP prospect pipeline for fundraising';

-- ===========================================
-- TABLE: airtable_id_mapping
-- Tracks Airtable IDs to PostgreSQL IDs
-- Used during and after migration
-- ===========================================
DROP TABLE IF EXISTS notalone.airtable_id_mapping CASCADE;
CREATE TABLE notalone.airtable_id_mapping (
    id SERIAL PRIMARY KEY,
    airtable_table VARCHAR(100) NOT NULL,
    airtable_record_id VARCHAR(20) NOT NULL,
    pg_table VARCHAR(100) NOT NULL,
    pg_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(airtable_table, airtable_record_id)
);

CREATE INDEX idx_mapping_airtable ON notalone.airtable_id_mapping(airtable_table, airtable_record_id);
CREATE INDEX idx_mapping_pg ON notalone.airtable_id_mapping(pg_table, pg_id);

COMMENT ON TABLE notalone.airtable_id_mapping IS 'Migration tracking - maps Airtable IDs to PostgreSQL IDs';

-- ===========================================
-- VIEWS
-- ===========================================

-- View: Hot LP Prospects with full details
CREATE OR REPLACE VIEW notalone.v_hot_lp_prospects AS
SELECT
    p.id AS person_id,
    p.name,
    p.current_role,
    c.name AS current_company,
    p.lp_potential,
    p.lp_segment,
    p.estimated_net_worth,
    p.location,
    p.is_8200_alumni,
    p.linkedin_url,
    lp.status AS prospect_status,
    lp.intro_path,
    lp.next_action,
    lp.last_contact,
    p.notes AS person_notes,
    lp.notes AS prospect_notes
FROM notalone.people p
LEFT JOIN notalone.companies c ON p.current_company_id = c.id
LEFT JOIN notalone.lp_prospects lp ON lp.person_id = p.id
WHERE p.lp_potential IN ('Hot', 'Warm')
ORDER BY
    CASE p.lp_potential
        WHEN 'Hot' THEN 1
        WHEN 'Warm' THEN 2
    END,
    p.estimated_net_worth DESC NULLS LAST;

COMMENT ON VIEW notalone.v_hot_lp_prospects IS 'Hot and warm LP prospects with company and contact details';

-- View: Network Elements for Kumu export
CREATE OR REPLACE VIEW notalone.v_network_elements AS
SELECT
    'person_' || id AS element_id,
    'Person' AS element_type,
    name AS label,
    primary_type AS category,
    lp_potential,
    estimated_net_worth,
    location,
    CASE WHEN is_8200_alumni THEN 'Yes' ELSE 'No' END AS "8200_alumni",
    notes AS description,
    tags
FROM notalone.people
UNION ALL
SELECT
    'company_' || id AS element_id,
    'Company' AS element_type,
    name AS label,
    company_type AS category,
    NULL AS lp_potential,
    NULL AS estimated_net_worth,
    hq_location AS location,
    NULL AS "8200_alumni",
    description,
    ARRAY_TO_STRING(tags, ',') AS tags
FROM notalone.companies
UNION ALL
SELECT
    'institution_' || id AS element_id,
    'Institution' AS element_type,
    name AS label,
    type AS category,
    NULL AS lp_potential,
    NULL AS estimated_net_worth,
    location,
    NULL AS "8200_alumni",
    notes AS description,
    NULL AS tags
FROM notalone.institutions;

COMMENT ON VIEW notalone.v_network_elements IS 'Network elements for Kumu visualization export';

-- View: Network Connections for Kumu export
CREATE OR REPLACE VIEW notalone.v_network_connections AS
-- Employment relationships
SELECT
    'person_' || person_id AS from_id,
    'company_' || company_id AS to_id,
    CASE
        WHEN is_founder THEN 'Founded'
        WHEN is_current THEN 'Works At'
        ELSE 'Worked At'
    END AS connection_type,
    role_title AS label,
    NULL AS strength
FROM notalone.employment_history
WHERE person_id IS NOT NULL AND company_id IS NOT NULL
UNION ALL
-- Investment relationships
SELECT
    'person_' || investor_id AS from_id,
    'company_' || company_id AS to_id,
    'Invested In' AS connection_type,
    investment_type AS label,
    NULL AS strength
FROM notalone.investment_relationships
WHERE investor_id IS NOT NULL AND company_id IS NOT NULL
UNION ALL
-- Co-founder relationships
SELECT
    'person_' || person1_id AS from_id,
    'person_' || person2_id AS to_id,
    'Co-Founder With' AS connection_type,
    company_name AS label,
    'Strong' AS strength
FROM notalone.cofounder_relationships
WHERE person1_id IS NOT NULL AND person2_id IS NOT NULL
UNION ALL
-- Person connections
SELECT
    'person_' || person1_id AS from_id,
    'person_' || person2_id AS to_id,
    connection_type,
    source AS label,
    strength
FROM notalone.person_connections
WHERE person1_id IS NOT NULL AND person2_id IS NOT NULL
UNION ALL
-- Education relationships
SELECT
    'person_' || person_id AS from_id,
    'institution_' || institution_id AS to_id,
    'Educated At' AS connection_type,
    degree_type || ' - ' || COALESCE(field_of_study, '') AS label,
    NULL AS strength
FROM notalone.education_records
WHERE person_id IS NOT NULL AND institution_id IS NOT NULL
UNION ALL
-- Board positions
SELECT
    'person_' || person_id AS from_id,
    'company_' || company_id AS to_id,
    'Board Member' AS connection_type,
    position AS label,
    'Strong' AS strength
FROM notalone.board_positions
WHERE person_id IS NOT NULL AND company_id IS NOT NULL;

COMMENT ON VIEW notalone.v_network_connections IS 'Network connections for Kumu visualization export';

-- View: Company statistics summary
CREATE OR REPLACE VIEW notalone.v_company_stats AS
SELECT
    c.id,
    c.name,
    c.sector,
    c.status,
    c.company_type,
    c.founded_year,
    c.total_raised / 100.0 AS total_raised_usd,
    c.exit_value / 100.0 AS exit_value_usd,
    COUNT(DISTINCT eh.person_id) AS total_employees_ever,
    COUNT(DISTINCT CASE WHEN eh.is_current THEN eh.person_id END) AS current_employees,
    COUNT(DISTINCT CASE WHEN eh.is_founder THEN eh.person_id END) AS founder_count,
    COUNT(DISTINCT fr.id) AS funding_rounds_count,
    COALESCE(SUM(fr.amount), 0) / 100.0 AS total_funding_recorded_usd
FROM notalone.companies c
LEFT JOIN notalone.employment_history eh ON eh.company_id = c.id
LEFT JOIN notalone.funding_rounds fr ON fr.company_id = c.id
GROUP BY c.id, c.name, c.sector, c.status, c.company_type, c.founded_year, c.total_raised, c.exit_value;

COMMENT ON VIEW notalone.v_company_stats IS 'Company summary statistics with employee and funding counts';

-- View: 8200 Alumni Network
CREATE OR REPLACE VIEW notalone.v_8200_network AS
SELECT
    p.id,
    p.name,
    p.current_role,
    c.name AS current_company,
    p.primary_type,
    p.lp_potential,
    p.estimated_net_worth,
    p.location,
    (
        SELECT STRING_AGG(DISTINCT co.name, ', ')
        FROM notalone.employment_history eh
        JOIN notalone.companies co ON co.id = eh.company_id
        WHERE eh.person_id = p.id AND eh.is_founder = TRUE
    ) AS companies_founded
FROM notalone.people p
LEFT JOIN notalone.companies c ON p.current_company_id = c.id
WHERE p.is_8200_alumni = TRUE
ORDER BY p.lp_potential, p.name;

COMMENT ON VIEW notalone.v_8200_network IS '8200 alumni with their founded companies';

-- ===========================================
-- FUNCTIONS
-- ===========================================

-- Function: Update timestamp trigger
CREATE OR REPLACE FUNCTION notalone.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update trigger to all tables
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'notalone'
        AND table_type = 'BASE TABLE'
        AND table_name != 'airtable_id_mapping'
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%I_updated_at ON notalone.%I;
            CREATE TRIGGER update_%I_updated_at
            BEFORE UPDATE ON notalone.%I
            FOR EACH ROW
            EXECUTE FUNCTION notalone.update_updated_at_column();
        ', t, t, t, t);
    END LOOP;
END;
$$ language 'plpgsql';

-- ===========================================
-- GRANTS (adjust user names as needed)
-- ===========================================

-- Create role for Notalone access
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'notalone_user') THEN
        CREATE ROLE notalone_user WITH LOGIN PASSWORD 'CHANGE_THIS_PASSWORD';
    END IF;
END
$$;

GRANT USAGE ON SCHEMA notalone TO notalone_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA notalone TO notalone_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA notalone TO notalone_user;

-- For Superset read-only access
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'notalone_readonly') THEN
        CREATE ROLE notalone_readonly WITH LOGIN PASSWORD 'CHANGE_THIS_PASSWORD';
    END IF;
END
$$;

GRANT USAGE ON SCHEMA notalone TO notalone_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA notalone TO notalone_readonly;

-- ===========================================
-- END OF SCHEMA
-- ===========================================

-- Verification query
SELECT
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'notalone'
ORDER BY tablename;
