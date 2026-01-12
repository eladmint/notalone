# Notalone Migration Architecture: Airtable to XNode3

**Version:** 1.0
**Date:** 2026-01-11
**Author:** @architect
**Status:** Design Phase

---

## Executive Summary

This document describes the architecture for migrating the Notalone Israeli Tech Ecosystem database from Airtable to XNode3 infrastructure. The migration will enable:

- **Cost reduction** by eliminating Airtable subscription fees
- **Enhanced analytics** via Apache Superset dashboards
- **Better data entry** experience through NocoDB spreadsheet UI
- **Full data ownership** on controlled infrastructure
- **Integration preservation** with existing Kumu visualization exports

---

## 1. Current State Analysis

### 1.1 Source: Airtable Base

```
Base: Israeli Tech Ecosystem
ID: appa39H33O8CmM01t
Tables: 13 active tables
Records: ~200+ total records
```

**Table Inventory:**

| # | Table Name | Records (est.) | Key Relationships |
|---|-----------|----------------|-------------------|
| 1 | People | ~140 | Core entity - many links |
| 2 | Companies | ~70 | Core entity - many links |
| 3 | Institutions | ~15 | Universities, military units |
| 4 | Employment History | ~100 | People <-> Companies |
| 5 | Education Records | ~30 | People <-> Institutions |
| 6 | Military Service | ~25 | People <-> Institutions |
| 7 | Investment Relationships | ~50 | People <-> Companies |
| 8 | Board Positions | ~20 | People <-> Companies |
| 9 | Funding Rounds | ~40 | Companies + investors |
| 10 | Acquisitions | ~15 | Company <-> Company |
| 11 | Co-founder Relationships | ~30 | People <-> People |
| 12 | Person Connections | ~60 | People <-> People |
| 13 | LP Prospects | ~50 | People + pipeline data |

**Airtable-Specific Features in Use:**
- Linked record fields (foreign keys)
- Multiple linked records (many-to-many)
- Single/Multiple select fields with color coding
- Formula fields (computed values)
- Rollup/Count fields
- Attachment fields (photos, logos)
- Checkbox fields
- URL fields
- Date fields

### 1.2 Target: XNode3 Infrastructure

```
Server: 74.50.97.243
PostgreSQL: Available (43GB free)
Superset: Port 8088
NocoDB: Port 8080
Existing: Events Hive project (9 tables, 7 dashboards)
```

### 1.3 Existing Data Pipeline

```
Airtable --> CSV Export --> database/csv/*.csv
                       --> database/kumu/elements.csv
                       --> database/kumu/connections.csv
                                        |
                                        v
                                    Kumu.io
                              (Network Visualization)
```

---

## 2. Target Architecture

### 2.1 High-Level Architecture

```
+------------------+     +------------------+     +------------------+
|    AIRTABLE      |     |     XNODE3       |     |   CONSUMERS      |
|  (Source/Legacy) |     |  (PostgreSQL)    |     |                  |
+------------------+     +------------------+     +------------------+
         |                        |                       |
         | Migration              |                       |
         | Script                 |                       |
         v                        v                       |
+------------------+     +------------------+             |
| Export Pipeline  |---->|  notalone.*     |             |
| (Python/Node)    |     |  schema tables  |             |
+------------------+     +------------------+             |
                                 |                       |
         +---------------+-------+-------+---------------+
         |               |               |               |
         v               v               v               v
+------------------+ +------------------+ +------------------+ +------------------+
|    NocoDB        | |    Superset      | |   Kumu Export    | |   Notion Sync    |
|  Data Entry UI   | |   Dashboards     | |   CSV Generator  | |   (Optional)     |
|   Port 8080      | |   Port 8088      | |   Python Script  | |                  |
+------------------+ +------------------+ +------------------+ +------------------+
```

### 2.2 PostgreSQL Schema Design

**Namespace:** `notalone` (separate from events_hive)

```sql
-- Schema creation
CREATE SCHEMA IF NOT EXISTS notalone;
SET search_path TO notalone;
```

### 2.3 Entity-Relationship Diagram

```
                                    +----------------+
                                    |  institutions  |
                                    +----------------+
                                    | id (PK)        |
                                    | name           |
                                    | type           |
                                    | subtype        |
                                    | location       |
                                    +-------+--------+
                                            |
          +------------------+              |               +------------------+
          |     people       |              |               |    companies     |
          +------------------+              |               +------------------+
          | id (PK)          |              |               | id (PK)          |
          | name             |              |               | name             |
          | current_role     |              |               | founded_year     |
          | primary_type     |              |               | company_type     |
          | is_8200_alumni   |              |               | stage            |
          | lp_potential     |              |               | status           |
          | estimated_worth  |              |               | sector           |
          +--------+---------+              |               +--------+---------+
                   |                        |                        |
     +-------------+-------------+----------+-----------+------------+-------------+
     |             |             |                      |            |             |
     v             v             v                      v            v             v
+----------+ +----------+ +----------+          +----------+ +----------+ +----------+
|employment| |education | |military  |          |funding   | |board     | |acquisit- |
| history  | | records  | | service  |          | rounds   | |positions | | ions     |
+----------+ +----------+ +----------+          +----------+ +----------+ +----------+
| person_id| | person_id| | person_id|          |company_id| |person_id | |acquirer  |
| company_ | | instit_  | | unit_id  |          |round_type| |company_id| |target_id |
|   id     | |   id     | | role     |          |amount    | |position  | |deal_value|
+----------+ +----------+ +----------+          +----------+ +----------+ +----------+

                    +------------------+     +------------------+
                    | investment_rels  |     | person_connect   |
                    +------------------+     +------------------+
                    | investor_id (FK) |     | person1_id (FK)  |
                    | company_id (FK)  |     | person2_id (FK)  |
                    | investment_type  |     | connection_type  |
                    | amount           |     | strength         |
                    +------------------+     +------------------+

                    +------------------+     +------------------+
                    | cofounder_rels   |     |  lp_prospects    |
                    +------------------+     +------------------+
                    | person1_id (FK)  |     | person_id (FK)   |
                    | person2_id (FK)  |     | segment          |
                    | company_id (FK)  |     | status           |
                    | relationship_type|     | check_size_min   |
                    +------------------+     +------------------+
```

