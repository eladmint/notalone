# Notalone Superset Dashboard Guide

**Date**: January 11, 2026
**Status**: COMPLETE - 3 dashboards with 9 charts

---

## Quick Access

| Resource | URL |
|----------|-----|
| **Superset** | http://74.50.97.243:8088 |
| **SQL Lab** | http://74.50.97.243:8088/sqllab/ |
| **Username** | admin |
| **Password** | EventsHive2025! |

---

## Dashboards

### Dashboard 17: LP Pipeline & Fundraising

**URL**: http://74.50.97.243:8088/superset/dashboard/17/
**Slug**: notalone-lp-pipeline

**Charts**:
- Chart 158: Total LP Prospects (big number)
- Chart 159: LP Pipeline by Status (pie chart)
- Chart 160: LP Prospects Table (searchable)

**Key Metrics**:
- Pipeline funnel: Target → Contacted → Meeting → Discussion → Committed
- Segmentation: Family Office, VC, Angel, Institution, Corporate
- Priority tiers: 1 (highest) to 3 (lowest)

---

### Dashboard 18: 8200 Network & People

**URL**: http://74.50.97.243:8088/superset/dashboard/18/
**Slug**: notalone-8200-network

**Charts**:
- Chart 161: Total People (big number)
- Chart 162: Network Connections (big number)
- Chart 163: People Directory (searchable table)

**Key Metrics**:
- Unit 8200 alumni identification
- Connection types: professional, educational, military, personal
- Geographic distribution of network

---

### Dashboard 19: Companies & Funding

**URL**: http://74.50.97.243:8088/superset/dashboard/19/
**Slug**: notalone-companies

**Charts**:
- Chart 164: Total Companies (big number)
- Chart 165: Funding Rounds (big number)
- Chart 166: Top Companies table (searchable)

**Key Metrics**:
- Company stages: Seed, Series A, B, C, Growth, Public
- Round types: Pre-Seed, Seed, Series A/B/C, Growth
- Total funding raised

---

## Database Connection

| Setting | Value |
|---------|-------|
| **Database ID** | 3 |
| **Name** | Notalone - Israeli Tech Ecosystem |
| **Connection** | postgresql://postgres:notalone2026@172.17.0.1:5433/calendar_monitoring |
| **Schema** | notalone |

---

## Datasets (IDs 42-59)

### Tables (14)
| Dataset | Table Name | Purpose |
|---------|------------|---------|
| People | notalone_people | Network contacts |
| Companies | notalone_companies | Company tracking |
| LP Prospects | notalone_lp_prospects | Fundraising pipeline |
| Institutions | notalone_institutions | Organizations |
| Employment | notalone_employment_history | Career tracking |
| Funding Rounds | notalone_funding_rounds | Investment data |
| Connections | notalone_person_connections | Network relationships |
| Cofounders | notalone_cofounder_relationships | Founder connections |
| Board Positions | notalone_board_positions | Board memberships |
| Acquisitions | notalone_acquisitions | M&A activity |
| Investments | notalone_investment_relationships | Investment tracking |
| Military | notalone_military_service | Military background |
| Education | notalone_education_records | Educational history |
| Interactions | notalone_interactions_log | Activity log |

### Views (4)
| View | Purpose |
|------|---------|
| v_lp_pipeline | LP prospects with institution details |
| v_people_careers | People with career history |
| v_company_funding | Companies with funding totals |
| v_8200_network | 8200 alumni network view |

---

## Setup Script

Run the dashboard setup script:

```bash
cd /Users/eladm/Projects/Nuru-AI/Notalone
node scripts/setup-notalone-dashboards.js
```

This creates all charts and dashboards automatically.

---

## SQL Lab Queries

### LP Pipeline Summary
```sql
SELECT
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 1) as percentage
FROM notalone.notalone_lp_prospects
GROUP BY status
ORDER BY
  CASE status
    WHEN 'Target' THEN 1
    WHEN 'Contacted' THEN 2
    WHEN 'Meeting Scheduled' THEN 3
    WHEN 'In Discussion' THEN 4
    WHEN 'Committed' THEN 5
    ELSE 6
  END;
```

### 8200 Alumni by Company
```sql
SELECT
  c.company_name,
  c.stage,
  COUNT(DISTINCT p.id) as alumni_count
FROM notalone.notalone_people p
JOIN notalone.notalone_employment_history e ON e.person_id = p.id
JOIN notalone.notalone_companies c ON e.company_id = c.id
WHERE p.is_8200_alumni = true
GROUP BY c.id, c.company_name, c.stage
ORDER BY alumni_count DESC
LIMIT 20;
```

### Top Funded Companies
```sql
SELECT
  company_name,
  stage,
  total_raised_usd / 1000000.0 as raised_millions,
  employee_count
FROM notalone.notalone_companies
WHERE total_raised_usd > 0
ORDER BY total_raised_usd DESC
LIMIT 20;
```

### Network Density
```sql
SELECT
  connection_type,
  COUNT(*) as connections,
  COUNT(DISTINCT person_1_id) + COUNT(DISTINCT person_2_id) as unique_people
FROM notalone.notalone_person_connections
GROUP BY connection_type
ORDER BY connections DESC;
```

---

## API Access

### Authentication
```javascript
const response = await fetch('http://74.50.97.243:8088/api/v1/security/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'EventsHive2025!',
    provider: 'db',
    refresh: true
  })
});
const { access_token } = await response.json();
```

### List Dashboards
```javascript
fetch('http://74.50.97.243:8088/api/v1/dashboard/', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});
```

### Guest Token (for embedding)
```javascript
// Get CSRF token first
const csrfResp = await fetch('http://74.50.97.243:8088/api/v1/security/csrf_token/', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});
const { result: csrfToken } = await csrfResp.json();

// Generate guest token
fetch('http://74.50.97.243:8088/api/v1/security/guest_token/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'X-CSRFToken': csrfToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    user: { username: 'guest', first_name: 'Guest', last_name: 'User' },
    resources: [{ type: 'dashboard', id: '<DASHBOARD_ID>' }],
    rls: []
  })
});
```

---

## Embedding Options

### Option 1: Direct Link (requires login)
```
http://74.50.97.243:8088/superset/dashboard/<ID>/
```

### Option 2: Standalone Mode (cleaner UI)
```
http://74.50.97.243:8088/superset/dashboard/<ID>/?standalone=1
```

### Option 3: Guest Token (temporary access)
```
http://74.50.97.243:8088/superset/dashboard/<ID>/?standalone=1&guest_token=<TOKEN>
```

Guest tokens expire after 5 minutes by default.

---

## Troubleshooting

### Connection Issues
- Superset runs on port 8088
- PostgreSQL runs on port 5433 (not 5432)
- Schema must be set to `notalone`

### Dataset Not Found
- Verify table exists in schema: `\dt notalone.*`
- Check dataset was created in Superset UI

### Chart Not Rendering
- Check SQL syntax in chart params
- Verify column names match table schema
- Test query in SQL Lab first

### CORS/Embedding Issues
- Guest tokens work for 5 minutes
- For persistent embedding, configure superset_config.py on server

---

## Files Reference

| File | Purpose |
|------|---------|
| `scripts/setup-notalone-dashboards.js` | Create charts and dashboards |
| `scripts/setup-superset-complete.js` | Create database and datasets |
| `scripts/setup-superset-notalone.js` | Alternative dataset setup |
| `database/SUPERSET_DASHBOARD_GUIDE.md` | This guide |
| `database/NOCODB_SUPERSET_SETUP.md` | NocoDB and Superset setup |

---

*Last updated: January 11, 2026*
