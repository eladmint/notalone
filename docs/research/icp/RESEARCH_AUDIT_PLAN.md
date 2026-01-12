# ICP Research Audit & Verification Plan

**Date:** November 30, 2025
**Issue:** Existing research contains unsourced claims and potentially invented figures
**Standard:** VC diligence standard (key claims must have primary sources, extrapolations disclosed)
**Priority Focus:** Growth activities (events, social media, hackathons, community tactics)

---

## Phase 1: Audit Existing Research (Timeline: 4-6 hours)

### Methodology

**Step 1: Flag Every Quantitative Claim**
- Review all 14 research documents
- Extract every claim with a number (CAC, success rates, costs, revenues, attendance, etc.)
- Categorize as:
  - ✅ **SOURCED**: Has explicit URL or document reference
  - ⚠️ **PARTIALLY SOURCED**: References a document but no specific page/section
  - ❌ **UNSOURCED**: No citation provided
  - 🔢 **EXTRAPOLATION**: Derived from other data (math shown)
  - 🤔 **SUSPECT**: Sounds plausible but likely invented

**Step 2: Create Audit Spreadsheet**

| Document | Claim | Category | Source Status | Action Required |
|----------|-------|----------|---------------|-----------------|
| Report 07 | "Events CAC $2,500-$12,500" | User Acquisition | ⚠️ PARTIALLY SOURCED | Find primary source |
| Master Synthesis | "90% post-PMF success rate" | Success Patterns | ❌ UNSOURCED | Verify or retract |
| Report 01 | "24 ICP hubs, zero failures" | Hub Sustainability | ❌ UNSOURCED | Count from ICP Hub list |

**Step 3: Prioritize Verification**

Focus on claims that matter for investment decisions:
1. **Growth Activity ROI** (events, hackathons, social media effectiveness)
2. **Success Rates** (post-PMF vs pre-PMF)
3. **User Acquisition Costs** (by channel)
4. **Hub Economics** (revenues, costs, sustainability)

---

## Phase 2: Primary Source Collection (Timeline: 1-2 days)

### Growth Activities Research Protocol

**Research Question:**
"What growth activities did ICP ecosystem projects actually use, what were the documented results, and what evidence exists for their effectiveness?"

### Primary Source Checklist

**For Each Growth Activity Type:**

#### A. Events & Conferences

**Required Evidence:**
- [ ] Event name, date, location (ICP Forum post, Twitter announcement)
- [ ] Attendance numbers (official report, organizer tweet, photos)
- [ ] Cost/budget (disclosed in forum, grant report, or estimated from venue size)
- [ ] Projects participating (list from event page, GitHub repos)
- [ ] Outcomes (user growth tweets, blog posts, dashboard data)

**Example Valid Sources:**
- ICP Forum: https://forum.dfinity.org/t/[event-name]/[post-id]
- Twitter: https://twitter.com/dfinity/status/[tweet-id] (with archive.org backup)
- YouTube: https://youtube.com/watch?v=[video-id] (with timestamp)
- Event websites: [event-url] (with archive.org backup)

**Minimum Data Points to Collect:** 10-20 documented ICP events with attendance/outcomes

#### B. Hackathons

**Required Evidence:**
- [ ] Hackathon name, date, organizer (Devpost, GitHub, official page)
- [ ] Prize pool (official announcement)
- [ ] Participants count (Devpost registrations, Twitter announcements)
- [ ] Winning projects (Devpost winners, ICP Forum announcements)
- [ ] Post-hackathon outcomes (which projects got funding, launched, failed)

**Example Valid Sources:**
- Devpost: https://devpost.com/[hackathon-name]
- ICP Grants: https://dfinity.org/grants (archive list)
- GitHub: https://github.com/dfinity/grant-rfps

**Minimum Data Points to Collect:** 5-10 ICP hackathons with full data

#### C. Social Media Campaigns

**Required Evidence:**
- [ ] Campaign name/hashtag (Twitter search, official announcement)
- [ ] Budget/incentives (disclosed in forum, grant, or estimated)
- [ ] Engagement metrics (likes, retweets, impressions if disclosed)
- [ ] User acquisition results (project dashboards, tweets)
- [ ] Specific projects using this tactic (examples with data)

**Example Valid Sources:**
- Twitter analytics (if shared publicly)
- ICP Dashboard: https://dashboard.internetcomputer.org/
- Project blog posts disclosing growth tactics

