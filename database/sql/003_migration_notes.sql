-- ============================================================================
-- Migration Notes: Airtable to PostgreSQL
-- Israeli Tech Ecosystem Database
-- ============================================================================

/*
================================================================================
AIRTABLE TO POSTGRESQL TYPE MAPPING
================================================================================

| Airtable Field Type      | PostgreSQL Type          | Notes                    |
|--------------------------|--------------------------|--------------------------|
| Single line text         | VARCHAR(255)             | Use TEXT for longer      |
| Multiline text           | TEXT                     |                          |
| Number (integer)         | INTEGER                  |                          |
| Number (decimal)         | DECIMAL(precision,scale) |                          |
| Currency                 | BIGINT (cents)           | Store as cents, /100     |
| Percent                  | DECIMAL(5,2)             | 0.00 to 100.00           |
| Date                     | DATE                     | ISO format preserved     |
| Date with time           | TIMESTAMPTZ              |                          |
| Checkbox                 | BOOLEAN                  |                          |
| Single select            | ENUM or VARCHAR          | Prefer ENUM for fixed    |
| Multiple select          | JSONB array              | ['option1', 'option2']   |
| Link to another record   | UUID FOREIGN KEY         | Create junction tables   |
| Multiple record links    | Junction table           | Many-to-many via table   |
| Attachment               | JSONB                    | Store URLs, not files    |
| URL                      | VARCHAR(500)             |                          |
| Email                    | VARCHAR(255)             |                          |
| Phone                    | VARCHAR(50)              |                          |
| Formula                  | GENERATED COLUMN         | Or materialized view     |
| Rollup                   | Materialized view        | Pre-compute aggregates   |
| Count                    | Materialized view        |                          |
| Lookup                   | JOIN in query            |                          |
| Created time             | TIMESTAMPTZ DEFAULT NOW()|                          |
| Last modified time       | TIMESTAMPTZ + trigger    |                          |
| Auto number              | SERIAL or UUID           | Prefer UUID for dist.    |
| Barcode                  | VARCHAR                  |                          |
| Rating                   | SMALLINT                 | 1-5 typically            |
| Duration                 | INTERVAL                 |                          |
| AI text                  | TEXT                     | Store generated text     |

================================================================================
MIGRATION PROCESS
================================================================================

STEP 1: Export from Airtable
----------------------------
1. Use Airtable API to export each table as JSON
2. Or use Airtable "CSV Export" feature per table
3. Preserve Airtable record IDs for reference (airtable_id column)

STEP 2: Create PostgreSQL Schema
--------------------------------
Run scripts in order:
  psql -d calendar_monitoring -f 001_create_schema.sql
  psql -d calendar_monitoring -f 002_materialized_views.sql

STEP 3: Data Transformation
---------------------------
For each table, transform Airtable JSON to PostgreSQL INSERT:

-- Example: People table transformation

-- From Airtable JSON:
{
  "id": "recABC123",
  "fields": {
    "Name": "Shlomo Kramer",
    "Current Role": "Executive Chairman",
    "Is 8200 Alumni": true,
    "LP Potential": "Hot",
    "LP Segment": "Exit Millionaire",
    "Estimated Net Worth": "$100M+",
    "Location": "Tel Aviv"
  }
}

-- To PostgreSQL INSERT:
INSERT INTO notalone.notalone_people (
    airtable_id,
    name,
    current_role,
    is_8200_alumni,
    lp_potential,
    lp_segment,
    estimated_net_worth,
    location
) VALUES (
    'recABC123',
    'Shlomo Kramer',
    'Executive Chairman',
    TRUE,
    'Hot',
    'Exit Millionaire',
    '$100M+',
    'Tel Aviv'
);

STEP 4: Resolve Linked Records
------------------------------
Airtable stores linked records as arrays of record IDs.
After base data is loaded, update foreign keys:

-- Example: Update current_company_id from company name
UPDATE notalone.notalone_people p
SET current_company_id = c.id
FROM notalone.notalone_companies c
WHERE p.current_company_name = c.company_name;

-- Example: Employment History foreign keys
UPDATE notalone.notalone_employment_history eh
SET person_id = p.id
FROM notalone.notalone_people p
WHERE eh.person_name = p.name;

UPDATE notalone.notalone_employment_history eh
SET company_id = c.id
FROM notalone.notalone_companies c
WHERE eh.company_name = c.company_name;

STEP 5: Populate Materialized Views
-----------------------------------
After all data is loaded and foreign keys resolved:

SELECT notalone.refresh_all_materialized_views();

================================================================================
SPECIFIC TABLE MIGRATION NOTES
================================================================================

TABLE: Institutions
-------------------
- Simple migration, minimal transformations needed
- Type/Subtype fields map directly to ENUMs
- Pre-populate with standard institutions (8200, Technion, etc.)

TABLE: Companies
----------------
- Financial fields: Multiply by 100 to store as cents
  Example: $10,000,000 -> 1000000000 (cents)
- Technologies field: Convert comma-separated to JSONB array
  Example: "MPC, ZK Proofs" -> '["MPC", "ZK Proofs"]'
- Tags field: Same treatment

TABLE: People
-------------
- Current Company: Store company_name first, resolve to UUID later
- Secondary Types: Convert to JSONB array
- Hebrew Name: May need UTF-8 encoding verification

TABLE: Employment History
-------------------------
- CRITICAL: This is the most important junction table
- Person/Company links: Use names initially, resolve to UUIDs
- is_current: Computed field based on end_date IS NULL
- tenure_months: Computed field from date range
- is_founder: Boolean based on role containing "Founder"

TABLE: Education Records
------------------------
- Person field in Airtable is multilineText (not linked)
- After migration, manually match to People table
- Institution links to Institutions table

TABLE: Military Service
-----------------------
- Person field is multilineText (not linked)
- Unit field is multilineText - match to Institutions
- Critical for identifying 8200 alumni

TABLE: Investment Relationships
-------------------------------
- Investor links to People table
- Company links to Companies table
- Amount: Convert to cents

TABLE: Funding Rounds
---------------------
- Company links to Companies table
- Other Investors: Store as JSONB array of names
- All amounts in cents

TABLE: Acquisitions
-------------------
- Target links to Companies table
- Acquirer: Store as text (may be external company)
- Key People: Store as JSONB array

TABLE: Co-Founder Relationships
-------------------------------
- Person 1/2: Store as names, resolve to UUIDs
- Company: Store as name, resolve to UUID
- Important for network visualization

TABLE: Person Connections
-------------------------
- Person 1/2: Store as names, resolve to UUIDs
- Connection Type: Map to ENUM values
- Strength: Map to ENUM values

TABLE: LP Prospects
-------------------
- Person: Store as name, resolve to UUID
- Check Size: Convert to cents
- Status/Segment/Warmth: Map to ENUMs

================================================================================
DATA QUALITY CHECKS
================================================================================

Run these queries after migration to verify data integrity:

-- Check for orphaned foreign keys
SELECT 'employment_history' AS table_name, COUNT(*) AS orphans
FROM notalone.notalone_employment_history
WHERE person_id IS NULL;

-- Check for duplicate people
SELECT name, COUNT(*) AS duplicates
FROM notalone.notalone_people
GROUP BY name
HAVING COUNT(*) > 1;

-- Check company type distribution
SELECT company_type, COUNT(*)
FROM notalone.notalone_companies
GROUP BY company_type;

-- Check LP prospect segments
SELECT segment, warmth_score, COUNT(*)
FROM notalone.notalone_lp_prospects
GROUP BY segment, warmth_score;

-- Verify 8200 alumni count
SELECT COUNT(*) AS alumni_8200_count
FROM notalone.notalone_people
WHERE is_8200_alumni = TRUE;

-- Verify exit values
SELECT
    COUNT(*) AS exit_count,
    SUM(deal_value_usd) / 100.0 AS total_exit_value_usd
FROM notalone.notalone_acquisitions
WHERE deal_value_usd > 0;

================================================================================
NETWORK ANALYSIS QUERIES
================================================================================

-- Find all connections for a person (2-hop network)
WITH person_network AS (
    -- Direct connections
    SELECT
        pc.person_2_id AS connected_person_id,
        pc.connection_type,
        pc.connection_strength,
        1 AS hops
    FROM notalone.notalone_person_connections pc
    WHERE pc.person_1_id = :person_id

    UNION

    SELECT
        pc.person_1_id AS connected_person_id,
        pc.connection_type,
        pc.connection_strength,
        1 AS hops
    FROM notalone.notalone_person_connections pc
    WHERE pc.person_2_id = :person_id
)
SELECT * FROM person_network;

-- Find talent flow from a company (where alumni went)
SELECT
    dest_company,
    dest_sector,
    COUNT(*) AS alumni_count,
    COUNT(*) FILTER (WHERE founded_next_company = TRUE) AS founded_count
FROM notalone.mv_talent_flow
WHERE source_company = 'Modu'
GROUP BY dest_company, dest_sector
ORDER BY alumni_count DESC;

-- "Modu Effect" analysis - companies spawned by Modu alumni
SELECT
    c.company_name,
    c.founded_year,
    c.sector,
    c.status,
    c.exit_value_usd / 100.0 AS exit_value_usd
FROM notalone.notalone_companies c
WHERE EXISTS (
    SELECT 1
    FROM notalone.notalone_employment_history eh1
    JOIN notalone.notalone_employment_history eh2 ON eh2.person_id = eh1.person_id
    JOIN notalone.notalone_companies modu ON modu.id = eh1.company_id
    WHERE modu.company_name = 'Modu'
      AND eh2.company_id = c.id
      AND eh2.is_founder = TRUE
      AND eh2.start_date > eh1.end_date
);

================================================================================
SUPERSET DASHBOARD QUERIES
================================================================================

-- Dashboard 1: Exit Value by Year
SELECT
    exit_year,
    COUNT(*) AS exit_count,
    SUM(deal_value_usd) AS total_value_usd,
    AVG(deal_value_usd) AS avg_value_usd
FROM notalone.mv_exit_analysis
GROUP BY exit_year
ORDER BY exit_year;

-- Dashboard 2: LP Pipeline Funnel
SELECT
    status,
    COUNT(*) AS count,
    SUM(target_commitment_usd) AS potential_commitment
FROM notalone.mv_lp_pipeline
GROUP BY status
ORDER BY
    CASE status
        WHEN 'Identified' THEN 1
        WHEN 'Researching' THEN 2
        WHEN 'Outreach Planned' THEN 3
        WHEN 'Contacted' THEN 4
        WHEN 'Meeting Scheduled' THEN 5
        WHEN 'Met' THEN 6
        WHEN 'Follow-up' THEN 7
        WHEN 'Soft Commit' THEN 8
        WHEN 'Hard Commit' THEN 9
        WHEN 'Wired' THEN 10
    END;

-- Dashboard 3: 8200 Alumni Impact
SELECT
    'Companies Founded' AS metric,
    SUM(companies_founded) AS value
FROM notalone.mv_8200_network

UNION ALL

SELECT
    'Total Exit Value ($M)' AS metric,
    ROUND(SUM(total_exit_value_usd) / 1000000, 1) AS value
FROM notalone.mv_8200_network

UNION ALL

SELECT
    'Active Network Connections' AS metric,
    SUM(alumni_connections) AS value
FROM notalone.mv_8200_network;

================================================================================
BACKUP AND MAINTENANCE
================================================================================

-- Create backup before major changes
pg_dump -d calendar_monitoring -n notalone -F c -f notalone_backup.dump

-- Restore from backup
pg_restore -d calendar_monitoring -n notalone notalone_backup.dump

-- Analyze tables for query optimization
ANALYZE notalone.notalone_people;
ANALYZE notalone.notalone_companies;
ANALYZE notalone.notalone_employment_history;

-- Vacuum to reclaim space
VACUUM ANALYZE notalone.notalone_people;

-- Reindex if performance degrades
REINDEX SCHEMA notalone;

================================================================================
*/

