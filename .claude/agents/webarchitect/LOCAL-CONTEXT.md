# WebArchitect Local Context - Notalone

## My Role Here
Web architecture specialist for Notalone, an Israeli tech ecosystem tracking platform. Focus on data visualization, dashboard integration, and web-based network graph solutions.

## My Recent Work
- 2026-01-11: Researched Kumu-like network visualization alternatives for Superset integration
  - Evaluated: ECharts Graph, Gephi Lite, Grafana Node Graph, Cytoscape.js, Sigma.js
  - Created comprehensive options document: `/Users/eladm/Projects/Nuru-AI/Notalone/docs/NETWORK_VISUALIZATION_OPTIONS.md`
  - Recommended: Start with ECharts Graph (native Superset), then Gephi Lite iframe embed

## Patterns I Use Here
- PostgreSQL materialized views for visualization data (`mv_network_edges`)
- Existing Kumu CSV export views: `v_network_elements`, `v_network_connections`
- Superset API for programmatic dashboard/chart creation
- Docker-based deployment on XNode3 (74.50.97.243)

## Project-Specific Knowledge

### Tech Stack
- **Database**: PostgreSQL on XNode3:5433, schema: `notalone`
- **BI Tool**: Apache Superset (http://74.50.97.243:8088)
- **Current Viz**: Kumu.io (CSV export integration)
- **Data editing**: NocoDB on XNode3

### Key Files
- `/Users/eladm/Projects/Nuru-AI/Notalone/database/SUPERSET_DASHBOARD_GUIDE.md` - Dashboard access and API info
- `/Users/eladm/Projects/Nuru-AI/Notalone/database/sql/002_materialized_views.sql` - Network edge materialized view
- `/Users/eladm/Projects/Nuru-AI/Notalone/database/kumu/KUMU_SETTINGS.md` - Current Kumu styling config
- `/Users/eladm/Projects/Nuru-AI/Notalone/docs/NETWORK_VISUALIZATION_OPTIONS.md` - My research output

### Network Data Structure
The `notalone.mv_network_edges` materialized view contains:
- edge_type: cofounder, colleague, investor, board
- source_id, source_name (person)
- target_id, target_name (person or company)
- context_id, context_name (company context)
- strength: Strong/Medium/Weak
- weight: 1-10 numeric

### Superset Credentials
- URL: http://74.50.97.243:8088
- User: admin / EventsHive2025!
- Database ID: 3 (Notalone - Israeli Tech Ecosystem)

## My Current Focus
- [ ] Help implement ECharts Graph chart in Superset (Phase 1)
- [ ] Design Gephi Lite + API architecture if Phase 1 is insufficient
- [ ] Configure Superset iframe embedding for external visualizations

## Discovered Issues
- Superset requires superset_config.py changes to allow iframe embeds
- ECharts Graph has ~1000 node performance limit
- Current network data has some NULL UUIDs in junction tables (per auditor)

## Related Agent Work
- @architect: Designed migration architecture including Kumu views
- @database: Created mv_network_edges materialized view
- @auditor: Found data gaps (missing people, FK issues)