**Minimum Data Points to Collect:** 5-10 documented social campaigns

#### D. Community Building (Discord, Forums, Ambassador Programs)

**Required Evidence:**
- [ ] Community size over time (Discord member counts, forum member graphs)
- [ ] Activity metrics (daily active users if disclosed)
- [ ] Conversion to users (project tweets, blog posts, dashboards)
- [ ] Costs (ambassador payments, rewards disclosed in grants/forums)

**Example Valid Sources:**
- Discord server "About" sections (member counts)
- ICP Forum member growth graphs
- Ambassador program announcements

**Minimum Data Points to Collect:** 5-10 community programs with metrics

#### E. Hub Activities

**Required Evidence:**
- [ ] Hub name, location (ICP Hub Network page)
- [ ] Event frequency (hub reports in ICP Forum)
- [ ] Attendance (event photos, tweets, self-reported)
- [ ] Sponsorship revenue (if disclosed in hub reports)
- [ ] Costs (if disclosed in grant applications or reports)
- [ ] Outcomes (developers onboarded, projects launched)

**Example Valid Sources:**
- ICP Hub Network: https://internetcomputer.org/community
- Hub-specific forum threads
- Hub Twitter accounts with event announcements

**Minimum Data Points to Collect:** 5-10 hubs with documented activities

---

## Phase 3: Evidence Database Structure

### Spreadsheet Template: ICP_GROWTH_ACTIVITIES_EVIDENCE.csv

```csv
Activity_Type,Project_Name,Activity_Name,Date,Metric_Type,Metric_Value,Source_URL,Archive_URL,Confidence,Notes
Event,DSCVR,EthDenver 2024,2024-02-28,Attendance,500,https://twitter.com/dscvr_one/status/XXX,https://archive.org/XXX,MEDIUM,Self-reported
Hackathon,Supernova,Supernova Hackathon,2023-06-15,Prize_Pool,100000,https://devpost.com/supernova,https://archive.org/XXX,HIGH,Official Devpost
Social,OpenChat,NFT Airdrop Campaign,2023-09-01,User_Growth,10000,https://openchat.io/blog/nft-campaign,https://archive.org/XXX,HIGH,Official blog
Community,ICP Hub Indonesia,Monthly Meetups,2023-01-01,Events_Per_Year,24,https://forum.dfinity.org/t/indonesia-hub/XXX,https://archive.org/XXX,MEDIUM,Hub report
```

**Confidence Levels:**
- **HIGH**: Official source, verified by multiple sources, or on-chain data
- **MEDIUM**: Single credible source (project blog, forum post, verified Twitter)
- **LOW**: Estimated, extrapolated, or unverified claim

---

## Phase 4: Gap Filling Research (Timeline: 1-2 days)

### Research Agent Instructions

**For Each Growth Activity Category:**

1. **Web Search Strategy**
   - Search: "ICP [event name] attendance" site:forum.dfinity.org
   - Search: "DFINITY [hackathon name]" site:devpost.com
   - Search: "[project name] growth strategy" site:medium.com
   - Search: "ICP hub [location]" site:twitter.com

2. **Data Extraction Protocol**
   - Copy exact quote from source
   - Record source URL
   - Archive URL with archive.org (create snapshot if needed)
   - Note date, author, context
   - Flag if metric is self-reported vs third-party verified

3. **Triangulation Requirement**
   - For critical claims (success rates, CAC benchmarks): Find 2-3 independent sources
   - If sources conflict: Document both, explain discrepancy
   - If no sources found: Label as "UNVERIFIED" and explain research process

4. **Extrapolation Disclosure**
   - If estimating (e.g., event cost from venue size): Show math
   - State assumptions explicitly
   - Provide range (low/mid/high estimates)
   - Label clearly as "ESTIMATED" not "ACTUAL"

---

## Phase 5: Verified Report Creation (Timeline: 1 day)

### Report Structure: ICP_GROWTH_ACTIVITIES_VERIFIED.md

