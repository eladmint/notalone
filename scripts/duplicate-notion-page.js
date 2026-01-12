/**
 * Duplicate Notion Page from Template (v2)
 * Properly handles nested children in column_list blocks
 *
 * Strategy:
 * 1. Create structure first (column_list with columns and content)
 * 2. Then recursively add children to blocks that support them (toggle, callout, headings)
 */

import 'dotenv/config';
import { Client } from '@notionhq/client';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const TEMPLATE_PAGE_ID = '2c585dd502d580eeb974c1f3cd8afc57';

const notion = new Client({ auth: NOTION_TOKEN });

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Block types that support children being added after creation
 */
const SUPPORTS_CHILDREN = new Set([
  'toggle',
  'heading_1', 'heading_2', 'heading_3',
  'bulleted_list_item', 'numbered_list_item',
  'to_do', 'quote', 'callout',
  'synced_block', 'template', 'paragraph'
]);

/**
 * Block types whose children MUST be included inline during creation
 */
const INLINE_CHILDREN_TYPES = new Set(['column_list', 'table']);

/**
 * Fetch all blocks recursively with pagination
 */
async function fetchAllBlocks(blockId) {
  const blocks = [];
  let cursor;

  do {
    await delay(350);
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100
    });

    for (const block of response.results) {
      const blockWithChildren = { ...block };
      if (block.has_children && !['child_database', 'child_page'].includes(block.type)) {
        blockWithChildren.children = await fetchAllBlocks(block.id);
      }
      blocks.push(blockWithChildren);
    }
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return blocks;
}

/**
 * Clean block for creation - handles different block types appropriately
 * @param block - The original block with all data
 * @param forInlineCreation - If true, we're creating inside column_list/table and need full inline structure
 */
function cleanBlockForCreation(block, forInlineCreation = false) {
  const blockType = block.type;
  const blockContent = block[blockType];

  const cleanBlock = {
    type: blockType,
    [blockType]: {}
  };

  switch (blockType) {
    case 'paragraph':
    case 'quote':
      cleanBlock[blockType] = {
        rich_text: blockContent.rich_text || [],
        color: blockContent.color || 'default'
      };
      break;

    case 'heading_1':
    case 'heading_2':
    case 'heading_3':
      cleanBlock[blockType] = {
        rich_text: blockContent.rich_text || [],
        color: blockContent.color || 'default',
        is_toggleable: blockContent.is_toggleable || false
      };
      break;

    case 'bulleted_list_item':
    case 'numbered_list_item':
      cleanBlock[blockType] = {
        rich_text: blockContent.rich_text || [],
        color: blockContent.color || 'default'
      };
      break;

    case 'to_do':
      cleanBlock[blockType] = {
        rich_text: blockContent.rich_text || [],
        checked: blockContent.checked || false,
        color: blockContent.color || 'default'
      };
      break;

    case 'toggle':
      cleanBlock[blockType] = {
        rich_text: blockContent.rich_text || [],
        color: blockContent.color || 'default'
      };
      break;

    case 'callout':
      cleanBlock[blockType] = {
        rich_text: blockContent.rich_text || [],
        color: blockContent.color || 'default'
      };
      if (blockContent.icon) {
        cleanBlock[blockType].icon = blockContent.icon;
      }
      break;

    case 'code':
      cleanBlock[blockType] = {
        rich_text: blockContent.rich_text || [],
        language: blockContent.language || 'plain text',
        caption: blockContent.caption || []
      };
      break;

    case 'divider':
      cleanBlock[blockType] = {};
      break;

    case 'table_of_contents':
      cleanBlock[blockType] = {
        color: blockContent.color || 'default'
      };
      break;

    case 'column_list':
      // column_list MUST include columns inline
      // Columns include their immediate content but NOT nested children
      cleanBlock[blockType] = {
        children: (block.children || []).map(col => cleanColumnForCreation(col))
      };
      break;

    case 'column':
      // This shouldn't be called directly - handled by cleanColumnForCreation
      cleanBlock[blockType] = {};
      break;

    case 'table':
      // table MUST include rows inline
      cleanBlock[blockType] = {
        table_width: blockContent.table_width,
        has_column_header: blockContent.has_column_header || false,
        has_row_header: blockContent.has_row_header || false,
        children: (block.children || [])
          .map(row => cleanBlockForCreation(row))
          .filter(row => row !== null)
      };
      break;

    case 'table_row':
      cleanBlock[blockType] = {
        cells: blockContent.cells || []
      };
      break;

    case 'image':
      if (blockContent.type === 'external') {
        cleanBlock[blockType] = {
          type: 'external',
          external: { url: blockContent.external.url },
          caption: blockContent.caption || []
        };
      } else if (blockContent.type === 'file') {
        cleanBlock[blockType] = {
          type: 'external',
          external: { url: blockContent.file.url },
          caption: blockContent.caption || []
        };
      }
      break;

    case 'bookmark':
      cleanBlock[blockType] = {
        url: blockContent.url,
        caption: blockContent.caption || []
      };
      break;

    case 'embed':
      cleanBlock[blockType] = {
        url: blockContent.url,
        caption: blockContent.caption || []
      };
      break;

    case 'video':
      if (blockContent.type === 'external') {
        cleanBlock[blockType] = {
          type: 'external',
          external: { url: blockContent.external.url },
          caption: blockContent.caption || []
        };
      }
      break;

    case 'synced_block':
      console.log(`  [!] Skipping synced_block - cannot duplicate synced content`);
      return null;

    case 'child_database':
      console.log(`  [!] Skipping child_database "${blockContent.title}" - databases cannot be duplicated via API`);
      return null;

    case 'child_page':
      console.log(`  [!] Skipping child_page - pages cannot be duplicated via API`);
      return null;

    default:
      if (blockContent?.rich_text) {
        cleanBlock[blockType] = {
          rich_text: blockContent.rich_text
        };
      }
      console.log(`  [!] Block type "${blockType}" may need special handling`);
  }

  return cleanBlock;
}