---

## 3. Database Schema Definition

### 3.1 Core Tables

```sql
-- ===========================================
-- TABLE: notalone.institutions
-- ===========================================
CREATE TABLE notalone.institutions (
    id SERIAL PRIMARY KEY,
    airtable_id VARCHAR(20) UNIQUE,  -- Preserve original ID for reference
    name VARCHAR(255) NOT NULL,
    full_name VARCHAR(500),
    type VARCHAR(50) CHECK (type IN ('University', 'Research Institute', 'Military Unit', 'Accelerator')),
    subtype VARCHAR(50),
    location VARCHAR(100),
    founded_year INTEGER,
    prestige_tier VARCHAR(20),
    notable_programs TEXT[],
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_institutions_type ON notalone.institutions(type);
CREATE INDEX idx_institutions_name ON notalone.institutions(name);

-- ===========================================
-- TABLE: notalone.companies
-- ===========================================
CREATE TABLE notalone.companies (
    id SERIAL PRIMARY KEY,
    airtable_id VARCHAR(20) UNIQUE,
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    founded_year INTEGER,
    shutdown_year INTEGER,
    company_type VARCHAR(50) CHECK (company_type IN ('Startup', 'VC Fund', 'Corporation', 'Acquirer', 'Accelerator')),
    stage VARCHAR(50) CHECK (stage IN ('Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Growth', 'Public', 'Acquired', 'Shut Down', 'Active')),
    status VARCHAR(50) CHECK (status IN ('Active', 'Acquired', 'Shut Down', 'IPO')),
    sector VARCHAR(50),
    technologies TEXT[],
    hq_location VARCHAR(100),
    description TEXT,
    total_raised BIGINT,  -- Store in cents/smallest unit
    exit_value BIGINT,
    exit_type VARCHAR(50),
    exit_date DATE,
    website VARCHAR(500),
    twitter_handle VARCHAR(100),
    tags TEXT[],
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_companies_type ON notalone.companies(company_type);
CREATE INDEX idx_companies_sector ON notalone.companies(sector);
CREATE INDEX idx_companies_status ON notalone.companies(status);

-- ===========================================
-- TABLE: notalone.people
-- ===========================================
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
    current_company_id INTEGER REFERENCES notalone.companies(id),
    primary_type VARCHAR(50) CHECK (primary_type IN ('Investor', 'Founder', 'Academic', 'Executive', 'Advisor')),
    secondary_types TEXT[],
    is_8200_alumni BOOLEAN DEFAULT FALSE,
    is_talpiot_alumni BOOLEAN DEFAULT FALSE,
    is_technion_alumni BOOLEAN DEFAULT FALSE,
    lp_potential VARCHAR(20) CHECK (lp_potential IN ('Hot', 'Warm', 'Cold', 'Not Relevant')),
    lp_segment VARCHAR(50),
    estimated_net_worth VARCHAR(20),
    location VARCHAR(100),
    tags TEXT[],
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_people_lp_potential ON notalone.people(lp_potential);
CREATE INDEX idx_people_primary_type ON notalone.people(primary_type);
CREATE INDEX idx_people_is_8200 ON notalone.people(is_8200_alumni) WHERE is_8200_alumni = TRUE;
CREATE INDEX idx_people_name ON notalone.people(name);

-- ===========================================
-- TABLE: notalone.employment_history
-- ===========================================
CREATE TABLE notalone.employment_history (
    id SERIAL PRIMARY KEY,
    airtable_id VARCHAR(20) UNIQUE,
    person_id INTEGER NOT NULL REFERENCES notalone.people(id) ON DELETE CASCADE,
    company_id INTEGER NOT NULL REFERENCES notalone.companies(id) ON DELETE CASCADE,
    role_title VARCHAR(100),
    role_type VARCHAR(50) CHECK (role_type IN ('Founder & CEO', 'Managing Partner', 'Executive Chairman', 'Co-Founder', 'Engineer', 'Officer', 'Founder & CTO', 'Chairman', 'Professor', 'Partner', 'General Partner', 'CEO', 'Tech Influencer', 'Investor', 'Founder', 'Commander', 'Founding Partner')),
    start_date DATE,
    end_date DATE,
    is_founder BOOLEAN DEFAULT FALSE,
    is_current BOOLEAN DEFAULT FALSE,
    notable_achievement TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_employment_person ON notalone.employment_history(person_id);
CREATE INDEX idx_employment_company ON notalone.employment_history(company_id);
CREATE INDEX idx_employment_current ON notalone.employment_history(is_current) WHERE is_current = TRUE;

-- ===========================================
-- TABLE: notalone.education_records
-- ===========================================
CREATE TABLE notalone.education_records (
    id SERIAL PRIMARY KEY,
    airtable_id VARCHAR(20) UNIQUE,
    person_id INTEGER REFERENCES notalone.people(id) ON DELETE CASCADE,
    person_name VARCHAR(255),  -- Fallback if person not in people table
    institution_id INTEGER REFERENCES notalone.institutions(id),
    degree_type VARCHAR(50) CHECK (degree_type IN ('PhD', 'BSc', 'MSc', 'Professor', 'MBA')),
    field_of_study VARCHAR(100),
    start_year INTEGER,
    end_year INTEGER,
    notable_achievement TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_education_person ON notalone.education_records(person_id);
CREATE INDEX idx_education_institution ON notalone.education_records(institution_id);

-- ===========================================
-- TABLE: notalone.military_service
-- ===========================================
CREATE TABLE notalone.military_service (
    id SERIAL PRIMARY KEY,
    airtable_id VARCHAR(20) UNIQUE,
    person_id INTEGER REFERENCES notalone.people(id) ON DELETE CASCADE,
    person_name VARCHAR(255),  -- Fallback if person not in people table
    unit VARCHAR(100),
    role VARCHAR(50) CHECK (role IN ('Developer', 'Officer', 'Commander')),
    start_year INTEGER,
    end_year INTEGER,
    highest_rank VARCHAR(50),
    notable_achievement TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_military_person ON notalone.military_service(person_id);
CREATE INDEX idx_military_unit ON notalone.military_service(unit);

-- ===========================================
-- TABLE: notalone.investment_relationships
-- ===========================================
CREATE TABLE notalone.investment_relationships (
    id SERIAL PRIMARY KEY,
    airtable_id VARCHAR(20) UNIQUE,
    investor_id INTEGER REFERENCES notalone.people(id) ON DELETE CASCADE,
    company_id INTEGER REFERENCES notalone.companies(id) ON DELETE CASCADE,
    investment_type VARCHAR(20) CHECK (investment_type IN ('Angel', 'VC')),
    round VARCHAR(20),
    amount BIGINT,
    investment_date DATE,
    is_lead_investor BOOLEAN DEFAULT FALSE,
    has_board_seat BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_investment_investor ON notalone.investment_relationships(investor_id);
CREATE INDEX idx_investment_company ON notalone.investment_relationships(company_id);

-- ===========================================
-- TABLE: notalone.board_positions
-- ===========================================
CREATE TABLE notalone.board_positions (
    id SERIAL PRIMARY KEY,
    airtable_id VARCHAR(20) UNIQUE,
    person_id INTEGER REFERENCES notalone.people(id) ON DELETE CASCADE,
    person_name VARCHAR(255),  -- Fallback
    company_id INTEGER REFERENCES notalone.companies(id) ON DELETE CASCADE,
    position VARCHAR(100),
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_board_person ON notalone.board_positions(person_id);
CREATE INDEX idx_board_company ON notalone.board_positions(company_id);

-- ===========================================
-- TABLE: notalone.funding_rounds
-- ===========================================
CREATE TABLE notalone.funding_rounds (
    id SERIAL PRIMARY KEY,
    airtable_id VARCHAR(20) UNIQUE,
    company_id INTEGER REFERENCES notalone.companies(id) ON DELETE CASCADE,
    round_name VARCHAR(100),
    round_type VARCHAR(50) CHECK (round_type IN ('Seed', 'Series A', 'Series B', 'Series C', 'Series D', 'Series E')),
    amount BIGINT,
    round_date DATE,
    pre_money_valuation BIGINT,
    lead_investor VARCHAR(255),
    other_investors TEXT[],
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_funding_company ON notalone.funding_rounds(company_id);
CREATE INDEX idx_funding_date ON notalone.funding_rounds(round_date);

-- ===========================================
-- TABLE: notalone.acquisitions
-- ===========================================
CREATE TABLE notalone.acquisitions (
    id SERIAL PRIMARY KEY,
    airtable_id VARCHAR(20) UNIQUE,
    acquirer_name VARCHAR(255),
    acquirer_id INTEGER REFERENCES notalone.companies(id),
    target_id INTEGER REFERENCES notalone.companies(id) ON DELETE CASCADE,
    deal_value BIGINT,
    acquisition_date DATE,
    deal_type VARCHAR(50),
    acquirer_type VARCHAR(50),
    strategic_rationale TEXT,
    key_people_acquired TEXT[],
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_acquisition_target ON notalone.acquisitions(target_id);
CREATE INDEX idx_acquisition_date ON notalone.acquisitions(acquisition_date);

-- ===========================================
-- TABLE: notalone.cofounder_relationships
-- ===========================================
CREATE TABLE notalone.cofounder_relationships (
    id SERIAL PRIMARY KEY,
    airtable_id VARCHAR(20) UNIQUE,
    person1_name VARCHAR(255),
    person1_id INTEGER REFERENCES notalone.people(id),
    person2_name VARCHAR(255),
    person2_id INTEGER REFERENCES notalone.people(id),
    company_name VARCHAR(255),
    company_id INTEGER REFERENCES notalone.companies(id),
    relationship_type VARCHAR(50),
    start_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cofounder_person1 ON notalone.cofounder_relationships(person1_id);
CREATE INDEX idx_cofounder_person2 ON notalone.cofounder_relationships(person2_id);

-- ===========================================
-- TABLE: notalone.person_connections
-- ===========================================
CREATE TABLE notalone.person_connections (
    id SERIAL PRIMARY KEY,
    airtable_id VARCHAR(20) UNIQUE,
    person1_name VARCHAR(255),
    person1_id INTEGER REFERENCES notalone.people(id),
    person2_name VARCHAR(255),
    person2_id INTEGER REFERENCES notalone.people(id),
    connection_type VARCHAR(50) CHECK (connection_type IN ('Co-Founder', 'Colleague', 'Military', 'Professional', 'Investor', 'Academic')),
    strength VARCHAR(20) CHECK (strength IN ('Strong', 'Medium', 'Weak')),
    source TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_connection_person1 ON notalone.person_connections(person1_id);
CREATE INDEX idx_connection_person2 ON notalone.person_connections(person2_id);
CREATE INDEX idx_connection_type ON notalone.person_connections(connection_type);

-- ===========================================
-- TABLE: notalone.lp_prospects
-- ===========================================
CREATE TABLE notalone.lp_prospects (
    id SERIAL PRIMARY KEY,
    airtable_id VARCHAR(20) UNIQUE,
    person_name VARCHAR(255),
    person_id INTEGER REFERENCES notalone.people(id),
    segment VARCHAR(50),
    priority_tier VARCHAR(50),
    status VARCHAR(50),
    warmth_score VARCHAR(20),
    intro_path TEXT,
    check_size_min BIGINT,
    check_size_max BIGINT,
    investment_thesis_match TEXT,
    last_contact DATE,
    next_action TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lp_person ON notalone.lp_prospects(person_id);
CREATE INDEX idx_lp_segment ON notalone.lp_prospects(segment);
CREATE INDEX idx_lp_status ON notalone.lp_prospects(status);
```

