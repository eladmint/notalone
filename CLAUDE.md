# Notalone

Project configuration for Claude Code.

---

## CollaborativeIntelligence Agents

Invoke specialists with `@agent-name`. Agents maintain project memory and share discoveries.

### Agent Directory

**Development**
`@developer` code/features | `@debugger` errors/investigations | `@engineer` engineering | `@fixer` critical fixes | `@refactorer` refactoring | `@optimizer` performance

**Architecture & Analysis**
`@architect` system design | `@analyst` analysis/metrics | `@planner` task planning | `@topologist` system topology | `@cartographer` codebase mapping | `@auditor` accuracy validation | `@verifier` verification

**Backend & Infrastructure**
`@backender` APIs/data layer | `@database` DB design/queries | `@infrastructurer` DevOps/deployment | `@networker` network systems | `@basher` shell/bash scripts

**Frontend**
`@renderer` frontend code | `@ui` UI components | `@ux` user experience | `@webarchitect` web architecture

**Testing & Quality**
`@tester` tests/coverage | `@benchmarker` benchmarks

**Documentation & Knowledge**
`@documenter` documentation | `@writer` technical writing | `@memory` context sync | `@researcher` research | `@scholar` learning systems | `@athena` knowledge architect

**Language & Domain Specialists**
`@rustist` Rust | `@linguist` languages | `@cryptographer` security/crypto | `@trader` trading/finance | `@binarian` binary analysis

**Operations & Coordination**
`@manager` project organization | `@deliverer` delivery | `@automator` automation | `@general` general tasks

**System Agents**
`@consolidator` consolidation | `@reactor` reactive tasks | `@visionary` vision/strategy | `@directoryorganizer` file organization | `@cacher` caching | `@enforcer` enforcement | `@sagekeeper` knowledge preservation

**Application & Integration**
`@applicationer` applications | `@notionmanager` Notion workspace | `@linkedin` LinkedIn networking

### Agent Protocol
1. Agents read `.claude/agents/{agent}/LOCAL-CONTEXT.md` first
2. Check `.claude/AGENT-UPDATES.md` for cross-agent updates
3. Update their context after work
4. Post discoveries that affect other agents

### Usage Examples
```
@developer implement the auth feature
@debugger investigate the memory leak
@architect review the microservices design
@analyst analyze code complexity metrics
@tester create tests for the payment module
@memory sync agent updates to local contexts
@fixer urgent: production is down
```

### When to Use Agents
- **Specialized work** → Use domain expert (`@backender`, `@cryptographer`, `@trader`)
- **Complex debugging** → `@debugger` maintains investigation context
- **Multi-step tasks** → Agents track progress in LOCAL-CONTEXT
- **Cross-cutting changes** → Agents notify affected agents via AGENT-UPDATES
