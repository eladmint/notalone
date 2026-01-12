# Superset ECharts Network Graph Setup

**Date**: January 12, 2026 (Updated)
**Purpose**: Interactive network visualization for the Notalone Israeli Tech Ecosystem

---

## Quick Access

| Resource | URL |
|----------|-----|
| **Superset** | http://74.50.97.243:8088 |
| **Network Graph Chart** | http://74.50.97.243:8088/explore/?slice_id=179 |
| **Dashboard 18** | http://74.50.97.243:8088/superset/dashboard/18/ |
| **SQL Lab** | http://74.50.97.243:8088/sqllab/ |
| **Username** | admin |
| **Password** | EventsHive2025! |

---

## Current Statistics (2026-01-12)

| Metric | Value |
|--------|-------|
| **Total Edges** | 906 |
| **Unique Sources** | 251 |
| **Unique Targets** | 254 |
| **Funding Rounds** | 91 |
| **Companies** | 184 |
| **Categories** | 19 |

### Edge Breakdown

| Graph Type | Category | Edges | Description |
|------------|----------|-------|-------------|
| investor-syndicate | Co-Invested | 453 | VC firms that co-invested in same rounds |
| investor-syndicate | Co-Investor | 195 | VC firm → Company (co-investor) |
| investor-syndicate | Lead Investor | 80 | VC firm → Company (lead) |
| person-company | Founded | 47 | Person founded company |
| person-person | Investor-Founder | 28 | Investor backed founder |
| person-person | Colleague | 27 | Worked together (overlapping tenure) |
| person-person | Military Cohort | 20 | Served in same unit (8200, etc.) |
| person-person | Co-Founder | 19 | Co-founded company together |
| person-company | Invested In | 10 | Person invested in company |
| person-company | Works At | 6 | Current employment |
| person-person | Investor | 5 | Direct investment relationship |
| person-person | Professional | 4 | Professional connection |
| person-person | Military | 3 | Military connection |
| person-company | Board positions | 5 | Board member/chairman/observer |
| person-person | Academic | 1 | Academic connection |

---

## Architecture

### View Hierarchy

```
v_network_graph_full (717 edges) ← Dataset 66
    ├── v_network_graph_combined (178 edges)
    │   ├── v_network_graph_edges (108 person-person)
    │   │   ├── Person Connections
    │   │   ├── Co-Founder Relationships
    │   │   ├── Military Cohort (overlapping service)
    │   │   └── Investor-Founder relationships
    │   ├── v_colleague_connections (27 colleagues)
    │   │   └── Employment overlap detection
    │   └── v_network_graph_company_edges (70 person-company)
    │       ├── Founded
    │       ├── Works At / Worked At
    │       ├── Invested In
    │       └── Board positions
    └── v_investor_syndicate (539 edges)
        ├── Lead Investor → Company (71)
        ├── Co-Investor → Company (157)
        └── VC ↔ VC Co-Invested (311)
```

### SQL Files

| File | Purpose |
|------|---------|
| `sql/004_network_graph_view.sql` | Base person-person edges |
| `sql/005_person_company_edges.sql` | Person→Company edges + combined view |
| `sql/006_colleague_connections.sql` | Colleague detection via employment overlap |
| `sql/007_investor_syndicate.sql` | VC syndicate network + full view |
| `sql/008_additional_funding_rounds.sql` | 58 additional funding rounds |

---

## Superset Configuration

### Dataset 66

- **Name**: v_network_graph_full
- **Schema**: notalone
- **Database**: Notalone - Israeli Tech Ecosystem (ID: 3)

**Columns:**
- `source` - Source node name
- `target` - Target node name
- `category` - Edge category (for coloring)
- `weight` - Edge weight (for thickness)
- `origin` - Where relationship originated
- `tooltip` - Hover text
- `edge_source` - Which view the edge came from
- `graph_type` - person-person, person-company, or investor-syndicate

### Chart 179

