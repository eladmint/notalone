# Testing the blurb-writer Agent

## Prerequisites

1. **Restart Claude Code** to load the new agent
   - The agent file is located at `.claude/agents/blurb-writer.md`
   - Claude Code only loads agents on startup

## How to Invoke

The agent name in the YAML frontmatter is `blurb-writer`, so you invoke it as:

```
@agent-blurb-writer
```

**Why `@agent-blurb-writer` and not `@blurb-writer`?**
- Claude Code automatically adds "agent-" prefix to distinguish custom agents
- This is why the name field is `blurb-writer` (without "agent-" prefix)
- The system converts it to `@agent-blurb-writer` for @ mentions

## Test Examples

### Example 1: Simple Test
```
@agent-blurb-writer help
```

Expected: The agent should respond and explain its purpose.

### Example 2: Create a Medium Blurb
```
@agent-blurb-writer Create a blurb for this opportunity:

Project: DeFiSwap
Raising: $2M at $20M FDV
Traction: $5M volume in 2 weeks, 3K active users
Team: Ex-Coinbase founders
Deck: https://example.com/deck
```

Expected: Agent should:
1. Read INVESTMENT_BLURB_TEMPLATE.md
2. Select Medium Blurb format
3. Generate formatted blurb
4. Flag missing information (project description, founder names, etc.)

### Example 3: Create a Full Blurb
```
@agent-blurb-writer I need a detailed blurb for Catapult:

- Built on Hyperliquid + LayerZero
- $15.5M volume from 11K users in 2 weeks
- $280K treasury profit
- 218K trades
- Raising $1.2M at $0.02 per token
- TGE at $0.09 (4.5x)
- Deck: https://catapult.example.com
```

Expected: Agent should create a Full Blurb with all sections.

## Verification Checklist

After invoking the agent, verify:

- [ ] Agent responds (proves it loaded correctly)
- [ ] Agent reads INVESTMENT_BLURB_TEMPLATE.md
- [ ] Agent uses the correct template format
- [ ] Output is formatted for Telegram (concise, mobile-friendly)
- [ ] Agent flags missing information
- [ ] Agent doesn't make up details

## Common Issues

### Agent not found
**Error:** "Agent @agent-blurb-writer not found"

**Solution:**
1. Verify file exists: `ls .claude/agents/blurb-writer.md`
2. Check YAML frontmatter has `name: blurb-writer`
3. **Restart Claude Code** (required to load new agents)

### Agent doesn't read template
**Issue:** Agent doesn't reference INVESTMENT_BLURB_TEMPLATE.md

**Solution:**
1. Verify template exists: `ls INVESTMENT_BLURB_TEMPLATE.md`
2. Agent has Read tool in frontmatter: `tools: Read, Write, Edit`
3. Template is in same directory as where you invoke the agent

## Notes

- The agent is a **markdown-based subagent** (not SDK/TypeScript)
- It uses Claude Code's built-in agent system
- Configuration is in YAML frontmatter (lines 1-6 of blurb-writer.md)
- The prompt/instructions are in the markdown body (lines 8+)
