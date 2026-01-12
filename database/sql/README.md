# Notalone SQL Scripts

SQL scripts for the Notalone PostgreSQL database on XNode3.

## Server Details

| Property | Value |
|----------|-------|
| **Host** | 74.50.97.243 |
| **Port** | 5433 |
| **Database** | calendar_monitoring |
| **Schema** | notalone |
| **User** | postgres |

## Script Overview

### Schema & Tables

| File | Purpose | Status |
|------|---------|--------|
| `001_create_schema.sql` | Main schema with 13 tables, enums, indexes | Deployed |
| `002_materialized_views.sql` | Materialized views for dashboards | Deployed |
| `003_seed_data.sql` | Initial seed data | Deployed |

### Network Graph Views

| File | Purpose | Edges | Status |
|------|---------|-------|--------|
| `004_network_graph_view.sql` | Base person-person edges | 108 | Deployed |
| `005_person_company_edges.sql` | Person→Company relationships | 70 | Deployed |
| `006_colleague_connections.sql` | Colleague detection via employment overlap | 27 | Deployed |
| `007_investor_syndicate.sql` | VC syndicate network (VC↔VC, VC→Company) | 539 | Deployed |

### Data Import

| File | Purpose | Records | Status |
|------|---------|---------|--------|
| `008_additional_funding_rounds.sql` | Import 58 funding rounds | 58 | Deployed |
| `009_import_collider_companies.sql` | Import 34 companies from Collider DB | 34 | Deployed |
| `010_notable_company_funding.sql` | Funding for notable companies | 10 | Deployed |

---

## View Architecture

```
v_network_graph_full (906 edges) ← Superset Dataset 66
├── v_network_graph_combined (178 edges)
│   ├── v_network_graph_edges (108)
│   │   ├── Person Connections
│   │   ├── Co-Founder Relationships
│   │   ├── Military Cohort
│   │   └── Investor-Founder
│   ├── v_colleague_connections (27)
│   └── v_network_graph_company_edges (70)
│       ├── Founded
│       ├── Works At / Worked At
│       ├── Invested In
│       └── Board positions
└── v_investor_syndicate (728)
    ├── Lead Investor → Company (80)
    ├── Co-Investor → Company (195)
    └── VC ↔ VC Co-Invested (453)
```

---

## Running Scripts

### Via SSH

```bash
# Copy script to server
scp database/sql/007_investor_syndicate.sql eladm@74.50.97.243:/tmp/

# Execute
ssh eladm@74.50.97.243 "PGPASSWORD=notalone2026 psql -h 172.17.0.1 -p 5433 -U postgres -d calendar_monitoring -f /tmp/007_investor_syndicate.sql"
```

### Via SQL Lab

1. Go to http://74.50.97.243:8088/sqllab/
2. Select Database: Notalone - Israeli Tech Ecosystem
3. Paste SQL and run

---

## Key Views

### v_network_graph_full

Main view for Superset network graph chart. Combines all edge types.

**Columns:**
- `source` - Source node name
- `target` - Target node name
- `category` - Edge category (Co-Founder, Investor, Colleague, etc.)
- `weight` - Edge weight (1-10)
- `origin` - Where relationship originated (company name, etc.)
- `tooltip` - Hover text
- `edge_source` - Which sub-view the edge came from
- `graph_type` - person-person, person-company, or investor-syndicate

### v_colleague_connections

Detects colleagues who worked at the same company with overlapping tenure.

**Logic:**
- Finds employment periods at same company
- Requires at least 180 days overlap
- Weights by founder status (8) vs regular employees (2-5)

### v_investor_syndicate

Creates VC network from funding rounds data.

**Logic:**
- Lead Investor → Company edges (weight: 9)
- Co-Investor → Company edges (weight: 7)
- VC ↔ VC edges when they co-invested in same round (weight: 6)

---

## Adding New Data

### New Funding Round

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

### New Person Connection

```sql
INSERT INTO notalone.notalone_person_connections
(person_1_name, person_2_name, connection_type, connection_strength, source)
VALUES ('Person A', 'Person B', 'Professional', 'Strong', 'Conference');
```

---

## Verification Queries

### Edge Counts by Category

```sql
SELECT graph_type, category, COUNT(*) as edges
FROM notalone.v_network_graph_full
GROUP BY graph_type, category
ORDER BY edges DESC;
```

### Total Statistics

```sql
SELECT
    COUNT(*) as total_edges,
    COUNT(DISTINCT source) as unique_sources,
    COUNT(DISTINCT target) as unique_targets
FROM notalone.v_network_graph_full;
```

### Funding Rounds Summary

```sql
SELECT COUNT(*) as total_rounds,
       COUNT(DISTINCT lead_investor) as unique_lead_investors,
       SUM(amount_raised_usd) as total_raised
FROM notalone.notalone_funding_rounds;
```

---

## Related Documentation

- [SUPERSET_NETWORK_GRAPH_SETUP.md](../SUPERSET_NETWORK_GRAPH_SETUP.md) - Superset chart configuration
- [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) - Server deployment instructions
- [.claude/agents/database/LOCAL-CONTEXT.md](../../.claude/agents/database/LOCAL-CONTEXT.md) - Agent context

---

*Last updated: January 12, 2026*
