# Manual Database Setup Guide

## Issue Discovered

The Notion workspace appears to have a setting or limitation that creates databases via API as **"data sources" (synced databases)** rather than native Notion databases. Data sources cannot have their schemas modified via the Notion API.

All databases created programmatically show a `data_sources` field in the API response, which indicates they are synced databases. This is why properties cannot be added via API.

## Solution: Manual Creation in Notion UI

The databases need to be created manually in the Notion interface with all properties. Here's a step-by-step guide:

---

## Step 1: Open the Deal Flow System Page

Open this page in Notion:
https://www.notion.so/2d960b6e8d1881c2b139e9a8d37d70b9

---

## Step 2: Create Deal Flow Pipeline Database

1. Click "+ New database" and select "Inline"
2. Name it: **Deal Flow Pipeline**
3. Add the following properties:

| Property Name | Type | Options/Format |
|---------------|------|----------------|
| Deal Name | Title | (default) |
| Source | Select | Services Pipeline (green), ICP Hubs Network (blue), Conference (purple), LP Referral (pink), VC Network (orange), Inbound (gray) |
| Stage | Select | 1-Sourcing (gray), 2-Screening (yellow), 3-Due Diligence (blue), 4-Investment Committee (purple), 5-Structuring (orange), 6-Onboarding (pink), 7-Active (green), 8-Exit (brown) |
| Classification | Select | OTC + Growth Assets (green), OTC Only (blue), Services First (purple), Pass (red) |
| Token Status | Select | Post-TGE (green), Pre-TGE (orange) |
| Market Cap | Number | Format: Dollar |
| Daily Volume | Number | Format: Dollar |
| Investment Size | Number | Format: Dollar |
| Discount % | Number | Format: Percent |
| Deal Lead | Text | |
| First Contact | Date | |
| Last Updated | Last edited time | |
| Status | Select | Active (green), On Hold (yellow), Closed Won (blue), Closed Lost (red) |
| Notes | Text | |

---

## Step 3: Create Screening Memos Database

1. Click "+ New database" and select "Inline"
2. Name it: **Screening Memos**
3. Add the following properties:

| Property Name | Type | Options/Format |
|---------------|------|----------------|
| Memo Title | Title | (default) |
| Deal | Relation | → Deal Flow Pipeline database |
| Screening Date | Date | |
| Growth Need | Text | |
| Team Fit | Checkbox | |
| Token Health | Checkbox | |
| Market Position | Text | |
| Cap Table Clean | Checkbox | |
| Classification | Select | OTC + Growth Assets (green), OTC Only (blue), Services First (purple), Pass (red) |
| Recommendation | Select | Proceed to DD (green), More Info Needed (yellow), Pass (red) |
| Next Steps | Text | |

---

## Step 4: Create Due Diligence Tracker Database

1. Click "+ New database" and select "Inline"
2. Name it: **Due Diligence Tracker**
3. Add the following properties:

| Property Name | Type | Options/Format |
|---------------|------|----------------|
| DD Title | Title | (default) |
| Deal | Relation | → Deal Flow Pipeline database |
| Token Economics Done | Checkbox | |
| Token Economics Notes | Text | |
| On-Chain Metrics Done | Checkbox | |
| On-Chain Notes | Text | |
| Competitive Position Done | Checkbox | |
| Competitive Notes | Text | |
| Team Background Done | Checkbox | |
| Team Notes | Text | |
| Cap Table Done | Checkbox | |
| Cap Table Notes | Text | |
| Legal Status Done | Checkbox | |
| Legal Notes | Text | |
| Growth Gaps | Text | |
| Audience Alignment | Multi-select | Builders (blue), Investors (green), Strategic Partners (purple) |
| Geographic Fit | Multi-select | APAC (orange), Europe (green), US (blue), MENA (pink), LATAM (purple) |
| DD Complete Date | Date | |
| Recommendation | Select | Proceed to IC (green), More DD Needed (yellow), Pass (red) |

---

## Step 5: Create Investment Committee Decisions Database

1. Click "+ New database" and select "Inline"
2. Name it: **Investment Committee Decisions**
3. Add the following properties:

| Property Name | Type | Options/Format |
|---------------|------|----------------|
| IC Record | Title | (default) |
| Deal | Relation | → Deal Flow Pipeline database |
| IC Date | Date | |
| Token Fundamentals | Number | Format: Number (1-5) |
| Growth Opportunity | Number | Format: Number (1-5) |
| Team Quality | Number | Format: Number (1-5) |
| Deal Terms | Number | Format: Number (1-5) |
| Strategic Fit | Number | Format: Number (1-5) |
| Decision | Select | Approve (green), Approve with Conditions (yellow), Request More DD (orange), Decline (red) |
| Conditions | Text | |
| Terms Approved | Text | |

