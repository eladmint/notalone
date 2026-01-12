# Textile Credit - Research Report

**Research Date:** 2025-12-14
**Company Website:** https://app.textilecredit.com/
**Documentation:** https://docs.textilecredit.com/
**Headquarters:** Israel (likely, based on founder location)
**Founded:** ~2024-2025 (estimated)

---

## Deal Classification

| Field | Value |
|-------|-------|
| **Deal Type** | Investment |
| **Token Status** | Token (TEXT token planned) |
| **Industry** | RWA - Private Credit |
| **Industry Fit** | ✅ Actively Liked (RWA, DeFi) |

### Quick Kill Check
- [x] Token project (not equity-only) - **PASS** (TEXT token planned)
- [x] Non-excluded sector (not Gaming/Metaverse/NFT) - **PASS** (RWA/DeFi)
- [x] Known team (not anonymous) - **PASS** (Tomer Bariach verified)
- [?] Has product or traction (if >6 months old) - **PARTIAL** (Product live, traction unclear)
- [?] FDV ≤ $100M - **UNKNOWN** (No valuation data available)
- [x] Clear product/problem - **PASS** (Clear value proposition)
- [x] Not a direct clone - **PASS** (Novel approach to private credit)

**Kill Criteria Triggered:** None

---

## Confidence Summary

| Section | Confidence | Notes |
|---------|------------|-------|
| Company Overview | MEDIUM | White paper + docs available, limited web presence |
| Product/Service | HIGH | Detailed technical documentation in white paper |
| Target Market | MEDIUM | Clear TAM, limited specific customer data |
| Business Model | HIGH | Well-documented in white paper |
| Technology | HIGH | Comprehensive technical architecture documented |
| Team/Leadership | LOW | Only one founder verified, co-author unclear |
| Funding/Investors | UNKNOWN | No public funding information found |
| Token Economics | MEDIUM | White paper provides structure, missing key details |
| Competitors | MEDIUM | Market landscape understood, direct comp unclear |
| Investment Fit | LOW | Missing critical investment terms data |

**Overall Confidence:** MEDIUM-LOW

---

## Executive Summary

Textile Credit is building a programmable, decentralized private credit infrastructure that connects capital providers with alternative credit companies (originators) globally. The platform tokenizes debt positions as ERC-20 tokens, enabling secondary market liquidity, composability with DeFi protocols, and programmable credit allocation through curator-managed vaults.

**Key Signals:**
- 🟢 Strong sector fit (RWA + DeFi, actively liked by Notalone)
- 🟢 Novel technical approach to private credit liquidity problem
- 🟢 Experienced founder (Tomer Bariach - GoodDollar, Flori Ventures)
- 🟢 Comprehensive white paper demonstrating technical depth
- 🔴 No public funding/investor information
- 🔴 Limited traction/metrics visibility
- 🔴 Second co-founder (Benoit Nolens) not verified
- 🟡 TGE timing unknown
- 🟡 Entry valuation unknown

---

## 1. Company Overview
[Confidence: MEDIUM]

### What They Do

Textile provides a decentralized lending protocol that transforms private credit markets into open, programmable systems. The platform allows:

- **Borrowers (Originators)** to permissionlessly create credit pools and raise capital
- **Lenders (Capital Providers)** to directly invest in debt pools or through curator-managed vaults
- **Curators** to create and manage diversified credit baskets
- **Deal Managers** to structure, price, and manage collateral for pools
- **Data Validators** to verify and attest to reported borrower data