### 3.2 Useful Views

```sql
-- ===========================================
-- VIEW: Hot LP Prospects with Details
-- ===========================================
CREATE VIEW notalone.v_hot_lp_prospects AS
SELECT
    p.name,
    p.current_role,
    c.name AS current_company,
    p.lp_potential,
    p.lp_segment,
    p.estimated_net_worth,
    p.location,
    p.is_8200_alumni,
    lp.status,
    lp.intro_path,
    lp.next_action,
    p.notes AS person_notes,
    lp.notes AS lp_notes
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

-- ===========================================
-- VIEW: Network Connections for Visualization
-- ===========================================
CREATE VIEW notalone.v_network_elements AS
SELECT
    'person_' || id AS element_id,
    'Person' AS element_type,
    name AS label,
    primary_type AS category,
    lp_potential,
    estimated_net_worth,
    location,
    is_8200_alumni::text AS "8200_alumni"
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
    NULL AS "8200_alumni"
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
    NULL AS "8200_alumni"
FROM notalone.institutions;

-- ===========================================
-- VIEW: Network Connections (Edges)
-- ===========================================
CREATE VIEW notalone.v_network_connections AS
-- Employment relationships
SELECT
    'person_' || person_id AS from_id,
    'company_' || company_id AS to_id,
    CASE WHEN is_founder THEN 'Founded'
         WHEN is_current THEN 'Works At'
         ELSE 'Worked At' END AS connection_type,
    role_title AS label
FROM notalone.employment_history
UNION ALL
-- Investment relationships
SELECT
    'person_' || investor_id AS from_id,
    'company_' || company_id AS to_id,
    'Invested In' AS connection_type,
    investment_type AS label
FROM notalone.investment_relationships
UNION ALL
-- Co-founder relationships
SELECT
    'person_' || person1_id AS from_id,
    'person_' || person2_id AS to_id,
    'Co-Founder With' AS connection_type,
    company_name AS label
FROM notalone.cofounder_relationships
WHERE person1_id IS NOT NULL AND person2_id IS NOT NULL
UNION ALL
-- Person connections
SELECT
    'person_' || person1_id AS from_id,
    'person_' || person2_id AS to_id,
    connection_type,
    strength AS label
FROM notalone.person_connections
WHERE person1_id IS NOT NULL AND person2_id IS NOT NULL;

-- ===========================================
-- VIEW: Company Summary Statistics
-- ===========================================
CREATE VIEW notalone.v_company_stats AS
SELECT
    c.id,
    c.name,
    c.sector,
    c.status,
    c.total_raised,
    c.exit_value,
    COUNT(DISTINCT eh.person_id) AS total_employees_ever,
    COUNT(DISTINCT CASE WHEN eh.is_current THEN eh.person_id END) AS current_employees,
    COUNT(DISTINCT CASE WHEN eh.is_founder THEN eh.person_id END) AS founder_count,
    COUNT(DISTINCT fr.id) AS funding_rounds_count,
    SUM(fr.amount) AS total_funding_recorded
FROM notalone.companies c
LEFT JOIN notalone.employment_history eh ON eh.company_id = c.id
LEFT JOIN notalone.funding_rounds fr ON fr.company_id = c.id
GROUP BY c.id, c.name, c.sector, c.status, c.total_raised, c.exit_value;
```

