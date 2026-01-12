# Notalone - Investment Blurb Generator

AI-powered investment opportunity blurb generator for internal Telegram communications with automated web presentation capture.

---

## Features

### 🤖 Intelligent Blurb Generation
- **Three template formats**: Full (major opportunities), Medium (good traction), Quick (time-sensitive)
- **Data-driven approach**: Numbers-first, metrics-focused
- **Pattern-based**: Built from actual team messaging patterns
- **Quality checks**: Built-in validation against team standards

### 📸 Web Presentation Capture
- **Automated screenshots**: Capture slides from web-based presentations
- **Multi-platform support**: Google Slides, Pitch, DocSend, Canva, and generic presentations
- **Smart navigation**: Platform-specific strategies with keyboard fallback
- **Visual analysis**: Agent reads screenshots to extract information

### 🎯 Claude Code Integration
- **Custom subagent**: `@agent-blurb-writer` for on-demand blurb creation
- **Autonomous workflow**: Detects web decks, captures screenshots, extracts info
- **Template-driven**: Uses proven messaging patterns from team history

---

## Quick Start

### 1. Installation

```bash
# Install dependencies
npm install

# Install browser for Playwright
npm run install-browsers

# Restart Claude Code to load the agent
```

### 2. Basic Usage

#### With Downloaded Deck Info
```
@agent-blurb-writer Create a blurb for:

Project: DeFiSwap
Raising: $2M at $20M FDV
Traction: $5M volume in 2 weeks, 3K users
Team: Ex-Coinbase founders
Deck: https://example.com/deck.pdf
```

#### With Web-Based Deck
```
@agent-blurb-writer Create a blurb for:

Deck: https://docs.google.com/presentation/d/abc123/edit
```

The agent will:
1. Detect it's a web-based deck
2. Capture screenshots automatically
3. Extract information from slides
4. Generate a formatted blurb

---

## Project Structure

```
Notalone/
├── .claude/
│   ├── agents/
│   │   └── blurb-writer.md              # Custom agent definition
│   └── logs/                             # Claude Code logs
├── scripts/
│   └── capture-presentation.js           # Playwright screenshot script
├── INVESTMENT_BLURB_TEMPLATE.md          # Template with proven patterns
├── SCREENSHOT_FEATURE_GUIDE.md           # Comprehensive screenshot guide
├── SCREENSHOT_FEATURE_SUMMARY.md         # Feature summary
├── AGENT_CREATION_VERIFICATION_REPORT.md # Agent implementation verification
├── TEST_AGENT_INVOCATION.md              # Testing guide
└── package.json                          # Dependencies
```

---

## Documentation

| Document | Purpose |
|----------|---------|
| **INVESTMENT_BLURB_TEMPLATE.md** | Blurb templates and messaging patterns |
| **SCREENSHOT_FEATURE_GUIDE.md** | Complete guide for screenshot capture |
| **SCREENSHOT_FEATURE_SUMMARY.md** | Feature implementation summary |
| **AGENT_CREATION_VERIFICATION_REPORT.md** | Agent verification against best practices |
| **TEST_AGENT_INVOCATION.md** | How to test the agent |

---

## Agent: `@agent-blurb-writer`

### Capabilities

- ✅ Reads investment opportunity details
- ✅ Selects appropriate template (Full/Medium/Quick)
- ✅ Captures web-based presentation screenshots
- ✅ Extracts information from slide images
- ✅ Generates formatted Telegram blurbs
- ✅ Flags missing information
- ✅ Follows team messaging patterns

### Tools Enabled

- `Read`: Template and screenshots
- `Write`: Save generated blurbs
- `Edit`: Refine existing blurbs
- `Bash`: Run screenshot capture script

### Model

- `sonnet` (Claude 3.5 Sonnet)

---

## Screenshot Capture

### Direct Script Usage

```bash
# Basic capture
node scripts/capture-presentation.js "https://docs.google.com/presentation/d/..."

# With options
node scripts/capture-presentation.js "https://pitch.com/..." \
  --output-dir ./my-deck \
  --max-slides 20 \
  --delay 3000 \
  --headless

# Using npm script
npm run capture-deck -- "https://..." --output-dir ./deck
```

### Supported Platforms

