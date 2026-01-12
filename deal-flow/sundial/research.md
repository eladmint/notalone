# Sundial - Research Report

**Research Date:** December 11, 2025
**Company Website:** https://www.sundialprotocol.com/
**Headquarters:** Singapore
**Founded:** 2025 (Company registration: March 20, 2025)
**Investment Criteria:** See `/strategy/investment-criteria.md`

---

## Deal Classification

| Field | Value |
|-------|-------|
| **Deal Type** | Investment |
| **Token Status** | Token (planned) |
| **Industry** | Bitcoin Layer-2, DeFi Infrastructure |
| **Industry Fit** | ✅ Actively Liked (Innovative DeFi) |

### Quick Kill Check
- [x] Token project (not equity-only)
- [x] Non-excluded sector (not Gaming/Metaverse/NFT)
- [x] Known team (not anonymous)
- [x] Has product or traction (despite being <6 months old - testnet Q3 2025)
- [x] FDV ≤ $100M ($40M valuation)
- [x] Clear product/problem
- [x] Not a direct clone (unique eUTxO-based approach)

**Kill Criteria Triggered:** None

---

## Confidence Summary

| Section | Confidence | Notes |
|---------|------------|-------|
| Company Overview | HIGH | Strong deck, verified partnerships, public presence |
| Product/Service | MEDIUM | Clear vision, testnet pending Q3 2025 |
| Target Market | HIGH | Well-defined $1.8T BTC market opportunity |
| Business Model | MEDIUM | Multiple revenue streams outlined, execution TBD |
| Technology | MEDIUM | Built on proven Cardano eUTxO model, partnerships verified |
| Team/Leadership | HIGH | Verified backgrounds, Cardano ecosystem veterans |
| Funding/Investors | MEDIUM | Catalyst funding verified, Pointer Capital and Draper mentioned in deck |
| Token Economics | LOW | Limited information available, TGE Q1 2026 |
| Competitors | HIGH | Clear competitive landscape, well-researched positioning |
| Investment Fit | MEDIUM | Meets most criteria, concerns on early stage and TGE timeline |

**Overall Confidence:** MEDIUM

---

## Executive Summary

Sundial is a Bitcoin Layer-2 protocol built on Cardano's eUTxO model that aims to unlock yield and smart contract functionality for the $1.8 trillion Bitcoin market. Currently raising $3.7M seed round at $40M valuation, with testnet planned Q3 2025 and mainnet Q1 2026. The team consists of Cardano ecosystem veterans led by Sheldon Hunt (ex-EMURGO), with strong early traction showing 200+ BTC committed ($20M+ liquidity) and 65+ ecosystem partners.

**Key Signals:**
- 🟢 Strong team with verified Cardano ecosystem experience (Sheldon Hunt - EMURGO founding member)
- 🟢 Significant early traction: 200+ BTC committed, 65+ partners including institutional players (Hextrust, Solv, Cumberland)
- 🟢 #1 ranked initiative in Project Catalyst Fund 13 with $1M grant secured
- 🟢 Unique technical approach: eUTxO-based optimistic rollup (differentiated from EVM-based L2s)
- 🟡 Very early stage: Company registered March 2025, testnet not yet live
- 🟡 TGE timeline Q1 2026 - aligns with Notalone preference but limited runway visibility
- 🔴 No tokenomics disclosed in available materials
- 🔴 Entry FDV $40M at seed stage - at upper limit of Notalone filter ($25-40M seed preferred)

---

## 1. Company Overview
[Confidence: HIGH]

### What They Do

Sundial provides a Bitcoin Layer-2 infrastructure that allows Bitcoin holders to:

- **Generate yield** through non-custodial staking without needing to wrap BTC via traditional bridges
- **Access smart contracts** using Bitcoin on a programmable layer built with Cardano's eUTxO model
- **Participate in DeFi** with bridgeless wrapped BTC, lending, borrowing, and yield generation

