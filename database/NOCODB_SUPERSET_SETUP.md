# NocoDB and Superset Setup Guide

## Quick Start

### Access URLs
- **NocoDB:** http://localhost:8080 (via SSH tunnel)
- **Superset:** http://74.50.97.243:8088

### SSH Tunnel for NocoDB
```bash
ssh -L 8080:localhost:8080 eladm@74.50.97.243
# Then open http://localhost:8080 in browser
```

---

## NocoDB Setup

### 1. Create External Database Connection

In NocoDB dashboard:
1. Click **"New Base"** or **"Create Base"**
2. Select **"Connect to External Database"**
3. Choose **PostgreSQL**

### 2. Connection Details

| Field | Value |
|-------|-------|
| Host | `localhost` |
| Port | `5433` |
| Database | `calendar_monitoring` |
| User | `postgres` |
| Password | *(your postgres password)* |
| Schema | `notalone` |

### 3. Import Tables

After connecting, NocoDB will discover all 14 tables:
- notalone_institutions
- notalone_companies
- notalone_people
- notalone_employment_history
- notalone_education_records
- notalone_military_service
- notalone_investment_relationships
- notalone_board_positions
- notalone_funding_rounds
- notalone_acquisitions
- notalone_cofounder_relationships
- notalone_person_connections
- notalone_lp_prospects
- notalone_interactions_log

### 4. Configure Views

Create these views for common use cases:

**LP Pipeline View**
- Table: `notalone_lp_prospects`
- Group by: `segment`, `status`
- Sort by: `priority_tier`

**People Directory View**
- Table: `notalone_people`
- Filter: `is_8200_alumni = true`
- Show: name, person_current_role, location

**Company Tracker View**
- Table: `notalone_companies`
- Group by: `stage`
- Sort by: `total_raised_usd` DESC

---

## Superset Setup

### 1. Add Database Connection

1. Login to Superset at http://74.50.97.243:8088
2. Go to **Settings** (gear icon) > **Database Connections**
3. Click **+ Database**
4. Select **PostgreSQL**

### 2. Connection Details

**SQLAlchemy URI:**
```
postgresql://postgres:PASSWORD@localhost:5433/calendar_monitoring
```

**Display Name:** `Notalone - Israeli Tech Ecosystem`

**Advanced Settings:**
```json
{
  "schemas_allowed_for_file_upload": ["notalone"],
  "metadata_params": {},
  "engine_params": {
    "connect_args": {
      "options": "-csearch_path=notalone"
    }
  }
}
```

### 3. Create Datasets

After connecting, create datasets for each table:

| Dataset Name | Table | Use Case |
|--------------|-------|----------|
| People | notalone_people | Network analysis |
| Companies | notalone_companies | Portfolio tracking |
| LP Prospects | notalone_lp_prospects | Fundraising pipeline |
| Employment | notalone_employment_history | Talent flow |
| Funding Rounds | notalone_funding_rounds | Market analysis |

### 4. Suggested Charts

**LP Pipeline Funnel**
```sql
SELECT status, COUNT(*) as count
FROM notalone.notalone_lp_prospects
GROUP BY status
ORDER BY
  CASE status
    WHEN 'Target' THEN 1
    WHEN 'Contacted' THEN 2
    WHEN 'Meeting Scheduled' THEN 3
    WHEN 'In Discussion' THEN 4
    WHEN 'Committed' THEN 5
  END
```

**8200 Alumni by Company Stage**
```sql
SELECT c.stage, COUNT(DISTINCT p.id) as alumni_count
FROM notalone.notalone_people p
JOIN notalone.notalone_employment_history e ON e.person_id = p.id
JOIN notalone.notalone_companies c ON e.company_id = c.id
WHERE p.is_8200_alumni = true
GROUP BY c.stage
ORDER BY alumni_count DESC
```

**Top Funded Companies**
```sql
SELECT
  c.company_name,
  c.stage,
  SUM(f.amount_raised_usd)/100 as total_raised_usd
FROM notalone.notalone_funding_rounds f
JOIN notalone.notalone_companies c ON f.company_id = c.id
GROUP BY c.id, c.company_name, c.stage
ORDER BY total_raised_usd DESC
LIMIT 20
```

**Network Density by Connection Type**
```sql
SELECT
  connection_type,
  COUNT(*) as connections,
  COUNT(DISTINCT person_1_id) + COUNT(DISTINCT person_2_id) as unique_people
FROM notalone.notalone_person_connections
GROUP BY connection_type
```

### 5. Dashboard Layout

Create a dashboard with these components:

1. **Header Row**
   - Total People: 369
   - Total Companies: 150
   - LP Prospects: 16

2. **Charts Row**
   - LP Pipeline Funnel (bar chart)
   - Companies by Stage (pie chart)

3. **Tables Row**
   - Top 10 LP Prospects (table)
   - Recent Funding Rounds (table)

4. **Network Row**
   - 8200 Alumni Distribution (bar chart)
   - Connection Type Breakdown (pie chart)

---

## Verification Queries

Run these in Superset SQL Lab to verify data:

```sql
-- Record counts
SELECT 'people' as table_name, COUNT(*) FROM notalone.notalone_people
UNION ALL SELECT 'companies', COUNT(*) FROM notalone.notalone_companies
UNION ALL SELECT 'lp_prospects', COUNT(*) FROM notalone.notalone_lp_prospects;

-- 8200 Alumni count
SELECT COUNT(*) as alumni_8200
FROM notalone.notalone_people
WHERE is_8200_alumni = true;

-- LP prospects by segment
SELECT segment, status, COUNT(*)
FROM notalone.notalone_lp_prospects
GROUP BY segment, status
ORDER BY segment, status;
```

---

## Troubleshooting

### Connection Refused
- Ensure PostgreSQL is running: `sudo nixos-container run events-hive -- pg_isready -p 5433`
- Check port: PostgreSQL runs on **5433**, not 5432

### Schema Not Found
- Set search_path in connection: `options=-csearch_path=notalone`
- Or prefix tables: `notalone.notalone_people`

### NocoDB Not Accessible
- Use SSH tunnel: `ssh -L 8080:localhost:8080 eladm@74.50.97.243`
- Access via: http://localhost:8080
