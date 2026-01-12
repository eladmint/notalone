# Research Agent Protocol: Evidence-Based ICP Growth Activities Research

**Version:** 2.0 (Rigorous Evidence Standard)
**Date:** November 30, 2025
**Standard:** VC Diligence - Every key claim must have primary source URL

---

## CRITICAL RULE: NO FABRICATION ALLOWED

**❌ FORBIDDEN:**
- Inventing numbers without sources
- "Estimating" costs without showing methodology
- Using "industry benchmarks" without ICP validation
- Extrapolating without disclosing assumptions and math
- Round numbers without specific sources (e.g., "30 events" needs a list of 30 events)
- Quotes without attribution URLs

**✅ REQUIRED:**
- Primary source URL for every quantitative claim
- Archive.org backup URL for all web sources
- Confidence level (HIGH/MEDIUM/LOW) for every claim
- "UNVERIFIED" label if source not found after thorough search
- Explicit "What We Don't Know" sections

---

## RESEARCH AGENT INSTRUCTIONS

### Your Mission

Research ICP ecosystem growth activities (events, social media, hackathons, community building, hubs) and document ONLY what can be verified with primary sources.

**You are NOT writing a comprehensive report. You are collecting evidence.**

### Research Questions (Priority Order)

**Question 1: What growth activities did successful ICP projects actually use?**

For each successful project (DSCVR, OpenChat, etc.):
- What specific tactics did they use? (Need: blog posts, tweets, interviews citing specific activities)
- What were the documented results? (Need: dashboard data, verified growth metrics)
- What did they spend? (Need: disclosed budgets, grant amounts, or reliable estimates with methodology)

**Question 2: What were the outcomes of ICP ecosystem events?**

For major ICP events (ETHDenver, Token2049, hackathons, etc.):
- How many people attended? (Need: official reports, organizer tweets, photos/videos)
- What did it cost? (Need: disclosed budgets OR venue-based estimates with math shown)
- What projects participated? (Need: event websites, GitHub repos, announcements)
- What happened after? (Need: projects that got funded, user growth, launches)

**Question 3: What do ICP hubs actually do, and what are the results?**

For each active hub:
- How many events do they run per year? (Need: hub reports in ICP Forum, Twitter archives)
- How many people attend? (Need: event photos, self-reported attendance, estimates)
- What's their budget/revenue model? (Need: disclosed financials OR grant amounts)
- What projects have they supported? (Need: hub reports, project acknowledgments)

**Question 4: What are the documented CACs for different growth tactics?**

- Find projects that disclosed both spend and user acquisition
- Calculate CAC (show math)
- Document attribution method (how do we know users came from this channel?)
- Assign confidence level based on source quality

---

## SOURCE QUALITY STANDARDS

### HIGH Confidence Sources

**Use these for key investment claims:**
- ✅ On-chain data (IC Dashboard, IC Rocks, SNS dashboards)
- ✅ Official project blog posts with specific metrics
- ✅ DFINITY/ICP official announcements
- ✅ Verified project Twitter accounts (with archive.org backup)
- ✅ ICP Forum posts from project teams or hub operators
- ✅ Press releases from known outlets
- ✅ GitHub repositories (code, grant proposals, documentation)
- ✅ YouTube videos (official channels, conference recordings with timestamps)

### MEDIUM Confidence Sources

**Use with caveats disclosed:**
- ⚠️ Self-reported metrics (project tweets, blog posts without third-party validation)
- ⚠️ Single-source data (only one place mentions this metric)
- ⚠️ Event photos (can estimate attendance but not precise)
- ⚠️ Discord/Telegram member counts (visible but not verified active users)

### LOW Confidence Sources

**Use only if HIGH/MEDIUM not available, label clearly:**
- ⚠️ Extrapolations (e.g., estimating event cost from venue size - must show math)
- ⚠️ Third-party estimates (analyst reports, news articles citing unnamed sources)
- ⚠️ Unverified claims (someone said it but no primary source found)

### FORBIDDEN Sources

**Never use these:**
- ❌ "Industry benchmarks" without ICP-specific validation
- ❌ Your own estimates without methodology
- ❌ Paraphrasing without URLs
- ❌ "Common knowledge" without verification

---

## RESEARCH PROCESS

### Step 1: Web Search (Systematic)

