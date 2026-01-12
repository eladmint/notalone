# Linked Database Views in Notion API - Technical Report

## Executive Summary

**Finding: Linked database views CANNOT be created programmatically via the Notion API.**

This is a fundamental API limitation with no official workaround. The template page duplication script correctly identifies these blocks but cannot recreate them automatically.

---

## Investigation Results

### 1. Block Type Analysis

The two database views in the template page (ID: `2c585dd502d580eeb974c1f3cd8afc57`) were found at:

**Location in page structure:**
```
column_list
  column (left - callout with info)
  column (right)
    paragraph ("Interactions")
    [child_database] ID: 2c585dd5-02d5-815f-8a73-f92a2ec9ae44
    paragraph ("Todo List")
    [child_database] ID: 2c585dd5-02d5-8165-bfa6-fa3159ec6067
```

**Block type:** `child_database` (NOT `linked_database`)

The Notion API represents ALL inline databases as `child_database` blocks, regardless of whether they are:
- Original databases created in place
- Linked views of other databases (filtered views)

### 2. Database Block Data

```json
{
  "object": "block",
  "id": "2c585dd5-02d5-815f-8a73-f92a2ec9ae44",
  "type": "child_database",
  "child_database": {
    "title": "Untitled"
  }
}
```

**Key observation:** The block data contains NO information about:
- Source database ID
- View configuration (filters, sorts)
- Whether it's a linked view or original database

### 3. API Error When Querying

When attempting to retrieve database details:
```json
{
  "object": "error",
  "status": 400,
  "code": "validation_error",
  "message": "Database with ID 2c585dd5-02d5-815f-8a73-f92a2ec9ae44 does not contain any data sources accessible by this API bot."
}
```

**This error confirms:** These are linked database views pointing to a source database that may not be shared with the integration.

### 4. Source Databases Found

The integration has access to these source databases:
- **Opportunities** (ID: `d6328ce4-63e7-4b1d-8aff-413959ee9ebd`)
- **Interactions** (ID: `2c585dd5-02d5-80cf-8b21-f6999e5b5ab7`)

The linked views in the template likely reference these databases with specific filters (e.g., "Opportunities: New Oppo...").

---

## API Capabilities Test Results

### Test 1: Create child_database via blocks.children.append

**Result: FAILED**

```
Response status: 400
"message": "body failed validation..."
```

The error lists ALL supported block types for `blocks.children.append`:
- embed, bookmark, image, video, pdf, file, audio
- code, equation, divider, breadcrumb, table_of_contents
- link_to_page, table_row, ai_block, table
- column_list, column
- heading_1, heading_2, heading_3, heading_4
- paragraph, bulleted_list_item, numbered_list_item
- quote, to_do, toggle, template, callout, synced_block

**`child_database` is NOT in this list.**

### Test 2: Create database via POST /v1/databases

**Result: SUCCESS (but creates NEW database, not linked view)**

```json
{
  "object": "database",
  "id": "2c585dd5-02d5-81a4-92e1-e36923bc1444",
  "title": [{"plain_text": "Test Database via API"}],
  "is_inline": false,
  "parent": {"type": "page_id", "page_id": "..."}
}
```

This creates a **new, empty database** - NOT a linked view of an existing database.

---

## Official Documentation Findings

### From Notion API Changelog (2025-09-03)

> "Notion's API does not currently support linked data sources. When sharing a database with your integration, make sure it contains the original data source!"

### From blocks.children.append Documentation

> "To create or update `child_database` type blocks, use the Create a database and the Update a database endpoints"

However, this only allows creating NEW databases, not linked views.

### From Notion Help Center

Linked databases in the Notion UI are created by:
1. Typing `/linked` and selecting "Create a linked view of a database"
2. Using the database menu to "Link to existing data source"

**Neither method is available via API.**

---

## What IS Supported vs What IS NOT

