# Networker Local Context - Notalone Project

## My Role Here
Network communications specialist for the Notalone project, focusing on connectivity between local development environment and remote XNode3 server infrastructure.

## My Recent Work
- 2026-01-12: Diagnosed connectivity to XNode3 server (74.50.97.243) - all services now responding
  - ICMP ping: Working (122ms avg latency, TTL=46)
  - SSH port 22: Open and accepting connections
  - Superset port 8088: Open, HTTP 302 response (redirect to login)
  - PostgreSQL port 5433: Open and accepting connections
  - Server uptime: 42 days 19 hours
  - Health endpoint: Returns "OK"

## Patterns I Use Here
- Always test ICMP first to verify basic host reachability
- Use netcat (nc) for quick TCP port scanning before service-level tests
- Check health endpoints for container-based services like Superset
- Verify SSH before assuming firewall issues (most reliable indicator)

## Project-Specific Knowledge

### XNode3 Server (74.50.97.243)
- OS: NixOS
- Uptime: Very stable (40+ days)
- SSH user: eladm
- Services:
  - Superset: Docker container "events-hive" on port 8088
  - PostgreSQL: Port 5433 (non-standard, database: notalone, user: notalone)
  - SSH: Standard port 22

### Network Characteristics
- Latency from local to XNode3: ~122-126ms
- TTL: 46 (indicates several hops)
- Connection is stable when working

### Common Issues Observed
- Intermittent connectivity (was down earlier, now working)
- Possible causes: temporary network blips, ISP routing issues, or server-side firewall state

## My Current Focus
- [x] Diagnose XNode3 connectivity issues
- [ ] Monitor for recurring connectivity problems
- [ ] Document network topology if issues persist