**For each project/event/hub, search in this order:**

1. **Official Sources**
   - Project website blog
   - Project Medium account
   - Project Twitter (verified account)
   - DFINITY official channels
   - ICP Forum (forum.dfinity.org)

2. **Community Sources**
   - Hub Twitter accounts
   - Hub ICP Forum posts
   - Discord server "About" sections
   - Telegram channel descriptions

3. **Third-Party Sources**
   - Devpost (for hackathons)
   - Crunchbase (for funding)
   - Press releases (GlobeNewswire, PR Newswire, Cointelegraph, Coindesk)
   - YouTube (event recordings, interviews)

4. **On-Chain Data**
   - IC Dashboard (dashboard.internetcomputer.org)
   - IC Rocks (dashboard.internetcomputer.org/circulation)
   - SNS dashboards for specific projects
   - OpenChat analytics if public

**Search Syntax Examples:**
```
site:forum.dfinity.org "DSCVR"
site:medium.com "@dscvr" OR "@dscvr_one"
"DSCVR Polychain" OR "DSCVR funding"
"OpenChat SNS" site:dashboard.internetcomputer.org
"ICP Hub Indonesia" site:twitter.com
"ETHDenver 2024 ICP"
"Chain Fusion Hub Token2049"
inurl:devpost.com "Internet Computer"
```

### Step 2: Data Extraction

**For every data point you find:**

1. **Copy exact quote** from source (verbatim)
2. **Record URL** (full URL, not shortened)
3. **Archive URL** using archive.org (create snapshot if needed)
4. **Note date** of source publication
5. **Identify author/publisher** (project team, DFINITY, hub, third-party)
6. **Extract metrics** (numbers, dates, costs, outcomes)
7. **Note context** (what was being announced? Any caveats mentioned?)

**Example Entry Format:**
```
CLAIM: "DSCVR has 700K users"
SOURCE: https://medium.com/@dscvr/example-post-title
ARCHIVE: https://web.archive.org/web/20241130/https://medium.com/@dscvr/example
DATE: October 15, 2024
AUTHOR: DSCVR Team
EXACT QUOTE: "DSCVR has reached 700,000 users since launch..."
CONTEXT: Announcing new feature launch
CONFIDENCE: HIGH (official project blog post)
```

### Step 3: Triangulation (For Critical Claims)

**For investment-critical metrics (CAC, success rates, costs), find 2-3 independent sources:**

Example:
```
CLAIM: "DSCVR raised $9M from Polychain"
SOURCE 1: [DSCVR blog post] - Confidence: HIGH
SOURCE 2: [Polychain portfolio page] - Confidence: HIGH
SOURCE 3: [Press release] - Confidence: MEDIUM (third-party)
VERIFIED: ✅ (multiple independent sources agree)
```

**If sources conflict:**
```
CLAIM: "Event had 500 attendees"
SOURCE 1: [Organizer tweet: "500 people"] - Confidence: MEDIUM
SOURCE 2: [Event photos suggest 200-300] - Confidence: LOW
DISCREPANCY: Self-reported vs visual estimate
RESOLUTION: Report range "200-500 attendees (self-reported: 500, photo estimate: 200-300)"
```

### Step 4: Gap Documentation

**If you can't find a source after thorough search:**

```
CLAIM: "Events cost $2,500-$12,500 per user"
SEARCH ATTEMPTS:
- Searched ICP Forum for "event CAC" - NO RESULTS
- Searched project blogs for disclosed event spend - NO RESULTS
- Searched Twitter for "ICP event cost" - NO SPECIFIC DATA
STATUS: ❌ UNVERIFIED
RECOMMENDATION: EXCLUDE from final report OR label clearly as "UNVERIFIED INDUSTRY ESTIMATE"
```

---

## OUTPUT FORMAT

### Deliverable: ICP_GROWTH_ACTIVITIES_EVIDENCE_REPORT.md

**Structure:**