/**
 * Clean a column block for inline creation within column_list
 * Creates the column structure without nested children for blocks that support them
 */
function cleanColumnForCreation(column) {
  const cleanColumn = {
    type: 'column',
    column: {
      children: []
    }
  };

  if (column.children) {
    for (const child of column.children) {
      const cleanChild = cleanBlockForCreation(child);
      if (cleanChild) {
        cleanColumn.column.children.push(cleanChild);
      }
    }
  }

  return cleanColumn;
}

/**
 * After creating blocks, add children to blocks that support them
 * This is needed because column_list blocks create their structure inline,
 * but nested children (inside toggles, callouts, toggleable headings) need to be added after
 */
async function addChildrenToCreatedBlocks(createdBlockId, originalBlocks) {
  // Fetch the created blocks to get their IDs
  await delay(350);
  const createdResponse = await notion.blocks.children.list({
    block_id: createdBlockId,
    page_size: 100
  });

  const createdBlocks = createdResponse.results;

  // Match created blocks to original blocks
  // We need to handle the case where some blocks were skipped (child_database, etc.)
  let createdIdx = 0;
  for (const originalBlock of originalBlocks) {
    // Skip block types that aren't created
    if (['child_database', 'child_page', 'synced_block'].includes(originalBlock.type)) {
      continue;
    }

    if (createdIdx >= createdBlocks.length) {
      console.log(`  [WARN] Ran out of created blocks to match`);
      break;
    }

    const createdBlock = createdBlocks[createdIdx];
    createdIdx++;

    // Handle column_list specially - need to recurse into columns
    if (originalBlock.type === 'column_list') {
      await addChildrenToColumnList(createdBlock.id, originalBlock.children || []);
    }
    // For blocks that support children and have them
    else if (originalBlock.children && originalBlock.children.length > 0 &&
             SUPPORTS_CHILDREN.has(originalBlock.type)) {
      console.log(`  Adding ${originalBlock.children.length} children to ${originalBlock.type}...`);
      await appendBlocksWithChildren(createdBlock.id, originalBlock.children);
    }
  }
}

/**
 * Handle adding children to blocks inside a column_list
 */
