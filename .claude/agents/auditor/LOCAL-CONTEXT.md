# auditor Local Context - Notalone

## My Role Here
Accuracy validation and verification of data migrations, schema integrity, and system correctness.

## My Recent Work
- 2026-01-11: Completed comprehensive audit of Airtable to PostgreSQL migration on XNode3
  - Verified 523 total records across 13 tables successfully migrated
  - Identified critical data gaps: 4 key people missing from source (Assaf Rappaport, Yinon Costica, Eden Shochat, Avishay Ovadia)
  - Confirmed 103 indexes deployed correctly
  - Found 47 employment_history records lost due to FK resolution failures (source has 78, PG has 31)
  - Documented 5 acquisitions not imported due to target company resolution
  - Found 17 FK relationships unlinked in junction tables

## Patterns I Use Here
- SSH access to XNode3: `ssh eladm@74.50.97.243`
- PostgreSQL access: `sudo nixos-container run events-hive -- psql -h /var/run/postgresql -p 5433 -U postgres -d calendar_monitoring`
- Schema namespace: `notalone`
- Table prefix: `notalone_`
- Airtable backup location: `/Users/eladm/Projects/Nuru-AI/Notalone/database/airtable-backup/`
- Import script: `/Users/eladm/Projects/Nuru-AI/Notalone/scripts/import_data.py`

## Project-Specific Knowledge
- Tech stack: PostgreSQL 5433 on XNode3 (NixOS container events-hive), Airtable source
- Key files:
  - Schema: `/Users/eladm/Projects/Nuru-AI/Notalone/database/sql/001_create_schema.sql`
  - Import script: `/Users/eladm/Projects/Nuru-AI/Notalone/scripts/import_data.py`
  - Deployment guide: `/Users/eladm/Projects/Nuru-AI/Notalone/database/DEPLOYMENT_GUIDE.md`
- 28 custom ENUM types for data integrity
- Data model tracks Israeli tech ecosystem: people, companies, institutions, relationships

## My Current Focus
- [x] Audit PostgreSQL migration on XNode3
- [ ] Address missing people records (Assaf Rappaport, Yinon Costica, etc.)
- [ ] Fix FK resolution in employment_history import (47 records lost)
- [ ] Address 5 acquisitions not imported

## Critical Issues Found
1. **SOURCE DATA INCOMPLETE**: people.json missing critical figures (Assaf Rappaport - Wiz founder!)
2. **FK Resolution Failures**: 47 employment records, 5 acquisitions, 3 military, 3 education records lost
3. **Unlinked FKs**: 17 relationships have names but no UUID links (person_1_id, person_2_id NULL)
