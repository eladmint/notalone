# Database Agent Local Context - Notalone

## My Role Here
Database specialist responsible for understanding, documenting, and managing the database infrastructure for the Notalone project - an Israeli tech ecosystem intelligence and LP fundraising platform.

## My Recent Work
- 2026-01-12: **Major Funding Data Expansion** - Batches 3-5
  - Added funding for 20+ companies across 5 SQL files (011-015)
  - Notable additions: Secret Network ($400M), Bancor ($153M ICO), Utila ($51.5M), DAOStack ($31M), Colu ($26.6M), Lava Network ($26M), Dynamic ($21M acquired by Fireblocks), Efficient Frontier ($12M), Odsy Network ($12.5M)
  - **New totals:** 184 companies, 123 funding rounds, 1,294 network edges, 327 unique sources
  - SQL files: 011-015 (major_company_funding, additional_funding_batch2-5)
- 2026-01-12: **Collider DB Import** - Added 34 new Israeli Web3 companies
  - Created `scripts/import_collider_companies.py` - reusable parser for Collider DB markdown
  - Imported notable companies: eToro, Solidus Labs, Ingonyama, Fhenix, Venn, Chain Reaction, GK8, DeepDAO, Portis
  - Added 10 funding rounds for notable companies (eToro $350M, Solidus Labs $45M, etc.)
  - SQL files: 009_import_collider_companies.sql, 010_notable_company_funding.sql
- 2026-01-12: Fixed Chart 173 "Web3: Founded by Year" - was failing on Dashboard 20
  - Root cause: Chart used simple string metric reference `"count"` instead of inline adhoc metric structure
  - Solution: Updated params to use inline adhoc metric: `{"expressionType":"SIMPLE","column":{"column_name":"id"},"aggregate":"COUNT"}`
  - Also fixed column configs in dataset 65: `id` was incorrectly marked as datetime (is_dttm=1) but is UUID
  - Chart now displays bar chart with 11 data points (years 2012-2023, 77 total companies)
- 2026-01-12: **Major Network Graph Expansion** - 906 edges (up from 34)
  - Added colleague connections via overlapping employment tenure
  - Added Person→Company edges (Founded, Works At, Invested In, Board)
  - Added investor syndicate network (VC↔VC co-investment, VC→Company)
  - Imported 58 new funding rounds + 10 notable company rounds (91 total)
  - Created new views: v_colleague_connections, v_investor_syndicate, v_network_graph_full
  - Dataset 66 now points to v_network_graph_full
- 2026-01-12: Fixed Chart 179 "Israeli Tech Network Graph" - was showing blank
  - Root cause: ECharts graph_chart requires a valid metric, not just removing the broken one
  - Solution: Set `"metric": "count"` using the registered COUNT(*) metric from dataset 66
- 2026-01-12: Fixed Superset Dashboard 20 charts (167, 168, 169, 171, 172, 173, 177)
  - Added 18 missing columns to dataset 65 (v_web3_companies)
  - Added "count" metric to dataset 65
  - Fixed chart metrics configurations
- 2026-01-11: Initial exploration and comprehensive documentation of database structure
- 2026-01-11: Designed complete PostgreSQL schema for XNode3 migration from Airtable
  - Created 13 core tables with proper relationships
  - Designed 35+ custom ENUM types for data integrity
  - Built 60+ indexes for network analysis and timeline queries
  - Created 8 materialized views for Superset dashboards
  - Documented Airtable-to-PostgreSQL type mapping
- 2026-01-11: Migration infrastructure setup complete
  - **Exported all 581 records** from Airtable to JSON backup files
  - Created Python migration script with dry-run capability
  - Created deployment guide for XNode3 PostgreSQL setup
  - Ready for NocoDB and Superset configuration

## Project Database Overview

### Primary Database: Airtable
**Base Name:** Israeli Tech Ecosystem
**Base ID:** `appa39H33O8CmM01t`
**Purpose:** Track talent flow, company relationships, and LP prospects in Israeli tech ecosystem

### Target Infrastructure: XNode3
**Server:** 74.50.97.243
**Database:** calendar_monitoring
**Schema:** notalone

| Tool | Port | Purpose |
|------|------|---------|
| PostgreSQL | 5432 | Primary database |
| NocoDB | 8080 | Spreadsheet interface |
| Superset | 8088 | Dashboards & analytics |

