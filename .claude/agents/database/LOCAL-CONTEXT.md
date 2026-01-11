# Database Agent Local Context - Notalone

## My Role Here
Database specialist responsible for understanding, documenting, and managing the database infrastructure for the Notalone project - an Israeli tech ecosystem intelligence and LP fundraising platform.

## My Recent Work
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
- [ ] Configure NocoDB workspace connection (requires SSH tunnel)
- [ ] Configure Superset datasets and dashboards

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
