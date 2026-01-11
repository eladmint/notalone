# Notalone Database Deployment Guide

## Target Infrastructure

- **Server:** XNode3 (74.50.97.243)
- **Database:** calendar_monitoring
- **Schema:** notalone
- **PostgreSQL Port:** 5433 (inside events-hive container)

## Deployment Status: COMPLETE

**Migration Date:** 2026-01-11

### Successfully Migrated Data

| Table | Records | Source |
|-------|---------|--------|
| institutions | 17 | 17 |
| companies | 150 | 150 |
| people | 369 | 369 |
| employment_history | 55 | 78 |
| education_records | 14 | 14 |
| military_service | 11 | 11 |
| investment_relationships | 11 | 11 |
| board_positions | 8 | 8 |
| funding_rounds | 23 | 26 |
| acquisitions | 11 | 16 |
| cofounder_relationships | 18 | 18 |
| person_connections | 16 | 16 |
| lp_prospects | 16 | 16 |

**Total: 719 records in PostgreSQL** (from 750 Airtable source records)

## Accessing the Database

### From Local Machine (via SSH)
```bash
ssh eladm@74.50.97.243 "sudo nixos-container run events-hive -- psql -h /var/run/postgresql -p 5433 -U postgres -d calendar_monitoring"
```

### Set Search Path
```sql
SET search_path TO notalone, public;
```

### From Inside XNode3
```bash
# SSH to XNode3
ssh eladm@74.50.97.243

# Enter container and connect to PostgreSQL
sudo nixos-container run events-hive -- psql -h /var/run/postgresql -p 5433 -U postgres -d calendar_monitoring
```

## NocoDB Setup

NocoDB is running on XNode3 port 8080 (inside container).

### Access via SSH Tunnel
```bash
# Create SSH tunnel
ssh -L 8080:localhost:8080 eladm@74.50.97.243

# Then access in browser: http://localhost:8080
```

### Configure NocoDB Connection
1. Open NocoDB dashboard
2. Create new workspace: "Notalone"
3. Connect to PostgreSQL:
   - Host: `localhost`
   - Port: `5433`
   - Database: `calendar_monitoring`
   - User: `postgres`
   - Schema: `notalone`

## Superset Setup

Superset is accessible at: http://74.50.97.243:8088

### Configure Superset Database Connection
1. Login to Superset
2. Settings > Database Connections > + Database
3. SQLAlchemy URI: `postgresql://postgres:password@localhost:5433/calendar_monitoring`
4. Advanced settings:
   - Extra: `{"schemas_allowed_for_file_upload": ["notalone"]}`

### Suggested Dashboards
- **LP Pipeline Tracker** - LP prospects by segment, warmth, priority
- **Israeli Tech Network Map** - Person connections, co-founders
- **Talent Flow Analysis** - Employment history, company transitions
- **Exit Value Tracker** - Acquisitions, funding rounds

## Verification Queries

```sql
-- Check all record counts
SELECT 'institutions' as t, COUNT(*) FROM notalone.notalone_institutions UNION ALL
SELECT 'companies', COUNT(*) FROM notalone.notalone_companies UNION ALL
SELECT 'people', COUNT(*) FROM notalone.notalone_people UNION ALL
SELECT 'employment_history', COUNT(*) FROM notalone.notalone_employment_history UNION ALL
SELECT 'lp_prospects', COUNT(*) FROM notalone.notalone_lp_prospects;

-- Check 8200 alumni
SELECT COUNT(*) FROM notalone.notalone_people WHERE is_8200_alumni = TRUE;

-- Check LP pipeline by status
SELECT status, COUNT(*)
FROM notalone.notalone_lp_prospects
GROUP BY status;

-- Check funding by company
SELECT c.company_name, SUM(f.amount_raised_usd)/100 as total_raised_usd
FROM notalone.notalone_funding_rounds f
JOIN notalone.notalone_companies c ON f.company_id = c.id
GROUP BY c.company_name
ORDER BY total_raised_usd DESC
LIMIT 10;
```

## Backup & Recovery

### JSON Backups
Location: `database/airtable-backup/`
- All 13 tables exported from Airtable
- Total: 581 original records
- Format: Raw Airtable JSON with record IDs

### Re-import from Backup
```bash
# Regenerate SQL from JSON backups
python scripts/import_data.py > /tmp/notalone_import.sql

# Run import
cat /tmp/notalone_import.sql | ssh eladm@74.50.97.243 "sudo nixos-container run events-hive -- psql -h /var/run/postgresql -p 5433 -U postgres -d calendar_monitoring"
```

## Schema Documentation

- **Schema file:** `database/sql/001_create_schema.sql`
- **Import script:** `scripts/import_data.py`
- **Full schema spec:** `database/AIRTABLE_SCHEMA_SPEC.md`

## Key Technical Details

### ENUM Types (28 custom types)
- `company_stage`, `company_status`, `company_type`
- `person_type`, `current_role_type`, `lp_segment`
- `connection_type`, `connection_strength`
- And 20 more...

### Indexes (103 total)
- Primary keys (UUID)
- Airtable ID lookups
- Alumni flags (8200, Talpiot, Technion)
- Timeline analysis indexes
- Full-text search on tags
