# Chat History Format Analysis

## From Your Original Message

### Example 1: Catapult (FULL FORMAT)
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

### Example 2: Tribe (SIMPLE FORMAT)
```
Tribe is building the first AI Connection Companion on the application layer — a communicative app that learns you, understands your vibe, and becomes an essential go-to for connecting, exploring, and expanding your social circle.

Where technology meets human rhythm, Tribe offers a playful, safe, and emotionally intelligent way to experience the world — powered by data that grows smarter with every interaction.

Because connection apps are broken: too much catfishing, ghosting, and inactiveness. Gen-Z won't engage with platforms that don't listen back. Tribe is here to change that — an app that talks, learns, and connects like a human.

Find your people with TRIBE.

Concept video

Initial prototype

Deck

TG app: @TRIBE_aibot
```

### Example 3: Panora (MEDIUM FORMAT)
```
Hey hey,

I have one Aptos project raising $4m at $40m FDV, looking to have TGE in Q1 next year. Check it out, happy to intro:

Panora is building the on-chain financial institution. Backed by Frictionless Capital, Aptos Labs, and key Aptos leadership including Avery Ching (CEO & Co-Founder, Aptos Labs) and others, Panora is deeply integrated into the Aptos stack and positioned at the forefront of its DeFi ecosystem.

From Aptos' leading DEX aggregator to the execution layer for next-gen trading - Panora is building the vertically integrated frontend for Aptos orderflow, with a growing product suite and close collaboration with the Aptos' Global Trading Engine.

We've shipped a complete trading suite - Swap, Flows, Limit, DCA, Terminal, and APIs/SDKs - making Panora the Super App.

Competitive Edge:
- >20 bps advantage per trade vs competitors
- 80%+ win rate on integrators due to better prices
- <300ms response time for quotes from our router
- 100% on-chain liquidity coverage

Stats on Aptos mainnet (since launch on Nov'2023):
- Trading Volume: ~$7.2B+
- Transactions: 8M+
- Unique Users: 315K+
- Liquidity Sources integrated: 15+ (Hyperion, Thala, Cellana, etc.)
- Panora Swap Integrators: 22+ (Backpack, Petra, Thala, Aries, etc.)

Founders:
- Keshav Saraogi: Ex-founder SpotSpreads (Crypto MM), CoinDCX/Okto, Prop HFT, D. E. Shaw
- Shraddha Agarwal: Ex-founder SpotSpreads (Crypto MM), Microsoft, D. E. Shaw, Franklin Templeton Investments

Pitch Deck: https://docsend.com/v/3zdnd/panora

App Link: https://app.panora.exchange
Calendly Link: https://calendly.com/panoraexchange

X | Discord
```

### Example 4: Actiquest (MEDIUM FORMAT)
```
Actiquest is a California-based deeptech company specializing in human-centered AI systems and focused on LLM hyper-personalization. We are building Membria -GraphRAG-as-a-Service for SMB: auto-sync Google Drive, CRM, E-commerce systems
instant ontology-based semantic search, and team memory — all in 5 minutes, no
technical setup. Membria is like a Cursor for your company documents.

Raising $1M (VC round in progress). Untitled VC, BHP Ventures, Angels

Partners: Mistral AI, Hugging Face

Traction: Pilots with corporate customers, ARR $200K pilots (WowCube, Inditex, Siemens Healthineers, Ooredoo). Membria's architecture provides a crucial economic advantage, enabling clients to reduce their GPU-related operational costs by up to 75% compared to traditional cloud-based AI solutions.

👥 Team & Scientific Board:
  •  Michael Aprossine – CEO, 2 hardware exits
  •  Mike Keer – CTO, CV-AI architect (EU EIC projects)
  •  Phil Khomenok – COO, $10M ARR ops
  •  Ankit Sahu – CFO, 20 yrs BoA/UBS AM
  •  Dr. Ty Vachon, MD – Sports-medicine radiologist, ex-DoD innovation
  •  Leonard Khirug, PhD – Neuroscience, University of Amsterdam
  •  Venkatesh Babu PhD - Computer Science, Indian Institute of Science (IISc)

📄 Pitch Deck | 🪙 Financials | 📅 Calendly
```

## KEY OBSERVATIONS

### Format Patterns:

1. **Full Blurbs (like Catapult):**
   - USE `# HEADER` format for sections (single #, not ##)
   - Sections: # TRACTION, # WHY IT WINS, # FINANCIALS, # THE DEAL
   - Very detailed (40+ lines)
   - Header line at top with pipes: PROJECT | Tagline | Deal terms | Links

2. **Medium Blurbs (like Panora, Actiquest):**
   - Simple labels like "Competitive Edge:", "Stats:", "Founders:", "Team:"
   - NO # headers
   - 20-35 lines
   - Some use emojis (👥, 📄, 🪙, 📅)

3. **Simple Blurbs (like Tribe):**
   - Just paragraphs and links
   - NO labels, NO headers
   - 10-15 lines
   - Very narrative-driven

### What I Got WRONG:

❌ I told the agent "NO # headers" - but Catapult DOES use them for full blurbs!
❌ I said "NO emojis" - but Actiquest uses them!
❌ I said "15-20 lines max" - but Catapult is 40+ lines, Panora is 35+ lines!

### What's Actually TRUE:

✅ There are THREE distinct formats: Full (with # headers), Medium (with labels), Simple (narrative only)
✅ Full blurbs CAN use `# HEADER` (single #, not ##)
✅ Emojis ARE used sometimes (Actiquest example)
✅ Length varies: 10-15 lines (simple), 20-35 lines (medium), 40+ lines (full)
✅ All are plain text that works in Telegram (no markdown bold/italic)

## Corrected Understanding

The agent should:
1. Recognize THREE blurb types based on deal complexity
2. Full blurbs (major deals): CAN use `# HEADER` format like Catapult
3. Medium blurbs: Use simple labels like "Traction:", "Team:"
4. Simple blurbs: Just narrative paragraphs
5. Emojis are acceptable (not required)
6. Length should match deal importance, not arbitrary 15-20 line limit