async function addChildrenToColumnList(columnListId, originalColumns) {
  // Fetch created columns
  await delay(350);
  const columnsResponse = await notion.blocks.children.list({
    block_id: columnListId,
    page_size: 100
  });

  const createdColumns = columnsResponse.results;

  for (let i = 0; i < Math.min(originalColumns.length, createdColumns.length); i++) {
    const originalColumn = originalColumns[i];
    const createdColumn = createdColumns[i];

    if (originalColumn.children && originalColumn.children.length > 0) {
      await addChildrenToColumnContents(createdColumn.id, originalColumn.children);
    }
  }
}

/**
 * Add children to blocks inside a column
 */
async function addChildrenToColumnContents(columnId, originalChildren) {
  // Fetch created blocks in this column
  await delay(350);
  const response = await notion.blocks.children.list({
    block_id: columnId,
    page_size: 100
  });

  const createdBlocks = response.results;

  // Match and add children
  let createdIdx = 0;
  for (const originalBlock of originalChildren) {
    if (['child_database', 'child_page', 'synced_block'].includes(originalBlock.type)) {
      continue;
    }

    if (createdIdx >= createdBlocks.length) {
      break;
    }

    const createdBlock = createdBlocks[createdIdx];
    createdIdx++;

    // Recurse into column_list inside columns
    if (originalBlock.type === 'column_list') {
      await addChildrenToColumnList(createdBlock.id, originalBlock.children || []);
    }
    // Add children to blocks that support them
    else if (originalBlock.children && originalBlock.children.length > 0 &&
             SUPPORTS_CHILDREN.has(originalBlock.type)) {
      const text = originalBlock[originalBlock.type]?.rich_text?.map(t => t.plain_text).join('') || '';
      console.log(`  Adding ${originalBlock.children.length} children to ${originalBlock.type}: "${text.substring(0, 30)}..."`);
      await appendBlocksWithChildren(createdBlock.id, originalBlock.children);
    }
  }
}

/**
 * Append blocks and then recursively add their children
 */
async function appendBlocksWithChildren(parentId, blocks) {
  // First, create all blocks without nested children
  const cleanBlocks = blocks
    .map(block => cleanBlockForCreation(block))
    .filter(block => block !== null);

  if (cleanBlocks.length === 0) {
    return;
  }

  await delay(350);
  const response = await notion.blocks.children.append({
    block_id: parentId,
    children: cleanBlocks
  });

  // Now add children to blocks that need them
  let createdIdx = 0;
  for (const originalBlock of blocks) {
    if (['child_database', 'child_page', 'synced_block'].includes(originalBlock.type)) {
      continue;
    }

    const createdBlock = response.results[createdIdx];
    createdIdx++;

    // Handle column_list - need to add children to column contents
    if (originalBlock.type === 'column_list') {
      await addChildrenToColumnList(createdBlock.id, originalBlock.children || []);
    }
    // For other blocks that support children
    else if (originalBlock.children && originalBlock.children.length > 0 &&
             SUPPORTS_CHILDREN.has(originalBlock.type)) {
      console.log(`    Adding ${originalBlock.children.length} children to nested ${originalBlock.type}...`);
      await appendBlocksWithChildren(createdBlock.id, originalBlock.children);
    }
  }
}