| Platform | URL Pattern | Auto-Detection |
|----------|-------------|----------------|
| Google Slides | `docs.google.com/presentation` | ✅ |
| Pitch | `pitch.com` | ✅ |
| DocSend | `docsend.com` | ✅ |
| Canva | `canva.com/design` | ✅ |
| Generic | Any URL | ✅ Keyboard nav |

### Script Options

- `--output-dir <dir>`: Where to save screenshots (default: `./slides`)
- `--max-slides <num>`: Maximum slides to capture (default: `50`)
- `--delay <ms>`: Delay between slides (default: `2000`)
- `--headless`: Run browser in background

---

## Blurb Templates

### Full Blurb
**Use for:** Major opportunities, formal rounds, detailed diligence

**Includes:**
- Project header with tagline and links
- Detailed traction metrics
- "Why It Wins" section (Position, Economics, Product, Team)
- Financial projections
- Complete deal terms

### Medium Blurb
**Use for:** Good opportunities, decent traction

**Includes:**
- Project description
- Key traction metrics (3-5)
- Competitive edge (3 points)
- Team backgrounds
- Deal summary

### Quick Blurb
**Use for:** Interesting deals, special situations, time-sensitive

**Includes:**
- One-sentence description
- Why it's interesting (2-3 sentences)
- Key numbers (FDV, revenue, etc.)
- Investment opportunity
- Deal terms if known

---

## Team Messaging Patterns

Based on analysis of actual Notalone team blurbs:

### 1. Lead with Numbers
- "$15.5M volume in 2 weeks" > "$15.5M volume"
- Always include timeframes
- Specific metrics build credibility

### 2. Create Social Proof
- Notable investors or backers
- Customer names (if impressive)
- "My friend invested 100k"
- KOL endorsements

### 3. Show Momentum
- Growth rates and velocity
- User/revenue trajectories
- "in X weeks" timeframes

### 4. Highlight Special Access
- "Private round filled"
- "Oversubscribed"
- "Final allocation"
- Creates FOMO

### 5. Be Concise
- Telegram = mobile reading
- Short paragraphs
- Bullet points for metrics
- Clear structure

---

## Examples

### Example 1: Catapult (Full Blurb)

```
CATAPULT | Hyper-Intelligent Launch Engine & Omnichain Infra | Seed Round raising ($1.2M @ $0.02) | APP | Tokenomics | Deck | X

Built on Hyperliquid + LayerZero, Catapult offers the crypto market a novel token launch process with a properly incentivized user/creator/mindshare economy and a compounding value loop.

# TRACTION:

- $15.5M volume from 11K active users in 2 weeks
- $280K treasury profit (3.71% margin, 1314% deposit efficiency)
- 218K trades, $35 avg size, $25 lifetime value per user
- 12M reach, 6K participants → 10K X followers in 3 weeks
- Top KOLs generated $100K-$250K each in volume

# WHY IT WINS

Position: First mover on Hyperliquid with multichain reach; riding CT's hottest narrative; no real competition

Economics: Multiple revenue streams (dynamic pre-bond tax, DEX fees 0.5%, trade fees 1%, chart creation); 25% of Turbo revenue buys/burns $PULT daily; all launches pair against $PULT

Product: Terminal-native UX for degens; volatility-based bonding curves; provably fair charts using Geometric Brownian Motion; 4-hour token lifecycles engineered for maximum engagement; sustainable liquidity via TWAP liquidations.

Team: co-founder MEMEFI (30M users, $30M USD rev miniapp, listed on most major exchanges). Experienced, 2017 class team, self-funded, building for 10 months.

# FINANCIALS

12-Month Projections:
- Volume: $50M → $175M/month
- Revenue: $1.8M → $6.5M/month
- EBITDA: $900K → $6M/month

# THE DEAL

Seed Round: $1.2M raising now!
- Entry: $0.02 per token
- TGE: $0.09 (4.5x)
- Allocation: 6% supply
- Unlock: 40% at TGE, 6-month vest
- Valuations: $90M FDV / $43M circulating at TGE

Private round ($2.1M @ $0.03) already filled.
```

### Example 2: Tribe (Medium Blurb)