---

## 4. Migration Strategy

### 4.1 Migration Approach: Hybrid (API + CSV)

Given the data volume (~200 records) and complexity (linked records), we'll use:

1. **Airtable API** for primary data extraction (preserves relationships)
2. **CSV exports** as validation/backup mechanism
3. **Python migration script** for transformation and loading

### 4.2 Migration Pipeline

```
+----------------+     +----------------+     +----------------+     +----------------+
|   EXTRACTION   |     | TRANSFORMATION |     |    LOADING     |     |  VALIDATION    |
+----------------+     +----------------+     +----------------+     +----------------+
        |                      |                      |                      |
        v                      v                      v                      v
+----------------+     +----------------+     +----------------+     +----------------+
| Airtable API   |     | Python Script  |     | PostgreSQL     |     | Data Integrity |
| list_records   |     | - Type mapping |     | COPY command   |     | - Row counts   |
| for each table |     | - FK resolution|     | or INSERT      |     | - FK validity  |
|                |     | - Data cleanup |     |                |     | - Sample check |
+----------------+     +----------------+     +----------------+     +----------------+
```

### 4.3 Execution Order (Dependency-Aware)

```
Phase 1: Independent Tables (No FK Dependencies)
  1. institutions
  2. companies

Phase 2: Primary Entity Tables
  3. people (depends on companies for current_company_id)

Phase 3: Junction/Relationship Tables
  4. employment_history (depends on people, companies)
  5. education_records (depends on people, institutions)
  6. military_service (depends on people)
  7. investment_relationships (depends on people, companies)
  8. board_positions (depends on people, companies)
  9. funding_rounds (depends on companies)
  10. acquisitions (depends on companies)

Phase 4: Network/Connection Tables
  11. cofounder_relationships (depends on people, companies)
  12. person_connections (depends on people)
  13. lp_prospects (depends on people)
```

