# Milo Page Formatting Improvement Plan

**Page:** https://www.notion.so/Milo-2c585dd502d581b8907bdc6683724f85
**Page ID:** `2c585dd502d581b8907bdc6683724f85`
**Date:** December 11, 2025

---

## Executive Summary

The Target Market and Business Model sections have poor readability due to:
- Inline numbered lists (should be separate list items)
- Long comma-separated content crammed into single bullets
- Missing visual hierarchy and data organization
- Key metrics buried in text instead of highlighted

This plan proposes restructuring using Notion's native block types: tables, callouts, toggle sections, and proper list formatting.

---

## Section 1: Target Market

### Block Analysis

| Block ID | Current Type | Issue |
|----------|--------------|-------|
| `2c585dd5-02d5-80ff-a450-d8b6d684d0c8` | numbered_list_item | Contains inline "1. 2. 3. 4." - should be 4 separate items |
| `2c585dd5-02d5-80b6-a2e5-c742aa9e16ac` | bulleted_list_item | Multiple categories crammed together |
| `2c585dd5-02d5-804b-b11b-eec009b399c9` | bulleted_list_item | Geographic data should be in table format |
| `2c585dd5-02d5-80f8-93e1-e3d7212075b3` | bulleted_list_item | Key metrics should be in callout or table |

---

### 1.1 Primary Customers

#### BEFORE (Current State)
```
[numbered_list_item]
1. Crypto Traders - active traders seeking to reduce complexity. 2. DeFi Users -
struggling with fragmented protocols. 3. Crypto Beginners - wanting simplified
access (92% want simplified DeFi). 4. Portfolio Managers - managing multiple
positions across chains.
```

**Problems:**
- All 4 customer types crammed into one line
- Numbers in text instead of actual numbered list
- No visual distinction between customer types
- Buried statistic (92%)

#### AFTER (Proposed)
```
[heading_3] Primary Customers

[numbered_list_item] Crypto Traders
  [paragraph] Active traders seeking to reduce complexity and streamline operations

[numbered_list_item] DeFi Users
  [paragraph] Struggling with fragmented protocols across multiple platforms

[numbered_list_item] Crypto Beginners
  [callout] 92% want simplified DeFi access
  [paragraph] New users wanting simplified, guided access to DeFi

[numbered_list_item] Portfolio Managers
  [paragraph] Managing multiple positions across chains, need unified view
```

**Block Types Used:**
- `numbered_list_item` x 4 (proper numbered list)
- `paragraph` for descriptions (nested under each)
- `callout` (blue) to highlight the 92% statistic

---

### 1.2 Market Segments

#### BEFORE (Current State)
```
[bulleted_list_item]
By Risk Tolerance: Low risk (~$10K AUM), Medium risk (~$70K AUM, largest segment),
High risk (~$22K AUM). By Engagement: Average top-up $201.30, 50.1% of Auto
Traders topped up.
```

**Problems:**
- Two different categorizations mixed together
- Key metric ($70K AUM largest segment) buried
- Percentages hard to scan

#### AFTER (Proposed)
```
[toggle] By Risk Tolerance
  [table] 3 columns x 4 rows
  | Risk Level | Avg AUM | Notes |
  |------------|---------|-------|
  | Low Risk   | ~$10K   | Conservative traders |
  | Medium Risk| ~$70K   | Largest segment |
  | High Risk  | ~$22K   | Aggressive traders |

[toggle] By Engagement
  [callout icon=chart] Key Engagement Metrics
    Average top-up: $201.30
    Auto Traders topped up: 50.1%
```

**Block Types Used:**
- `toggle` x 2 (collapsible sections for each category)
- `table` for risk tolerance comparison (3 cols, 4 rows with header)
- `callout` with chart icon for engagement metrics

---

### 1.3 Geographic Focus

#### BEFORE (Current State)
```
[bulleted_list_item]
United States (89 users, $22K AUM - largest), Australia (16 users), Germany
(17 users), Israel (13 users), Spain (7 users). Also Singapore, UK, France,
Norway, Italy.
```