---

## Step 6: Create Growth Assets Activations Database

1. Click "+ New database" and select "Inline"
2. Name it: **Growth Assets Activations**
3. Add the following properties:

| Property Name | Type | Options/Format |
|---------------|------|----------------|
| Activation Name | Title | (default) |
| Deal | Relation | → Deal Flow Pipeline database |
| Conference/Event | Text | |
| Event Date | Date | |
| Activation Type | Select | House Event (green), Speaking Slot (blue), Panel (purple), Demo Station (orange), Hackathon Challenge (pink) |
| Package | Select | Essential ($20K) (blue), Growth ($35K) (green), Premium ($50K) (purple), Custom (gray) |
| Token Value Released | Number | Format: Dollar |
| Leads Generated | Number | Format: Number |
| Partnerships Initiated | Number | Format: Number |
| Debrief Notes | Text | |
| Status | Select | Planned (gray), Confirmed (yellow), Completed (green), Cancelled (red) |

---

## Step 7: Delete Old Empty Databases

The page currently has several empty databases (the ones created via API that became data sources). You can safely delete them:

1. Click the "..." menu on each empty database
2. Select "Delete"

Old database IDs to delete:
- `9c6652d9-860d-48fa-9f8c-aed4300141f7` (Deal Flow Pipeline - OLD)
- `cba20df1-69e3-4bc5-ba61-7ae7565677bd` (Screening Memos - OLD)
- `f5f39f36-a4d3-48cf-bb5f-24ce6f86c089` (Due Diligence Tracker - OLD)
- `b88ab785-0341-474f-aaca-a2038df216c7` (Investment Committee - OLD)
- `d28728e1-f4fa-4cf8-a701-dcd4ce3b90cf` (Growth Assets Activations - OLD)
- `cb35cea1-a2f9-4d0a-bdb2-80f13f64c302` (Deal Flow Pipeline - NEW but data source)
- `90744c07-1dd0-47f3-a7cd-104fdb529056` (Screening Memos - NEW but data source)
- `f2d76a71-ebf2-4d38-9d42-ad4c96319e80` (Due Diligence Tracker - NEW but data source)
- `a9e505f6-c2db-4345-801c-417a94bb3610` (Investment Committee - NEW but data source)
- `98fab9d4-6921-4333-bbc8-74b504775995` (Growth Assets Activations - NEW but data source)

---

## Step 8: Configure Database Views

For each database, you can add helpful views:

### Deal Flow Pipeline
- **Board View**: Group by "Stage" to create a Kanban board
- **Table View**: Default view with all properties
- **Calendar View**: By "First Contact" date

### Screening Memos
- **Table View**: Default
- **Gallery View**: Group by "Recommendation"

### Due Diligence Tracker
- **Table View**: With filters for incomplete items
- **Gallery View**: Group by "Recommendation"

### Investment Committee
- **Table View**: Sorted by "IC Date" (newest first)
- **Gallery View**: Group by "Decision"

### Growth Assets Activations
- **Calendar View**: By "Event Date"
- **Table View**: Filtered by "Status" = Active
- **Board View**: Group by "Status"

---

## Why This Happened

The Notion workspace "maagic" appears to have settings that create API-generated databases as **data sources** (synced databases) rather than native databases. This is likely:

1. A workspace-level setting for external integrations
2. A security feature to prevent external apps from modifying database schemas
3. Related to how the integration was set up

Data sources are meant for connecting external data (like Google Sheets, GitHub, etc.) and their schemas cannot be modified via API for data integrity reasons.

---

## Process Overview Content

The process overview content HAS been successfully added to the page! You should see:

- Process Overview heading
- The 8 Stages table
- Deal Classifications list
- Key Criteria sections
- How to Use numbered list
- Callout boxes with important info

This content is visible on the page even though the databases need to be recreated manually.

---

## Alternative: Use Notion Templates

If manually creating 5 databases with all properties is too tedious, you can:

1. Create one database manually with all properties
2. Duplicate it within Notion
3. Rename and adjust the properties for each database type
4. Update relations to point to the correct databases

---

## Need Help?

If you continue to have issues or want to explore other options:

1. Check with Notion workspace admin about integration permissions
2. Try creating a test database in a different workspace
3. Consider using Notion's database templates feature
4. Contact Notion support about data sources vs native databases

---

**Status:** Manual setup required due to Notion API limitations with this workspace
**Date:** December 30, 2024