```markdown
# ICP Growth Activities: Evidence-Based Analysis

**Research Date:** [Date]
**Evidence Standard:** VC Diligence (key claims sourced, extrapolations disclosed)
**Primary Focus:** Growth activities (events, social, hackathons, community)
**Total Primary Sources:** [Number]

---

## Executive Summary

[Only include claims with HIGH or MEDIUM confidence sources]

---

## Section 1: Events & Conferences

### 1.1 Documented ICP Events (2022-2024)

| Event Name | Date | Location | Attendance | Source | Confidence |
|------------|------|----------|------------|--------|------------|
| ETHDenver ICP House | 2024-02-28 | Denver | 500 | [URL] | MEDIUM |
| Token2049 Chain Fusion Hub | 2024-09-19 | Singapore | 300 | [URL] | HIGH |

**Key Finding:** [Only state findings supported by data above]

**Source:**
- [1] https://twitter.com/dfinity/status/XXX (archived: https://archive.org/XXX)
- [2] https://forum.dfinity.org/t/event-report/XXX

**Limitations:** [Acknowledge what we don't know]

### 1.2 Event ROI Analysis

**Claim:** "Events cost $2,500-$12,500 per user acquired"

**Evidence:**
- Project A: $50K event spend, 20 users acquired = $2,500/user [SOURCE: URL]
- Project B: $100K event spend, 8 users acquired = $12,500/user [SOURCE: URL]

**Extrapolation:** Range based on 2 documented examples.
**Confidence:** MEDIUM (limited sample size)
**Limitations:** Self-reported costs, attribution unclear (users may have joined from other channels)

---

[Repeat for each growth activity category]

---

## Appendix A: Research Methodology

[Explain search strategy, source selection criteria, data validation process]

## Appendix B: Full Source Bibliography

[Every single URL cited in the report, organized by section]

## Appendix C: Unverified Claims

[List claims from original research that could not be verified, with explanation of research attempts]
```

---

## Phase 6: Investment Memo (Timeline: 0.5 days)

### Final Deliverable: NOTALONE_ICP_INVESTMENT_THESIS_VERIFIED.md

**Focus:** Answer the key investment question:

**"What growth activities should NotAlone portfolio companies use, based on verified ICP ecosystem evidence?"**

**Structure:**
1. Verified Growth Tactics (with ROI data from evidence database)
2. Red Flags (tactics that didn't work, with sources)
3. Knowledge Gaps (what we don't know, where more research is needed)
4. Investment Criteria (based only on verified patterns)
5. Portfolio Playbook (specific tactics to recommend, with confidence levels)

---

## Success Criteria

**This audit/research is successful if:**

✅ Every quantitative claim has a clickable source URL
✅ Extrapolations are clearly labeled with methodology disclosed
✅ Confidence levels are assigned to each claim (HIGH/MEDIUM/LOW)
✅ Knowledge gaps are explicitly acknowledged
✅ Final report is suitable for LP review (professional, defensible, conservative)

**Red Flags to Avoid:**
❌ Round numbers without sources (e.g., "30 events" without counting)
❌ Industry benchmarks applied to ICP without validation
❌ Vague language ("many," "most," "typically") instead of specific data
❌ Success rates without defining methodology (what counts as "success"?)

---

## Timeline Summary

| Phase | Duration | Output |
|-------|----------|--------|
| Phase 1: Audit | 4-6 hours | Audit spreadsheet flagging unsourced claims |
| Phase 2: Primary Source Collection | 1-2 days | Evidence database (50-100 data points) |
| Phase 3: Database Organization | 2-4 hours | Structured CSV with sources |
| Phase 4: Gap Filling Research | 1-2 days | Verified data for critical gaps |
| Phase 5: Verified Report | 1 day | Professional research report with full citations |
| Phase 6: Investment Memo | 0.5 days | Actionable investment thesis |

**Total Timeline:** 4-6 days for rigorous, defensible research

---

## Open Questions for User

1. **Scope:** Should we audit ALL 14 documents or focus only on growth activities sections?
2. **Verification Depth:** For how many growth activities do we need documented examples? (5? 10? 20?)
3. **Acceptable Sources:** Are project self-reported metrics acceptable (e.g., DSCVR tweeting user growth) or do we need third-party verification?
4. **Extrapolations:** When exact data isn't available, should we estimate conservatively or exclude entirely?
5. **Publication:** Will this research be shared externally (LPs, ICP ecosystem) or internal only?

---

**Next Steps:**
1. User confirms audit scope and verification requirements
2. Launch Phase 1 audit (4-6 hours)
3. Share audit results and prioritize gap-filling research
4. Execute Phase 2-6 with daily check-ins

**Accountability:**
- Daily progress reports showing sources collected
- Transparent flagging of unsourced claims
- Conservative estimates clearly labeled
- No claims without evidence trail
