# Deal Flow System - Quick Start Guide

**Access the system:** https://www.notion.so/NOTALONE-Deal-Flow-System-2d960b6e8d1881c2b139e9a8d37d70b9

---

## Adding a New Deal (5 Minutes)

### 1. Create Deal in Pipeline
Open **Deal Flow Pipeline** database and click **+ New**

**Required Fields:**
- Deal Name: Project name
- Source: Where did it come from?
- Stage: Start at "Sourcing"
- Token Status: Post-TGE or Pre-TGE
- Deal Lead: Who owns this?
- First Contact: Today's date
- Status: Active

**Optional but Recommended:**
- Market Cap ($M)
- Daily Volume ($K)
- Website
- Notes: Initial context

---

## Screening a Deal (30 Minutes)

### 2. After Initial Call - Create Screening Memo

Open **Screening Memos** database and click **+ New**

**Process:**
1. Title: "[Deal Name] - Screening Memo"
2. Link to Deal: Select from relation
3. Screening Date: Today
4. Fill in assessment:
   - Growth Need: What do they need?
   - Check boxes: Team Fit, Token Health, Cap Table Clean
   - Market Position: Select one
5. Set Classification:
   - OTC + Growth Assets (best fit)
   - OTC Only (capital only)
   - Services First (not ready for investment)
   - Pass (doesn't fit)
6. Recommendation: What's next?
7. Next Steps: Action items

**Update Pipeline:**
- Change Stage to "Screening"
- Update Classification to match memo

---

## Due Diligence (1-2 Weeks)

### 3. Create DD Tracker Entry

Open **Due Diligence Tracker** database and click **+ New**

**Process:**
1. Title: "[Deal Name] - DD Report"
2. Link to Deal
3. Work through each area (check when complete):
   - Token Economics → Add notes
   - On-Chain Metrics → Add notes
   - Competitive Position → Add notes
   - Team Background → Add notes
   - Cap Table Review → Add notes
   - Legal Status → Add notes
4. Growth Fit:
   - Growth Gaps Analysis: Write what's blocking them
   - Audience Alignment: Select persona(s)
   - Geographic Fit: Select regions
5. Set DD Complete Date when done
6. Final Recommendation

**Update Pipeline:**
- Change Stage to "Due Diligence"
- Add notes with DD findings

---

## Investment Committee (1 Day)

### 4. Create IC Decision Entry

Open **Investment Committee Decisions** database and click **+ New**

**Process:**
1. Title: "[Deal Name] - IC Decision [Date]"
2. Link to Deal
3. IC Date: Meeting date
4. Score each area (1-5):
   - Token Fundamentals (25% weight)
   - Growth Opportunity (25% weight)
   - Team Quality (20% weight)
   - Deal Terms (15% weight)
   - Strategic Fit (15% weight)
5. Calculate Overall Score (manual or formula)
6. Decision:
   - Approve (score 3.5+)
   - Approve with Conditions
   - More DD Required
   - Decline
7. Document Conditions/Notes
8. Record Terms Approved

**Update Pipeline:**
- If approved: Change Stage to "Structuring"
- If declined: Status to "Closed Lost"

---

## Activating Growth Assets

### 5. Plan First Activation

Open **Growth Assets Activations** database and click **+ New**

**Process:**
1. Title: "[Deal Name] @ [Conference]"
2. Link to Deal
3. Conference/Event: Select or add
4. Date: Event date
5. Activation Type: Check all that apply
   - House Event
   - Speaking
   - Panel
   - Demo
   - Hackathon
6. Package Used: Essential/Growth/Premium
7. Status: Planned → Confirmed → Completed

**During Event:**
- Update to "Confirmed" when finalized
- Track metrics as they happen

**After Event:**
- Change Status to "Completed"
- Fill in:
  - Token Value Released ($K)
  - Leads Generated
  - Partnerships Initiated
  - Debrief Notes

**Update Pipeline:**
- Change Stage to "Active (Growth Assets)"

---

## Daily Operations

### Deal Leads - Daily Review
1. Open Pipeline Kanban view
2. Check "My Deals" (filter by Deal Lead)
3. Move deals through stages as they progress
4. Update Status if anything goes on hold

### Weekly Team Sync
1. Pipeline Table view
2. Sort by Last Updated
3. Review deals that haven't moved
4. Discuss stuck deals

### Monthly Portfolio Review
1. Filter Pipeline: Stage = "Active (Growth Assets)"
2. Check Growth Assets Activations for utilization
3. Review any deals at "Monitoring/Exit"

---

## Common Actions

### Mark a Deal as Pass
1. In Pipeline: Status → "Closed Lost"
2. Add note explaining why
3. Keep for future reference

### Put Deal On Hold
1. Status → "On Hold"
2. Add note with reason
3. Set reminder to revisit

### Close a Won Deal
1. Complete all stages through "Onboarding"
2. Stage → "Active (Growth Assets)"
3. Status → "Closed Won"
4. Start tracking activations

### Track Quarterly Performance
1. Filter Activations: Date in Q1 2025
2. Sum Token Value Released
3. Count Leads Generated
4. Review debrief notes for learnings

---

## Views to Create (Recommended)

### Deal Flow Pipeline
- **Active Deals Kanban**: Filter Status=Active, group by Stage
- **My Deals**: Filter by your name in Deal Lead
- **This Month**: Filter First Contact in current month
- **Post-TGE Only**: Filter Token Status=Post-TGE

### Screening Memos
- **Need Action**: Filter Recommendation="More Info Needed"
- **Approved for DD**: Filter Recommendation="Proceed to DD"

### Growth Assets Activations
- **Q1 Calendar**: Calendar view, filter Date in Q1
- **Upcoming**: Filter Status=Planned or Confirmed, sort by Date
- **Completed This Quarter**: Filter Status=Completed, Date in quarter

---

## Tips & Best Practices

### Always Link Records
- Every Screening Memo → Deal
- Every DD Tracker → Deal
- Every IC Decision → Deal
- Every Activation → Deal

This creates a complete audit trail.

### Update Stage Promptly
Keep the Pipeline Stage current so everyone knows status at a glance.

### Use Rich Content
- Add images in deal notes
- Link to external decks/docs
- Embed videos from pitches

### Set Reminders
Use Notion reminders for:
- Follow-up calls
- IC meeting prep
- Activation planning deadlines

### Templates
Create page templates for:
- Screening memo format
- DD report structure
- IC memo outline

---

## Keyboard Shortcuts

- `Cmd/Ctrl + N`: New page/entry
- `Cmd/Ctrl + Shift + L`: Add link
- `@`: Mention person or link to page
- `[[`: Link to another page
- `/table`: Insert table
- `/todo`: Add checkbox

---

## Getting Help

**Documentation:**
- Full Setup Guide: `/docs/DEAL_FLOW_SYSTEM_SETUP.md`
- Process Framework: `/docs/services/DEAL_FLOW_PROCESS.md`

**Scripts:**
- Create system: `node scripts/create-deal-flow-system.js`
- Sync to Notion: `node scripts/sync-markdown-to-notion.js`

**Common Issues:**
- Can't see database: Check permissions
- Relation not working: Ensure deal exists in Pipeline first
- Missing fields: Database may need property added

---

**Last Updated:** December 30, 2025
**Quick Access:** Bookmark the main page URL for fastest access