**Type**: ECharts Graph Chart
**Dashboard**: 18 (Notalone - 8200 Network & People)

**Configuration:**
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

---

## Adding More Data

### To Add New Funding Rounds

1. Add records to `notalone_funding_rounds` table
2. Include `lead_investor` and `other_investors` (JSONB array)
3. The `v_investor_syndicate` view will automatically include new edges

```sql
INSERT INTO notalone.notalone_funding_rounds
(id, company_id, round_type, amount_raised_usd, round_date, lead_investor, other_investors)
SELECT
    gen_random_uuid(),
    c.id,
    'Seed'::notalone.round_type,
    5000000,
    '2024-01-01'::date,
    'Lead VC Name',
    '["Co-Investor 1", "Co-Investor 2"]'::jsonb
FROM notalone.notalone_companies c
WHERE c.company_name = 'Company Name';
```

### To Add New Person Connections

Add to `notalone_person_connections` table:
```sql
INSERT INTO notalone.notalone_person_connections
(person_1_name, person_2_name, connection_type, connection_strength, source, notes)
VALUES
('Person A', 'Person B', 'Professional', 'Strong', 'Conference', 'Met at ETHDenver');
```

### To Add Employment (for colleague detection)

Add to `notalone_employment_history`:
```sql
INSERT INTO notalone.notalone_employment_history
(person_id, company_id, role, start_date, end_date, is_founder, is_current)
VALUES
('person-uuid', 'company-uuid', 'CTO', '2020-01-01', '2023-06-01', false, false);
```

---

## Troubleshooting

### Chart Not Rendering

1. Verify dataset 66 points to `v_network_graph_full`
2. Check that metric is set to `count`
3. Verify data exists: `SELECT COUNT(*) FROM notalone.v_network_graph_full;`

### Too Many Edges (Performance)

1. Filter by graph_type: `WHERE graph_type = 'person-person'`
2. Reduce row_limit in chart settings
3. Increase repulsion value

### Missing VC Syndicate Edges

1. Check funding_rounds has `other_investors` as JSONB array
2. Verify lead_investor is populated
3. Run: `SELECT * FROM notalone.v_investor_syndicate LIMIT 10;`

### Colleague Detection Not Working

1. Verify employment_history has start_date and end_date
2. Check for overlapping periods (at least 180 days)
3. Run: `SELECT * FROM notalone.v_colleague_connections LIMIT 10;`

---

## Maintenance

### Refresh Statistics

```sql
-- Check current edge counts
SELECT graph_type, category, COUNT(*) as edges
FROM notalone.v_network_graph_full
GROUP BY graph_type, category
ORDER BY edges DESC;

-- Total counts
SELECT
    COUNT(*) as total_edges,
    COUNT(DISTINCT source) as unique_sources,
    COUNT(DISTINCT target) as unique_targets
FROM notalone.v_network_graph_full;
```

### Update Superset Dataset

If views change, update dataset in Superset SQLite:
```bash
ssh eladm@74.50.97.243 "docker exec superset python3 -c \"
import sqlite3
conn = sqlite3.connect('/app/superset_home/superset.db')
cursor = conn.cursor()
cursor.execute('UPDATE tables SET table_name = \\\"v_network_graph_full\\\" WHERE id = 66')
conn.commit()
conn.close()
\""
```

---

## Files Reference

| File | Purpose |
|------|---------|
| `database/sql/004_network_graph_view.sql` | Person-person edges view |
| `database/sql/005_person_company_edges.sql` | Person-company edges |
| `database/sql/006_colleague_connections.sql` | Colleague detection |
| `database/sql/007_investor_syndicate.sql` | VC syndicate + full view |
| `database/sql/008_additional_funding_rounds.sql` | Funding data import |
| `database/SUPERSET_NETWORK_GRAPH_SETUP.md` | This guide |
| `.claude/agents/database/LOCAL-CONTEXT.md` | Agent context |

---

*Last updated: January 12, 2026*