### Migration Status: READY TO DEPLOY
- Schema file: `/database/sql/001_create_schema.sql`
- Migration script: `/scripts/migrate_airtable_to_postgres.py`
- Backup files: `/database/airtable-backup/` (581 records)
- Deployment guide: `/database/DEPLOYMENT_GUIDE.md`

### Secondary Integration: Notion
- Used for deal flow management and documentation
- Note: Notion API creates "data sources" (synced databases) rather than native databases in this workspace
- Manual database creation required for schema modifications

### Visualization Layer: Kumu.io
- Network visualization for the ecosystem
- Uses exported CSV data from Airtable
- Located in `/Users/eladm/Projects/Nuru-AI/Notalone/database/kumu/`

---

## Airtable Schema (15 Tables)

### Core Entity Tables

| Table | ID | Purpose | Records |
|-------|-----|---------|---------|
| People | `tbl6ROVRtAadOLlhe` | Founders, executives, investors, advisors | 33+ |
| Companies | `tbluQaieDFsMztLFV` | Startups, corporations, funds, accelerators | 28+ |
| Institutions | `tbl99OI9v2ZnF7XmK` | Universities, military units, accelerators | 16 |

### Junction/Relationship Tables

| Table | ID | Purpose |
|-------|-----|---------|
| Employment History | `tbl7d2Vj6dYlLmktI` | Who worked where, when |
| Education Records | `tbl48OdXbC2PcCjgh` | Academic history |
| Military Service | `tbluYsfYdCKRJhu5V` | IDF service records |
| Investment Relationships | `tbl1Yo8DOMJv98d4k` | Angel/VC investments |
| Board Positions | `tblIkfJksjZpiWOR0` | Board memberships |
| Funding Rounds | `tblZMB7cWtudEETlW` | Company fundraising |
| Acquisitions | `tbl8PKKLuxaToIpic` | M&A activity |
| Co-Founder Relationships | `tblS0fyGLHJ9hslNT` | Founder pairs |
| Person Connections | `tblsC3z0LSqfEiVA3` | Network edges |

### LP Fundraising Table

| Table | ID | Purpose |
|-------|-----|---------|
| LP Prospects | `tblPH9D0sEFqrEoxh` | LP fundraising pipeline |

---

## Key Relationships Diagram

```
                                    +-------------+
                                    |   PEOPLE    |
                                    +------+------+
                                           |
         +-------------+-------------+-----+-----+-------------+
         |             |             |           |             |
         v             v             v           v             v
+---------------+ +-------------+ +-------------+ +-------------+ +-------------+
| Employment    | | Education   | | Military    | | Investment  | | Board       |
| History       | | Records     | | Service     | | Relations   | | Positions   |
+-------+-------+ +------+------+ +------+------+ +------+------+ +------+------+
        |                |               |               |               |
        v                v               v               |               |
+-------------+ +-------------+ +-------------+          |               |
|  COMPANIES  | |INSTITUTIONS | |INSTITUTIONS |          |               |
|             | |(Universities)| |  (Military) |          |               |
+------+------+ +-------------+ +-------------+          |               |
       |                                                 |               |
       +-------------------+-----------------------------+---------------+
       |
       v
+-------------+     +-------------+     +-------------+
|   Funding   |     |Acquisitions |     | LP Prospects|
|   Rounds    |     |             |     |             |
+-------------+     +-------------+     +-------------+
```

---

## Key Fields by Table

### People Table
- **Primary Key:** Name (text)
- **Key Fields:** Current Role, Current Company (linked), Primary Type, Is 8200 Alumni, LP Potential, LP Segment, Estimated Net Worth, Location
- **Views:** Hot LP Prospects, Exit Millionaires, Crypto OGs

### Companies Table
- **Primary Key:** Company Name (text)
- **Key Fields:** Founded Year, Company Type, Stage, Status, Sector, Technologies, Total Raised, Exit Value, Exit Type
- **Views:** Active Startups, Successful Exits, Crypto/Web3

### Employment History Table
- **Key Fields:** Person (linked), Company (linked), Role, Start Date, End Date, Is Founder, Is Current
- **Views:** Modu Alumni

---

## Data Import Order
When setting up, tables must be created in this order (for relationships):

1. Institutions
2. Companies
3. People
4. Employment History
5. Education Records
6. Military Service
7. Investment Relationships
8. Board Positions
9. Funding Rounds
10. Acquisitions
11. Co-Founder Relationships
12. Person Connections
13. LP Prospects

---

## LP Prospect Segments