```markdown
# ICP Growth Activities: Evidence-Based Research

**Research Date:** [Date]
**Evidence Standard:** VC Diligence
**Primary Sources Collected:** [Number]
**Verified Claims:** [Number]
**Unverified Claims Excluded:** [Number]

---

## Executive Summary

[Only include findings supported by HIGH/MEDIUM confidence sources]

**What We Know (Verified):**
- [Claim 1 with source citation]
- [Claim 2 with source citation]

**What We Don't Know (Gaps):**
- [Claim that could not be verified]
- [Data that doesn't exist publicly]

---

## Section 1: Project Growth Tactics (Verified Examples)

### 1.1 DSCVR - NFT Rewards Program

**Growth Metrics (Verified):**
- Users: 700K+ [[SOURCE 1](URL)] [[ARCHIVE](archive.org URL)]
- Growth: 76K → 400K (Nov 2023 → Feb 2024) [[SOURCE 2](URL)]
- Confidence: [HIGH/MEDIUM]

**Tactics Used (Verified):**
- NFT airdrops [[SOURCE](URL)]
- Portal community structure [[SOURCE](URL)]
- Multi-crypto tipping [[SOURCE](URL)]

**Costs (Status):**
- NFT rewards: "Millions of dollars" claimed [[SOURCE if found](URL)]
- Specific amount: ❌ NOT DISCLOSED IN PUBLIC SOURCES
- CAC: Cannot calculate without verified spend data

**Limitations:**
- Exact NFT reward spend not disclosed
- User retention data not public
- Attribution unclear (organic vs incentivized growth)

---

[Repeat for each verified project]

---

## Section 2: ICP Events (Verified Data)

### 2.1 Token2049 Singapore 2024 - Chain Fusion Hub

**Event Details (Verified):**
- Date: September 19-20, 2024 [[SOURCE](URL)]
- Venue: Fullerton Hotel Singapore [[SOURCE](URL)]
- Organizer: DFINITY Foundation [[SOURCE](URL)]

**Attendance (Status):**
- Claimed: [Number if found] [[SOURCE](URL)]
- Verified: [✅/❌] via [method]
- Confidence: [HIGH/MEDIUM/LOW]

**Cost (Status):**
- Budget: ❌ NOT DISCLOSED
- Estimate: [If calculated, show math and assumptions]

**Outcomes (Verified):**
- Projects participating: [List if available] [[SOURCE](URL)]
- User growth: [If disclosed by participants] [[SOURCE](URL)]

---

[Repeat for each event]

---

## Appendix A: Full Evidence Database

[Link to EVIDENCE_TRACKING_TEMPLATE.md with all logged sources]

## Appendix B: Search Methodology

[Document all searches performed, results, dead ends]

## Appendix C: Unverifiable Claims

[List claims from prior research that could NOT be verified, explain why]

**Example:**
- "Events cost $2,500-$12,500 per user" - NO ICP-specific data found
- "Community-led growth costs $0-50 per user" - NO disclosed budgets found
- "90% post-PMF success rate" - NO comprehensive dataset available
```

---

## DAILY PROGRESS REPORTING

**At end of each research day, report:**

1. **Sources Found:** [Number of new URLs added to evidence database]
2. **Claims Verified:** [Number of previous unsourced claims now sourced]
3. **Claims Debunked:** [Claims that were false or couldn't be verified]
4. **Knowledge Gaps Identified:** [What data doesn't exist publicly]
5. **Tomorrow's Focus:** [Which projects/events/topics to research next]

---

## SUCCESS CRITERIA

**This research is successful if:**

✅ Every quantitative claim has a clickable primary source URL
✅ Archive.org backups exist for all web sources
✅ Confidence levels assigned to all claims
✅ Knowledge gaps explicitly acknowledged
✅ No fabricated data (if we don't know, we say "UNVERIFIED")
✅ Final report suitable for LP review (professional, conservative, defensible)

**Red Flags (Means research failed):**
❌ Round numbers without specific sources
❌ CAC calculations based on invented assumptions
❌ "Estimated" figures without methodology disclosed
❌ Extrapolations presented as facts
❌ Missing URLs for key claims

---

## AGENT ACCOUNTABILITY

**You will be evaluated on:**
- Number of verified sources found (quantity)
- Quality of sources (HIGH confidence preferred)
- Transparency about gaps (don't hide what you couldn't find)
- Accuracy (no fabrication, no speculation without disclosure)

**If you cannot find a source after thorough search:**
- Document your search attempts
- Explain why data likely doesn't exist
- Recommend excluding claim from final report
- **Do NOT invent a number**

---

**Now go research. Collect evidence. Be rigorous. Be conservative. Be honest about gaps.**
