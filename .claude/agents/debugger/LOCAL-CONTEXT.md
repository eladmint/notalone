# Debugger Local Context - Notalone

## My Role Here
Technical debugging specialist for the Notalone project, focusing on code-level issues, infrastructure debugging, and systematic error resolution.

## My Recent Work
- 2026-01-12: Investigated Superset dashboard chart errors (Dashboard ID 20, Israel Web3 Ecosystem)
  - ROOT CAUSE FOUND: Superset instance has been reset - all datasets, charts, and dashboards are missing
  - PostgreSQL view (v_web3_companies) works correctly with 123 rows
  - Dashboard 20, Dataset 65, and Charts 167-173 all return 404 Not Found
  - Superset API shows 0 datasets, 0 charts

## Patterns I Use Here
- SSH to XNode3 may fail (publickey auth issues) - use API/psycopg2 instead
- PostgreSQL view verification via psycopg2 (port 5433)
- Superset API access via Node.js scripts with retry logic (connection unstable)
- Network connectivity is intermittent - use retry with backoff

## Project-Specific Knowledge
- Tech stack: PostgreSQL (5433), Superset (Docker on 8088), NocoDB (8080)
- Key infrastructure: XNode3 (74.50.97.243)
- Database: calendar_monitoring, schema notalone
- Superset credentials: admin / EventsHive2025!
- PostgreSQL credentials: postgres / notalone2026
- SSH to XNode3 NOT working with hivelocity_key (different server)
- Superset connection is unstable - requires retry logic

## Key Views
- notalone.v_web3_companies: 123 Web3 companies (sector='Crypto/Web3')
  - Columns: status (ENUM), stage (ENUM), founded_year, company_name, etc.
  - status ENUM values: 'Active', 'Acquired', 'Shut Down', 'IPO'
  - stage ENUM values: 'Pre-Seed', 'Seed', 'Series A-E', 'Growth', 'Public', 'Acquired', 'Shut Down', 'Active'

## My Current Focus
- [x] Diagnosed root cause: Superset has no data (reset/wiped)
- [x] Verified via API: 0 databases, 0 datasets, 0 charts, 0 dashboards
- [x] Confirmed PostgreSQL data intact: 123 companies in v_web3_companies
- [x] Created recreation script: scripts/recreate-superset-dashboard.py
- [ ] BLOCKED: XNode3 services are down (Superset:8088 and PostgreSQL:5433 refusing connections)
- [ ] Server is reachable (ping OK) but Docker containers appear stopped
- [ ] Need SSH access to restart Docker containers on XNode3