| Segment | Description | Priority |
|---------|-------------|----------|
| Hot Leads | Ready for outreach | Tier 1 |
| Warm Leads | Need warming | Tier 2-3 |
| Connectors | For amplification | Network |
| Exit Millionaire | Recent liquidity | High Value |
| Crypto OG | Web3 native | Aligned |
| Frustrated Allocator | Seeking access | Motivated |
| Crypto Curious Traditional | Interested VCs | Convert |

---

## File Locations

### CSV Data Files
`/Users/eladm/Projects/Nuru-AI/Notalone/database/csv/`
- 01_institutions.csv
- 02_companies.csv
- 03_people.csv
- 04_employment_history.csv
- 05_education_records.csv
- 06_military_service.csv
- 07_investment_relationships.csv
- 08_board_positions.csv
- 09_funding_rounds.csv
- 10_acquisitions.csv
- 11_cofounder_relationships.csv
- 12_person_connections.csv
- 13_lp_prospects.csv

### Kumu Visualization Files
`/Users/eladm/Projects/Nuru-AI/Notalone/database/kumu/`
- elements.csv (nodes: people, companies, institutions)
- connections.csv (edges: relationships)
- KUMU_SETTINGS.md (styling configuration)

### Schema Documentation
- `/Users/eladm/Projects/Nuru-AI/Notalone/database/AIRTABLE_SCHEMA_SPEC.md` - Full schema specification
- `/Users/eladm/Projects/Nuru-AI/Notalone/database/AIRTABLE_SETUP_GUIDE.md` - Setup instructions

### Airtable Backup Files (JSON)
`/Users/eladm/Projects/Nuru-AI/Notalone/database/airtable-backup/`
| File | Records |
|------|---------|
| institutions.json | 17 |
| companies.json | 150 |
| people.json | 200 |
| employment_history.json | 78 |
| education_records.json | 14 |
| military_service.json | 11 |
| investment_relationships.json | 11 |
| board_positions.json | 8 |
| funding_rounds.json | 26 |
| acquisitions.json | 16 |
| cofounder_relationships.json | 18 |
| person_connections.json | 16 |
| lp_prospects.json | 16 |

### PostgreSQL Schema & Migration
- `/Users/eladm/Projects/Nuru-AI/Notalone/database/sql/001_create_schema.sql` - Main schema
- `/Users/eladm/Projects/Nuru-AI/Notalone/scripts/migrate_airtable_to_postgres.py` - Migration script
- `/Users/eladm/Projects/Nuru-AI/Notalone/database/DEPLOYMENT_GUIDE.md` - Deployment instructions

---

## Patterns I Use Here

### Airtable API Access
- Use MCP Airtable tools: `mcp__airtable__*`
- Base ID for Israeli Tech Ecosystem: `appa39H33O8CmM01t`
- Tables accessible via table name or ID

### Data Integrity Patterns
- Employment History is the critical junction table for talent flow analysis
- Person-Company relationships tracked through multiple tables (employment, investment, board)
- Military service (especially 8200) is key differentiator in Israeli tech

### Query Patterns
- LP Prospects filtered by: LP Potential (Hot/Warm/Cold), LP Segment, Estimated Net Worth
- Companies filtered by: Status (Active/Acquired), Sector (Crypto/Web3, Cybersecurity)
- People connected through: Employment History, Military Service, Education

---

## Project-Specific Knowledge

### Tech Stack
- **Database:** Airtable (primary), Notion (deal flow)
- **Visualization:** Kumu.io
- **Scripting:** Node.js with @notionhq/client
- **Export Format:** CSV for portability

### Key Israeli Tech Insights Encoded in Data
- "Modu Effect" - Failed startup that spawned 12+ successful companies
- "8200 Origin" - Unit 8200 alumni network (80% of cyber founders)
- "Check Point Mafia" - Original cyber company spawned ecosystem
- Serial founders tracked through Employment History patterns

### Ecosystem Focus Areas
- Cybersecurity (Check Point, Wiz, CyberArk, Palo Alto Networks)
- Crypto/Web3 (StarkWare, Fireblocks, Zengo, Blockaid)
- MPC Technology (Curv, Unbound, Fordefi)

---

## My Current Focus
- [x] Document complete database structure
- [x] Design PostgreSQL schema for XNode3 migration
- [x] Create materialized views for Superset dashboards
- [x] Export Airtable data to JSON backup (581 records)
- [x] Create migration script with dry-run
- [x] Create deployment guide
- [x] Deploy schema to XNode3 PostgreSQL (completed 2026-01-11)
- [x] Import 523 records from Airtable backup
- [x] Create network graph views for Superset ECharts (completed 2026-01-11)
- [ ] Configure NocoDB workspace connection (requires SSH tunnel)
- [x] Configure Superset datasets and dashboards (completed 2026-01-11)
- [x] Add network graph chart to Dashboard 18 (Chart ID: 179, completed 2026-01-11)

