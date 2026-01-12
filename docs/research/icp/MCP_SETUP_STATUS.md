# MCP Setup Status for ICP Research
**Date:** November 28, 2025
**Status:** ✅ Initial Configuration Complete

---

## Current MCP Configuration

### ✅ Installed MCP Servers

**File:** `~/.claude/mcp.json`

1. **GitHub MCP** - `@modelcontextprotocol/server-github`
   - **Purpose:** Track DFINITY repos, ICP project activity, grant applications
   - **Status:** Configured (needs GitHub token)
   - **Use Cases:**
     - Monitor dfinity/ic repository commits
     - Track dfinity/grant-rfps applications
     - Analyze top 50 ICP project GitHub activity

2. **Fetch MCP** - `@modelcontextprotocol/server-fetch`
   - **Purpose:** Web content fetching for ICP docs, whitepapers
   - **Status:** ✅ Ready (no auth required)
   - **Use Cases:**
     - Download ICP Dashboard data
     - Fetch DFINITY blog posts
     - Retrieve ICP documentation pages

3. **Filesystem MCP** - `@modelcontextprotocol/server-filesystem`
   - **Purpose:** Access Nuru-AI project files
   - **Status:** ✅ Ready
   - **Scope:** `/Users/eladm/Projects/Nuru-AI`
   - **Use Cases:**
     - Read Sippar ICP integration code
     - Access Rabbi ICP research docs
     - Browse events-hive scraping agents

4. **Browser Control MCP** (existing)
   - **Purpose:** Browser automation (from TokenHunter)
   - **Status:** ✅ Ready
   - **Location:** `/Users/eladm/Projects/token/tokenhunter/mcp_tools`
   - **Use Cases:**
     - Scrape ICP hub websites (OpenChat, DSCVR)
     - Extract data from JavaScript-heavy pages
     - Automate ICP Dashboard data collection

5. **Supabase MCP** (existing)
   - **Purpose:** Database operations
   - **Status:** ✅ Ready (has token)
   - **Use Cases:**
     - Store ICP research data
     - Track hub metrics over time
     - Build research knowledge base

---

## Next Steps

### Immediate (Today)

1. **Add GitHub Personal Access Token**
   - Generate token at https://github.com/settings/tokens
   - Add to mcp.json `GITHUB_PERSONAL_ACCESS_TOKEN`
   - Restart Claude Code

2. **Test MCP Servers**
   - Test GitHub MCP with dfinity/ic repo query
   - Test Fetch MCP with ICP Dashboard
   - Test Browser Control with OpenChat

### Short-term (This Week)

3. **Add Blockchain Data MCPs**
   ```json
   "coingecko": {
     "command": "npx",
     "args": ["-y", "coingecko-mcp"]
   }
   ```

4. **Add PostgreSQL MCP** (for research data storage)
   ```json
   "postgres": {
     "command": "npx",
     "args": ["-y", "@modelcontextprotocol/server-postgres"],
     "env": {
       "DATABASE_URL": "postgresql://..."
     }
   }
   ```

### Medium-term (Weeks 2-4)

5. **Build Custom ICP MCP Server**
   - Repository: `notalone/icp-mcp-server`
   - Capabilities: Canister queries, SNS DAO data, ICP ledger
   - Timeline: 60-80 hours development

---

## MCP Servers Still Needed

### High Priority

- **CoinGecko MCP** - ICP token price/market data
  - NPM: `coingecko-mcp`
  - No auth required (free tier)

- **PostgreSQL MCP** - Research data storage
  - NPM: `@modelcontextprotocol/server-postgres`
  - Needs database setup

### Medium Priority

- **Hive Intelligence MCP** - Crypto analytics
  - NPM: `hive-crypto-mcp`
  - Remote server: https://hiveintelligence.xyz/crypto-mcp

- **Memory MCP** - Knowledge graph
  - NPM: `@modelcontextprotocol/server-memory`
  - Organize ICP research findings

### Custom Development

- **ICP MCP Server** (CRITICAL - First of its kind)
  - Query ICP canisters directly
  - Access SNS DAO governance
  - Track ICP ledger transactions
  - Estimated: 60-80 hours

---

## Testing Checklist

### GitHub MCP
- [ ] List recent commits from dfinity/ic
- [ ] Search grant-rfps repository
- [ ] Get contributor stats for ICP project

### Fetch MCP
- [ ] Download ICP Dashboard homepage
- [ ] Fetch DFINITY blog post
- [ ] Retrieve ICP API documentation

### Browser Control MCP
- [ ] Scrape OpenChat user count
- [ ] Extract DSCVR activity metrics
- [ ] Get ICP Dashboard canister count

### Filesystem MCP
- [ ] Read Sippar icpCanisterService.ts
- [ ] Access Rabbi ICP research docs
- [ ] List events-hive agents

---

## Configuration Commands

### View MCP Status
```bash
# In Claude Code, type:
/mcp
```

### Add New MCP Server
```bash
claude mcp add-json <name> '<json-config>'
```

### Remove MCP Server
```bash
claude mcp remove <name>
```

### List All MCPs
```bash
claude mcp list
```

---

## Troubleshooting

### MCP Not Working
1. Check `~/.claude/mcp.json` syntax (valid JSON)
2. Restart Claude Code
3. Check MCP server logs: `~/.claude/logs/`

### GitHub MCP Auth Error
1. Verify token in mcp.json
2. Ensure token has `repo` scope
3. Test token: `curl -H "Authorization: token ghp_..." https://api.github.com/user`

### NPX Command Fails
1. Ensure Node.js installed: `node --version`
2. Clear npm cache: `npm cache clean --force`
3. Try manual install: `npm install -g <package>`

---

## Success Criteria

- [x] MCP configuration file created
- [x] 5 MCP servers configured
- [ ] All MCPs tested successfully
- [ ] GitHub token added
- [ ] First ICP research query via MCP

---

## Resources

- **MCP Documentation:** https://docs.anthropic.com/en/docs/claude-code/mcp
- **MCP Registry:** https://registry.modelcontextprotocol.io
- **GitHub MCP:** https://github.com/modelcontextprotocol/servers
- **Blockchain MCPs:** https://github.com/royyannick/awesome-blockchain-mcps

---

**Status:** Ready for testing after GitHub token is added
**Next Action:** Add GitHub token + test MCP servers with ICP queries