**Source:** [Pitch deck, Sundial Protocol website](https://www.sundialprotocol.com/)

### The Problem They Solve

Sundial addresses three core problems in the Bitcoin ecosystem:

1. **Idle Bitcoin Capital**: ~98% of Bitcoin ($1.8 trillion) sits unproductive without yield or utility opportunities (Source: Pitch deck, slide 4)

2. **Lack of Smart Contracts**: Bitcoin doesn't natively support smart contract capabilities, limiting its use in DeFi applications (Source: Pitch deck, slide 3)

3. **Transaction Limitations**: Bitcoin's high transaction costs and slow speeds (10+ minutes per block) limit economic growth and application development (Source: Pitch deck, slide 3)

**Market Timing ("Why Now"):**
- DeFi ecosystem maturity with wallets, bridges, and tooling now available
- Bitcoin Layer-2 scaling technologies (ZK tech, Bitcoin bridges) preparing to launch
- Experienced team with ecosystem connections from Cardano and Bitcoin communities
(Source: Pitch deck, slide 3)

### Value Proposition

"Sundial is the first Layer-2 to natively unlock and put trillions of dollars of Bitcoin to work through smart contracts and yield generation."

**Differentiation:**
- First Layer-2 using eUTxO architecture (Cardano model) rather than EVM
- Bridgeless wrapped BTC secured by deterministic eUTxO and optimistic rollup
- 24,000% faster than BTC with <0.01% fees
- Native Bitcoin security through trustless ZK bridge technology

(Source: Pitch deck, slides 2, 7; [Sundial Protocol website](https://www.sundialprotocol.com/))

---

## 2. Product/Service
[Confidence: MEDIUM]

### Core Platform Components

Sundial operates on two parallel tracks:

#### Track 1: Native BTC Yield

**On-Chain Yield, No Token Needed:**
- Earn sustainable BTC yield through non-custodial staking
- Vault infrastructure secured by Sundial's fraud-proof Layer-2
- No need for users to hold platform tokens to earn yield

**Institutional-Grade Access:**
- Integrates with custody platforms (Hextrust, Solv, Cumberland)
- White-labeled BTC yield services for compliance
- Institutional yield desks integration

**Restaking & Lending Revenue:**
- BTC restaking capabilities
- Non-custodial lending pools
- Structured BTC yield instruments

(Source: Pitch deck, slide 5)

#### Track 2: Programmable BTC

**Wrapped BTC on Sundial L2:**
- Mint bridgeless, wrapped BTC natively secured by deterministic eUTxO
- Optimistic rollup architecture for security

**Cross-Chain Composability:**
- Use BTC in DeFi apps (trading, lending, synthetics)
- No custodians or fragmented bridges required
- Bitcoin-ADA interoperability

**Developer SDKs & Compliance-Ready:**
- SDKs and APIs for fintechs and dApps
- Compliance modules built-in
- Enable BTC-native DeFi development

(Source: Pitch deck, slide 5)

### Key Technical Features

| Feature | Description | Benefit |
|---------|-------------|---------|
| **Transaction Fees** | Pay in native chain token (BTC, Lightning) | Lower barrier for BTC users |
| **Speed** | 24,000% faster than BTC | High-frequency trading, DeFi possible |
| **Fees** | <0.01% transaction fees | Cost-effective for all transaction sizes |
| **Native Bitcoin Security** | Trustless ZK bridge tech (via BitcoinOS partnership) | No custodial risk |
| **Ecosystem** | 65+ partners across DeFi, wallets, infrastructure | Day 1 functionality |

(Source: Pitch deck, slide 7)

### Technology Stack

**Core Architecture:**
- eUTxO (Extended Unspent Transaction Output) model from Cardano
- Optimistic rollup with fraud proofs
- Built in collaboration with Anastasia Labs and Midgard L2 technology
- BitVM-powered ZK bridge for trustless BTC-ADA transfers

**Security Features:**
- No reentrancy attacks or state manipulation vulnerabilities
- Deterministic smart contract execution
- Regular checkpointing to Cardano mainnet
- Comprehensive security reviews (planned)

(Source: [Project Catalyst Fund 13 proposal](https://projectcatalyst.io/funds/13/cardano-partners-enterprise-randd/institutional-grade-layer-2-for-bitcoin-defi-on-cardano-in-collaboration-with-bitcoinos-tesseract-and-more), [Medium - Bitlayer partnership](https://medium.com/tap-in-with-taptools/bitlayer-bitvm-and-sundial-set-the-stage-for-bitcoin-on-cardano-3b1ae302305f))

---

## 3. Target Market
[Confidence: HIGH]

### Market Opportunity

**Total Addressable Market:**
- Bitcoin market cap: $1.8 trillion (as of Nov 20, 2025)
- Idle/unproductive BTC: ~98% of supply
- **Sundial's Target:** 5% of BTC market = **$90 billion**

(Source: Pitch deck, slide 4)

### Primary Customer Segments

1. **Bitcoin Holders (Retail & HNW)**
   - Currently earning 0% yield on holdings
   - Seeking secure, non-custodial yield opportunities
   - Conservative users who won't bridge to Ethereum

2. **Institutional Bitcoin Custodians**
   - Custody platforms: Hextrust, others
   - Need compliant yield products for clients
   - Require institutional-grade security and compliance

3. **DeFi Protocols & Developers**
   - Building Bitcoin-native DeFi applications
   - Need reliable infrastructure and liquidity
   - Seeking composable BTC for lending, trading, derivatives

4. **Financial Institutions**
   - Traditional finance entities exploring BTC yield
   - Compliance and regulatory requirements paramount
   - White-label infrastructure needs

(Source: Pitch deck, slides 5, 9; [Partnership announcements](https://www.sundialprotocol.com/news/appold-partnership))

### Geographic Focus

- **Primary Market:** Global (crypto-native)
- **Company Base:** Singapore (favorable regulatory environment)
- **Ecosystem Focus:** Cardano and Bitcoin communities

(Source: [Company registration records](https://recordowl.com/company/sundial-protocol-pte-ltd), LinkedIn)

---

## 4. Business Model
[Confidence: MEDIUM]

### Revenue Streams

Sundial positions itself as "a revenue generating protocol built for decades" with four primary revenue streams:

#### 1. Staking Yield Revenue
- Sundial earns a share of staking rewards from BTC-secured validator nodes
- Percentage of yields generated by various yield products deployed on Sundial
- Sustainable protocol revenue model

#### 2. BTC + UTxO Asset Market Making
- Provide liquidity-as-a-service across BTC pairs and DeFi markets
- Ensure low slippage and deep order books
- Stable trading environments for bridged Bitcoin and UTxO assets

#### 3. Institutional Access & Infrastructure Fees
- Integration fees from exchanges, funds, and custodians
- Retainers for secure infrastructure access
- AUM-based billing for institutional clients

#### 4. dApp Onboarding, Support & Revenue Sharing
- Protocols built on Sundial share revenue (fees, incentives, TVL-based)
- One-time and recurring support fees
- Revenue from secure infrastructure and bridged BTC liquidity access

(Source: Pitch deck, slide 10)

### Unit Economics (if available)

[NOT FOUND in public sources]

**Notes:**
- Specific pricing tiers not disclosed
- Revenue projections not available in deck
- Early stage - business model validation pending testnet/mainnet launch

---

## 5. Technology
[Confidence: MEDIUM]

### Core Technology Approach

Sundial uses an **optimistic rollup architecture** built on Cardano's **eUTxO (Extended Unspent Transaction Output)** model rather than the EVM (Ethereum Virtual Machine) approach used by most Bitcoin L2s.

**Key Technical Innovations:**

1. **Bridgeless Wrapped BTC**
   - eUTxO-native BTC representation
   - Secured by optimistic rollup fraud proofs
   - Eliminates traditional bridge vulnerabilities

2. **Deterministic Smart Contracts**
   - Transactions are deterministic based on inputs
   - No global state dependencies (unlike Ethereum)
   - Users know exactly what will happen before execution

3. **BitVM-Powered ZK Bridge** (via Bitlayer partnership)
   - Trustless bridge between Bitcoin and Cardano
   - ZK-proofs for secure cross-chain transactions
   - Off-chain computation with on-chain fraud proofs
   - Bitcoin locked on BTC blockchain, pegged asset issued on Cardano

(Source: [Project Catalyst Fund 13](https://projectcatalyst.io/funds/13/cardano-partners-enterprise-randd/institutional-grade-layer-2-for-bitcoin-defi-on-cardano-in-collaboration-with-bitcoinos-tesseract-and-more), [Medium - Bitlayer](https://medium.com/@Bitlayer/cardano-joins-btcfi-frontier-bitlayer-sundial-forge-bitvm-bridge-via-strategic-partnerships-dc90fa1186cb))

### Technical Infrastructure

**Layer-2 Architecture:**
- Built in collaboration with Anastasia Labs (Cardano protocol experts)
- Leverages Midgard L2 technology (Cardano's first permissionless L2)
- Regular checkpointing to Cardano mainnet for security
- High-frequency transaction processing at L2 level

**Security Model:**
- No reentrancy vulnerabilities (eUTxO prevents this by design)
- Fraud-proof optimistic rollup
- Industry-leading security reviews planned
- Non-custodial design throughout

**Middleware & Oracle Integration:**
- Partnership with Torram for Bitcoin-native middleware
- Decentralized data availability and proof anchoring
- Reliable oracle feeds
- Bitcoin-native programmability

(Source: [Sundial-Torram partnership](https://www.sundialprotocol.com/news/torram-partnership), [Anastasia Labs team profile](https://medium.com/@anastasia_labs/the-driving-force-behind-anastasia-labs-an-in-depth-look-at-our-team-cd3557c69b68))

### Performance Metrics

| Metric | Sundial | Bitcoin | Source |
|--------|---------|---------|--------|
| **Speed** | 24,000% faster | ~10 min/block | Deck slide 7 |
| **Fees** | <0.01% | Variable, often >$1 | Deck slide 7 |
| **Finality** | Fast (L2) | ~60 min (6 blocks) | Inferred |

---

## 6. Team/Leadership
[Confidence: HIGH]

### Founders & Management

#### Sheldon Hunt - CEO & Founder
- **Background:** Founding member of EMURGO (one of Cardano's original entities)
- **Previous Roles:**
  - Head of Cardano Ecosystem at EMURGO
  - Input Output Global (IOG) Engagement Lead – Voltaire / Intersect
  - Worked on Intersect MBO (Cardano's off-chain governance)
- **Experience:** In crypto since 2013, builder of ecosystems, tech and communities
- **Education:** University of Toronto
- **Location:** Singapore
- **LinkedIn:** [Verified profile](https://www.linkedin.com/in/sheldonhunt/)

(Source: [LinkedIn](https://www.linkedin.com/in/sheldonhunt/), [Sundial Protocol website](https://www.sundialprotocol.com/about))

#### Sam Delaney - Core Tech Lead
- Senior technical role leading core development
- [LIMITED PUBLIC INFORMATION - Background not verified in public sources]

#### Phil Disarro - Senior Developer
- **Background:** Founder and CEO of Anastasia Labs (Cardano R&D consultancy)
- **Expertise:**
  - 4+ years in compiler development, programming language theory, smart contract security
  - Recognized expert in compiler & programming language research
  - Architect of Midgard (Cardano's first permissionless Layer-2)
- **Previous Role:** FinTech Software Engineer at Plaid
- **Notable Achievement:** One of first developers to formally verify smart contracts in Cardano using Agda
- **Security Contribution:** Thwarted large-scale DDoS attack on Cardano by exploiting attacker's smart contract vulnerability

(Source: [Project Catalyst Fund 13](https://projectcatalyst.io/funds/13/cardano-partners-enterprise-randd/institutional-grade-layer-2-for-bitcoin-defi-on-cardano-in-collaboration-with-bitcoinos-tesseract-and-more), [Anastasia Labs team profile](https://medium.com/@anastasia_labs/the-driving-force-behind-anastasia-labs-an-in-depth-look-at-our-team-cd3557c69b68))

#### Vic Genin - Senior Developer
- [LIMITED PUBLIC INFORMATION]

#### Michael Yagi - Developer & Ecosystem
- [LIMITED PUBLIC INFORMATION]

### Management Team

#### Rob Gaskell - Operations & Project Management
- Founder and Partner at Appold (strategic partner and investor)
- Quoted in partnership announcements regarding institutional Bitcoin infrastructure

(Source: [Appold partnership announcement](https://www.appold.com/news/appold-announces-partnership-with-sundial))

#### Yoram BenZvi - Business Development & Partnerships
- [LIMITED PUBLIC INFORMATION]

#### Lewis Harding - Investor Relations & Operations
- [LIMITED PUBLIC INFORMATION]

#### Liz Jacobi - Investor Relations
- [LIMITED PUBLIC INFORMATION]

(Source: Pitch deck, slide 6)

### Team Composition

- **Size:** 9 core team members shown in deck
- **Key Expertise:** Cardano protocol development, Bitcoin infrastructure, DeFi
- **Notable Hires From:** EMURGO, Plaid, Cardano ecosystem
- **Technical Depth:** Strong - includes L2 architect (DiSarro), core Cardano ecosystem builders

### Key Observations

**Strengths:**
- CEO (Hunt) is a founding member of EMURGO with deep Cardano ecosystem connections
- Senior Developer (DiSarro) is a proven L2 architect with Midgard track record
- Team has complementary skills across business development, operations, and technical development
- Strong institutional relationships (evidenced by partnership traction)

**Concerns:**
- Limited public information on 5 of 9 team members
- Most team members lack easily verifiable LinkedIn profiles or public presence
- Company very new (founded March 2025) - team working together <9 months
- No prior founder/exit track record identified (beyond Cardano ecosystem experience)

---

## 7. Funding/Investors
[Confidence: MEDIUM]

### Funding History

| Round | Date | Amount | Lead Investor | Source |
|-------|------|--------|---------------|--------|
| Grant | Q1 2025 | $1M USD | Project Catalyst Fund 13 | [Catalyst](https://projectcatalyst.io/funds/13/cardano-partners-enterprise-randd/institutional-grade-layer-2-for-bitcoin-defi-on-cardano-in-collaboration-with-bitcoinos-tesseract-and-more), Deck |
| Pre-Seed | Q2 2025 | $300K | [NOT SPECIFIED] | Deck slide 13 |
| Seed (Open) | Q4 2025 (Now) | Target: $3.7M | Pointer Capital Fund II (AngelList) | Deck slide 13 |
| **Total Raised** | - | **$1.3M confirmed + $3.7M target** | - | - |

**Notes:**
- Grant was 1,800,000 ADA from Project Catalyst (~$1M USD equivalent)
- Pre-seed valuation: $20M FDV
- Current seed valuation: $40M FDV (2x markup from pre-seed)

### Investor Roster

**Current Backers:**

1. **Project Catalyst (Cardano Treasury)** - $1M grant
   - #1 Ranked Community Initiative in Fund 13
   - Validates strong community support and technical merit
   - All infrastructure outputs fully open-source under MIT license

2. **Pointer Capital Fund II (AngelList)** - Lead Investor in Seed Round
   - [SINGLE SOURCE - Deck only, not independently verified]

3. **Draper University**
   - Participating project in Tim Draper's premier accelerator program
   - [SINGLE SOURCE - Deck only, not independently verified]

4. **Appold** - Strategic Partner & Investor
   - Made a "founding investment" in Sundial Protocol
   - Provides institutional partnership and distribution

(Source: Pitch deck slide 13, [Appold partnership announcement](https://www.appold.com/news/appold-announces-partnership-with-sundial), [X/Twitter - Cardano Times](https://x.com/TheCardanoTimes/status/1869401797804360086))

### Valuation

**Current Round:**
- Raising: $3.7M
- Valuation: $40M pre-money
- Stage: Seed

**Valuation Progression:**
- Pre-seed (Q2 2025): $20M FDV
- Seed (Q4 2025): $40M FDV
- Entry→Current Multiple: 2x (in ~6 months)

**Notalone Filter Check:**
- Seed filter: $25-40M preferred ✅
- At upper limit but within acceptable range

### Use of Funds

[NOT DISCLOSED in available materials]

**Inferred priorities based on roadmap:**
- Testnet development and launch (Q3 2025)
- Security audits and performance optimization
- Ecosystem integrations and partnerships
- Mainnet preparation (Q1 2026)
- Marketing campaign for mainnet launch

---

## 7b. Token Economics
[Confidence: LOW]

### Token Overview

| Parameter | Value | Notalone Filter |
|-----------|-------|-----------------|
| **Token Status** | Planned | Token required ✅ |
| **TGE Date** | Q1 2026 | H1 2026 preferred ✅ |
| **Expected Launch FDV** | [NOT FOUND] | ≤$50M preferred ❓ |
| **Entry FDV** | $40M | Pre-seed: $10-15M, Seed: $25-40M ✅ |
| **Entry→TGE Multiple** | [CANNOT CALCULATE] | Calculate: TGE FDV / Entry FDV |

**Notes:**
- No tokenomics disclosed in deck or public materials
- TGE timing aligns well with Notalone preference (H1 2026)
- Token necessary for platform governance and fee mechanisms (inferred)

### Unlock Schedule

[NOT FOUND in available materials]

**Critical Missing Information:**
- TGE unlock percentage
- Cliff duration
- Vesting schedule
- Team/investor allocation percentages
- Total supply
- Token distribution breakdown

**Notalone Requirements Check:**
- [ ] TGE unlock ≥10% (20% ideal) - UNKNOWN
- [ ] Fully unlocked ≤18 months post-TGE - UNKNOWN
- [ ] No cliff longer than 3 months - UNKNOWN

### CEX Listing & Hedging Feasibility

| Exchange | Status | Perpetual Futures |
|----------|--------|-------------------|
| [NOT SPECIFIED] | Unknown | Unknown |

**Hedging Viable:** UNKNOWN

**Critical Gap:** No confirmed CEX listing plans disclosed. This is a **mandatory requirement** per Notalone investment policy.

### Tokenomics Red Flags

- [x] No TGE timeline ❌ (Timeline exists: Q1 2026)
- [x] TGE unlock <10% ❓ UNKNOWN
- [x] Cliff >6 months ❓ UNKNOWN
- [x] Full unlock >24 months ❓ UNKNOWN
- [x] No CEX listing plans ⚠️ NOT DISCLOSED
- [ ] Team allocation >25% ❓ UNKNOWN
- [ ] Insider unlock before public ❓ UNKNOWN

**MAJOR CONCERN:** Complete lack of tokenomics disclosure is a significant red flag for an investment decision. This must be addressed in due diligence calls.

---

## 8. Competitors
[Confidence: HIGH]

### Bitcoin Layer-2 Competitive Landscape

According to available data, there are approximately **75 active Bitcoin Layer-2 projects** and ~335 total known implementations or proposals. However, only a handful have significant traffic and TVL (Total Value Locked).

(Source: [Medium - Web3.com Ventures](https://medium.com/@Web3comVC/the-impact-and-landscape-of-bitcoin-layer-2-27ba90ab3732))

### Direct Competitors

#### 1. Stacks (STX)
- **Focus:** Comprehensive L1 blockchain for Bitcoin smart contracts, DeFi, NFTs, dApps
- **Technology:** Proof-of-Transfer consensus mechanism, Clarity programming language
- **Status:** Live, operational since 2020 (rebranded from Blockstack)
- **Differentiator:** Most established Bitcoin smart contract layer, significant ecosystem
- **Funding/Traction:** Mature project with substantial TVL and user base
- **vs. Sundial:** Stacks is L1 sidechain vs. Sundial's L2 rollup approach

(Source: [CryptoNews Bitcoin L2 projects](https://cryptonews.com/cryptocurrency/bitcoin-layer-2-projects/))

#### 2. BOB (Build on Bitcoin)
- **Focus:** Hybrid L2 network - built on Bitcoin with Ethereum compatibility
- **Technology:** OP Stack (Optimism), EVM-compatible, BitVM integration, Superchain member
- **Status:** Live, recently joined Optimism Superchain ecosystem
- **Differentiator:** EVM compatibility allows porting of Ethereum dApps to Bitcoin
- **Funding/Traction:** Backed by Interlay, institutional partnerships
- **vs. Sundial:** BOB uses EVM vs. Sundial's eUTxO model; BOB has more mature ecosystem

(Source: [Xverse Blog](https://www.xverse.app/blog/bob-build-on-bitcoin-layer-2), [CoinDesk](https://www.coindesk.com/tech/2024/10/30/bob-becomes-first-bitcoin-layer-2-project-to-join-optimisms-superchain))

#### 3. Core (CoreDAO)
- **Focus:** EVM-compatible L1 blockchain using Bitcoin's hash power for security
- **Technology:** Satoshi Plus consensus, leverages Bitcoin mining security
- **Status:** Live, operational
- **Differentiator:** Bitcoin sidechain with DPoS + PoW hybrid, CORE token staking
- **Funding/Traction:** Active Bitcoin-powered DeFi ecosystem
- **vs. Sundial:** Core is L1 sidechain vs. Sundial's L2 rollup

(Source: [CoreDAO Blog](https://coredao.org/blog/bitcoin-asset-management-protocols), [KuCoin Learn](https://www.kucoin.com/learn/crypto/top-bitcoin-layer-2-projects))

#### 4. Arch Network
- **Focus:** [Limited public information available]
- **Positioning:** Per deck, positioned as less scalable/functional than Sundial but with more liquidity depth than Starknet/BOB

(Source: Pitch deck slide 11 - Competition Matrix)

#### 5. Starknet (Bitcoin Integration)
- **Focus:** ZK-rollup technology extending to Bitcoin
- **Positioning:** Per deck, less liquidity depth, moderate scalability
- **vs. Sundial:** Sundial claims higher scalability and liquidity positioning

(Source: Pitch deck slide 11)

### Competitive Positioning Matrix

According to Sundial's self-assessment (Deck slide 11):

**Axes:** Depth of Liquidity (vertical) vs. Scalability + Functionality (horizontal)

- **Sundial:** HIGH liquidity depth, HIGH scalability/functionality (top-right quadrant)
- **Bitcoin (L1):** HIGH liquidity, LOW scalability (top-left)
- **CoreDAO:** MEDIUM-HIGH liquidity, MEDIUM scalability
- **Arch Network:** MEDIUM liquidity, MEDIUM-HIGH scalability
- **Starknet:** LOW-MEDIUM liquidity, LOW-MEDIUM scalability
- **BOB:** LOW-MEDIUM liquidity, LOW-MEDIUM scalability

**[SELF-REPORTED - Competitive positioning not independently verified]**

### Competitive Advantages

1. **eUTxO Architecture**
   - Only Bitcoin L2 using Cardano's eUTxO model vs. EVM
   - Deterministic smart contracts eliminate reentrancy vulnerabilities
   - Unique positioning vs. all major competitors

2. **Day 1 Ecosystem**
   - 65+ partners committed pre-launch
   - Leverage existing Cardano DeFi infrastructure
   - Wallets, DEXs, lending protocols ready from testnet

3. **Institutional Focus**
   - Compliance-ready modules built-in
   - Partnerships with institutional custody (Hextrust, Cumberland)
   - White-label infrastructure for traditional finance

4. **Bridgeless BTC**
   - Native eUTxO-secured wrapped BTC
   - Eliminates traditional bridge vulnerabilities
   - BitVM-powered trustless bridge (vs. custodial bridges)

(Source: Pitch deck slides 7, 8, 11)

### Competitive Disadvantages

1. **Market Entry Timing**
   - Very late to market (2025) vs. Stacks (2020), others
   - Competitors have established user bases and TVL
   - Network effects favor incumbents

2. **Ecosystem Lock-in**
   - Tied to Cardano ecosystem success
   - Smaller developer community vs. EVM (Ethereum-compatible) chains
   - Learning curve for eUTxO vs. familiar EVM model

3. **No Product Yet**
   - Testnet not live until Q3 2025
   - Competitors have working products and traction
   - Execution risk high

4. **Cardano Dependency**
   - Bitcoin community may be skeptical of Cardano-based solution
   - Cardano has struggled with developer adoption vs. Ethereum
   - Two-ecosystem challenge (Bitcoin + Cardano)

---

## 9. Recent News/Developments
[Confidence: HIGH]

### Recent Achievements

- **Project Catalyst Fund 13 (2024):**
  - Secured #1 ranking in Community Initiative category
  - Awarded 1,800,000 ADA (~$1M USD) grant
  - Proposal: "Institutional-Grade Layer-2 for Bitcoin DeFi on Cardano"

  (Source: [Project Catalyst](https://projectcatalyst.io/funds/13/cardano-partners-enterprise-randd/institutional-grade-layer-2-for-bitcoin-defi-on-cardano-in-collaboration-with-bitcoinos-tesseract-and-more), [X/Twitter announcement](https://x.com/TheCardanoTimes/status/1869401797804360086))

- **Company Formation (March 2025):**
  - SUNDIAL PROTOCOL PTE. LTD. registered in Singapore
  - Registration number: 202512044M
  - Favorable regulatory jurisdiction for crypto/fintech

  (Source: [Company records](https://recordowl.com/company/sundial-protocol-pte-ltd))

- **Traction Metrics (as of Dec 2025):**
  - 200+ BTC already committed ($20M+ liquidity at current prices)
  - 65+ ecosystem partners secured
  - Growing partnership pipeline weekly

  (Source: Pitch deck slide 9, blurb)

### Key Partnerships

#### Institutional & Finance Partners

- **Hextrust** - Custody platform for institutional-grade Bitcoin access
- **Solv Protocol** - Bitcoin staking and yield infrastructure
- **Cumberland** - Institutional trading and liquidity desk
- **Appold** - Strategic partnership for institutional Bitcoin yield infrastructure
  - Founding investment in Sundial
  - "Convinced by quality of team, strength of technology, and institutional demand"

  (Source: Pitch deck slide 9, [Appold announcement](https://www.appold.com/news/appold-announces-partnership-with-sundial))

#### Technology & Infrastructure Partners

- **Bitlayer** - BitVM implementation partnership (announced May 2025)
  - Building BitVM-powered ZK bridge
  - Enables trustless Bitcoin-Cardano interoperability
  - Off-chain computation with on-chain fraud proofs

  (Source: [Medium - Bitlayer announcement](https://medium.com/@Bitlayer/cardano-joins-btcfi-frontier-bitlayer-sundial-forge-bitvm-bridge-via-strategic-partnerships-dc90fa1186cb))

- **BitcoinOS** - Grail Bridge for trustless BTC-ADA linkages via ZK technology

  (Source: [Project Catalyst proposal](https://projectcatalyst.io/funds/13/cardano-partners-enterprise-randd/institutional-grade-layer-2-for-bitcoin-defi-on-cardano-in-collaboration-with-bitcoinos-tesseract-and-more))

- **Anastasia Labs** - Core technical development partner
  - Leading Cardano protocol development and L2 solutions
  - Philip DiSarro (CEO) serving as Sundial Senior Developer
  - Providing Midgard L2 technology foundation

  (Source: [Project Catalyst proposal](https://projectcatalyst.io/funds/13/cardano-partners-enterprise-randd/institutional-grade-layer-2-for-bitcoin-defi-on-cardano-in-collaboration-with-bitcoinos-tesseract-and-more))

- **Torram** - Bitcoin-native middleware infrastructure (announced 2025)
  - Decentralized data availability and proof anchoring
  - Reliable oracle feeds
  - Bitcoin-native programmability

  (Source: [Sundial-Torram partnership announcement](https://www.sundialprotocol.com/news/torram-partnership))

- **Tesseract** - Collaboration partner (specifics not disclosed)

#### Ecosystem Partners (65+ total)

Categories include (per deck slide 8):
- **DEXs:** Multiple logos shown (Cardano ecosystem)
- **Lending-Borrowing:** Danoga, and others
- **Wallets:** Vespr, Eternl, and others
- **Stablecoins:** Multiple projects
- **Bridge + Cross-Chain:** BOS, Wanchain, Rosen Bridge, and others
- **DeFi Management:** Vyfi, and others
- **Infrastructure:** Ikigai, Maestro, ZKFold, and others
- **NFT + Tokenization:** Clarity, NMKR, Zengate, and others
- **Finance & Consulting:** Multiple firms
- **Real World Partners:** Huawei, FC Barcelona, Dell, UN, and others
- **Retail & Utility:** Iagon, and others
- **Gaming:** Multiple projects

**[SELF-REPORTED - Partnership depth and commercial terms not verified]**

### Outlook

**Near-term milestones (per roadmap, deck slide 12):**

- **Q2 2025 (Current/Completed):** Foundational Phase
  - Company registration and legal documents ✓
  - Litepaper draft released ✓
  - First strategic partnerships ✓
  - Core technical documents released ✓

- **Q3 2025 (Next):** Testnet Launch
  - Public testnet deployment for early users and developers
  - Demo of Bitcoin-Cardano bridging mechanisms
  - Launch of early DeFi features (lending, borrowing, yield)
  - Early ecosystem onboarding and testing phase

- **Q4 2025:** Security & Ecosystem Growth
  - Formal security audits and performance optimization
  - Community developer integrations and dApp pilots
  - Business development and institutional partnerships expansion
  - Begin mainnet operational preparations

- **Q1 2026:** Mainnet Launch
  - Launch of Sundial Mainnet with Bitcoin-native DeFi using Cardano's eUTxO model
  - Trust-minimized BTC-ADA transfers within Sundial
  - Core DeFi protocols (Lending, Borrowing, Yield)
  - Governance and validator framework live
  - Global marketing campaign

- **Q2-Q4 2026:** Growth & Expansion
  - Rollout of expanded smart contract capabilities
  - Integration of new protocols and dApps
  - Ecosystem funding and developer grants
  - Ongoing upgrades to scalability, performance, and UX
  - Continued regulatory compliance and institutional adoption

(Source: Pitch deck slide 12)

---

## 10. Market Position
[Confidence: MEDIUM]

### Positioning Statement

"Sundial is the first UTxO-native Layer 2 enabling secure, compliant Bitcoin yield generation at scale. Built for institutions who demand security, compliance, and sustainable yield."

**Target Position:** Institutional-grade Bitcoin DeFi infrastructure provider (vs. retail-focused competitors)

(Source: [Sundial Protocol website](https://www.sundialprotocol.com/))

### Competitive Moats

1. **Technology Differentiation (eUTxO Model)**
   - Only Bitcoin L2 using Cardano's eUTxO architecture
   - Eliminates entire classes of vulnerabilities (reentrancy, state manipulation)
   - Deterministic execution provides predictability for institutional users
   - **Durability:** MEDIUM - Technology advantage, but adoption uncertain

2. **Day 1 Ecosystem (Cardano Integration)**
   - 65+ partners already committed pre-launch
   - Leverage battle-tested Cardano DeFi infrastructure
   - Plug-and-play wallets, DEXs, oracles from launch
   - **Durability:** MEDIUM - Partnership depth unclear, competitors building ecosystems

3. **Institutional Relationships**
   - Hextrust, Cumberland, Solv partnerships
   - Compliance-ready infrastructure from Day 1
   - White-label capabilities for traditional finance
   - **Durability:** MEDIUM-LOW - Partnerships not exclusive, competitors pursuing same market

4. **Cardano Ecosystem Network Effects**
   - Sheldon Hunt's EMURGO founding member status
   - Deep relationships in Cardano community
   - Project Catalyst #1 ranking signals community support
   - **Durability:** MEDIUM - Strong in Cardano, but limited outside ecosystem

### Market Opportunity

- **TAM (Total Addressable Market):** $1.8 trillion (entire Bitcoin market cap)
- **SAM (Serviceable Addressable Market):** ~$1.76 trillion (98% idle Bitcoin)
- **Target Market:** $90 billion (5% of Bitcoin market cap)
- **Market Growth:** Bitcoin continues to grow in adoption and institutional acceptance

**Growth Drivers:**
1. Institutional Bitcoin adoption increasing (ETFs, corporate treasuries)
2. Yield demand from Bitcoin holders (currently earning 0%)
3. Bitcoin DeFi still nascent (low penetration vs. Ethereum DeFi)
4. Regulatory clarity improving for compliant infrastructure
5. Layer-2 scaling technology maturing (ZK proofs, optimistic rollups)

(Source: Pitch deck slide 4)

### Risks and Challenges

1. **Execution Risk (HIGH)**
   - Very early stage (company <9 months old)
   - Testnet not yet launched (Q3 2025 target)
   - Complex technical implementation (Bitcoin-Cardano bridge, L2 rollup)
   - 75+ Bitcoin L2 competitors, many with live products

2. **Market Timing Risk (MEDIUM)**
   - Late entry vs. established competitors (Stacks since 2020)
   - Q1 2026 mainnet - will market still be receptive?
   - Bull market dependency for attention and liquidity
   - TGE timing (Q1 2026) dependent on successful testnet/mainnet

3. **Technology Risk (MEDIUM)**
   - eUTxO model unfamiliar to most developers (vs. EVM)
   - Cardano-Bitcoin bridge complexity
   - Dependency on partner technology (BitcoinOS, Bitlayer, Anastasia Labs)
   - Security audit findings could delay launch

4. **Adoption Risk (HIGH)**
   - Bitcoin community skepticism of non-native solutions
   - Cardano has struggled with developer adoption historically
   - Network effects favor incumbent L2s
   - Institutional sales cycles long (12-24 months)

5. **Regulatory Risk (MEDIUM)**
   - Evolving crypto regulation globally
   - Singapore base helps but not sufficient
   - Institutional partners require ongoing compliance
   - DeFi regulatory uncertainty

6. **Team Risk (MEDIUM)**
   - New team working together <9 months
   - Limited public information on most team members
   - No prior successful exits identified
   - Heavy reliance on partnerships (Anastasia Labs for core tech)

7. **Token/Liquidity Risk (HIGH)**
   - No tokenomics disclosed
   - No confirmed CEX listings
   - Hedging not possible without liquid perpetual futures
   - **This violates Notalone investment policy - deal not viable without CEX confirmation**

### SWOT Summary

| Strengths | Weaknesses |
|-----------|------------|
| Strong team credentials (Hunt from EMURGO, DiSarro from Anastasia Labs) | Very early stage, no live product |
| Unique eUTxO architecture vs. EVM competitors | Unproven team working together |
| 65+ ecosystem partners pre-launch | Small Cardano developer ecosystem vs. Ethereum |
| Project Catalyst #1 ranking, $1M grant | No tokenomics disclosed |
| Institutional partnerships (Hextrust, Cumberland) | Late to market (2025 vs. competitors in 2020-2022) |
| Huge TAM: $1.8T Bitcoin market | Complete lack of traction metrics (users, TVL) |

| Opportunities | Threats |
|---------------|---------|
| 98% of Bitcoin idle, earning 0% yield | 75+ Bitcoin L2 competitors, many live |
| Institutional Bitcoin adoption accelerating | Cardano ecosystem has struggled vs. Ethereum |
| Bitcoin DeFi still nascent vs. Ethereum | Bitcoin community skepticism of cross-chain |
| Regulatory clarity improving | Regulatory crackdown on DeFi possible |
| ZK bridge tech maturing (BitVM) | Technology execution risk (complex stack) |
| Q1 2026 TGE aligns with potential bull market | Market timing - could miss optimal window |

---

## 11. Investment Fit Assessment
[Confidence: MEDIUM]

### Notalone Screening Scorecard

| Criterion | Status | Notes |
|-----------|--------|-------|
| **TGE Timing** | ✅ | Q1 2026 - aligns with H1 2026 preference, 3-6 month timeline if investing now |
| **Product Stage** | ⚠️ | Testnet Q3 2025, not yet public - early but acceptable for seed |
| **Business Model** | ✅ | Clear, multiple revenue streams (staking, infra fees, market making, revenue share) |
| **Founders' Experience** | ✅ | Sheldon Hunt (EMURGO founding member), Phil DiSarro (Anastasia Labs CEO, L2 architect) |
| **Token Unlocks** | ❌ | NOT DISCLOSED - critical gap, must be addressed in DD |
| **Sector** | ✅ | Innovative DeFi - actively liked sector |
| **Valuation (FDV)** | ⚠️ | $40M seed - at upper limit of $25-40M filter, acceptable but not ideal |
| **Momentum/Traction** | ⚠️ | 200+ BTC committed, 65+ partners - good for pre-product, but self-reported |
| **Social Proof** | ✅ | Project Catalyst #1 ranking, Pointer Capital (claimed), institutional partners |

**Scorecard Result:** 5/9 clear pass, 3/9 warning, 1/9 fail

### PMF (Product-Market Fit) Indicators

- [ ] Live product with users - **Testnet Q3 2025, Mainnet Q1 2026**
- [ ] Organic growth (not airdrop-driven) - **Too early to assess**
- [ ] Retention metrics available - **Not available**
- [ ] Revenue or clear path to revenue - **Clear path via 4 revenue streams ✓**
- [ ] Users would be disappointed if product disappeared - **Too early to assess**

**PMF Assessment:** Too early stage to evaluate PMF. Pre-product with strong partnerships is positive signal.

### Runway Assessment

| Metric | Value |
|--------|-------|
| Current runway | [NOT DISCLOSED] |
| Total raised | $1.3M confirmed (Catalyst $1M + Pre-seed $300K) |
| Raising now | $3.7M seed target |
| Potential runway with seed | ~18-24 months (estimated at $200-250K/month burn) |
| Can reach TGE without new funding? | LIKELY YES (Q1 2026 = 3-4 months) |
| Burn rate | [NOT DISCLOSED] |

**Runway Notes:**
- $5M total raised ($1.3M + $3.7M target) should be sufficient to reach Q1 2026 TGE
- Team size (9 people) suggests moderate burn rate
- Singapore base has reasonable cost structure
- Heavy reliance on partnerships (Anastasia Labs) may reduce development costs

---

## 12. Investment Considerations (Internal)

### Deal Recommendation

| Recommendation | Rationale |
|----------------|-----------|
| ⬜ **INVEST** | Strong fit, meets all criteria |
| ☑️ **INVEST (conditional)** | Good fit, needs specific conditions addressed |
| ⬜ **SERVICES** | Not investment fit, but can help as service provider |
| ⬜ **SHOWCASE** | Strong project, add to pipeline for investor visibility |
| ⬜ **PASS** | Does not meet investment criteria |

**Conditional Investment - Required Conditions:**

1. **MANDATORY - Tokenomics Disclosure**
   - TGE unlock schedule (minimum 10%, ideally 20%)
   - Full unlock timeline (maximum 18 months post-TGE)
   - Vesting terms for seed investors
   - Team and advisor allocations

2. **MANDATORY - CEX Listing Confirmation**
   - Confirmed listing on CEX with liquid perpetual futures
   - Required for hedging strategy per Notalone policy
   - Deal is NOT viable without this

3. **HIGHLY DESIRABLE - Traction Validation**
   - Verify 200+ BTC commitment (on-chain or contractual evidence)
   - Validate depth of 65+ partnerships (LOIs, contracts, integration status)
   - Testnet metrics post-Q3 2025 launch

4. **DESIRABLE - Launch FDV Expectation**
   - Team's projected TGE FDV
   - Justification for valuation (comparables, market position)
   - Required for Entry→TGE multiple calculation per framework

### Why Interesting

1. **Massive TAM with Clear Pain Point**
   - $1.8T Bitcoin market, 98% sitting idle earning 0%
   - Institutional demand for compliant yield products validated by partnerships
   - First-mover in eUTxO-based Bitcoin L2 (unique positioning)

2. **Strong Team with Ecosystem Moats**
   - Sheldon Hunt is EMURGO founding member (deep Cardano ecosystem access)
   - Phil DiSarro is proven L2 architect (Midgard) with security expertise
   - Day 1 ecosystem of 65+ partners leverages Cardano infrastructure

3. **Institutional Focus Aligns with Market Trend**
   - Bitcoin ETF approval driving institutional adoption
   - Compliance-ready infrastructure differentiates from retail-focused competitors
   - Hextrust, Cumberland partnerships signal institutional validation

4. **Technology Differentiation**
   - eUTxO model eliminates reentrancy vulnerabilities (vs. EVM)
   - Deterministic smart contracts provide predictability institutions require
   - BitVM-powered bridge is cutting-edge (trustless ZK bridge)

5. **Sector Alignment**
   - Innovative DeFi = actively liked sector per Notalone criteria
   - Not Gaming/Metaverse/NFT ✓
   - Clear product/problem ✓

6. **Timeline Alignment**
   - Q1 2026 TGE aligns perfectly with Notalone H1 2026 preference
   - 3-4 month runway to TGE if investing now
   - Potential to participate in pre-testnet and pre-mainnet rounds

7. **Valuation Reasonable for Stage**
   - $40M seed FDV is at upper limit but acceptable
   - 2x markup from pre-seed in 6 months shows momentum
   - If TGE FDV reaches $80-100M (conservative for Bitcoin L2), provides 2-2.5x uplift

### Concerns

1. **CRITICAL - No Tokenomics = No Deal**
   - Zero disclosure on token structure, vesting, allocations
   - Cannot evaluate unlock timeline vs. Notalone 18-month requirement
   - Cannot assess TGE unlock percentage vs. 10-20% requirement
   - **This is a deal-breaker until resolved**

2. **CRITICAL - No CEX Confirmation = No Deal**
   - Notalone policy: "A deal is not viable unless hedging is possible"
   - Hedging requires "confirmed to list on a centralized exchange with liquid perpetual futures"
   - No exchange discussions disclosed
   - **This is a deal-breaker until resolved**

3. **HIGH - Execution Risk on Complex Technology**
   - Bitcoin-Cardano bridge via BitVM is cutting-edge (unproven at scale)
   - eUTxO model unfamiliar to most developers (adoption challenge)
   - Testnet delayed or failing would cascade to TGE delay
   - Heavy dependency on partner technology (Anastasia Labs, BitcoinOS, Bitlayer)

4. **HIGH - Very Early Stage with No Live Product**
   - Company founded March 2025 (<9 months old)
   - Testnet not until Q3 2025 (still 6+ months away)
   - No users, no TVL, no transaction metrics
   - 200+ BTC "committed" is self-reported and unverified

5. **MEDIUM - Late Market Entry**
   - 75+ Bitcoin L2 competitors, many with live products
   - Stacks operational since 2020 with established ecosystem
   - BOB, Core, others have head start on user acquisition
   - Network effects favor incumbents

6. **MEDIUM - Cardano Ecosystem Dependency**
   - Cardano has struggled with developer adoption vs. Ethereum
   - Bitcoin community may be skeptical of Cardano-based solution
   - Two-ecosystem challenge (must succeed in both Bitcoin and Cardano)
   - eUTxO learning curve limits developer pipeline

7. **MEDIUM - Valuation at Upper Limit**
   - $40M seed FDV is maximum per Notalone filter
   - Entry→TGE multiple calculation impossible without TGE FDV disclosure
   - If TGE FDV is <$60M, insufficient uplift per framework
   - Risk of down round if testnet/mainnet underwhelms

8. **MEDIUM - Partnership Validation Unclear**
   - 65+ partners claimed but depth unclear (LOIs vs. live integrations?)
   - Institutional partners (Hextrust, Cumberland) - commercial terms unknown
   - Pointer Capital and Draper University not independently verified
   - Real World Partners (Huawei, FC Barcelona, Dell, UN) - connection unclear

9. **LOW-MEDIUM - Team Transparency**
   - Limited public information on 5 of 9 team members
   - No prior successful exits identified
   - Team working together <9 months (cohesion unproven)

### IC Questions to Address

**CRITICAL (Must Answer Before Investment):**
- [ ] What are the complete tokenomics (supply, distribution, vesting, TGE unlock %)?
- [ ] What is the investor vesting schedule (cliff, unlock timeline, TGE %)?
- [ ] Which CEX(es) have confirmed listing commitments? When will perpetual futures launch?
- [ ] What is the expected TGE FDV and justification?
- [ ] What is the current burn rate and runway to TGE?

**HIGH PRIORITY:**
- [ ] Can you provide evidence of 200+ BTC commitments (contracts, on-chain, LOIs)?
- [ ] What is the status of 65+ partnerships (categories: signed, LOI, verbal)?
- [ ] What are the commercial terms with institutional partners (Hextrust, Cumberland, Solv)?
- [ ] What happens if testnet is delayed beyond Q3 2025? TGE delay scenarios?
- [ ] Who else is in the current seed round? What is allocation remaining?
- [ ] What are the security audit plans (firm, timeline, scope)?

**MEDIUM PRIORITY:**
- [ ] What is the go-to-market strategy for user acquisition post-mainnet?
- [ ] How does pricing/revenue sharing work with dApps building on Sundial?
- [ ] What is the competitive response to Stacks, BOB, CoreDAO?
- [ ] What happens if Bitcoin community rejects Cardano-based solution?
- [ ] What is the plan for developer adoption given eUTxO learning curve?
- [ ] Can you verify Pointer Capital and Draper University involvement?

**DUE DILIGENCE ACTIONS:**
- [ ] Reference calls with Anastasia Labs (Phil DiSarro) on technical delivery
- [ ] Reference calls with institutional partners on commercial relationship depth
- [ ] Independent technical review of litepaper/technical docs by advisor
- [ ] Background checks on Sheldon Hunt (EMURGO tenure, reputation)
- [ ] Project Catalyst Fund 13 proposal review for technical details
- [ ] Comparison of eUTxO vs. EVM approach with technical advisor
- [ ] Bitcoin L2 market landscape validation with sector expert
- [ ] Singapore entity verification and legal structure review

### Next Steps

**IF INTERESTED - Immediate Actions:**

1. **Schedule Founder Call**
   - Sheldon Hunt (CEO) and Phil DiSarro (Senior Developer/CTO role)
   - Focus: Tokenomics disclosure, CEX plans, technical roadmap
   - Bring technical advisor for eUTxO/L2 architecture questions

2. **Request Data Room**
   - Tokenomics deck
   - Partnership agreements/LOIs
   - Financial model and burn rate
   - Technical architecture documentation
   - Security audit plans
   - Cap table and investor rights

3. **Technical Deep Dive**
   - Review litepaper and technical documents
   - Understand eUTxO vs. EVM trade-offs
   - Assess Bitcoin-Cardano bridge feasibility
   - Evaluate dependency on partner technology

4. **Reference Checks**
   - Anastasia Labs (Phil DiSarro) - technical delivery capability
   - Cardano community members - Sheldon Hunt reputation
   - Institutional partners - commercial relationship validation

5. **Competitive Analysis**
   - Benchmark against Stacks, BOB, CoreDAO
   - Validate "Day 1 ecosystem" claims
   - Assess technology differentiation durability

**IF PASSING - Reasons:**
- Tokenomics not disclosed = cannot assess vs. Notalone filters
- No CEX confirmation = violates mandatory hedging requirement
- Too early stage (no product) for $40M valuation
- Execution risk too high on unproven technology stack
- Late market entry vs. established competitors

---

## Pattern Analysis

### Red Flags Detected

| Pattern | Severity | Evidence | Source |
|---------|----------|----------|--------|
| **No Tokenomics Disclosure** | HIGH | Zero information on token structure, vesting, TGE unlock | Deck, all public sources |
| **No CEX Listing Plans** | HIGH | No exchange commitments disclosed, violates Notalone policy | Deck, public sources |
| **Self-Reported Traction** | MEDIUM | 200+ BTC, 65+ partners claimed but unverified | Deck slide 9 |
| **Late Market Entry** | MEDIUM | 75+ Bitcoin L2 competitors, many with live products since 2020-2022 | Market research |
| **Very Early Stage** | MEDIUM | Company <9 months old, no live product, testnet 6+ months away | Company records, roadmap |
| **Partnership Depth Unclear** | MEDIUM | Real World Partners (Huawei, FC Barcelona, Dell, UN) - connection to BTC L2 unclear | Deck slide 8 |
| **Team Transparency Low** | MEDIUM | 5 of 9 team members lack public profiles or background | LinkedIn searches |
| **Unverified Investors** | MEDIUM | Pointer Capital, Draper U mentioned only in deck | Deck slide 13 |
| **Valuation at Limit** | MEDIUM | $40M seed = maximum per Notalone filter, no room for flexibility | Deck, investment criteria |

### Success Indicators Detected

| Pattern | Strength | Evidence | Source |
|---------|----------|----------|--------|
| **Repeat Founder (Ecosystem)** | STRONG | Sheldon Hunt = EMURGO founding member | [LinkedIn](https://www.linkedin.com/in/sheldonhunt/) verified |
| **Domain Expertise** | STRONG | Phil DiSarro = L2 architect (Midgard), 4+ years compiler/PL theory | [Anastasia Labs](https://medium.com/@anastasia_labs/the-driving-force-behind-anastasia-labs-an-in-depth-look-at-our-team-cd3557c69b68) |
| **Customer Pull** | MEDIUM | 200+ BTC committed, institutional partners pre-launch | Deck (self-reported) |
| **Strategic Investors** | MEDIUM | Project Catalyst #1 ranking, institutional partners (Hextrust, Cumberland) | [Catalyst verified](https://projectcatalyst.io/funds/13/cardano-partners-enterprise-randd/institutional-grade-layer-2-for-bitcoin-defi-on-cardano-in-collaboration-with-bitcoinos-tesseract-and-more) |
| **Clear Differentiation** | MEDIUM | eUTxO architecture vs. EVM, only Bitcoin L2 on Cardano | Technical analysis |
| **Pre-Launch Ecosystem** | MEDIUM | 65+ partners committed before product launch | Deck slide 8 (self-reported) |

### Contradictions Found

| Topic | Source A Says | Source B Says | Resolution |
|-------|---------------|---------------|------------|
| Pre-seed amount | $300K (Deck slide 13) | Not mentioned in public sources | Verify in data room |
| Investor status | Pointer Capital "Lead Investor" (Deck) | No independent verification found | Request confirmation |
| Partnership depth | 65+ partners (Deck) | Some logos unclear (Huawei, FC Barcelona for BTC L2?) | Validate in DD calls |
| TGE timeline | Q1 2026 (Deck slide 12) | No tokenomics disclosed anywhere | Contradictory - address urgently |

---

## Open Questions (Information Gaps)

### Critical (Must Resolve Before Investment)

- [ ] **Tokenomics Full Disclosure** - What is the complete token structure, distribution, vesting schedule, TGE unlock %, team allocation, investor terms? **[WHY IT MATTERS: Cannot assess vs. Notalone 18-month unlock and 10-20% TGE requirements - deal-breaker]** - **[SUGGESTED SOURCE: Founder call, data room]**

- [ ] **CEX Listing Confirmation** - Which centralized exchange(s) have confirmed listing commitments? When will perpetual futures be available for hedging? **[WHY IT MATTERS: Mandatory per Notalone policy - "deal not viable unless hedging is possible"]** - **[SUGGESTED SOURCE: Founder call, exchange LOIs]**

- [ ] **Expected TGE FDV** - What is the team's projection for TGE fully diluted valuation and justification? **[WHY IT MATTERS: Required to calculate Entry→TGE multiple per Notalone framework - need minimum 1.5x, ideally 2-4x]** - **[SUGGESTED SOURCE: Founder call, financial model]**

- [ ] **Investor Vesting Terms** - What is the exact vesting schedule for seed investors (cliff, linear, TGE unlock %)? **[WHY IT MATTERS: Must be fully unlocked ≤18 months post-TGE per Notalone requirement]** - **[SUGGESTED SOURCE: Data room, term sheet]**

- [ ] **Burn Rate & Runway** - What is monthly burn rate and runway to TGE without this round? **[WHY IT MATTERS: Assess if company can reach TGE without additional funding - affects risk]** - **[SUGGESTED SOURCE: Founder call, financial model]**

### Important (Should Resolve)

- [ ] **200+ BTC Commitment Validation** - Can you provide evidence of 200+ BTC commitments (on-chain deposits, signed contracts, LOIs)? **[WHY IT MATTERS: Key traction metric, currently self-reported]** - **[SUGGESTED SOURCE: Data room, on-chain verification]**

- [ ] **Partnership Depth Analysis** - What is the status breakdown of 65+ partnerships (signed contracts, LOIs, verbal commitments, integration status)? **[WHY IT MATTERS: Differentiates real Day 1 ecosystem from aspirational partnerships]** - **[SUGGESTED SOURCE: Partnership tracker, contracts]**

- [ ] **Institutional Partner Terms** - What are the commercial arrangements with Hextrust, Cumberland, Solv (revenue share, exclusivity, integration timeline)? **[WHY IT MATTERS: Validates business model and revenue potential]** - **[SUGGESTED SOURCE: Partnership agreements]**

- [ ] **Testnet Delay Contingency** - What happens to TGE timeline if testnet is delayed beyond Q3 2025? **[WHY IT MATTERS: TGE timing (Q1 2026) is critical for Notalone H1 2026 preference]** - **[SUGGESTED SOURCE: Founder call]**

- [ ] **Security Audit Plans** - Which firm(s) will conduct security audits, on what timeline, and what scope? **[WHY IT MATTERS: Institutional partners require audited code, delays could cascade to TGE]** - **[SUGGESTED SOURCE: Technical roadmap]**

- [ ] **Pointer Capital Verification** - Can you verify Pointer Capital Fund II's lead investor status and check size? **[WHY IT MATTERS: Validates investor quality and round terms]** - **[SUGGESTED SOURCE: Pointer Capital, AngelList]**

- [ ] **Draper University Verification** - What is the nature of Draper University participation (investment amount, accelerator terms, Tim Draper personal involvement)? **[WHY IT MATTERS: Validates social proof and investor quality]** - **[SUGGESTED SOURCE: Draper University, founder call]**

- [ ] **Real World Partner Relationships** - What is the connection between Huawei, FC Barcelona, Dell, UN and Sundial's Bitcoin L2? **[WHY IT MATTERS: Deck slide 8 shows these logos under "Real World Partners" but unclear how they relate to BTC DeFi]** - **[SUGGESTED SOURCE: Partnership agreements, founder call]**

### Nice to Know

- [ ] **Developer Adoption Strategy** - How will you overcome eUTxO learning curve vs. familiar EVM to attract developers?
- [ ] **Go-to-Market Plan** - What is the user acquisition strategy post-mainnet launch?
- [ ] **dApp Revenue Sharing** - What are the specific terms for dApp revenue sharing (% split, minimum thresholds)?
- [ ] **Competitive Response** - How will you respond if Stacks or BOB replicates your eUTxO approach?
- [ ] **Bitcoin Community Skepticism** - What is the strategy to overcome Bitcoin purist skepticism of Cardano-based solution?
- [ ] **Team Backgrounds** - Can you provide LinkedIn profiles and backgrounds for the 5 team members with limited public information?
- [ ] **Cap Table** - What is the current cap table and investor rights (board seats, pro-rata, information rights)?
- [ ] **Follow-On Plans** - Is there a planned Series A post-mainnet? At what valuation/timeline?

---

## Sources

### Primary Sources (Official/Direct)

1. [Sundial Protocol Website](https://www.sundialprotocol.com/) - Company overview, positioning
2. [Sundial Pitch Deck](file:///Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/sundial/Sundial%20Deck%20-%20V2%20-%20Dec.pdf) - Core company information, metrics, roadmap
3. [Project Catalyst Fund 13 Proposal](https://projectcatalyst.io/funds/13/cardano-partners-enterprise-randd/institutional-grade-layer-2-for-bitcoin-defi-on-cardano-in-collaboration-with-bitcoinos-tesseract-and-more) - Technical details, partnerships, $1M grant
4. [Singapore Company Registration](https://recordowl.com/company/sundial-protocol-pte-ltd) - SUNDIAL PROTOCOL PTE. LTD., registered March 20, 2025

### Secondary Sources (Verified Reporting)

5. [Medium - Bitlayer Partnership Announcement](https://medium.com/@Bitlayer/cardano-joins-btcfi-frontier-bitlayer-sundial-forge-bitvm-bridge-via-strategic-partnerships-dc90fa1186cb) - BitVM bridge partnership details
6. [Medium - TapTools Analysis](https://medium.com/tap-in-with-taptools/bitlayer-bitvm-and-sundial-set-the-stage-for-bitcoin-on-cardano-3b1ae302305f) - Bitcoin-Cardano integration
7. [Appold Partnership Announcement](https://www.appold.com/news/appold-announces-partnership-with-sundial) - Strategic partnership and founding investment
8. [Sundial-Torram Partnership](https://www.sundialprotocol.com/news/torram-partnership) - Middleware infrastructure collaboration
9. [Medium - Anastasia Labs Team Profile](https://medium.com/@anastasia_labs/the-driving-force-behind-anastasia-labs-an-in-depth-look-at-our-team-cd3557c69b68) - Phil DiSarro background and expertise
10. [LinkedIn - Sheldon Hunt Verified Profile](https://www.linkedin.com/in/sheldonhunt/) - CEO background, EMURGO founding member

### Tertiary Sources (Market Research/Analysis)

11. [X/Twitter - Cardano Times Announcement](https://x.com/TheCardanoTimes/status/1869401797804360086) - Project Catalyst Fund 13 ranking
12. [X/Twitter - Sundial Official Account](https://x.com/sundialprotocol?lang=en) - Company social media
13. [KuCoin Learn - Top Bitcoin Layer-2 Projects](https://www.kucoin.com/learn/crypto/top-bitcoin-layer-2-projects) - Competitive landscape
14. [Medium - Web3.com Ventures BTC L2 Analysis](https://medium.com/@Web3comVC/the-impact-and-landscape-of-bitcoin-layer-2-27ba90ab3732) - 75+ Bitcoin L2 projects statistic
15. [Xverse Blog - BOB Guide](https://www.xverse.app/blog/bob-build-on-bitcoin-layer-2) - Competitor analysis
16. [CryptoNews - Bitcoin Layer 2 Projects](https://cryptonews.com/cryptocurrency/bitcoin-layer-2-projects/) - Market overview
17. [CoreDAO Blog](https://coredao.org/blog/bitcoin-asset-management-protocols) - Competitor positioning
18. [CoinDesk - BOB Joins Superchain](https://www.coindesk.com/tech/2024/10/30/bob-becomes-first-bitcoin-layer-2-project-to-join-optimisms-superchain) - Competitive developments

### Self-Reported (Company Materials - Requires Verification)

19. Pitch Deck Slide 4 - $1.8T BTC market cap, 98% idle, $90B target
20. Pitch Deck Slide 9 - 200+ BTC committed, 65+ partners
21. Pitch Deck Slide 13 - Pointer Capital, Draper University backing
22. Pitch Deck Slides 8, 9 - Partnership logos and categories

---

## Research Methodology

**Passes Completed:**
- [x] Pass 1: GATHER - Raw information collection from deck, blurb, web searches
- [x] Pass 2: VERIFY - Cross-reference team backgrounds (LinkedIn), partnerships (press releases), Catalyst funding
- [x] Pass 3: SYNTHESIZE - Pattern recognition (red flags: no tokenomics, no CEX; success indicators: team, Catalyst #1)
- [x] Pass 4: RECOMMEND - Final report with confidence levels, conditional investment recommendation

**Entity Verification:** PASSED
- Website verified: Yes (sundialprotocol.com - live and functional)
- Founders verified on LinkedIn: Partial (Sheldon Hunt verified, others limited info)
- Third-party mentions found: Yes (Project Catalyst, Bitlayer, Appold partnerships verified)
- Company registration verified: Yes (Singapore, March 20, 2025)

**Verification Confidence:**
- HIGH: Sheldon Hunt background, Project Catalyst funding, Bitlayer/Appold partnerships
- MEDIUM: Philip DiSarro background (Anastasia Labs verified, Sundial role confirmed in Catalyst docs)
- LOW: Other team members, Pointer Capital/Draper involvement, 200+ BTC commitment, 65+ partners depth

---

*Report compiled: December 11, 2025, 3:45 PM UTC*
*Research conducted by: @agent-deal-researcher*
*Overall Confidence: MEDIUM*
*Red Flags Found: 9 (2 HIGH severity - tokenomics and CEX)*
*Open Questions: 5 critical, 8 important, 8 nice-to-know*

---

## INVESTMENT RECOMMENDATION SUMMARY

**Status:** CONDITIONAL INVESTMENT (Subject to Critical Conditions)

**Rationale:** Sundial presents a compelling opportunity in the massive Bitcoin yield market with unique eUTxO-based technology and a strong Cardano ecosystem team. However, **two critical deal-breakers must be resolved before investment**:

1. **Tokenomics disclosure** (TGE unlock, vesting, allocations)
2. **CEX listing confirmation** with perpetual futures for hedging

Without these, the deal violates Notalone investment policy and cannot proceed.

**Recommended Next Action:** Schedule founder call to address critical questions. If answers are satisfactory, proceed to data room and technical DD. If not, pass.

**Valuation Assessment:** $40M seed FDV is at upper limit but acceptable IF TGE FDV reaches $80-120M (2-3x uplift). Requires validation of team's TGE FDV expectations.

**Timeline Fit:** Q1 2026 TGE aligns perfectly with Notalone H1 2026 preference. Strong timing match if execution stays on track.

**Risk Level:** HIGH (early stage, complex technology, competitive market, no live product)

**Upside Potential:** VERY HIGH (if successful, could capture significant share of $90B target market in nascent Bitcoin DeFi space)

---

**END OF REPORT**