### 4.4 Type Mapping: Airtable to PostgreSQL

| Airtable Type | PostgreSQL Type | Transformation Notes |
|--------------|-----------------|---------------------|
| Single line text | VARCHAR(255) | Direct copy |
| Multiline text | TEXT | Direct copy |
| Single select | VARCHAR + CHECK | Extract choice values |
| Multiple select | TEXT[] | Array transformation |
| Number (Integer) | INTEGER | Direct copy |
| Number (Currency) | BIGINT | Store as cents |
| Checkbox | BOOLEAN | Convert to true/false |
| Date | DATE | Parse YYYY-MM-DD |
| URL | VARCHAR(500) | Validate format |
| Email | VARCHAR(255) | Validate format |
| Linked Record | INTEGER FK | Resolve via airtable_id mapping |
| Multiple Linked | Junction table or TEXT[] | Depends on use case |
| Formula | Computed/VIEW | Recreate as SQL |
| Attachment | VARCHAR (URL) | Store URL reference only |

### 4.5 Handling Linked Records (Critical)

**Challenge:** Airtable linked records use record IDs, not names.

**Solution:** Two-pass migration with ID mapping.

```python
# Pseudocode
id_mapping = {}  # airtable_id -> postgresql_id

# Pass 1: Insert all records, store ID mapping
for table in migration_order:
    for record in airtable.list_records(table):
        pg_id = insert_record(table, record)
        id_mapping[record['id']] = pg_id

# Pass 2: Update foreign key references
for table in tables_with_fks:
    for record in records:
        update_fk_references(record, id_mapping)
```

---

## 5. Migration Script Design

### 5.1 Script Structure

```
scripts/
  migration/
    airtable_to_xnode3/
      __init__.py
      config.py           # Configuration and credentials
      extractor.py        # Airtable API extraction
      transformer.py      # Data transformation logic
      loader.py           # PostgreSQL loading
      validator.py        # Post-migration validation
      main.py            # Orchestration script
      kumu_exporter.py   # CSV export for Kumu compatibility
```

### 5.2 Configuration (config.py)