```
Tribe is building the first AI Connection Companion on the application layer — a communicative app that learns you, understands your vibe, and becomes an essential go-to for connecting, exploring, and expanding your social circle.

Where technology meets human rhythm, Tribe offers a playful, safe, and emotionally intelligent way to experience the world — powered by data that grows smarter with every interaction.

Because connection apps are broken: too much catfishing, ghosting, and inactiveness. Gen-Z won't engage with platforms that don't listen back. Tribe is here to change that — an app that talks, learns, and connects like a human.

Find your people with TRIBE.

Concept video | Initial prototype | Deck | TG app: @TRIBE_aibot
```

---

## Testing

### Test the Agent

See `TEST_AGENT_INVOCATION.md` for complete testing guide.

**Quick tests:**
```
# 1. Test agent loads
@agent-blurb-writer help

# 2. Test with details
@agent-blurb-writer Create a blurb for:
Project: TestProject
Raising: $1M at $10M FDV
Traction: $1M ARR
Team: Ex-Google

# 3. Test with web deck
@agent-blurb-writer https://docs.google.com/presentation/d/...
```

### Test Screenshot Capture

```bash
# Test help
node scripts/capture-presentation.js --help

# Test with small deck
node scripts/capture-presentation.js "https://..." --max-slides 3

# Test full capture
node scripts/capture-presentation.js "https://..." --output-dir ./test-deck
```

---

## Troubleshooting

### Agent Issues

**Problem:** Agent not found
**Solution:**
1. Verify file exists: `ls .claude/agents/blurb-writer.md`
2. Check YAML frontmatter
3. Restart Claude Code

**Problem:** Agent doesn't read template
**Solution:**
1. Verify template exists: `ls INVESTMENT_BLURB_TEMPLATE.md`
2. Check you're in project root
3. Agent has Read tool enabled

### Screenshot Issues

**Problem:** "Playwright not installed"
**Solution:**
```bash
npm install
npm run install-browsers
```

**Problem:** Screenshots are blank
**Solution:**
- Increase `--delay` (try 3000-5000ms)
- Remove `--headless` to see what's happening
- Check if authentication is required

**Problem:** Can't navigate to next slide
**Solution:**
- Script will stop after 3 consecutive failures
- Check captured slides in output directory
- Try increasing `--delay`

---

## Dependencies

```json
{
  "dependencies": {
    "@notionhq/client": "^5.4.0",
    "playwright": "^1.57.0"
  }
}
```

### Installation

```bash
npm install              # Install dependencies
npm run install-browsers # Install Chromium for Playwright
```

---

## Contributing

### Adding New Platform Support

Edit `scripts/capture-presentation.js` and add to `detectPlatform()`:

```javascript
else if (url.includes('your-platform.com')) {
  return {
    name: 'Your Platform',
    nextSelector: '.next-button',      // CSS selector for next button
    slideNumberSelector: '.slide-num',  // CSS selector for slide number
    containerSelector: '.container'     // CSS selector for main container
  };
}
```

### Improving Templates

Edit `INVESTMENT_BLURB_TEMPLATE.md` to add new patterns or sections based on successful team blurbs.

---

## Architecture

### Agent Flow

```
User Input
    ↓
Agent (blurb-writer)
    ↓
[Has web URL?] → Yes → Capture screenshots → Read images
    ↓                                             ↓
    No                                         Extract info
    ↓                                             ↓
Read INVESTMENT_BLURB_TEMPLATE.md ←---------------┘
    ↓
Select template (Full/Medium/Quick)
    ↓
Generate blurb
    ↓
Output formatted text
```

### Screenshot Capture Flow

```
Web URL
    ↓
Playwright Script
    ↓
Detect Platform
    ↓
Launch Browser (Chromium)
    ↓
Navigate to URL
    ↓
[For each slide]:
    - Wait for render
    - Take screenshot
    - Navigate to next
    ↓
Save screenshots + metadata
    ↓
Close browser
```

---

## Version

- **Agent Version:** 1.0.0
- **Screenshot Feature:** 1.0.0
- **Template:** 1.0.0
- **Last Updated:** 2025-12-05

---

## License

Internal use only - Notalone investment team

---

## Support

For issues or questions:
1. Check documentation in project root
2. Review `SCREENSHOT_FEATURE_GUIDE.md` for screenshot issues
3. Review `TEST_AGENT_INVOCATION.md` for agent issues

---

**Built with Claude Code** 🤖
