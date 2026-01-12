# NOTALONE Deal Flow System - Notion Setup

**Date:** December 30, 2025
**Status:** Active
**Related:** DEAL_FLOW_PROCESS.md

---

## Overview

The NOTALONE Deal Flow System is a comprehensive Notion-based tracking system for managing investment opportunities from sourcing through exit. It implements the framework defined in `docs/services/DEAL_FLOW_PROCESS.md`.

**Main Page URL:** https://www.notion.so/NOTALONE-Deal-Flow-System-2d960b6e8d1881c2b139e9a8d37d70b9

---

## System Architecture

The system consists of 5 interconnected databases, all linked to the main Deal Flow Pipeline:

```
┌─────────────────────────────────────────────────────┐
│         DEAL FLOW PIPELINE (Main Tracker)          │
│  - Tracks all deals from sourcing through exit     │
│  - 8 stages: Sourcing → Monitoring/Exit            │
└────────────┬────────────┬────────────┬─────────────┘
             │            │            │
    ┌────────┴───┐   ┌────┴─────┐  ┌──┴──────────┐
    │ Screening  │   │ Due Dil. │  │ Investment  │
    │ Memos      │   │ Tracker  │  │ Committee   │
    └────────────┘   └──────────┘  └─────────────┘
             │
    ┌────────┴───────────┐
    │ Growth Assets      │
    │ Activations        │
    └────────────────────┘
```

---

## Database Details

### 1. Deal Flow Pipeline Database
**Database ID:** `9c6652d9-860d-48fa-9f8c-aed4300141f7`

**Purpose:** Main tracker for all investment opportunities

**Key Fields:**
- **Deal Name** (Title)
- **Source**: Services Pipeline, ICP Hubs, Conference, LP Referral, VC Network, Inbound
- **Stage**: Sourcing → Screening → Due Diligence → IC → Structuring → Onboarding → Active → Monitoring/Exit
- **Classification**: OTC + Growth Assets, OTC Only, Services First, Pass
- **Token Status**: Post-TGE, Pre-TGE, Equity Only
- **Market Cap ($M)**: Market capitalization
- **Daily Volume ($K)**: Daily trading volume
- **Investment Size ($K)**: Target investment amount
- **Discount %**: OTC discount percentage
- **Deal Lead**: Elad, Viktor, Nuru
- **First Contact**: Date of first contact
- **Last Updated**: Auto-updated timestamp
- **Status**: Active, On Hold, Closed Won, Closed Lost
- **Website**: Project website URL
- **Deck**: Pitch deck URL
- **Notes**: Free-form notes

**Recommended Views:**
- Kanban by Stage (default)
- Table sorted by Last Updated
- Calendar by First Contact
- Gallery view with cover images

---

### 2. Screening Memos Database
**Database ID:** `cba20df1-69e3-4bc5-ba61-7ae7565677bd`

**Purpose:** Document initial screening assessments

**Key Fields:**
- **Memo Title** (Title)
- **Deal** (Relation to Pipeline)
- **Screening Date**
- **Growth Need**: What growth support they need
- **Team Fit**: Checkbox - willing to engage
- **Token Health**: Checkbox - no major unlock cliffs
- **Market Position**: Differentiated, Competitive, Crowded, Unclear
- **Cap Table Clean**: Checkbox
- **Classification**: Match to pipeline
- **Recommendation**: Proceed to DD, More Info, Services Only, Pass
- **Next Steps**: Action items
- **Screener**: Who conducted screening

**Usage:**
- Create one memo per screening call
- Link to Deal in pipeline
- Check all boxes for pass/fail criteria
- Document recommendation and next steps

---

### 3. Due Diligence Tracker Database
**Database ID:** `f5f39f36-a4d3-48cf-bb5f-24ce6f86c089`

**Purpose:** Track comprehensive investment and growth fit due diligence

**Key Fields:**
- **DD Report** (Title)
- **Deal** (Relation to Pipeline)
- **Investment DD Areas** (6 checkboxes + notes):
  - Token Economics
  - On-Chain Metrics
  - Competitive Position
  - Team Background
  - Cap Table Review
  - Legal Status
- **Growth Fit Areas**:
  - Growth Gaps Analysis: Text field for blockers
  - Audience Alignment: Multi-select (Builders, Investors, Strategic)
  - Geographic Fit: Multi-select regions
- **DD Complete Date**
- **Recommendation**: Strong Invest, Invest, Conditional, Pass
- **DD Lead**: Who led the diligence

**Usage:**
- Create one report per deal entering DD
- Check off areas as completed
- Add detailed notes in each notes field
- Update recommendation as DD progresses

---

### 4. Investment Committee Decisions Database
**Database ID:** `b88ab785-0341-474f-aaca-a2038df216c7`

**Purpose:** Document IC decisions with scoring framework

**Key Fields:**
- **IC Decision** (Title)
- **Deal** (Relation to Pipeline)
- **IC Date**
- **Scoring** (1-5 scale):
  - Token Fundamentals Score (25% weight)
  - Growth Opportunity Score (25% weight)
  - Team Quality Score (20% weight)
  - Deal Terms Score (15% weight)
  - Strategic Fit Score (15% weight)
- **Overall Score**: Calculated (min 3.5/5.0 to proceed)
- **Decision**: Approve, Approve with Conditions, More DD, Decline
- **Conditions/Notes**: Any conditions or notes
- **Terms Approved**: Approved deal terms
- **IC Members**: Who participated

**Usage:**
- Create entry for each IC meeting
- Score each category 1-5
- Calculate weighted average (can use formula)
- Document decision and any conditions
- Minimum 3.5/5.0 overall score to proceed

**Scoring Framework:**
```
Overall Score = (Token*0.25) + (Growth*0.25) + (Team*0.20) + (Terms*0.15) + (Strategic*0.15)
```