| Feature | API Support | Notes |
|---------|-------------|-------|
| Create new database | YES | `POST /v1/databases` |
| Query database | YES | `POST /v1/databases/{id}/query` |
| Update database properties | YES | `PATCH /v1/databases/{id}` |
| Create linked database view | **NO** | Not supported |
| Create filtered view | **NO** | Views are UI-only |
| Duplicate linked view | **NO** | Cannot read view config |
| Read view filters/sorts | **NO** | Not exposed in API |

---

## Workarounds

### Workaround 1: Create Relation Property (Partial Solution)

Instead of a linked view, create a relation property that connects to the source database:

```javascript
const response = await fetch(`https://api.notion.com/v1/databases`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    parent: { page_id: targetPageId },
    title: [{ text: { content: "Related Items" } }],
    properties: {
      Name: { title: {} },
      RelatedOpportunity: {
        relation: {
          database_id: "d6328ce4-63e7-4b1d-8aff-413959ee9ebd", // Opportunities DB
          single_property: {}
        }
      }
    }
  })
});
```

**Limitation:** This creates a NEW database with a relation, not a filtered view showing existing data.

### Workaround 2: Manual Post-Creation Setup

1. API creates the page with all supported content
2. Script outputs instructions for manual linked database creation
3. User manually adds linked views in Notion UI

**Example output:**
```
Page created successfully.

Manual steps required:
1. Open the page at: https://notion.so/...
2. In the right column, type /linked
3. Select "Interactions" database
4. Apply filter: "Opportunities" contains "[Page Name]"
5. Repeat for "Todo List" view
```

### Workaround 3: Use Notion's Page Duplication (UI)

If the goal is exact duplication including linked views:
1. Use Notion's built-in "Duplicate" feature in the UI
2. Update the duplicated page's relation filters manually

---

## Recommended Implementation for Page Duplication

```javascript
async function duplicatePageWithDatabaseHandling(templatePageId, targetTitle) {
  // 1. Fetch all blocks from template
  const blocks = await fetchBlocksRecursively(templatePageId);

  // 2. Identify unsupported blocks
  const unsupportedBlocks = blocks.filter(b =>
    b.type === 'child_database' ||
    b.type === 'child_page'
  );

  // 3. Create new page with supported blocks only
  const newPage = await createPageWithContent(targetTitle,
    blocks.filter(b => !unsupportedBlocks.includes(b))
  );

  // 4. Generate manual instructions
  if (unsupportedBlocks.length > 0) {
    console.log('\n=== MANUAL STEPS REQUIRED ===');
    for (const block of unsupportedBlocks) {
      if (block.type === 'child_database') {
        console.log(`
Linked Database View: "${block.child_database.title || 'Untitled'}"
Location: After block ID ${block.parent.block_id}
Action: Manually create linked view using /linked command
        `);
      }
    }
  }

  return newPage;
}
```

---

## Conclusion

**Linked database views are a UI-only feature in Notion.** The API does not provide:
- A way to create linked database views
- Access to view configuration (filters, sorts, grouping)
- Information about which database a linked view references

This is a known and documented limitation. The only reliable solution for exact page duplication including linked views is to:
1. Use Notion's native duplicate feature in the UI, OR
2. Accept that linked views must be manually recreated after API-based duplication

---

## References

- [Notion API Block Types](https://developers.notion.com/reference/block)
- [Notion API Database Creation](https://developers.notion.com/reference/database-create)
- [Upgrading to Version 2025-09-03](https://developers.notion.com/docs/upgrade-guide-2025-09-03)
- [FAQs: Version 2025-09-03](https://developers.notion.com/docs/upgrade-faqs-2025-09-03)
- [Data Sources - Notion Help Center](https://www.notion.com/help/data-sources-and-linked-databases)
- [Community Question: Linked Database References](https://notionanswers.com/1062/can-create-linked-database-references-via-the-api) (Unanswered)

---

*Report generated: 2025-12-10*
*Template Page ID: 2c585dd502d580eeb974c1f3cd8afc57*
*Working Directory: /Users/eladm/Projects/Nuru-AI/Notalone*