```python
# Environment variables required:
# AIRTABLE_API_KEY - Airtable personal access token
# XNODE3_DB_HOST - PostgreSQL host (74.50.97.243)
# XNODE3_DB_PORT - PostgreSQL port (5432)
# XNODE3_DB_NAME - Database name
# XNODE3_DB_USER - Database user
# XNODE3_DB_PASSWORD - Database password

AIRTABLE_BASE_ID = "appa39H33O8CmM01t"

TABLE_MAPPING = {
    "tbl99OI9v2ZnF7XmK": {"name": "Institutions", "pg_table": "institutions"},
    "tbluQaieDFsMztLFV": {"name": "Companies", "pg_table": "companies"},
    "tbl6ROVRtAadOLlhe": {"name": "People", "pg_table": "people"},
    "tbl7d2Vj6dYlLmktI": {"name": "Employment History", "pg_table": "employment_history"},
    "tbl48OdXbC2PcCjgh": {"name": "Education Records", "pg_table": "education_records"},
    "tbluYsfYdCKRJhu5V": {"name": "Military Service", "pg_table": "military_service"},
    "tbl1Yo8DOMJv98d4k": {"name": "Investment Relationships", "pg_table": "investment_relationships"},
    "tblIkfJksjZpiWOR0": {"name": "Board Positions", "pg_table": "board_positions"},
    "tblZMB7cWtudEETlW": {"name": "Funding Rounds", "pg_table": "funding_rounds"},
    "tbl8PKKLuxaToIpic": {"name": "Acquisitions", "pg_table": "acquisitions"},
    "tblS0fyGLHJ9hslNT": {"name": "Co-Founder Relationships", "pg_table": "cofounder_relationships"},
    "tblsC3z0LSqfEiVA3": {"name": "Person Connections", "pg_table": "person_connections"},
    "tblPH9D0sEFqrEoxh": {"name": "LP Prospects", "pg_table": "lp_prospects"},
}

MIGRATION_ORDER = [
    "tbl99OI9v2ZnF7XmK",  # institutions
    "tbluQaieDFsMztLFV",  # companies
    "tbl6ROVRtAadOLlhe",  # people
    "tbl7d2Vj6dYlLmktI",  # employment_history
    "tbl48OdXbC2PcCjgh",  # education_records
    "tbluYsfYdCKRJhu5V",  # military_service
    "tbl1Yo8DOMJv98d4k",  # investment_relationships
    "tblIkfJksjZpiWOR0",  # board_positions
    "tblZMB7cWtudEETlW",  # funding_rounds
    "tbl8PKKLuxaToIpic",  # acquisitions
    "tblS0fyGLHJ9hslNT",  # cofounder_relationships
    "tblsC3z0LSqfEiVA3",  # person_connections
    "tblPH9D0sEFqrEoxh",  # lp_prospects
]
```

### 5.3 Core Migration Logic (main.py outline)

```python
#!/usr/bin/env python3
"""
Notalone Airtable to XNode3 Migration Script

Usage:
    python main.py --mode=full     # Full migration
    python main.py --mode=validate # Validation only
    python main.py --mode=export   # Export for Kumu only
"""

import argparse
from extractor import AirtableExtractor
from transformer import DataTransformer
from loader import PostgresLoader
from validator import MigrationValidator
from kumu_exporter import KumuExporter
from config import MIGRATION_ORDER, TABLE_MAPPING

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--mode', choices=['full', 'validate', 'export'], default='full')
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()

    # Initialize components
    extractor = AirtableExtractor()
    transformer = DataTransformer()
    loader = PostgresLoader(dry_run=args.dry_run)
    validator = MigrationValidator()

    if args.mode == 'full':
        # Phase 1: Extract from Airtable
        print("Phase 1: Extracting data from Airtable...")
        raw_data = {}
        for table_id in MIGRATION_ORDER:
            table_config = TABLE_MAPPING[table_id]
            print(f"  Extracting {table_config['name']}...")
            raw_data[table_id] = extractor.extract_table(table_id)

        # Phase 2: Transform data
        print("\nPhase 2: Transforming data...")
        transformed_data, id_mapping = transformer.transform_all(raw_data)

        # Phase 3: Load to PostgreSQL
        print("\nPhase 3: Loading to PostgreSQL...")
        loader.create_schema()
        for table_id in MIGRATION_ORDER:
            table_config = TABLE_MAPPING[table_id]
            print(f"  Loading {table_config['name']}...")
            loader.load_table(table_config['pg_table'], transformed_data[table_id])

        # Phase 4: Update foreign keys
        print("\nPhase 4: Resolving foreign key references...")
        loader.update_foreign_keys(id_mapping)

        # Phase 5: Validate
        print("\nPhase 5: Validating migration...")
        validation_results = validator.validate_all(raw_data, loader)
        validator.print_report(validation_results)

    elif args.mode == 'validate':
        validator.validate_existing()

    elif args.mode == 'export':
        kumu = KumuExporter()
        kumu.export_elements()
        kumu.export_connections()
        print("Kumu export complete: database/kumu/elements.csv, connections.csv")

if __name__ == '__main__':
    main()
```

---

## 6. Superset Dashboard Design

### 6.1 Dashboard Structure

```
Notalone Superset Dashboards
|
+-- 1. LP Pipeline Dashboard (Primary)
|   +-- Pipeline Funnel Chart
|   +-- LP Prospects by Segment (Pie)
|   +-- Hot Prospects Table
|   +-- Net Worth Distribution
|   +-- Geographic Distribution Map
|
+-- 2. Network Overview Dashboard
|   +-- Entity Count Summary
|   +-- Company Stage Distribution
|   +-- Sector Breakdown
|   +-- 8200 Alumni Highlight
|   +-- Recent Exits Timeline
|
+-- 3. Company Intelligence Dashboard
|   +-- Funding by Year/Quarter
|   +-- Exit Value Distribution
|   +-- Sector Funding Comparison
|   +-- Top Companies by Funding
|   +-- Acquisition Activity
|
+-- 4. Relationship Network Dashboard
|   +-- Connection Type Distribution
|   +-- Co-founder Pairs
|   +-- Investment Network
|   +-- Most Connected People
```

### 6.2 Key Charts Configuration