**Source:** [White paper, pg 1-2](file:///Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/textile-credit/white-paper.md)

### The Problem They Solve

**1. Global Credit Shortage in Emerging Markets**
Private credit in developed markets benefits from unified financial and regulatory systems. However, emerging markets face:
- Capital located primarily outside their borders
- High overhead for international capital allocators to underwrite different markets
- Broken credit supply chains due to fragmentation

**2. Capital Drag in Private Credit**
Traditional private credit suffers from idle capital costs - either lenders or borrowers end up paying for uncommitted capital sitting unused.

**3. Lack of Secondary Market Liquidity**
Private credit secondary markets are one-sided (mostly sellers), have low volumes, and experience high slippage, making market makers avoid the space entirely.

**Source:** [White paper, Introduction & Secondary Market sections](file:///Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/textile-credit/white-paper.md)

### How They Solve It

Textile proposes a **two-layer solution**:

**Financial Layer** (DeFi infrastructure):
- AMMs for secondary markets
- Lending markets to take loans against private credit positions
- Vaults to create baskets and indexes

**Data Layer** (Oracle system):
- Translation and standardization of underlying asset data
- On-chain writing of verified data
- Third-party validation attestations

**Source:** [White paper, Abstract](file:///Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/textile-credit/white-paper.md)

---

## 2. Product/Service
[Confidence: HIGH]

### Core Platform Components

#### Debt Pools (Origination Pools)
- Borrowers issue ERC-20 Debt tokens in exchange for capital
- Each token has attached characteristics: minimum stake size, max pool size, interest payment intervals
- Tokens are tradeable and composable with DeFi
- Interest payments raise token price continuously (per-second compounding)

**Source:** [White paper, Granular Markets section](file:///Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/textile-credit/white-paper.md); [Textile Docs](https://docs.textilecredit.com/)

#### Revolving Credit Mechanism
Textile's first credit type is revolving credit, particularly suited for short-duration, high-turnover lending (microfinance, BNPL, invoice-based, remittance-backed).

**Capital Life Cycle:**

| State | Description | Interest Rate |
|-------|-------------|---------------|
| **Staked Yet Undrawn** | LP deposited, borrower hasn't drawn | 2% + DeFi yield (e.g., AAVE) |
| **Drawn Principal** | Borrower has drawn capital for lending | Full interest rate (negotiated) |
| **Repayment** | Borrower repays capital to pool | Returns to Undrawn state |

**Withdrawal Rights:** Capital providers can withdraw once per year.

**Interest Distribution:**
- Default: Interest raises token price (appreciating asset)
- Optional: LPs can lock tokens and receive direct cash flow interest (tokens redeemed pro rata)

**Source:** [White paper, Revolving Credit section](file:///Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/textile-credit/white-paper.md)

#### Curator Vaults (Baskets)
Curators create and manage diversified credit portfolios:
- Pool capital from passive LPs
- Select borrowers based on stated strategy
- Charge performance fees (deducted from interest earned)
- Strategies encoded as on-chain rules (e.g., "invest only in Senior pools with 2 years of 15%+ interest rate")
- Can be programmatic (rule-based allocation) or managed (curator discretion within rules)

**Example Programmatic Strategy:**
"Create an index of energy companies, allocate only to those with 2+ years consistent repayment history, weight allocations by TVL relative to total TVL of qualifying energy companies"

**Source:** [White paper, Baskets and Programmable Credit section](file:///Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/textile-credit/white-paper.md)

#### Secondary Market (Liquidity Solution)
Traditional AMMs don't work for private credit due to one-sided markets and low volumes. Textile's innovation:

**Curator-Managed Liquidity Pools:**
- Curator opens a stablecoin liquidity pool
- LPs stake capital into the pool
- Curator selects which Debt tokens the pool will support
- Curator sets **duration-based pricing** (monthly risk rate)

**Pricing Example:**
- Debt token X has monthly duration risk of 2%
- Next redemption in 4 months
- Lender needing liquidity now can sell at 8% discount (2% × 4 months)
- Vault immediately submits token for redemption on primary market

**Efficiency Gain:**
- Single $500K vault can support 5 pools each with $1M TVL
- Same liquidity serves multiple debt pools
- Tiered pricing: First $100K at 2% monthly, next $100K at 3%, etc.

**Source:** [White paper, Secondary Market section](file:///Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/textile-credit/white-paper.md)

#### Deal Manager Role
Optional feature - companies can add a deal manager who:
- Structures pool terms (currency, size, covenants)
- Prices the offering using market data
- Often holds debt tokens themselves (skin in the game)
- Must approve any borrower-initiated term changes
- Handles collateral management

**Source:** [White paper, Deal Manager section](file:///Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/textile-credit/white-paper.md)

### Key Features

| Feature | Description |
|---------|-------------|
| **Permissionless Pool Creation** | Originators can create credit markets without gatekeepers |
| **ERC-20 Debt Tokens** | Full composability with DeFi ecosystem |
| **Per-Second Compounding** | Continuous interest accrual |
| **Flexible Capital Deployment** | Undrawn capital earns DeFi yield + 2% |
| **Annual Withdrawal Rights** | LPs can exit once yearly |
| **Programmable Allocation** | Rule-based or curator-managed strategies |
| **Secondary Market Liquidity** | Duration-based pricing for early exits |
| **Verifiable Data Layer** | Schema-based reporting with third-party attestations |

**Source:** Compiled from [White paper, multiple sections](file:///Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/textile-credit/white-paper.md)

### Value Proposition

**For Borrowers (Originators):**
"For the first time, originators can permissionlessly create their own credit markets — fully programmable, reputation-driven, and owned end-to-end... From day one, they can raise, manage, and scale credit without gatekeepers"

**For Lenders (Capital Providers):**
- Access to global private credit markets previously unavailable
- Secondary market liquidity (unprecedented in private credit)
- Composability with DeFi (use positions as collateral, create strategies)
- Transparency through on-chain data and third-party attestations

**For Curators:**
- Performance fees for credit expertise
- Incentivized to bring originators and capital into protocol
- Revenue generation even before native token

**Source:** [White paper, Conclusion](file:///Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/textile-credit/white-paper.md)

---

## 3. Target Market
[Confidence: MEDIUM]

### Primary Customers

**1. Borrowers / Originators:**
- Alternative credit companies in emerging markets
- Microfinance institutions
- BNPL (Buy Now Pay Later) providers
- Invoice financing companies
- Remittance-backed lenders
- Short-duration, high-turnover lending operations

**2. Capital Providers:**
- DeFi users seeking real-world yield
- Institutional investors looking for private credit exposure
- Traditional credit investors seeking tokenized positions
- Yield farmers with stablecoins

**3. Curators / Deal Managers:**
- Credit experts
- Traditional debt fund managers transitioning to DeFi
- Investment advisors specializing in alternative credit

**Source:** [White paper, multiple sections](file:///Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/textile-credit/white-paper.md)

### Geographic Focus

- **Primary Market:** Emerging markets (borrower side)
- **Secondary Markets:** Global (capital provider side)
- **Specific Mention:** Problem statement emphasizes "markets that are not the US"

**Source:** [White paper, Introduction](file:///Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/textile-credit/white-paper.md)

### Customer Metrics

**[NOT FOUND]** - No public data on:
- Number of originators onboarded
- Number of active pools
- Number of LPs/capital providers
- Key logos or notable customers

**Gap Identified:** Critical to verify product-market fit

---

## 4. Business Model
[Confidence: HIGH]

### Revenue Model

**Protocol Revenue Sources:**

1. **Fee Auctions for High-Demand Pools**
   - LPs bid TEXT tokens for access to limited-capacity pools
   - Highest bidder gets allocation priority
   - Replaces "personal network" access with transparent auction

2. **TEXT Token Fee Distribution** (from auctions):
   - Pool Manager: Portion for sourcing/managing opportunity
   - Curators: Portion for their role
   - Data Verifiers: Portion for validation work
   - Textile Protocol: Portion for development/operations
   - **Burn:** Fixed portion permanently burned (deflationary)

**Curator Revenue:**
- Performance fees deducted from interest earned by vault
- Aligns incentives: curators earn more with better risk-adjusted returns

**Deal Manager Revenue:**
- [SELF-REPORTED] Presumably fees from borrowers, but not explicitly detailed in white paper

**Source:** [White paper, Textile Economy section](file:///Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/textile-credit/white-paper.md)

### Unit Economics (if available)

**[NOT FOUND]** - No public data on:
- Average pool size
- Average interest rates
- Protocol take rate
- Curator performance fees (ranges)
- Deal manager fees

**Note:** White paper states "Textile is successful when loans are being repaid on price and on time" - protocol health tied to credit performance, not just volume.

**Source:** [White paper, Textile Economy section](file:///Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/textile-credit/white-paper.md)

---

## 5. Technology
[Confidence: HIGH]

### Core Technology Approach

**Two-Layer Architecture:**

**1. Financial Layer (DeFi Infrastructure)**
   - Built on existing DeFi primitives
   - ERC-20 token standard for debt positions
   - Composable with: AMMs, lending protocols (e.g., AAVE for idle capital), vault systems
   - Smart contracts for pool management, interest calculation, withdrawal logic

**2. Data Layer (Oracle System)**
   - Schema-based data reporting for each pool
   - Standardized on-chain data writing
   - Third-party validator attestations (cryptographically signed)
   - Enables programmability (rules-based allocation based on verified data)

**Source:** [White paper, Abstract & Data Infrastructure sections](file:///Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/textile-credit/white-paper.md)

### Technical Infrastructure

**Interest Calculation:**
- Per-second compounding
- Raises token price continuously
- Alternative: Token redemption for direct interest payments

**Capital Efficiency Mechanism:**
- Undrawn capital staked in low-risk DeFi (e.g., T-bills, AAVE)
- Borrowers pay minimal 2% on undrawn + DeFi yield goes to LPs
- Full interest paid on drawn capital

**Withdrawal Mechanism:**
- Annual withdrawal windows for LPs
- Pro-rata redemption from pool

**Secondary Market Pricing:**
- Duration-based discount formula
- Curator-set monthly risk rate
- Automatic redemption submission after purchase

**Source:** [White paper, multiple technical sections](file:///Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/textile-credit/white-paper.md)

### Data Infrastructure

**Schema System:**
- Each pool attached to required data fields schema
- Defines performance, risk, and structural details reporting
- Common language for cross-pool comparison

**Reporting Flexibility:**
- Borrowers can self-report from own systems, OR
- Leverage third-party validators to extract and attest data

**Verification & Trust:**
- Third-party validators review data
- Check alignment with schema
- Confirm figures match underlying records
- Post cryptographic attestations on-chain (tamper-resistant proof)

**Importance:** Enables programmable credit - vaults can allocate based on verified, standardized data (e.g., "only pools with 2 years of 15%+ returns")

**Source:** [White paper, Verifiable Credit Data Infrastructure section](file:///Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/textile-credit/white-paper.md)

### Technology Stack (if known)

**[PARTIAL DATA]:**
- Blockchain: [NOT SPECIFIED in white paper - likely Ethereum or EVM-compatible]
- Smart Contracts: ERC-20 standard
- Integrations: AAVE (mentioned for idle capital staking)
- Oracle: Custom data schema system

**[NOT FOUND]:**
- Specific blockchain(s)
- Security audits
- Code repository (GitHub not found in search)

---

## 6. Team/Leadership
[Confidence: LOW]

### Founders

#### Tomer Bariach - CEO and Co-Founder
[Confidence: HIGH - Verified via LinkedIn, Medium, multiple sources]

- **Current Role:** CEO and Co-Founder, Textile (2024-present)
- **Education:** Economics and Psychology, Hebrew University of Jerusalem
- **Location:** Israel

**Relevant Background:**
- **GoodDollar.org** - Co-Founder & Protocol Lead (2019-2022, then Strategic Advisor)
  - Architect of GoodDollar protocol (community currency/UBI project)
  - Deep expertise in token economics and protocol design
- **Flori Ventures** - General Partner (2021-present)
  - Seed-stage web3 venture fund focused on inclusive financial systems
  - Impact investing thesis aligned with Textile's mission
- **Bancor** - Project Manager & Token Economics (2018-2019)
  - Early team member at major DeFi protocol
  - Token economics specialization
- **Jerusalem Lira** - Co-Founder (2014-2016)
  - Community currency based on Bernard Lietaer theory
  - Grassroots economic system design
- **SeedBed** - CEO (2017-2021)
  - Entrepreneurship and real estate background
- **AppCoin** - Product Marketing Manager (2015)
- **eToro** - Early work in token economics

**Expertise:**
- Token economics (multiple publications on Medium)
- Protocol architecture
- Community currencies
- DeFi infrastructure
- Impact investing
- Emerging markets finance

**Publications:**
- "Token Economics 101" (Medium/Flori Ventures)
- "Real-world credit solutions will be a trillion-dollar opportunity" (Medium/Flori Ventures)
- "The credit markets are broken at the edges" (Medium, March 2025)
- "So, what are we building?" (Medium - Textile introduction)

**Sources:**
- [Tomer Bariach LinkedIn](https://www.linkedin.com/in/tomer-bariach/)
- [The Org - Flori Ventures](https://theorg.com/org/flori-ventures/org-chart/tomer-bariach)
- [Medium Profile](https://medium.com/@tomerbariach)
- [Poach VC - Serial Founders](https://poach.vc/p/0030-serial-founders-working-on-something)

#### Benoit Nolens - Co-Author
[Confidence: VERY LOW - Cannot verify connection to Textile]

**White Paper Lists:** "Benoit Nolens, Tomer Bariach" as authors (May 2025)

**Search Results:**
- Found "Benoit Nolens" on GitHub - Founder of @kaalapay, previously @mozilla and @truestory
- Profile shows Objective-C and JavaScript projects
- **NO connection found** between this Benoit Nolens and Textile Credit
- **NO LinkedIn profile found** for Benoit Nolens in crypto/blockchain
- Search also returned Bénédicte Nolens (female) - prominent crypto regulatory executive, but NOT a founder

**[CONTRADICTION]:**
- White paper names Benoit Nolens as co-author
- No verification found of his involvement with Textile
- No LinkedIn, no mentions in company materials, no web presence connected to project

**[CRITICAL GAP]:** Second co-founder/co-author not verified. This is a red flag per investment criteria (team must be known and verifiable).

**Source:** [White paper, pg 1](file:///Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/textile-credit/white-paper.md); [GitHub search](https://github.com/bnolens)

### Team Composition

**[NOT FOUND]** - No public data on:
- Total team size
- Key hires
- Technical team depth
- Advisors
- Company structure

**Available Information:**
- Company email: tomer@textilecredit.com (suggests Tomer is primary contact)
- GitHub organization: Not found in search
- Team page: Not found on website/docs

**Source:** [Textile Docs](https://docs.textilecredit.com/)

### Key Observations

**Strengths:**
- Tomer Bariach has highly relevant background (token economics, DeFi, community currencies, emerging markets)
- Serial entrepreneur with successful protocol design experience (GoodDollar)
- Active venture capital GP gives access to networks and deal flow
- Strong alignment: Flori Ventures thesis (inclusive finance) matches Textile mission

**Concerns:**
- Second co-founder not verified (major red flag)
- No visible team beyond founder(s)
- No advisors disclosed
- Limited operational transparency

**[CRITICAL QUESTION]:** Who is Benoit Nolens and what is his role? If he's a technical co-founder, why no digital presence?

---

## 7. Funding/Investors
[Confidence: UNKNOWN]

### Funding History

**[NOT FOUND]** - No public information on:
- Funding rounds
- Amount raised
- Investors (angels or institutions)
- Valuation
- Funding dates

**Search Conducted:**
- CoinGecko, CoinMarketCap listings: Not found
- Crunchbase: Not found
- News/press releases: None found
- Tomer Bariach mentions: No funding announcements

**Indirect Signal:**
- Poach VC mentioned "serial founders working on something new" with "some initial funding"
- Source: [Poach VC profile](https://poach.vc/p/0030-serial-founders-working-on-something)

**[UNVERIFIED - TERTIARY SOURCE]:** "Some initial funding" mentioned but no details.

### Investor Roster

**[NOT FOUND]**

**Possible Connections (Speculation - NOT Verified):**
- Flori Ventures (Tomer is GP) - could be investor or just affiliated
- GoodDollar network connections
- Bancor network connections

**[CRITICAL GAP]:** No investor information available. For investment criteria, knowing previous backers is important for social proof.

### Valuation

**[NOT FOUND]**

**No data on:**
- Current valuation
- Entry valuation for this potential deal
- Previous round valuation
- FDV expectations at TGE

**[CRITICAL GAP]:** Cannot assess against Notalone filters (≤$50M preferred FDV)

### Use of Funds

**[NOT FOUND]** - No public information on capital allocation plans.

---

## 7b. Token Economics (If Applicable)
[Confidence: MEDIUM]

### Token Overview

| Parameter | Value | Notalone Filter | Status |
|-----------|-------|-----------------|--------|
| **Token Ticker** | $TEXT | - | ✅ Confirmed |
| **Token Status** | Planned | Token required | ✅ PASS |
| **TGE Date** | [NOT FOUND] | H1 2026 preferred | ❌ UNKNOWN |
| **Expected Launch FDV** | [NOT FOUND] | ≤$50M preferred | ❌ UNKNOWN |
| **Entry FDV** | [NOT FOUND] | Pre-seed: $10-15M, Seed: $25-40M | ❌ UNKNOWN |
| **Entry→TGE Multiple** | [CANNOT CALCULATE] | Calculate: TGE FDV / Entry FDV | ❌ UNKNOWN |

**Source:** [White paper, Textile Economy section](file:///Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/textile-credit/white-paper.md)

### Token Utility

**Primary Utility: Access Rights via Fee Auctions**

High-demand loan pools with limited capacity grant access via TEXT token auctions:
- LPs bid TEXT tokens for capital allocation priority
- Highest bidders get staking rights
- Loan pools denominated in stablecoins, but access requires TEXT

**Quote:** "Today access to these types of deals is a question of personal network, and your ability to be 'invited'"

**Replaces:** Private network gatekeeping with transparent, permissionless auction mechanism

**Source:** [White paper, Textile Economy section](file:///Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/textile-credit/white-paper.md)

### Token Distribution & Emissions

**Emission Mechanism:**
- TEXT minted per block
- Distributed to all pools registered as "healthy" in protocol
- Goes to: Deal managers, Curators, Data validators
- **Vesting Rule:** Tokens distributed per block but **claimable only at lifetime of loan** (ensures accountability)

**Fee Distribution (from access auctions):**
1. Pool Manager: Portion for sourcing/managing
2. Curators: Portion for their role
3. Data Verifiers: Portion for validation
4. Textile Protocol: Portion for operations
5. **Burn:** Fixed portion permanently destroyed

**Deflationary Mechanism:** Burn component makes TEXT deflationary over time.

**Source:** [White paper, Textile Economy section](file:///Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/textile-credit/white-paper.md)

### Token Allocation

**[NOT FOUND]** - No information on:
- Total supply
- Distribution percentages (team, investors, community, ecosystem, treasury)
- Team allocation percentage
- Investor allocation percentage

### Unlock Schedule

**[NOT FOUND]** - No information on:
- TGE unlock percentage
- Cliff periods
- Vesting schedules for different stakeholder groups
- Full unlock timeline

**Notalone Requirements Check:**
- [ ] TGE unlock ≥10% (20% ideal) - **UNKNOWN**
- [ ] Fully unlocked ≤18 months post-TGE - **UNKNOWN**
- [ ] No cliff longer than 3 months - **UNKNOWN**

### CEX Listing & Hedging Feasibility

**[NOT FOUND]** - No information on:
- Exchange listing plans
- Market maker agreements
- Liquidity provision strategy
- Perpetual futures availability

**Hedging Viable:** **UNKNOWN**

**[CRITICAL GAP]:** Per Notalone investment criteria, "A deal is NOT viable unless hedging is possible" - requires CEX with liquid perpetual futures. No data available.

### Tokenomics Red Flags

Assessment based on available information:

- [x] **No TGE timeline** - RED FLAG
- [?] TGE unlock <10% - UNKNOWN
- [?] Cliff >6 months - UNKNOWN
- [?] Full unlock >24 months - UNKNOWN
- [x] **No CEX listing plans** - RED FLAG (or not disclosed)
- [?] Team allocation >25% - UNKNOWN
- [?] Insider unlock before public - UNKNOWN

**2/7 confirmed red flags, 5/7 unknown** - Insufficient data for tokenomics evaluation.

### Token Economics Assessment

**Strengths:**
- Clear utility (access rights to high-demand pools)
- Deflationary mechanism (burn component)
- Aligns incentives across ecosystem participants (managers, curators, validators)
- Value accrues from protocol usage, not just speculation
- Clever design: Accountability mechanism (claim only at loan lifetime)

**Concerns:**
- No transparency on distribution, supply, vesting
- TGE timing critical for Notalone (H1 2026 preferred) - completely unknown
- No hedging feasibility data
- No launch valuation guidance

**[CRITICAL GAPS]:**
1. TGE timeline
2. Token distribution
3. Unlock schedules
4. Launch FDV expectations
5. CEX listing plans

---

## 8. Competitors
[Confidence: MEDIUM]

### Direct Competitors

#### Goldfinch
- **Focus:** Decentralized credit protocol for real-world loans
- **Model:** Senior/junior tranche structure
- **Differentiator:** Established player, ~$100M+ TVL at peak
- **Funding:** Well-funded, backed by a16z and others
- **Status:** Live, operational for 2+ years

**How Textile Differs:**
- Programmable credit (vaults, rule-based allocation)
- Novel secondary market mechanism (duration-based pricing)
- Permissionless pool creation vs. Goldfinch's borrower approval process

#### Centrifuge
- **Focus:** Tokenizing real-world assets, particularly invoices and receivables
- **Model:** Asset-backed pools, Tinlake protocol
- **Differentiator:** Strong focus on asset tokenization infrastructure
- **Funding:** Well-funded
- **Status:** Live, mature product

**How Textile Differs:**
- Focus on private credit (loans) vs. broader RWA tokenization
- Curator vault system for passive allocation
- Revolving credit mechanics vs. fixed-term asset pools

#### Credix
- **Focus:** Private credit infrastructure for emerging markets
- **Model:** Institutional-grade credit platform
- **Differentiator:** Focus on LatAm, institutional investors
- **Funding:** $11.25M raised (2022)
- **Status:** Live, operational

**How Textile Differs:**
- DeFi-native approach vs. institutional-first
- Programmable credit baskets
- Permissionless vs. curated borrower onboarding

#### Maple Finance
- **Focus:** Institutional capital markets infrastructure
- **Model:** Pool delegates manage credit pools
- **Differentiator:** Focused on institutional borrowers (crypto-native)
- **Funding:** Well-funded
- **Status:** Live, but faced challenges with defaults (Orthogonal Trading)

**How Textile Differs:**
- Emerging market focus vs. developed market institutional
- Data validation layer for transparency
- Revolving credit vs. term loans

#### Untangled Finance
- **Focus:** Private credit tokenization, particularly supply chain finance
- **Model:** Securitization platform
- **Sectors:** Automotive, textile supply chains (NOT "Textile" the company)
- **Funding:** $13.5M (Fasanara Capital lead, 2023)
- **Differentiator:** zkKYC technology, supply chain finance

**How Textile Differs:**
- Broader private credit scope vs. supply chain specific
- Permissionless platform vs. managed securitization
- DeFi composability focus

**Sources:**
- [RWA.xyz Private Credit](https://app.rwa.xyz/private-credit)
- [Untangled Funding Announcement](https://www.coindesk.com/business/2023/10/10/tokenized-rwa-platform-untangled-goes-live-gets-135m-funding-to-bring-private-credit-on-chain)
- Industry knowledge

### Indirect Competitors / Adjacent Protocols

- **TradFi Private Credit Funds:** Blackstone, Apollo, KKR credit arms (multi-billion AUM, Textile's ultimate disruption target)
- **DeFi Lending:** AAVE, Compound (crypto-collateralized, not RWA)
- **RWA Treasuries:** Ondo, Mountain Protocol (lower yield, safer assets)
- **Credit Scoring/Data:** Spectral, Credora, RociFi (complementary, could integrate)

### Competitive Advantages

**1. Programmable Credit Architecture**
- Novel concept: vaults with on-chain rules for automated allocation
- Enables strategies impossible in TradFi (e.g., "buy any debt token that is energy-backed, Senior pool, >$50M AUM, 11% return")
- **Moat:** First-mover on programmable credit infrastructure

**2. Secondary Market Innovation**
- Duration-based pricing solves private credit liquidity problem
- Curator-managed pools enable capital efficiency (one pool serves multiple debt tokens)
- **Moat:** Novel mechanism, not replicated by competitors

**3. Permissionless Origination**
- Borrowers can create pools without approval (vs. Goldfinch, Credix gated approach)
- Lowers barriers to entry for emerging market originators
- **Moat:** Truly decentralized credit market creation

**4. Verifiable Data Infrastructure**
- Schema-based reporting + third-party attestations
- Enables trust without centralized underwriting
- **Moat:** Data layer enables programmability, competitive advantage if widely adopted

**5. Capital Efficiency (Idle Capital Optimization)**
- Undrawn capital earns DeFi yield + 2%
- Solves capital drag problem unique to revolving credit
- **Moat:** Better unit economics for borrowers and lenders vs. traditional revolving credit

**Source:** [White paper, compiled sections](file:///Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/textile-credit/white-paper.md)

### Competitive Landscape Summary

**Market Position:**
- Entering a growing but competitive RWA private credit space
- Differentiated approach (programmable credit, permissionless, secondary markets)
- Competitors are well-funded and have live products with traction
- Market is early enough that multiple winners possible

**Key Competitive Risks:**
1. **Execution Risk:** Competitors have 1-3 year head start
2. **Network Effects:** Goldfinch, Centrifuge have borrower/lender networks
3. **Regulatory Risk:** Competitors may have clearer regulatory paths
4. **Capital Attraction:** Established protocols have proven track records

**Key Competitive Opportunities:**
1. **Innovation:** Novel mechanisms (programmable vaults, secondary markets) could leapfrog
2. **Emerging Markets:** Underserved by current competitors
3. **DeFi Integration:** More crypto-native than institutional competitors
4. **Timing:** RWA private credit is 2025 growth driver (per market research)

**Market Dynamics:**
- RWA private credit reached $546.8M in active loans (April 2025)
- Market shifting from Treasuries (4-5% yield) to private credit (10-16% yield)
- Total RWA market cap: $38-54B (sources vary)
- Private credit is identified as 2025's primary RWA growth driver

**Sources:**
- [BeInCrypto - RWA Private Credit](https://beincrypto.com/rwa-capital-in-2025-the-shift-from-safe-treasuries-to-high-yield-private-credit/)
- [Crypto.news - RWA Growth](https://crypto.news/rwas-hit-24b-as-private-credit-leads-2025-crypto-growth-report-shows/)
- [CoinGecko RWA Report 2025](https://www.coingecko.com/research/publications/rwa-report-2025)

---

## 9. Recent News/Developments
[Confidence: LOW]

### Recent Achievements

**[LIMITED DATA AVAILABLE]:**

- **White Paper Published:** May 2025
  - Described as "early look at design principles"
  - "Architecture is live and evolving"
  - Shared to "align contributors, attract feedback, and accelerate what's already happening on-chain"
  - Source: [White paper, About This Paper](file:///Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/textile-credit/white-paper.md)

**[INTERPRETATION]:** Language suggests product is live in some form, but unclear if mainnet or testnet.

- **Product Status:** Documentation site live (https://docs.textilecredit.com/)
- **Application:** app.textilecredit.com exists (though content unclear from web scraping)

**[NOT FOUND]:**
- Mainnet launch announcement
- Testnet launch announcement
- TVL or usage metrics
- User growth
- Partnership announcements
- Media coverage

### Key Partnerships

**[NOT FOUND]** - No public partnership announcements found.

**Potential Integrations (Mentioned in White Paper):**
- AAVE (for idle capital staking) - implementation status unknown
- DeFi AMMs (for token trading) - specific partners not named
- Data validators - no specific partners named

### Outlook

**From White Paper:**
- "Architecture is live and evolving"
- Plans to expand beyond revolving credit to other credit types
- Goal to create "trillion-dollar opportunity" (per Tomer's Medium article on real-world credit)

**[SELF-REPORTED]:** Forward-looking statements from company materials, not independently verified.

**[CRITICAL GAP]:** No verifiable traction data, launch timeline, or partnership announcements.

---

## 10. Market Position
[Confidence: MEDIUM]

### Positioning Statement

**How Textile Positions Itself:**

"Textile is not just a platform; it's a network. And unlike ecosystems where value accrues to centralized intermediaries, Textile is designed to deliver value directly to the originators."

**Key Differentiation:**
- **Permissionless:** First protocol where originators can permissionlessly create credit markets
- **Reputation-driven:** Credit based on on-chain track record and verified data, not gatekeepers
- **Originator-owned:** Originators own their credit markets end-to-end
- **Network flywheel:** Value accrues to originators as network grows

**Source:** [White paper, Conclusion](file:///Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/textile-credit/white-paper.md)

### Competitive Moats

| Moat | Strength | Description |
|------|----------|-------------|
| **1. Programmable Credit Architecture** | STRONG | Novel infrastructure for rule-based credit allocation; first-mover advantage |
| **2. Secondary Market Mechanism** | STRONG | Duration-based pricing solves private credit liquidity problem; not replicated by competitors |
| **3. Data Infrastructure** | MEDIUM | Schema-based reporting + attestations enable trust; requires network adoption to be valuable |
| **4. Network Effects** | WEAK (Early) | Curator/borrower/lender flywheel requires scale; not yet proven |
| **5. Capital Efficiency** | MEDIUM | Idle capital optimization provides better economics; replicable but not yet copied |

**Assessment:** Strong technical moats (architecture, secondary markets), but early-stage network effects are the long-term moat. Success depends on execution and adoption.

### Market Opportunity

**TAM (Total Addressable Market):**

**Global Private Credit Market:**
- Traditional finance: **$1.6 trillion** (as of 2024)
- Source: [RWA.io Private Credit Report](https://www.rwa.io/post/the-tokenization-of-private-credit-enhancing-access-to-capital)

**On-Chain Private Credit:**
- Current: **$546.8M** in total active loans (April 2025)
- RWA total market cap: **$38-54B** (December 2025)
- Private credit is fastest-growing RWA segment
- Source: [BeInCrypto](https://beincrypto.com/rwa-capital-in-2025-the-shift-from-safe-treasuries-to-high-yield-private-credit/), [CoinGecko RWA Report 2025](https://www.coingecko.com/research/publications/rwa-report-2025)

**SAM (Serviceable Addressable Market):**
- Emerging market private credit seeking tokenization
- DeFi users seeking real-world yield (10-16% vs. 4-5% Treasuries)
- Alternative credit originators (microfinance, BNPL, invoice financing)

**Estimated SAM:** $50-100B over 5 years (if RWA private credit captures 5-10% of TradFi market)

**Growth Drivers:**
1. **Yield Migration:** Capital flowing from Treasuries (4-5%) to private credit (10-16%)
2. **RWA Adoption:** Institutional and retail appetite for tokenized assets
3. **Emerging Market Needs:** $5T+ credit gap in developing economies (White paper claim)
4. **DeFi Maturation:** Infrastructure ready for real-world asset integration
5. **Regulatory Clarity:** Increasing frameworks for tokenized securities (2024-2025)

**Source:** Compiled from [White paper](file:///Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/textile-credit/white-paper.md), [BeInCrypto](https://beincrypto.com/rwa-capital-in-2025-the-shift-from-safe-treasuries-to-high-yield-private-credit/), [CoinGecko RWA Report](https://www.coingecko.com/research/publications/rwa-report-2025)

### Risks and Challenges

**1. Execution Risk (HIGH)**
- Product live status unclear (mainnet vs. testnet)
- No visible traction data
- Competitors have 1-3 year head start
- Team size unknown - may lack resources to execute

**2. Regulatory Risk (HIGH)**
- Tokenized debt may be securities in most jurisdictions
- Third-party validators may need licenses
- Cross-border lending regulatory complexity
- No disclosed legal structure or compliance strategy

**3. Credit Risk (HIGH)**
- Platform success depends on loan repayment ("repaid on price and on time")
- Permissionless pool creation could attract bad actors
- Data validation quality critical - unproven
- Default handling mechanism not detailed in white paper

**4. Liquidity Risk (MEDIUM)**
- Secondary market mechanism untested at scale
- Curator vaults require bootstrapping
- Annual withdrawal windows could cause liquidity crunches
- DeFi yield integrations (AAVE) add smart contract risk

**5. Market Risk (MEDIUM)**
- RWA private credit growing but still nascent ($546M active loans)
- Institutional adoption uncertain
- Competing with TradFi yields and crypto-native yields
- Bear market could reduce capital provider appetite

**6. Technology Risk (MEDIUM)**
- Smart contract risk (no audits disclosed)
- Oracle risk (data validation layer is critical infrastructure)
- Composability with evolving DeFi protocols
- Scalability unknowns

**7. Network Effects / Cold Start (HIGH)**
- Need borrowers, lenders, curators, validators simultaneously
- Chicken-and-egg: Lenders want borrowers, borrowers want capital
- Established competitors have networks
- TEXT token auction mechanism requires high-demand pools (may not exist early)

**8. Team Risk (MEDIUM-HIGH)**
- Second co-founder unverified (red flag)
- Team size unknown
- Operational capacity unclear
- Single point of failure if Tomer is only known team member

**9. Funding Risk (UNKNOWN)**
- No disclosed funding or runway
- Cannot assess ability to reach TGE without new capital
- Unknown burn rate

**10. Tokenomics Risk (MEDIUM)**
- No transparency on distribution, vesting, supply
- TGE timing unknown (critical for Notalone's H1 2026 preference)
- Utility depends on high-demand pools existing (unproven)

### SWOT Summary

| Strengths | Weaknesses |
|-----------|------------|
| Novel programmable credit architecture | No verified second co-founder |
| Strong founder background (Tomer) | No visible team beyond founder(s) |
| Solves real problem (private credit liquidity) | No public traction data |
| Capital efficiency innovation | No funding/investor transparency |
| Clear technical vision (white paper) | Product status unclear (mainnet?) |
| Hot sector (RWA private credit) | Late to market vs. competitors |
| DeFi composability design | Cold start / network effects challenge |

| Opportunities | Threats |
|---------------|---------|
| RWA market growing rapidly ($38-54B) | Well-funded competitors (Goldfinch, Centrifuge, etc.) |
| Private credit is 2025's RWA growth driver | Regulatory crackdown on tokenized securities |
| Emerging market credit gap ($5T+) | Credit defaults could damage reputation |
| Yield migration from Treasuries (4-5% → 10-16%) | Bear market reducing capital provider appetite |
| Institutional appetite for tokenized assets | Smart contract exploits / hacks |
| Underserved originator segment | TradFi incumbents entering space (BlackRock, etc.) |
| First-mover on programmable credit | Market saturation (too many RWA protocols) |

---

## 11. Investment Fit Assessment
[Confidence: LOW - Insufficient Data]

### Notalone Screening Scorecard

| Criterion | Status | Notes |
|-----------|--------|-------|
| **TGE Timing** | ❌ UNKNOWN | No TGE timeline disclosed; H1 2026 preferred but no data |
| **Product Stage** | ⚠️ UNCLEAR | White paper says "architecture is live" but no mainnet confirmation; app exists but unclear if functional |
| **Business Model** | ✅ PASS | Clear, scalable model (fee auctions, curator fees); sustainable if credit performs |
| **Founders' Experience** | ⚠️ PARTIAL | Tomer highly qualified (GoodDollar, Flori, Bancor), but second co-founder unverified (red flag) |
| **Token Unlocks** | ❌ UNKNOWN | No vesting schedule disclosed; cannot assess ≤18 month requirement |
| **Sector** | ✅ PASS | RWA private credit - actively liked by Notalone |
| **Valuation (FDV)** | ❌ UNKNOWN | No entry FDV or TGE FDV disclosed; cannot assess ≤$50M filter |
| **Momentum/Traction** | ❌ FAIL | No public metrics, no TVL, no user count, no partnerships |
| **Social Proof** | ❌ FAIL | No disclosed investors, no media coverage, no known backers |

**Scorecard Result:** 2/9 criteria clearly met, 2/9 partial, 5/9 fail/unknown

**Assessment:** **INSUFFICIENT DATA for investment decision.** Strong sector fit and business model, but critical gaps in team verification, traction, valuation, and tokenomics.

### PMF (Product-Market Fit) Indicators

- [ ] **Live product with users** - Product exists but user base unknown
- [ ] **Organic growth (not airdrop-driven)** - No growth data available
- [ ] **Retention metrics available** - Not available
- [ ] **Revenue or clear path to revenue** - Clear path (fee auctions, curator fees) but no revenue data
- [ ] **Users would be disappointed if product disappeared** - Cannot assess without knowing users

**PMF Assessment:** **UNVERIFIABLE** - Product may be live but no evidence of product-market fit.

### Runway Assessment

| Metric | Value |
|--------|-------|
| Current runway | **UNKNOWN** |
| Can reach TGE without new funding? | **UNKNOWN** |
| Burn rate | **UNKNOWN** |
| Funding raised | **UNKNOWN** |

**Runway Assessment:** **CANNOT ASSESS** - Critical gap for investment decision.

---

## 12. Investment Considerations (Internal)

### Deal Recommendation

| Recommendation | Rationale |
|----------------|-----------|
| ⬜ INVEST | Insufficient data |
| ⬜ INVEST (conditional) | Insufficient data |
| ☑️ **CONDITIONAL INTEREST** | Strong sector fit and technical vision, but requires extensive due diligence to fill critical gaps |
| ⬜ SERVICES | Not applicable |
| ⬜ SHOWCASE | Could be option if terms don't fit |
| ⬜ PASS | Not recommended yet - need more data |

**Recommendation: CONDITIONAL INTEREST - Proceed to Intro Call with Critical Questions**

### Why Interesting

**Strong Positives:**

1. **Sector Alignment (HIGH VALUE)**
   - RWA private credit is Notalone's actively liked category
   - Market timing excellent: 2025 identified as private credit growth year
   - TAM is massive ($1.6T TradFi, $50-100B tokenized opportunity)

2. **Technical Innovation (HIGH VALUE)**
   - Programmable credit is novel concept with strong moat potential
   - Secondary market mechanism solves real problem (private credit liquidity)
   - Data validation layer enables trust at scale
   - Capital efficiency optimization (idle capital → DeFi yield)

3. **Founder Quality (MEDIUM-HIGH VALUE)**
   - Tomer Bariach has exceptional background: GoodDollar (protocol design), Flori Ventures (GP), Bancor (token economics)
   - Deep domain expertise in token economics, community currencies, emerging markets
   - Serial entrepreneur with successful protocol launch
   - Network access via Flori Ventures

4. **Business Model Clarity (MEDIUM VALUE)**
   - Revenue model well-designed (fee auctions, curator fees, burn mechanism)
   - Aligns incentives across all participants
   - Sustainable if credit performs well

5. **Market Timing (MEDIUM VALUE)**
   - RWA narrative strong in 2025
   - Yield migration from Treasuries to private credit underway
   - Institutional appetite increasing

6. **Differentiation (MEDIUM VALUE)**
   - Permissionless vs. competitors' gated approaches
   - Emerging market focus vs. institutional focus
   - DeFi-native vs. TradFi hybrid models

### Concerns

**Critical Red Flags:**

1. **Team Verification Failure (HIGH RISK)**
   - Second co-founder (Benoit Nolens) completely unverified
   - No team page, no other team members visible
   - Single point of failure risk
   - **Per Notalone criteria:** "Anonymous team → REJECT" and "Team must be known and non-anonymous"

2. **Zero Traction Visibility (HIGH RISK)**
   - No TVL, no user count, no pool count
   - Product status unclear (mainnet vs. testnet)
   - No partnerships announced
   - No media coverage
   - **Per Notalone criteria:** ">6 months without product or traction → RED FLAG"

3. **No Funding/Investor Data (HIGH RISK)**
   - Cannot assess runway or ability to reach TGE
   - No social proof from investors
   - Unknown if bootstrapped or funded
   - **Per Notalone criteria:** "Tier-1/Tier-2 investors are a bonus" - none disclosed

4. **Missing Investment Terms (CRITICAL BLOCKER)**
   - No entry valuation
   - No TGE timeline (H1 2026 is Notalone requirement)
   - No token unlock schedule
   - No allocation details
   - **Cannot assess against any Notalone valuation/timing filters**

5. **No Hedging Feasibility (CRITICAL BLOCKER)**
   - No CEX listing plans disclosed
   - No perpetual futures access planned
   - **Per Notalone criteria:** "A deal is NOT viable unless hedging is possible"

**Moderate Concerns:**

6. **Competitive Landscape (MEDIUM RISK)**
   - Well-funded competitors with 1-3 year head start
   - Goldfinch, Centrifuge, Credix have proven traction
   - Network effects favor incumbents
   - Late entry requires exceptional execution

7. **Regulatory Risk (MEDIUM RISK)**
   - Tokenized debt likely securities
   - No disclosed legal structure or compliance strategy
   - Cross-border lending complexity
   - Permissionless model may face regulatory pushback

8. **Credit Risk (MEDIUM RISK)**
   - Platform success depends on loan repayment
   - Data validation quality unproven
   - Permissionless pools could attract bad actors
   - Default handling unclear

9. **Network Effects / Cold Start (MEDIUM RISK)**
   - Need borrowers, lenders, curators, validators simultaneously
   - Chicken-and-egg problem
   - TEXT token utility requires high-demand pools (may not exist early)

10. **Tokenomics Opacity (MEDIUM RISK)**
    - No distribution transparency
    - No supply/allocation data
    - Utility depends on unproven market dynamics

### IC Questions to Address

**CRITICAL (Must Answer Before Investment):**

- [ ] **Who is Benoit Nolens?** What is his role, background, and why no digital presence?
- [ ] **What is the current team size?** Who are the other team members?
- [ ] **What is the product status?** Mainnet or testnet? When did it launch?
- [ ] **What is the current traction?** TVL, number of pools, number of users, transaction volume?
- [ ] **What funding has been raised?** Amount, investors, valuation, runway remaining?
- [ ] **What is the entry valuation for this round?** FDV at entry?
- [ ] **What is the TGE timeline?** Specific month/quarter in 2025/2026?
- [ ] **What are the token unlock terms?** TGE unlock %, cliff, vesting schedule, full unlock timeline?
- [ ] **What is the expected TGE FDV?** Launch valuation range?
- [ ] **What are the CEX listing plans?** Which exchanges, perpetual futures availability?
- [ ] **What is the token allocation?** Team %, investors %, community %, ecosystem %?
- [ ] **Can the company reach TGE without new funding?** Burn rate and runway?

**IMPORTANT (Should Answer for Full DD):**

- [ ] What are the current partnerships or LOIs with originators?
- [ ] What are the smart contract audit results? (auditor, findings, status)
- [ ] What is the legal structure? (entity, jurisdiction, regulatory strategy)
- [ ] What is the go-to-market strategy for originator onboarding?
- [ ] What is the data validator onboarding strategy?
- [ ] What are the unit economics assumptions? (average pool size, interest rates, take rates)
- [ ] What is the competitive differentiation vs. Goldfinch/Centrifuge specifically?
- [ ] What are the default handling mechanisms and credit loss reserves?
- [ ] What is the regulatory risk mitigation strategy?
- [ ] Who are the advisors? (if any)

**NICE TO KNOW:**

- [ ] What is Tomer's time allocation? (Textile vs. Flori Ventures GP duties)
- [ ] What is the technical roadmap post-TGE?
- [ ] What is the geographic expansion strategy?
- [ ] What is the community building plan?
- [ ] What are the long-term vision milestones (3-5 years)?

### Next Steps

**Immediate Actions:**

1. **Schedule Intro Call** with Tomer Bariach
   - Objective: Verify team composition, product status, and obtain missing critical data
   - Focus: IC Critical Questions above
   - Decision Point: GO/NO-GO to full due diligence

2. **Request Data Room Access** (if moving forward)
   - Pitch deck (if exists beyond white paper)
   - Financial model
   - Team bios and org chart
   - Traction metrics and dashboard
   - Smart contract audit reports
   - Legal structure and regulatory opinion
   - Customer/originator pipeline
   - Cap table and previous fundraising docs

3. **Verify Product Status**
   - Request demo or testnet access
   - Review on-chain data (contract addresses, transactions)
   - Identify active pools (if any)
   - Test user flow

4. **Reference Checks**
   - Reach out to Flori Ventures network
   - Contact GoodDollar team for Tomer reference
   - Speak to any customers/originators (if exist)
   - Industry contacts in RWA space for market validation

**Conditional Path:**

- **IF Critical Questions Answered Satisfactorily:**
  - Proceed to full due diligence
  - Request term sheet review
  - Assess against Notalone filters (valuation, timing, unlocks)
  - Evaluate hedging feasibility
  - Conduct technical deep dive
  - Model market timing and regime expectations

- **IF Critical Gaps Remain:**
  - Move to **SHOWCASE** (strong project, wrong timing/stage for Notalone)
  - OR **PASS** if red flags not resolved (especially team verification)

**Timeline:**
- Intro call: Within 1-2 weeks
- GO/NO-GO decision: Post intro call
- Full DD (if GO): 2-4 weeks
- IC presentation (if DD positive): 4-6 weeks from now

---

## Pattern Analysis

### Red Flags Detected

| Pattern | Severity | Evidence | Source |
|---------|----------|----------|--------|
| **Ghost Co-Founder** | HIGH | Benoit Nolens named in white paper but completely unverifiable online; no LinkedIn, no company mentions, no connection to project found | White paper pg 1; Web searches |
| **Solo Visible Team** | MEDIUM | Only Tomer Bariach verifiable; no other team members, advisors, or org structure visible | LinkedIn, company website |
| **No Traction Disclosure** | HIGH | Zero public metrics despite "architecture is live" claim; no TVL, users, pools, or partnerships | White paper, web searches, docs site |
| **Funding Silence** | MEDIUM | No investor disclosure, no funding announcements, only vague "some initial funding" from tertiary source | Crunchbase, news searches, Poach VC |
| **Missing Investment Terms** | HIGH | No valuation, no TGE timeline, no unlock schedules - cannot evaluate against any investment criteria | All sources |
| **No Social Proof** | MEDIUM | No investor logos, no media coverage, no notable partnerships despite founder's network | Web searches |
| **Vague Product Status** | MEDIUM | "Architecture is live and evolving" but no mainnet confirmation, no launch announcement | White paper "About This Paper" |
| **No Audit Disclosure** | MEDIUM | No smart contract audits mentioned despite product being "live" | White paper, docs, web searches |
| **Tokenomics Opacity** | MEDIUM | No supply, distribution, or vesting transparency despite detailed white paper | White paper Textile Economy section |
| **Late to Market** | LOW | Competitors operational for 1-3 years with proven traction | Market research |

**Total Red Flags:** 10 (3 HIGH, 6 MEDIUM, 1 LOW)

### Success Indicators Detected

| Pattern | Strength | Evidence | Source |
|---------|----------|----------|--------|
| **Repeat/Experienced Founder** | STRONG | Tomer Bariach - successful protocol design (GoodDollar), VC GP (Flori), token economics expert (Bancor, publications) | LinkedIn, Medium, The Org |
| **Domain Expertise** | STRONG | 8+ years in token economics, DeFi, community currencies, emerging markets - highly relevant to Textile | LinkedIn background |
| **Hot Sector** | STRONG | RWA private credit identified as 2025's primary growth driver; market growing from $546M to multi-billion | CoinGecko RWA Report, BeInCrypto, Crypto.news |
| **Clear Differentiation** | MEDIUM | Novel mechanisms (programmable credit, secondary market pricing) not replicated by competitors | White paper, competitive analysis |
| **Technical Depth** | MEDIUM | Comprehensive white paper demonstrating deep thinking on architecture, incentives, and mechanisms | White paper quality |
| **Strong Business Model** | MEDIUM | Clear revenue streams (fee auctions, curator fees), deflationary tokenomics, aligned incentives | White paper Textile Economy |
| **Capital Efficiency Innovation** | MEDIUM | Idle capital optimization (DeFi yield + 2%) solves real problem in revolving credit | White paper Revolving Credit section |
| **Large TAM** | MEDIUM | $1.6T TradFi private credit market, $50-100B tokenized opportunity | RWA.io, market research |
| **Network Access** | MEDIUM | Tomer's Flori Ventures GP role provides deal flow and capital networks | LinkedIn, Flori Ventures profile |

**Total Success Indicators:** 9 (3 STRONG, 6 MEDIUM)

### Contradictions Found

| Topic | Source A Says | Source B Says | Resolution Needed |
|-------|---------------|---------------|-------------------|
| **Co-Founder Identity** | White paper: "Benoit Nolens, Tomer Bariach" (May 2025) | Web searches: No connection found between Benoit Nolens and Textile; only Tomer mentioned in all public sources | **CRITICAL:** Direct question to company - who is Benoit Nolens, what is his role, why no public presence? |
| **Product Status** | White paper: "architecture is live and evolving" | Public data: No mainnet announcement, no launch date, no on-chain metrics visible | **IMPORTANT:** Clarify mainnet vs. testnet, launch date, where to view on-chain activity |
| **Funding Status** | Poach VC: "some initial funding" (tertiary source) | All other sources: No funding information whatsoever | **IMPORTANT:** Confirm funding raised, amounts, investors |

---

## Open Questions (Information Gaps)

### Critical (Must Resolve Before Investment)

- [ ] **Co-founder verification** - Who is Benoit Nolens, what is his background, role, and why no digital presence? Is he actually involved? - **BLOCKER: Team must be known per Notalone criteria**
- [ ] **Team composition** - Who else is on the team beyond Tomer? Size, roles, backgrounds? - **CRITICAL: Assess execution capacity**
- [ ] **Product status** - Mainnet or testnet? Launch date? Where to verify on-chain? - **CRITICAL: Product stage is investment filter**
- [ ] **Traction metrics** - TVL, number of pools, number of users, transaction volume, growth rate? - **BLOCKER: Cannot assess PMF without data**
- [ ] **Funding and runway** - How much raised, from whom, at what valuation, how much runway remains? - **BLOCKER: Cannot assess ability to reach TGE**
- [ ] **Entry valuation** - What is the FDV for this investment round? - **BLOCKER: Cannot compare to ≤$50M filter**
- [ ] **TGE timeline** - What month/quarter is TGE planned? - **BLOCKER: H1 2026 is Notalone preference**
- [ ] **Token unlocks** - TGE unlock %, cliff, vesting schedule, full unlock date? - **BLOCKER: Must be ≤18 months post-TGE**
- [ ] **Token allocation** - Team %, investors %, community %, ecosystem %? - **CRITICAL: Must check team allocation ≤25%**
- [ ] **TGE FDV expectations** - What is the expected launch valuation range? - **BLOCKER: Need Entry→TGE multiple calculation**
- [ ] **CEX listing plans** - Which exchanges confirmed or in discussion? Perpetual futures availability? - **BLOCKER: Hedging is mandatory per Notalone criteria**
- [ ] **Smart contract audits** - Which auditor, what findings, what status? - **CRITICAL: Security assessment**

### Important (Should Resolve)

- [ ] **Partnerships/LOIs** - Any signed agreements with originators or lenders?
- [ ] **Legal structure** - Entity type, jurisdiction, regulatory strategy?
- [ ] **Go-to-market plan** - How will originators be onboarded at scale?
- [ ] **Data validator strategy** - Who are target validators, how will they be onboarded?
- [ ] **Unit economics** - Assumed average pool sizes, interest rates, protocol take rates?
- [ ] **Competitive positioning** - Specific differentiation vs. Goldfinch/Centrifuge?
- [ ] **Credit risk management** - Default handling, loss reserves, underwriting standards?
- [ ] **Regulatory risk** - Legal opinion on securities status, compliance roadmap?
- [ ] **Advisors** - Any advisors, their backgrounds, their involvement?
- [ ] **Tomer's time allocation** - Full-time on Textile vs. Flori Ventures GP duties?

### Nice to Know

- [ ] Post-TGE roadmap and feature development
- [ ] Geographic expansion strategy beyond initial markets
- [ ] Community building and user acquisition plan
- [ ] Long-term vision (3-5 years) and success metrics
- [ ] Backup plans if initial GTM doesn't work

---

## Sources

### Primary Sources (Official/Direct)

1. [Textile White Paper](file:///Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/textile-credit/white-paper.md) - Company white paper (May 2025) - Comprehensive technical and economic design
2. [Textile Documentation](https://docs.textilecredit.com/) - Official docs site - Product overview and guides
3. [Textile Application](https://app.textilecredit.com/) - Live application (content not accessible via scraping)

### Secondary Sources (Verified Reporting)

4. [Tomer Bariach LinkedIn](https://www.linkedin.com/in/tomer-bariach/) - Founder background verification
5. [The Org - Flori Ventures](https://theorg.com/org/flori-ventures/org-chart/tomer-bariach) - Tomer's current role as GP
6. [Tomer Bariach Medium](https://medium.com/@tomerbariach) - Founder's publications on token economics and credit
7. [LinkedIn - Textile Post](https://www.linkedin.com/posts/tomer-bariach_theres-no-shortage-of-capital-in-the-world-activity-7388956844087476224-kZAY) - Tomer's announcement about building Textile
8. [BeInCrypto - RWA Private Credit 2025](https://beincrypto.com/rwa-capital-in-2025-the-shift-from-safe-treasuries-to-high-yield-private-credit/) - Market trends: shift from Treasuries to private credit
9. [Crypto.news - RWAs Hit $24B](https://crypto.news/rwas-hit-24b-as-private-credit-leads-2025-crypto-growth-report-shows/) - Market size and private credit growth data
10. [CoinGecko RWA Report 2025](https://www.coingecko.com/research/publications/rwa-report-2025) - Comprehensive RWA market analysis
11. [RWA.xyz Private Credit](https://app.rwa.xyz/private-credit) - Private credit market data and competitor landscape
12. [RWA.io - Tokenization of Private Credit](https://www.rwa.io/post/the-tokenization-of-private-credit-enhancing-access-to-capital) - TAM data ($1.6T TradFi market)
13. [CoinDesk - Untangled Funding](https://www.coindesk.com/business/2023/10/10/tokenized-rwa-platform-untangled-goes-live-gets-135m-funding-to-bring-private-credit-on-chain) - Competitor funding and sector validation

### Tertiary Sources (Unverified/Social)

14. [Poach VC - Serial Founders](https://poach.vc/p/0030-serial-founders-working-on-something) - Mention of Tomer and "some initial funding" - **[TERTIARY - UNVERIFIED]**

### Self-Reported (Company Materials)

15. [Medium - "So, what are we building?"](https://medium.com/@tomerbariach/so-what-are-we-building-4e306c11634f) - Tomer's introduction to Textile (attempted access, 403 error)
16. [Medium - "The credit markets are broken at the edges"](https://medium.com/@tomerbariach/the-credit-markets-are-broken-at-the-edges-d8d9696b31af) - Tomer's problem statement article (March 2025)
17. [Medium - "Real-world credit solutions will be a trillion-dollar opportunity"](https://medium.com/floriventures/real-world-credit-solutions-will-be-a-trillion-dollar-opportunity-ee4d5256394f) - Tomer's market opportunity article

### Negative Search Results (Attempted, Not Found)

- Benoit Nolens connection to Textile Credit - **NOT FOUND**
- Textile Credit funding announcements - **NOT FOUND**
- Textile Credit partnerships or customers - **NOT FOUND**
- Textile Credit media coverage - **NOT FOUND**
- Textile TEXT token information - **NOT FOUND**
- Textile Credit team page - **NOT FOUND**
- CoinGecko/CoinMarketCap listing - **NOT FOUND**

---

## Research Methodology

**Passes Completed:**
- [x] Pass 1: GATHER - Raw information collection from white paper, web sources, founder research, market landscape
- [x] Pass 2: VERIFY - Cross-reference and source classification (Primary/Secondary/Tertiary); identified contradictions and unverifiable claims
- [x] Pass 3: SYNTHESIZE - Pattern recognition (10 red flags, 9 success indicators), competitive analysis, gap identification
- [x] Pass 4: RECOMMEND - Final report with confidence levels, actionable next steps, IC questions

**Entity Verification:** **PARTIAL PASS**
- Website verified: Yes (app.textilecredit.com, docs.textilecredit.com)
- Founder verified on LinkedIn: Yes (Tomer Bariach - HIGH confidence)
- Co-founder verified: **NO** (Benoit Nolens - FAILED verification - RED FLAG)
- Third-party mentions found: Limited (white paper, docs, Poach VC tertiary mention)
- Product existence: Partial (sites exist, but mainnet status unclear)

**Data Quality Assessment:**
- High-quality technical documentation (white paper)
- Strong founder verification (Tomer Bariach)
- Good market landscape data (RWA sector)
- **Critical gaps:** Team composition, traction, funding, investment terms, tokenomics details

**Limitations:**
- Google Slides pitch deck inaccessible (returned only page framework code)
- app.textilecredit.com content not scrapable (returned only CSS snippet)
- Medium article inaccessible (403 error)
- No on-chain data found (contract addresses not disclosed)
- No GitHub repository found

---

*Report compiled: 2025-12-14*
*Research conducted by: @agent-deal-researcher*
*Overall Confidence: MEDIUM-LOW*
*Red Flags Found: 10 (3 HIGH, 6 MEDIUM, 1 LOW)*
*Success Indicators: 9 (3 STRONG, 6 MEDIUM)*
*Open Questions: 12 critical, 10 important, 5 nice-to-know*

**INVESTMENT RECOMMENDATION: CONDITIONAL INTEREST - Proceed to Intro Call with Critical Questions List**

**NEXT ACTION: Schedule call with Tomer Bariach to address Critical Open Questions, especially co-founder verification, team composition, product status, and traction metrics.**
