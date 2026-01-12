# architect Local Context - Notalone

## My Role Here
System architecture design for Notalone fund operations, including database design, infrastructure planning, and data migration strategies.

## My Recent Work
- 2026-01-11: Designed comprehensive migration architecture from Airtable to XNode3 PostgreSQL
  - Created full architecture document: `/Users/eladm/Projects/Nuru-AI/Notalone/docs/XNODE3_MIGRATION_ARCHITECTURE.md`
  - Created PostgreSQL schema DDL: `/Users/eladm/Projects/Nuru-AI/Notalone/database/postgresql/schema.sql`
  - Mapped 13 Airtable tables to PostgreSQL with proper foreign keys
  - Designed views for Kumu network visualization export
  - Planned Superset dashboard structure for LP pipeline

## Patterns I Use Here
- **Schema namespacing**: Use `notalone` schema to isolate from `events_hive` on XNode3
- **Airtable ID preservation**: Store `airtable_id` column for traceability during migration
- **Currency storage**: Store monetary values as BIGINT (cents) not DECIMAL
- **FK resolution**: Two-pass migration pattern with ID mapping table
- **View-based exports**: SQL views for Kumu elements.csv and connections.csv generation

## Project-Specific Knowledge
- **Tech stack**:
  - Source: Airtable base `appa39H33O8CmM01t` (Israeli Tech Ecosystem)
  - Target: PostgreSQL on XNode3 (74.50.97.243)
  - Dashboards: Apache Superset (port 8088)
  - Spreadsheet UI: NocoDB (port 8080)
  - Visualization: Kumu.io (via CSV export)
- **Key files**:
  - Schema spec: `/Users/eladm/Projects/Nuru-AI/Notalone/database/AIRTABLE_SCHEMA_SPEC.md`
  - Kumu settings: `/Users/eladm/Projects/Nuru-AI/Notalone/database/kumu/KUMU_SETTINGS.md`
  - CSV exports: `/Users/eladm/Projects/Nuru-AI/Notalone/database/csv/`
  - PostgreSQL DDL: `/Users/eladm/Projects/Nuru-AI/Notalone/database/postgresql/schema.sql`
  - Migration architecture: `/Users/eladm/Projects/Nuru-AI/Notalone/docs/XNODE3_MIGRATION_ARCHITECTURE.md`
- **Airtable table IDs** (most important):
  - `tbl6ROVRtAadOLlhe` = People (~140 records)
  - `tbluQaieDFsMztLFV` = Companies (~70 records)
  - `tbl99OI9v2ZnF7XmK` = Institutions (~15 records)
  - `tblPH9D0sEFqrEoxh` = LP Prospects (pipeline table)
- **Existing project on XNode3**: Events Hive (9 tables, 7 dashboards) - do not conflict

## My Current Focus
- [ ] Migration script implementation (Python) - next step
- [ ] Superset dashboard creation after data migration
- [ ] NocoDB workspace configuration
- [ ] Incremental sync design (if Airtable stays as input)

## Architecture Decisions Made
1. **Separate schema**: `notalone` instead of table prefix to cleanly isolate from Events Hive
2. **Preserve Airtable IDs**: Every table has `airtable_id` column for rollback/traceability
3. **Views for Kumu**: Create `v_network_elements` and `v_network_connections` views that match existing CSV format
4. **Check constraints**: Use PostgreSQL CHECK constraints to enforce enum values from Airtable select fields
5. **Array types**: Use TEXT[] for Airtable multi-select fields instead of junction tables (simpler for ~200 records)