**Chart 1: LP Pipeline Funnel**
```yaml
chart_type: funnel
datasource: notalone.lp_prospects
metrics:
  - COUNT(*)
dimensions:
  - status
filters:
  - status NOT IN ('Not Relevant')
sort_by:
  - CASE status
      WHEN 'Target' THEN 1
      WHEN 'Active Lead' THEN 2
      WHEN 'Hot' THEN 3
```

**Chart 2: Net Worth Distribution**
```yaml
chart_type: bar
datasource: notalone.people
metrics:
  - COUNT(*)
dimensions:
  - estimated_net_worth
filters:
  - lp_potential IN ('Hot', 'Warm')
```

**Chart 3: Sector Funding Over Time**
```yaml
chart_type: area
datasource: notalone.v_company_stats
time_column: (derived from funding_rounds)
metrics:
  - SUM(total_raised)
dimensions:
  - sector
granularity: quarter
```

### 6.3 Superset Setup Steps

1. **Connect to PostgreSQL**
   ```
   Database: postgresql://user:pass@74.50.97.243:5432/dbname
   Schema: notalone
   ```

2. **Create Datasets**
   - Add each table as a dataset
   - Add views as virtual datasets
   - Configure calculated columns

3. **Build Dashboards**
   - Create charts from datasets
   - Arrange on dashboard canvas
   - Add filters and cross-filters

4. **Set Permissions**
   - Create "Notalone" role
   - Grant access to notalone schema datasets

---

## 7. NocoDB Configuration

### 7.1 Workspace Setup

1. **Create Workspace:** "Notalone - Israeli Tech Ecosystem"
2. **Connect to PostgreSQL:**
   ```
   Connection Type: PostgreSQL
   Host: localhost (or use internal Docker network)
   Port: 5432
   Database: same as Superset
   Schema: notalone
   ```

### 7.2 Table Configuration

For each table, configure:

1. **Primary Display Field** - Most human-readable identifier
2. **Field Types** - Override detected types if needed
3. **Lookup/Rollup Fields** - Create from FK relationships
4. **Form Views** - For data entry

### 7.3 Views to Create

| Table | View Name | Type | Purpose |
|-------|-----------|------|---------|
| people | Hot LP Prospects | Grid (filtered) | Quick access to high-priority leads |
| people | 8200 Alumni | Grid (filtered) | Military network view |
| companies | Active Startups | Grid (filtered) | Current companies |
| companies | Recent Exits | Grid (filtered) | M&A opportunities |
| lp_prospects | Pipeline Kanban | Kanban | Visual pipeline management |
| employment_history | By Company | Grouped | Company-centric view |

### 7.4 Gallery Views (Photos)

Configure gallery views for tables with images:
- **People Gallery** - Display photo_url, name, role
- **Companies Gallery** - Display logo via website favicon

---

## 8. Integration Points

### 8.1 Kumu Visualization

**Current Flow (Preserved):**
```
database/kumu/elements.csv   --> Kumu.io Import
database/kumu/connections.csv --> Kumu.io Import
```

**New Flow (PostgreSQL Source):**
```
PostgreSQL (notalone schema)
         |
         v
    SQL Query Export
    (via Python script)
         |
         v
database/kumu/elements.csv   --> Kumu.io Import
database/kumu/connections.csv --> Kumu.io Import
```

**Kumu Export Script:**
```python
# kumu_exporter.py
def export_elements():
    """Export PostgreSQL data to Kumu elements.csv format"""
    query = """
    SELECT
        label,
        element_type AS "Type",
        -- additional fields as per KUMU_SETTINGS.md
    FROM notalone.v_network_elements
    """
    # Execute and write to CSV

def export_connections():
    """Export PostgreSQL data to Kumu connections.csv format"""
    query = """
    SELECT
        from_id AS "From",
        to_id AS "To",
        connection_type AS "Type"
    FROM notalone.v_network_connections
    """
    # Execute and write to CSV
```

### 8.2 Notion Integration (Future)

Existing Notion sync scripts can be adapted to:
1. Read from PostgreSQL instead of Airtable
2. Use standard SQL queries
3. Sync specific views/tables to Notion databases

### 8.3 Scheduled Sync (Optional)

If continuing to use Airtable as entry point temporarily:

```
Cron: 0 * * * *  (Hourly)
Script: sync_airtable_to_postgres.py
  - Fetch modified records since last sync
  - Upsert to PostgreSQL
  - Trigger Kumu export if changes detected
```

---

## 9. Implementation Plan

### Phase 1: Infrastructure Setup (Day 1)

| Task | Time Est. | Owner |
|------|-----------|-------|
| Create `notalone` schema in PostgreSQL | 30 min | @database |
| Execute DDL to create all tables | 30 min | @database |
| Configure NocoDB connection | 30 min | @infrastructurer |
| Configure Superset connection | 30 min | @infrastructurer |
| Verify connectivity | 30 min | All |

### Phase 2: Migration Script Development (Days 2-3)

| Task | Time Est. | Owner |
|------|-----------|-------|
| Create migration script scaffold | 1 hr | @developer |
| Implement Airtable extractor | 2 hr | @developer |
| Implement data transformer | 3 hr | @developer |
| Implement PostgreSQL loader | 2 hr | @developer |
| Implement FK resolution logic | 2 hr | @developer |
| Implement validator | 1 hr | @developer |
| Testing and debugging | 3 hr | @developer |