**Problems:**
- All countries on one line
- Inconsistent data (some have AUM, some don't)
- "Also" list at end loses impact
- Hard to compare countries

#### AFTER (Proposed)
```
[heading_3] Geographic Focus

[table] 4 columns x 6 rows
| Country | Users | AUM | Notes |
|---------|-------|-----|-------|
| United States | 89 | $22K | Largest market |
| Germany | 17 | - | Growing market |
| Australia | 16 | - | - |
| Israel | 13 | - | - |
| Spain | 7 | - | - |

[toggle] Other Markets
  [bulleted_list_item] Singapore
  [bulleted_list_item] United Kingdom
  [bulleted_list_item] France
  [bulleted_list_item] Norway
  [bulleted_list_item] Italy
```

**Block Types Used:**
- `table` (4 columns for structured comparison)
- `toggle` for secondary markets (keeps main view clean)
- `bulleted_list_item` for secondary markets list

---

### 1.4 Customer Count / Key Metrics

#### BEFORE (Current State)
```
[bulleted_list_item]
712K overall active users, 2,480 WAU, 562 DAU, 314 active Auto Traders
(>=1 SOL), 81% monthly retention, ~50% daily retention.
```

**Problems:**
- Critical metrics crammed into one line
- No visual hierarchy for important numbers
- Difficult to scan/compare

#### AFTER (Proposed)
```
[heading_3] Key Metrics

[callout icon=users color=blue]
  712K Overall Active Users

[table] 3 columns x 4 rows
| Metric | Value | Notes |
|--------|-------|-------|
| Weekly Active Users (WAU) | 2,480 | - |
| Daily Active Users (DAU) | 562 | - |
| Active Auto Traders | 314 | >=1 SOL balance |

[callout icon=chart color=green]
  Retention Metrics
  - Monthly: 81%
  - Daily: ~50%
```

**Block Types Used:**
- `callout` (blue) for headline number (712K)
- `table` for structured metrics comparison
- `callout` (green) for retention metrics (grouped)

---

## Section 2: Business Model

### Block Analysis

| Block ID | Current Type | Issue |
|----------|--------------|-------|
| `2c585dd5-02d5-8005-8e8a-ee5dad620f8e` | bulleted_list_item | Multiple revenue streams crammed together |

---

### 2.1 Revenue Model

#### BEFORE (Current State)
```
[bulleted_list_item]
Trading Fees (~0.77% implied rate) - $10K generated on $1.3M volume.
Subscription/Staking - Advanced Auto Trader features require token staking.
Current: $3.5K MRR, $42K ARR run rate.
```

**Problems:**
- Two revenue streams mixed on one line
- Key financials ($3.5K MRR, $42K ARR) buried at end
- Hard to understand unit economics

#### AFTER (Proposed)
```
[heading_3] Revenue Model

[callout icon=dollar color=yellow]
  Current Revenue: $3.5K MRR / $42K ARR run rate

[toggle] Trading Fees (Primary Revenue)
  [bulleted_list_item] Fee Rate: ~0.77% implied
  [bulleted_list_item] Recent: $10K generated on $1.3M volume
  [bulleted_list_item] Scales with platform usage

[toggle] Subscription/Staking (Secondary Revenue)
  [bulleted_list_item] Advanced Auto Trader features
  [bulleted_list_item] Token staking required for access
  [bulleted_list_item] Recurring revenue stream
```

**Alternative: Table Format**
```
[heading_3] Revenue Model

[callout icon=dollar color=yellow]
  $3.5K MRR | $42K ARR Run Rate

[table] 3 columns x 3 rows
| Revenue Stream | Details | Notes |
|----------------|---------|-------|
| Trading Fees | ~0.77% rate | $10K on $1.3M volume |
| Subscription/Staking | Token staking | Auto Trader features |
```

**Block Types Used:**
- `callout` (yellow/gold) for key revenue figures (highlighted at top)
- `toggle` x 2 for detailed breakdown of each stream
- `bulleted_list_item` for details within toggles
- Alternative: `table` for quick comparison view

---

## Implementation Summary

### Block Types to Use

| Block Type | Count | Purpose |
|------------|-------|---------|
| `numbered_list_item` | 4 | Primary customers list |
| `bulleted_list_item` | ~15 | Details within sections |
| `table` | 4 | Geographic, Metrics, Segments, Revenue |
| `toggle` | 5 | Collapsible detailed sections |
| `callout` | 5 | Key statistics/numbers |
| `heading_3` | Existing | Section headers (keep) |

### Callout Color Scheme
- **Blue**: User/engagement metrics (712K users)
- **Green**: Retention/growth metrics
- **Yellow/Gold**: Revenue/financial metrics
- **Purple**: Key percentages/insights

### Implementation Order

1. **Phase 1: Primary Customers** (highest impact)
   - Delete block `2c585dd5-02d5-80ff-a450-d8b6d684d0c8`
   - Insert 4 numbered list items with nested descriptions
   - Add callout for 92% statistic

2. **Phase 2: Geographic Focus** (table needed)
   - Delete block `2c585dd5-02d5-804b-b11b-eec009b399c9`
   - Insert table with country data
   - Add toggle for secondary markets

3. **Phase 3: Key Metrics** (most data-dense)
   - Delete block `2c585dd5-02d5-80f8-93e1-e3d7212075b3`
   - Insert headline callout
   - Insert metrics table
   - Add retention callout

4. **Phase 4: Market Segments** (moderate complexity)
   - Delete block `2c585dd5-02d5-80b6-a2e5-c742aa9e16ac`
   - Insert toggles for each category
   - Add table within risk tolerance toggle

5. **Phase 5: Revenue Model** (Business Model section)
   - Delete block `2c585dd5-02d5-8005-8e8a-ee5dad620f8e`
   - Insert revenue callout at top
   - Add toggles or table for revenue streams

---

## Visual Mockup

### Target Market Section - After

```
## Target Market
---
### Primary Customers

1. Crypto Traders
   Active traders seeking to reduce complexity

2. DeFi Users
   Struggling with fragmented protocols

3. Crypto Beginners
   |----------------------------------|
   | [!] 92% want simplified DeFi    |
   |----------------------------------|
   New users wanting guided access

4. Portfolio Managers
   Managing positions across chains

### Market Segments

> By Risk Tolerance [click to expand]
  +------------+---------+-----------------+
  | Risk Level | Avg AUM | Notes           |
  +------------+---------+-----------------+
  | Low Risk   | ~$10K   | Conservative    |
  | Medium     | ~$70K   | Largest segment |
  | High Risk  | ~$22K   | Aggressive      |
  +------------+---------+-----------------+

> By Engagement [click to expand]
  |----------------------------------|
  | [$] Average top-up: $201.30     |
  |     50.1% of Auto Traders       |
  |----------------------------------|

### Geographic Focus

+---------------+-------+-------+----------------+
| Country       | Users | AUM   | Notes          |
+---------------+-------+-------+----------------+
| United States | 89    | $22K  | Largest market |
| Germany       | 17    | -     | Growing        |
| Australia     | 16    | -     |                |
| Israel        | 13    | -     |                |
| Spain         | 7     | -     |                |
+---------------+-------+-------+----------------+

> Other Markets [click to expand]
  - Singapore
  - United Kingdom
  - France
  - Norway
  - Italy

### Key Metrics

|--------------------------------------|
| [*] 712K Overall Active Users        |
|--------------------------------------|

+---------------------------+---------+---------------+
| Metric                    | Value   | Notes         |
+---------------------------+---------+---------------+
| Weekly Active Users (WAU) | 2,480   |               |
| Daily Active Users (DAU)  | 562     |               |
| Active Auto Traders       | 314     | >=1 SOL       |
+---------------------------+---------+---------------+

|--------------------------------------|
| [+] Retention Metrics                |
|     Monthly: 81% | Daily: ~50%       |
|--------------------------------------|
```

---

## Next Steps

1. **Review this plan** with stakeholders
2. **Create implementation script** using Notion API
3. **Test on copy of page** first (if possible)
4. **Implement in phases** with validation after each
5. **Set full width** on page for better table display

---

## Technical Notes

### API Considerations
- Maximum 100 blocks per API call
- Rate limit: 3 requests/second
- Tables require: create table block, then add table_row children
- Toggles require: create toggle block, then add children

### Block Dependencies
- Tables: Parent table block must be created before rows
- Toggles: Parent toggle must be created before nested content
- Nested lists: Parent list item created before children

### Rollback Strategy
If issues occur:
1. Export current page to markdown (backup)
2. Track all block IDs created
3. Delete in reverse order if needed
4. Re-import from markdown backup