## Network Graph Views (Updated 2026-01-12)

### Current Architecture

The network graph uses a layered view architecture culminating in `v_network_graph_full`:

| View | Purpose | Edges |
|------|---------|-------|
| `v_network_graph_edges` | Base person-person edges | 108 |
| `v_colleague_connections` | Colleagues via overlapping employment | 27 |
| `v_network_graph_company_edges` | Person→Company relationships | 70 |
| `v_investor_syndicate` | VC↔VC and VC→Company edges | 728 |
| `v_network_graph_combined` | Person + Company edges | 178 |
| **`v_network_graph_full`** | **All edges combined** | **906** |

### Current Statistics (2026-01-12)
- **Total Edges:** 1,294
- **Unique Sources:** 327
- **Unique Targets:** ~300
- **Funding Rounds:** 123
- **Companies:** 184

### Edge Categories by Count

| Graph Type | Category | Edges |
|------------|----------|-------|
| investor-syndicate | Co-Invested (VC↔VC) | 453 |
| investor-syndicate | Co-Investor (VC→Company) | 195 |
| investor-syndicate | Lead Investor (VC→Company) | 80 |
| person-company | Founded | 47 |
| person-person | Investor-Founder | 28 |
| person-person | Colleague | 27 |
| person-person | Military Cohort | 20 |
| person-person | Co-Founder | 19 |
| person-company | Invested In | 10 |
| person-company | Works At | 6 |
| person-person | Other (Investor, Professional, Military, Academic) | 14 |
| person-company | Board positions | 5 |

### SQL Files

| File | Purpose |
|------|---------|
| `004_network_graph_view.sql` | Base person-person edges view |
| `005_person_company_edges.sql` | Person→Company edges + combined view |
| `006_colleague_connections.sql` | Colleague detection via employment overlap |
| `007_investor_syndicate.sql` | VC syndicate network + full combined view |
| `008_additional_funding_rounds.sql` | 58 additional funding rounds import |
| `009_import_collider_companies.sql` | 34 companies from Collider DB |
| `010_notable_company_funding.sql` | 10 funding rounds for notable companies |
| `011_major_company_funding.sql` | Fireblocks, StarkWare, ZenGo, Blockaid, etc. |
| `012_additional_funding_batch2.sql` | Kaspa, Dymension, SSV Network, Ownera, etc. |
| `013_additional_funding_batch3.sql` | Secret Network, Bancor, Lava Network, Utila, Dynamic |
| `014_additional_funding_batch4.sql` | DAOStack, Colu, Beam, Chromia, Bit2C |
| `015_additional_funding_batch5.sql` | Efficient Frontier, Lightblocks, Crowdsense, Odsy Network |

**Documentation:**
- `/Users/eladm/Projects/Nuru-AI/Notalone/database/SUPERSET_NETWORK_GRAPH_SETUP.md`
- `/Users/eladm/Projects/Nuru-AI/Notalone/database/sql/README.md`

## Superset ECharts Graph Chart (Updated 2026-01-12)

**Chart ID:** 179
**Chart Name:** Israeli Tech Network Graph
**Dashboard ID:** 18 (Notalone - 8200 Network & People)
**Dataset ID:** 66 (notalone.v_network_graph_full)

**URLs:**
- Chart: http://74.50.97.243:8088/explore/?slice_id=179
- Dashboard: http://74.50.97.243:8088/superset/dashboard/18/

**Current Data (2026-01-12):**
- **906 edges** across 19 categories
- **220 unique sources** (people, companies, VCs)
- **219 unique targets**

**Configuration:**
- Source: source column
- Target: target column
- Category: category column (for node coloring)
- Metric: count
- Layout: Force-directed
- Roam: Enabled (zoom/pan)
- Draggable: Enabled (move nodes)

**Chart Configuration:**
```json
{
  "datasource": "66__table",
  "viz_type": "graph_chart",
  "source": "source",
  "target": "target",
  "source_category": "category",
  "metric": "count",
  "layout": "force",
  "roam": true,
  "draggable": true,
  "repulsion": 500,
  "gravity": 0.3,
  "edge_length": 200,
  "row_limit": 1000,
  "show_legend": true,
  "legend_orientation": "top"
}
```