### Phase 3: Data Migration (Day 4)

| Task | Time Est. | Owner |
|------|-----------|-------|
| Run migration (dry run) | 30 min | @database |
| Review dry run output | 1 hr | @analyst |
| Execute full migration | 1 hr | @database |
| Validate row counts | 30 min | @analyst |
| Spot check 10% of records | 1 hr | @analyst |
| Resolve any data issues | 2 hr | @developer |

### Phase 4: UI Configuration (Days 5-6)

| Task | Time Est. | Owner |
|------|-----------|-------|
| Configure NocoDB tables | 2 hr | @ui |
| Create NocoDB views | 2 hr | @ui |
| Create NocoDB forms | 1 hr | @ui |
| Create Superset datasets | 1 hr | @analyst |
| Build LP Pipeline dashboard | 3 hr | @analyst |
| Build Network Overview dashboard | 2 hr | @analyst |
| Build Company Intelligence dashboard | 2 hr | @analyst |

### Phase 5: Integration & Testing (Day 7)

| Task | Time Est. | Owner |
|------|-----------|-------|
| Implement Kumu CSV exporter | 1 hr | @developer |
| Test Kumu import with new data | 1 hr | @tester |
| End-to-end workflow testing | 2 hr | @tester |
| Documentation update | 2 hr | @documenter |
| User acceptance testing | 2 hr | User |

### Phase 6: Parallel Operation (Days 8-14)

| Task | Duration |
|------|----------|
| Run Airtable and PostgreSQL in parallel | 1 week |
| Monitor for discrepancies | Daily |
| Collect user feedback | Ongoing |
| Fix issues as discovered | As needed |

### Phase 7: Cutover (Day 15+)

| Task | Time Est. |
|------|-----------|
| Final sync from Airtable | 1 hr |
| Disable Airtable write access | 15 min |
| Verify all users on new system | 1 hr |
| Archive Airtable export | 30 min |
| Update documentation | 1 hr |

---

## 10. Risk Mitigation

### 10.1 Data Integrity Risks

| Risk | Mitigation |
|------|------------|
| Data loss during migration | Full Airtable CSV backup before migration |
| Broken foreign key references | Two-pass migration with ID mapping table |
| Type conversion errors | Explicit type validation in transformer |
| Character encoding issues | UTF-8 throughout pipeline |

### 10.2 Rollback Strategy

```
If migration fails:
1. PostgreSQL: DROP SCHEMA notalone CASCADE;
2. Restore from Airtable (still active)
3. Debug and retry

If issues found post-migration:
1. Keep Airtable active during parallel period
2. Fix issues in PostgreSQL
3. Re-run migration if needed
```

### 10.3 Validation Checklist

- [ ] Total record count matches per table
- [ ] All foreign keys resolve to valid records
- [ ] No NULL values in NOT NULL columns
- [ ] Enum/check constraint values are valid
- [ ] Dates are in correct format
- [ ] Monetary values are correctly scaled
- [ ] Boolean values correctly converted
- [ ] Arrays correctly parsed
- [ ] Sample of 10% records manually verified
- [ ] Kumu export produces valid visualization

---

## 11. Appendix

### A. SQL DDL Script Location

Full DDL script: `/Users/eladm/Projects/Nuru-AI/Notalone/database/postgresql/schema.sql`

### B. Airtable Table IDs Reference

```
tblVwe3rO18bWLngp = s (unused?)
tbl99OI9v2ZnF7XmK = Institutions
tbluQaieDFsMztLFV = Companies
tbl6ROVRtAadOLlhe = People
tbl7d2Vj6dYlLmktI = Employment History
tbl48OdXbC2PcCjgh = Education Records
tbluYsfYdCKRJhu5V = Military Service
tbl1Yo8DOMJv98d4k = Investment Relationships
tblIkfJksjZpiWOR0 = Board Positions
tblZMB7cWtudEETlW = Funding Rounds
tbl8PKKLuxaToIpic = Acquisitions
tblS0fyGLHJ9hslNT = Co-Founder Relationships
tblsC3z0LSqfEiVA3 = Person Connections
tblPH9D0sEFqrEoxh = LP Prospects
```

### C. Environment Variables Template

```bash
# .env.migration
AIRTABLE_API_KEY=pat_xxxxxxxxxxxxx
XNODE3_DB_HOST=74.50.97.243
XNODE3_DB_PORT=5432
XNODE3_DB_NAME=notalone
XNODE3_DB_USER=notalone_user
XNODE3_DB_PASSWORD=xxxxxxxxxxxx
```

### D. Useful Commands

```bash
# Test PostgreSQL connection
psql -h 74.50.97.243 -U notalone_user -d notalone -c "SELECT 1;"

# Count records in all notalone tables
psql -h 74.50.97.243 -U notalone_user -d notalone -c "
SELECT schemaname, relname, n_live_tup
FROM pg_stat_user_tables
WHERE schemaname = 'notalone'
ORDER BY n_live_tup DESC;"

# Export Kumu files
python scripts/migration/airtable_to_xnode3/main.py --mode=export
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-11 | @architect | Initial architecture design |

---

*End of Architecture Document*