---

### 5. Growth Assets Activations Database
**Database ID:** `d28728e1-f4fa-4cf8-a701-dcd4ce3b90cf`

**Purpose:** Track conference activations and growth support delivery

**Key Fields:**
- **Activation** (Title)
- **Deal** (Relation to Pipeline)
- **Conference/Event**: Token2049, ETH Denver, Consensus, Devcon, etc.
- **Date**
- **Activation Type** (Multi-select):
  - House Event
  - Speaking
  - Panel
  - Demo
  - Hackathon
- **Package Used**: Essential, Growth, Premium
- **Token Value Released ($K)**: Amount unlocked
- **Leads Generated**: Number count
- **Partnerships Initiated**: Number count
- **Debrief Notes**: Post-event notes
- **Status**: Planned, Confirmed, Completed, Cancelled
- **Coordinator**: Who managed activation

**Usage:**
- Create entry when planning activation
- Update status as progresses
- Track metrics (leads, partnerships)
- Document token releases
- Add debrief notes post-event

**Recommended Views:**
- Calendar view by Date
- Kanban by Status
- Table grouped by Conference
- Timeline view for planning

---

## Workflow Integration

### Stage Progression
As deals move through stages, create entries in linked databases:

1. **Sourcing** → Add to Pipeline
2. **Screening** → Create Screening Memo
3. **Due Diligence** → Create DD Tracker entry
4. **Investment Committee** → Create IC Decision entry
5. **Onboarding** → Plan first Growth Assets Activation
6. **Active (Growth Assets)** → Track activations
7. **Monitoring/Exit** → Update status in Pipeline

### Relationship Flow
```
Pipeline Deal
    ↓
    ├─→ Screening Memo (1:1 or 1:many)
    ├─→ DD Tracker (1:1)
    ├─→ IC Decision (1:1)
    └─→ Growth Assets Activations (1:many)
```

---

## Database IDs for Integration

All database IDs for API/script access:

```javascript
const DEAL_FLOW_DATABASES = {
  pipeline: '9c6652d9-860d-48fa-9f8c-aed4300141f7',
  screening: 'cba20df1-69e3-4bc5-ba61-7ae7565677bd',
  dueDiligence: 'f5f39f36-a4d3-48cf-bb5f-24ce6f86c089',
  investmentCommittee: 'b88ab785-0341-474f-aaca-a2038df216c7',
  growthAssets: 'd28728e1-f4fa-4cf8-a701-dcd4ce3b90cf'
};
```

---

## Customization Recommendations

### Database Views to Create

**Deal Flow Pipeline:**
1. Kanban by Stage (default)
2. Kanban by Status
3. Table view with all fields
4. Active Deals (filter: Status = Active)
5. Q1 Deals (filter: First Contact in Q1)

**Screening Memos:**
1. Table grouped by Recommendation
2. List by Screening Date
3. Gallery view

**Due Diligence Tracker:**
1. Checklist view (show all checkbox fields)
2. Table by DD Complete Date
3. Pending DD (filter: DD Complete Date is empty)

**Investment Committee:**
1. Table sorted by Overall Score
2. Approved Deals (filter: Decision contains "Approve")
3. Timeline by IC Date

**Growth Assets Activations:**
1. Calendar by Date
2. Kanban by Status
3. Table grouped by Conference
4. Q1 Events (filter: Date in Q1)

### Formulas to Add

You can add formula properties for calculated fields:

**In IC Decisions - Overall Score Formula:**
```
(prop("Token Fundamentals Score") * 0.25) +
(prop("Growth Opportunity Score") * 0.25) +
(prop("Team Quality Score") * 0.20) +
(prop("Deal Terms Score") * 0.15) +
(prop("Strategic Fit Score") * 0.15)
```

Note: Notion requires numeric values, so scores must be converted from select to numbers first.

---

## Permissions & Access

### Recommended Setup
- **Admin Access**: Deal leads (Elad, Viktor)
- **Full Access**: Investment team
- **Comment Only**: Advisors, LPs (for IC decisions)
- **View Only**: Extended team

### Sharing
The main page can be shared with different permission levels:
- Full access to edit all databases
- Can comment on specific entries
- View only for reporting

---

## Scripts for Automation

### Available Scripts

**Create System:**
```bash
node scripts/create-deal-flow-system.js [parent-page-id]
```

**Sync Deal Research to Notion:**
```bash
# After deal-researcher creates research.md
node scripts/sync-markdown-to-notion.js \
  deal-flow/[project]/research.md \
  [notion-page-id]
```

**Fetch Deal from Notion:**
```bash
node scripts/fetch-notion-page.js [deal-page-id] > output.md
```

---

## Maintenance

### Regular Updates
- Review and archive Closed Lost deals monthly
- Update Stage progression weekly
- Track Growth Assets activation completion
- Calculate ROI on Growth Assets quarterly

### Data Quality
- Ensure all deals have Deal Lead assigned
- Keep Status current
- Link all related records (Screening → DD → IC → Activations)
- Add notes for important context

---

## Support & Documentation

**Reference Documents:**
- Process Framework: `/docs/services/DEAL_FLOW_PROCESS.md`
- Growth Assets Structures: `/docs/services/GROWTH_ASSETS_DEAL_STRUCTURES.md`
- Fund Positioning: `/docs/NOTALONE_GROWTH_FUND_POSITIONING.md`

**Scripts Location:** `/scripts/`

**Agent Integration:**
- `deal-researcher`: Creates research.md files
- `blurb-writer`: Creates investment blurbs
- `NotaloneNotionManager`: Syncs content to Notion

---

**System Created:** December 30, 2025
**Framework Version:** DEAL_FLOW_PROCESS v1.0
**Status:** Production Ready