## Superset Dataset 65 Fix (2026-01-12)

**Issue:** Charts 167, 168, 169, 171, 172, 173, 177 in Dashboard 20 (Israel Web3 Ecosystem) were failing.

**Root Causes:**
1. Dataset 65 (notalone.v_web3_companies) only had 11 columns registered, but the PostgreSQL view has 29 columns
2. Charts had empty `metrics` arrays - they need the "count" metric to work
3. No metrics were defined for the dataset

**Fix Applied:**
1. Added 18 missing columns to dataset 65 in Superset SQLite
2. Added "count" metric (COUNT(*)) to dataset 65
3. Updated charts 167, 168, 171, 172 to use the "count" metric
4. Updated chart 169 with SUM(total_raised_usd) adhoc metric
5. Updated chart 177 (table) with all_columns and query_mode: raw

**Fix Scripts:**
- `/Users/eladm/Projects/Nuru-AI/Notalone/scripts/fix-superset-dataset-65.py` - Adds missing columns/metrics
- `/Users/eladm/Projects/Nuru-AI/Notalone/scripts/fix-chart-metrics.py` - Fixes chart metrics
- `/Users/eladm/Projects/Nuru-AI/Notalone/scripts/fix-all-charts.py` - Comprehensive chart fix

**Verification:**
- Dataset 65 now has 29 columns (was 11)
- Dataset 65 now has 1 metric: count = COUNT(*)
- All charts have proper metrics configured
- PostgreSQL view returns 123 rows correctly

**Dashboard URL:** http://74.50.97.243:8088/superset/dashboard/20/

### Timestamp Parsing Fix (2026-01-12) - RESOLVED

**Issue:** Charts 167-177 using dataset 65 returned HTTP 500 "DB engine Error"
**Root Cause:** ISO 8601 timestamps with "T" separator (e.g., `2026-01-12T07:47:56.203719`) in Superset's SQLite metadata tables. Superset's SQLAlchemy ORM couldn't parse these.

**Affected Tables:**
- `table_columns`: 18 rows with T-format timestamps
- `sql_metrics`: 1 row with T-format timestamps

**Fix Applied:**
```sql
UPDATE table_columns
SET created_on = REPLACE(SUBSTR(created_on, 1, 19), "T", " "),
    changed_on = REPLACE(SUBSTR(changed_on, 1, 19), "T", " ")
WHERE created_on LIKE "%T%" OR changed_on LIKE "%T%";

UPDATE sql_metrics
SET created_on = REPLACE(SUBSTR(created_on, 1, 19), "T", " "),
    changed_on = REPLACE(SUBSTR(changed_on, 1, 19), "T", " ")
WHERE created_on LIKE "%T%" OR changed_on LIKE "%T%";
```

**Prevention:** When adding columns/metrics to Superset SQLite programmatically, use format `YYYY-MM-DD HH:MM:SS` not ISO 8601 with "T".

---

## Migration Status: COMPLETE

**Date:** 2026-01-11
**Total Records Imported:** 523 (from 581 Airtable records)

### Connection Details
```bash
# SSH command to access PostgreSQL
ssh eladm@74.50.97.243 "sudo nixos-container run events-hive -- psql -h /var/run/postgresql -p 5433 -U postgres -d calendar_monitoring"

# Set search path
SET search_path TO notalone, public;
```

### Import Results
- institutions: 17/17
- companies: 150/150
- people: 200/200
- employment_history: 31/78 (partial - FK constraints)
- education_records: 14/14
- military_service: 8/11 (partial)
- investment_relationships: 11/11
- board_positions: 8/8
- funding_rounds: 23/26 (partial)
- acquisitions: 11/16 (partial)
- cofounder_relationships: 18/18
- person_connections: 16/16
- lp_prospects: 16/16

---

## Notes for Other Agents

### For @notionmanager
- Notion databases in this workspace become "data sources" via API
- Manual creation required for schema changes
- See `/Users/eladm/Projects/Nuru-AI/Notalone/MANUAL_DATABASE_SETUP_GUIDE.md`

### For @analyst
- Talent flow queries: use Employment History with Company links
- Network analysis: use Person Connections and Co-Founder Relationships
- LP pipeline: use LP Prospects with Person links

### For @researcher
- Primary data source for Israeli tech ecosystem intelligence
- Kumu exports provide network visualization data
- CSV files can be used for external analysis tools