async function main() {
  console.log('=== Notion Page Duplicator v2 ===\n');
  console.log('This version properly handles nested children in toggle blocks and columns.\n');

  if (!NOTION_TOKEN) {
    console.error('ERROR: NOTION_TOKEN not found in environment variables');
    process.exit(1);
  }

  try {
    // Step 1: Fetch the template page
    console.log('Step 1: Fetching template page...');
    console.log(`  Template ID: ${TEMPLATE_PAGE_ID}`);

    const templatePage = await notion.pages.retrieve({ page_id: TEMPLATE_PAGE_ID });

    const titleProp = templatePage.properties?.Name?.title ||
                      templatePage.properties?.title?.title ||
                      Object.values(templatePage.properties).find(p => p.type === 'title')?.title;
    const templateTitle = titleProp?.[0]?.plain_text || 'Untitled';

    console.log(`  Title: "${templateTitle}"`);
    console.log(`  Created: ${templatePage.created_time}`);
    console.log(`  Last edited: ${templatePage.last_edited_time}`);

    // Step 2: Identify parent database
    console.log('\nStep 2: Identifying parent database...');

    let parentDatabaseId = null;
    let parentPageId = null;
    let parentType = templatePage.parent.type;

    if (parentType === 'database_id' || templatePage.parent.database_id) {
      parentDatabaseId = templatePage.parent.database_id;
      console.log(`  Parent Database ID: ${parentDatabaseId}`);

      await delay(350);
      const database = await notion.databases.retrieve({ database_id: parentDatabaseId });
      const dbTitle = database.title?.[0]?.plain_text || 'Untitled Database';
      console.log(`  Database Name: "${dbTitle}"`);
    } else if (parentType === 'page_id') {
      parentPageId = templatePage.parent.page_id;
      console.log(`  Parent Page ID: ${parentPageId}`);
    } else {
      throw new Error(`Unsupported parent type: ${parentType}`);
    }

    // Step 3: Fetch all blocks
    console.log('\nStep 3: Fetching template blocks...');
    const templateBlocks = await fetchAllBlocks(TEMPLATE_PAGE_ID);
    console.log(`  Total top-level blocks: ${templateBlocks.length}`);

    // Count all blocks including nested
    function countAllBlocks(blocks) {
      let count = blocks.length;
      for (const block of blocks) {
        if (block.children) {
          count += countAllBlocks(block.children);
        }
      }
      return count;
    }
    console.log(`  Total blocks (including nested): ${countAllBlocks(templateBlocks)}`);

    // Step 4: Create new page
    console.log('\nStep 4: Creating new page...');

    const newPageTitle = `Copy of ${templateTitle} - ${new Date().toISOString().split('T')[0]}`;

    let newPageParams;

    if (parentDatabaseId) {
      await delay(350);
      const database = await notion.databases.retrieve({ database_id: parentDatabaseId });

      const titlePropertyName = Object.keys(database.properties || {}).find(
        key => database.properties[key].type === 'title'
      ) || 'Name';

      newPageParams = {
        parent: { database_id: parentDatabaseId },
        properties: {
          [titlePropertyName]: {
            title: [{ text: { content: newPageTitle } }]
          }
        }
      };

      // Copy other properties
      if (templatePage.properties) {
        for (const [propName, propValue] of Object.entries(templatePage.properties)) {
          const skipTypes = ['title', 'formula', 'rollup', 'created_time',
                            'created_by', 'last_edited_time', 'last_edited_by',
                            'unique_id', 'verification'];
          if (!skipTypes.includes(propValue.type)) {
            try {
              const cleanedProp = JSON.parse(JSON.stringify(propValue));
              delete cleanedProp.id;
              newPageParams.properties[propName] = cleanedProp;
            } catch (e) {
              // Skip problematic properties
            }
          }
        }
      }
    } else {
      newPageParams = {
        parent: { page_id: parentPageId },
        properties: {
          title: {
            title: [{ text: { content: newPageTitle } }]
          }
        }
      };
    }

    await delay(350);
    const newPage = await notion.pages.create(newPageParams);

    console.log(`  New page created!`);
    console.log(`  New Page ID: ${newPage.id}`);

    // Step 5: Copy blocks with full nested support
    console.log('\nStep 5: Copying blocks (with nested children support)...');

    if (templateBlocks.length > 0) {
      await appendBlocksWithChildren(newPage.id, templateBlocks);
      console.log(`  All blocks copied!`);
    }

    // Final report
    const formattedPageId = newPage.id.replace(/-/g, '');
    const pageUrl = `https://www.notion.so/${formattedPageId}`;

    console.log('\n=== Duplication Complete ===');
    console.log(`\nNew page created:`);
    console.log(`  Title: "${newPageTitle}"`);
    console.log(`  Page ID: ${newPage.id}`);
    console.log(`  URL: ${pageUrl}`);

    return { success: true, newPage, url: pageUrl };

  } catch (error) {
    console.error('\nERROR:', error.message);
    if (error.body) {
      console.error('Details:', JSON.stringify(error.body, null, 2));
    }
    process.exit(1);
  }
}

main();
