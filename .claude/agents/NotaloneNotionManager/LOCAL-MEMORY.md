# NotaloneNotionManager - Local Memory

**Project**: Notalone Investment Deal Flow
**Last Updated**: December 2024
**Purpose**: Track project-specific Notion sync state, page mappings, and operational context

---

## Active Page Mappings

### Registered Sync Mappings

| Page ID | File Path | Title | Strategy | Status |
|---------|-----------|-------|----------|--------|
| `2c960b6e8d1881f98e48c4f6acbc1f4f` | `./docs/NOTALONE-IL.md` | NOTALONE IL | interactive | Active (Dec 14) |
| `2c585dd502d581058a47fb8024bae29a` | `./deal-flow/addressable/notion-sync.md` | Addressable | notion-wins | Synced Dec 10 |

### Key Notion Pages

| Resource | Page ID | Purpose |
|----------|---------|---------|
| Main Project Page | `2c960b6e8d1881f98e48c4f6acbc1f4f` | NOTALONE IL overview (maagic workspace) |
| Deal Research Template | `2c585dd502d580eeb974c1f3cd8afc57` | Template for new deal pages |
| Old Main Page (deprecated) | `2c585dd502d580739744f33cc9bd2859` | Previous NOTALONE-IL (no longer shared) |

---

## Deal-Flow Projects

Current deal directories in `deal-flow/`:

| Project | Status | Has Research | Has Blurb | Notion Synced |
|---------|--------|--------------|-----------|---------------|
| addressable | Active | Check | Check | Yes |
| milo | Active | Check | Check | Partial |
| SHIFT | Active | Check | Check | Unknown |
| soda-labs | Active | Check | Check | Unknown |
| sundial | Active | Check | Check | Unknown |
| zengo | Active | Check | Check | Unknown |
| docsend-deck | Archive | No | No | No |

---

## Sync History Log

### December 2024

- **Dec 14**: Page migration to maagic workspace
  - New NOTALONE IL page: `2c960b6e8d1881f98e48c4f6acbc1f4f`
  - Old page deprecated: `2c585dd502d580739744f33cc9bd2859`
  - Claude Code integration connected
  - Page structure: column_list, paragraphs, 2 child_databases

- **Dec 10**: Initial sync map created
  - NOTALONE-IL page registered
  - Addressable synced from Notion (notion-wins strategy)

- **Dec 10**: Milo page formatting work
  - Template duplication tested
  - Full-width formatting applied

---

## Known Issues & Workarounds

### 1. Linked Database Views Cannot Be Duplicated

**Issue**: When duplicating template pages, `child_database` blocks (linked database views) cannot be recreated via API.

**Workaround**: After duplication, manually add linked database views in Notion UI.

**Affected Scripts**: `duplicate-notion-page.js`, `duplicate-notion-page-v2.js`

### 2. Column Children Require Special Handling

**Issue**: `column_list` blocks require inline children during creation; nested toggle children must be added separately.

**Solution**: `duplicate-notion-page-v2.js` handles this with two-pass approach:
1. Create structure with inline column content
2. Recursively add children to toggles/callouts inside columns

### 3. Rate Limiting on Large Pages

**Issue**: Pages with 100+ blocks can hit rate limits during sync.

**Workaround**: Scripts use `p-limit` for parallel operations with concurrency=2 and 350ms delays between batches.

---

## Template Structure Reference

The deal research template (`2c585dd502d580eeb974c1f3cd8afc57`) has this structure:

```
Page
├── Column List (2 columns)
│   ├── Column 1: Company info callout
│   └── Column 2: Key metrics
├── Toggleable Heading: Company Overview
│   └── [Content to fill]
├── Toggleable Heading: Product
│   ├── Colored subheading: "What they do"
│   └── [Content to fill]
├── Toggleable Heading: Target Market
│   └── [Content to fill]
├── Toggleable Heading: Business Model
│   └── [Content to fill]
├── Toggleable Heading: Technology
│   └── [Content to fill]
├── Toggleable Heading: Team/Leadership
│   └── [Content to fill]
├── Toggleable Heading: Funding/Investors
│   └── [Content to fill]
├── Toggleable Heading: Competitors
│   └── [Content to fill]
├── Toggleable Heading: Investment Fit
│   └── [Content to fill]
└── Linked Database View (PRESERVE - cannot recreate!)
```

---

## Integration Notes

### With deal-researcher Agent

Workflow:
1. `deal-researcher` creates `deal-flow/[project]/research.md`
2. `NotaloneNotionManager` can sync research.md to Notion page
3. Either create new page from template or fill existing sections

### With blurb-writer Agent

Workflow:
1. `blurb-writer` creates `deal-flow/[project]/blurb.md`
2. `NotaloneNotionManager` can sync blurb to a Notion page for sharing
3. Usually synced as simple content (not template-based)

---

## Performance Metrics

### Observed Timings

| Operation | Blocks | Time | Notes |
|-----------|--------|------|-------|
| Template duplication | ~50 blocks | ~30s | Including nested children |
| Markdown sync | ~100 blocks | ~45s | Delete all + append |
| Page fetch | ~50 blocks | ~15s | Recursive block fetch |

### API Rate Limits

- Maximum: 3 requests/second
- Script delays: 350ms between batches
- Parallel operations: p-limit concurrency=2

---

## Future Improvements

- [ ] Automate research.md → Notion sync after deal-researcher completes
- [ ] Create blurb-specific Notion template for quick sharing
- [ ] Add Notion→Git sync for collaborative editing
- [ ] Implement conflict detection for bidirectional sync

---

## Quick Reference Commands

```bash
# Test Notion connection
node scripts/test-notion-connection.js

# Sync markdown to existing page
node scripts/sync-markdown-to-notion.js deal-flow/[project]/research.md [page-id]

# Duplicate template for new deal
node scripts/duplicate-notion-page-v2.js

# Fetch page content
node scripts/fetch-notion-page.js [page-id]

# Analyze page structure
node scripts/analyze-page-structure.js [page-id]
```

---

*This file is maintained by NotaloneNotionManager agent for project-specific context.*
*Update when: new pages added, sync issues encountered, workflows change.*