-- Migration helper function: Convert Airtable currency to cents
CREATE OR REPLACE FUNCTION notalone.currency_to_cents(amount_str TEXT)
RETURNS BIGINT AS $$
DECLARE
    cleaned TEXT;
    multiplier BIGINT := 1;
    amount DECIMAL;
BEGIN
    IF amount_str IS NULL OR amount_str = '' THEN
        RETURN NULL;
    END IF;

    -- Remove currency symbols and commas
    cleaned := REGEXP_REPLACE(amount_str, '[$,]', '', 'g');

    -- Handle B (billions), M (millions), K (thousands)
    IF cleaned ~* 'B$' THEN
        multiplier := 100000000000;  -- Billions to cents
        cleaned := REGEXP_REPLACE(cleaned, '[BMK]$', '', 'i');
    ELSIF cleaned ~* 'M$' THEN
        multiplier := 100000000;  -- Millions to cents
        cleaned := REGEXP_REPLACE(cleaned, '[BMK]$', '', 'i');
    ELSIF cleaned ~* 'K$' THEN
        multiplier := 100000;  -- Thousands to cents
        cleaned := REGEXP_REPLACE(cleaned, '[BMK]$', '', 'i');
    ELSE
        multiplier := 100;  -- Dollars to cents
    END IF;

    amount := cleaned::DECIMAL;
    RETURN (amount * multiplier)::BIGINT;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Migration helper: Convert comma-separated string to JSONB array
CREATE OR REPLACE FUNCTION notalone.csv_to_jsonb_array(csv_string TEXT)
RETURNS JSONB AS $$
BEGIN
    IF csv_string IS NULL OR csv_string = '' THEN
        RETURN '[]'::JSONB;
    END IF;

    RETURN (
        SELECT jsonb_agg(TRIM(value))
        FROM unnest(STRING_TO_ARRAY(csv_string, ',')) AS value
        WHERE TRIM(value) != ''
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN '[]'::JSONB;
END;
$$ LANGUAGE plpgsql;

-- Test the helper functions
-- SELECT notalone.currency_to_cents('$23B');  -- Should return 2300000000000
-- SELECT notalone.currency_to_cents('$100M'); -- Should return 10000000000
-- SELECT notalone.currency_to_cents('$50K');  -- Should return 5000000
-- SELECT notalone.currency_to_cents('10000'); -- Should return 1000000

-- SELECT notalone.csv_to_jsonb_array('MPC, ZK Proofs, Blockchain');
-- Should return '["MPC", "ZK Proofs", "Blockchain"]'
