/**
 * Duplicate Notion Page from Template
 * Creates a new page in the same database with identical block structure
 */

import 'dotenv/config';
import { Client } from '@notionhq/client';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const TEMPLATE_PAGE_ID = '2c585dd502d580eeb974c1f3cd8afc57';

// Initialize client
const notion = new Client({ auth: NOTION_TOKEN });

// Rate limiting helper
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch all blocks recursively with pagination
 */
async function fetchAllBlocks(blockId) {
  const blocks = [];
  let cursor;

  do {
    await delay(350); // Rate limit: 3 req/s
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100
    });

    for (const block of response.results) {
      const blockWithChildren = { ...block };
      if (block.has_children) {
        blockWithChildren.children = await fetchAllBlocks(block.id);
      }
      blocks.push(blockWithChildren);
    }
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return blocks;
}

/**
 * Clean block for creation - remove read-only fields
 * For structural blocks like column_list, includes children inline
 */
function cleanBlockForCreation(block, includeChildren = false) {
  const blockType = block.type;
  const blockContent = block[blockType];

  // Create clean block with only type and content
  const cleanBlock = {
    type: blockType,
    [blockType]: {}
  };

  // Handle different block types
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
      // Only include icon if it exists (not null)
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
      // column_list MUST include its column children inline
      cleanBlock[blockType] = {
        children: (block.children || [])
          .map(col => cleanBlockForCreation(col, true))
          .filter(col => col !== null)
      };
      break;

    case 'column':
      // column blocks contain their content as children
      if (includeChildren && block.children) {
        cleanBlock[blockType] = {
          children: block.children
            .map(child => cleanBlockForCreation(child, false))
            .filter(child => child !== null)
        };
      } else {
        cleanBlock[blockType] = {};
      }
      break;

    case 'image':
      if (blockContent.type === 'external') {
        cleanBlock[blockType] = {
          type: 'external',
          external: { url: blockContent.external.url },
          caption: blockContent.caption || []
        };
      } else if (blockContent.type === 'file') {
        // Notion-hosted images need to be converted to external URL
        // The file URL is temporary, so we use it as external
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

    case 'table':
      // table MUST include its table_row children inline
      cleanBlock[blockType] = {
        table_width: blockContent.table_width,
        has_column_header: blockContent.has_column_header || false,
        has_row_header: blockContent.has_row_header || false,
        children: (block.children || [])
          .map(row => cleanBlockForCreation(row, false))
          .filter(row => row !== null)
      };
      break;

    case 'table_row':
      cleanBlock[blockType] = {
        cells: blockContent.cells || []
      };
      break;

    case 'synced_block':
      // Synced blocks need special handling - skip for now
      console.log(`  [!] Skipping synced_block - cannot duplicate synced content`);
      return null;

    case 'child_database':
      // Child databases cannot be duplicated via API - skip
      console.log(`  [!] Skipping child_database "${blockContent.title}" - databases cannot be duplicated via API`);
      return null;

    case 'child_page':
      // Child pages cannot be duplicated via API - skip
      console.log(`  [!] Skipping child_page - pages cannot be duplicated via API`);
      return null;

    default:
      // For unsupported types, try to copy basic content
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
 * Append blocks to a parent, handling children recursively
 * Some blocks (column_list, table) have their children included inline and don't need recursive handling
 */
async function appendBlocksRecursively(parentId, blocks) {
  const createdBlocks = [];

  // Block types that have children included inline (don't need recursive child handling)
  const inlineChildrenTypes = ['column_list', 'column', 'table'];

  // Block types that support children being added after creation
  const supportsChildrenTypes = [
    'toggle',
    'heading_1',     // Toggleable headings can have children
    'heading_2',     // Toggleable headings can have children
    'heading_3',     // Toggleable headings can have children
    'bulleted_list_item',
    'numbered_list_item',
    'to_do',
    'quote',
    'callout',
    'synced_block',
    'template',
    'paragraph' // paragraph can have children in some contexts
  ];

  // Process blocks in batches of 100 (API limit)
  const batchSize = 100;

  for (let i = 0; i < blocks.length; i += batchSize) {
    const batch = blocks.slice(i, i + batchSize);

    // Prepare clean blocks for this batch, filtering out nulls (skipped blocks)
    const cleanBlocks = batch
      .map(block => cleanBlockForCreation(block))
      .filter(block => block !== null);

    if (cleanBlocks.length === 0) {
      continue;
    }

    await delay(350); // Rate limit

    try {
      const response = await notion.blocks.children.append({
        block_id: parentId,
        children: cleanBlocks
      });

      // Build a mapping from original blocks to created blocks
      let createdIdx = 0;
      for (let j = 0; j < batch.length; j++) {
        const originalBlock = batch[j];
        const cleanedBlock = cleanBlockForCreation(originalBlock);

        // Skip if this block was filtered out (null)
        if (cleanedBlock === null) {
          continue;
        }

        const createdBlock = response.results[createdIdx];
        createdBlocks.push(createdBlock);
        createdIdx++;

        // Handle children for blocks that:
        // 1. Don't have them inline already
        // 2. Actually support children
        if (originalBlock.children && originalBlock.children.length > 0 &&
            !inlineChildrenTypes.includes(originalBlock.type) &&
            supportsChildrenTypes.includes(originalBlock.type)) {
          console.log(`  Adding ${originalBlock.children.length} child blocks to ${originalBlock.type}...`);
          await appendBlocksRecursively(createdBlock.id, originalBlock.children);
        }
      }
    } catch (error) {
      console.error(`Error appending blocks:`, error.message);
      // Log the block that caused the error for debugging
      if (cleanBlocks.length > 0) {
        console.error(`First block in batch:`, JSON.stringify(cleanBlocks[0], null, 2));
      }
      throw error;
    }
  }

  return createdBlocks;
}

async function main() {
  console.log('=== Notion Page Duplicator ===\n');

  if (!NOTION_TOKEN) {
    console.error('ERROR: NOTION_TOKEN not found in environment variables');
    process.exit(1);
  }

  try {
    // Step 1: Fetch the template page
    console.log('Step 1: Fetching template page...');
    console.log(`  Template ID: ${TEMPLATE_PAGE_ID}`);

    const templatePage = await notion.pages.retrieve({ page_id: TEMPLATE_PAGE_ID });

    // Get title
    const titleProp = templatePage.properties?.Name?.title ||
                      templatePage.properties?.title?.title ||
                      Object.values(templatePage.properties).find(p => p.type === 'title')?.title;
    const templateTitle = titleProp?.[0]?.plain_text || 'Untitled';

    console.log(`  Title: "${templateTitle}"`);
    console.log(`  Created: ${templatePage.created_time}`);
    console.log(`  Last edited: ${templatePage.last_edited_time}`);

    // Step 2: Identify parent database
    console.log('\nStep 2: Identifying parent database...');

    console.log(`  Parent object:`, JSON.stringify(templatePage.parent, null, 2));

    let parentDatabaseId = null;
    let parentPageId = null;
    let parentType = templatePage.parent.type;

    if (parentType === 'database_id' || templatePage.parent.database_id) {
      // Handle both direct database_id type and data_source_id with database_id
      parentDatabaseId = templatePage.parent.database_id;
      console.log(`  Parent Database ID: ${parentDatabaseId}`);

      // Get database info
      await delay(350);
      const database = await notion.databases.retrieve({ database_id: parentDatabaseId });
      const dbTitle = database.title?.[0]?.plain_text || 'Untitled Database';
      console.log(`  Database Name: "${dbTitle}"`);
    } else if (parentType === 'page_id') {
      parentPageId = templatePage.parent.page_id;
      console.log(`  Parent is a page, not a database`);
      console.log(`  Parent Page ID: ${parentPageId}`);
    } else if (parentType === 'workspace') {
      console.log(`  Parent is workspace root`);
    } else if (parentType === 'block_id') {
      // Sometimes pages are nested under blocks
      console.log(`  Parent is a block`);
      console.log(`  Parent Block ID: ${templatePage.parent.block_id}`);
    }

    // Step 3: Fetch all blocks from template
    console.log('\nStep 3: Fetching template blocks...');
    const templateBlocks = await fetchAllBlocks(TEMPLATE_PAGE_ID);
    console.log(`  Total blocks fetched: ${templateBlocks.length}`);

    // Display block summary
    const blockSummary = {};
    function countBlocks(blocks) {
      for (const block of blocks) {
        blockSummary[block.type] = (blockSummary[block.type] || 0) + 1;
        if (block.children) {
          countBlocks(block.children);
        }
      }
    }
    countBlocks(templateBlocks);
    console.log('  Block types:', blockSummary);

    // Step 4: Create new page
    console.log('\nStep 4: Creating new page in database...');

    const newPageTitle = `Copy of ${templateTitle} - ${new Date().toISOString().split('T')[0]}`;

    let newPageParams;

    if (parentDatabaseId) {
      // Create in database - need to match database properties
      await delay(350);
      console.log('  Retrieving database schema...');
      const database = await notion.databases.retrieve({ database_id: parentDatabaseId });

      console.log('  Database properties:', Object.keys(database.properties || {}));

      // Find the title property
      const titlePropertyName = Object.keys(database.properties || {}).find(
        key => database.properties[key].type === 'title'
      ) || 'Name';
      console.log(`  Title property name: "${titlePropertyName}"`);

      newPageParams = {
        parent: { database_id: parentDatabaseId },
        properties: {
          [titlePropertyName]: {
            title: [{ text: { content: newPageTitle } }]
          }
        }
      };

      // Copy other properties from template if they exist
      if (templatePage.properties) {
        for (const [propName, propValue] of Object.entries(templatePage.properties)) {
          // Skip read-only and auto-generated properties
          const skipTypes = ['title', 'formula', 'rollup', 'created_time',
                            'created_by', 'last_edited_time', 'last_edited_by',
                            'unique_id', 'verification'];
          if (!skipTypes.includes(propValue.type)) {
            try {
              // Deep copy the property, removing any id fields
              const cleanedProp = JSON.parse(JSON.stringify(propValue));
              delete cleanedProp.id;
              newPageParams.properties[propName] = cleanedProp;
            } catch (e) {
              console.log(`  Skipping property "${propName}": ${e.message}`);
            }
          }
        }
      }
      console.log(`  Properties to create:`, Object.keys(newPageParams.properties));
    } else if (parentPageId) {
      // Create as child of parent page
      newPageParams = {
        parent: { page_id: parentPageId },
        properties: {
          title: {
            title: [{ text: { content: newPageTitle } }]
          }
        }
      };
    } else if (parentType === 'block_id') {
      // If parent is a block, we need to find the containing page/database
      // For now, try to use the block's parent page
      console.log('  Note: Template is inside a block. Will create as sibling in same container.');
      // Fall back to creating in workspace - this might fail if workspace root access isn't allowed
      throw new Error('Creating pages under blocks requires additional handling. Please provide a database ID.');
    } else {
      throw new Error(`Unsupported parent type: ${parentType}. Please ensure the template is in a database or under a page.`);
    }

    await delay(350);
    const newPage = await notion.pages.create(newPageParams);

    console.log(`  New page created!`);
    console.log(`  New Page ID: ${newPage.id}`);

    // Step 5: Copy blocks to new page
    console.log('\nStep 5: Copying blocks to new page...');

    if (templateBlocks.length > 0) {
      await appendBlocksRecursively(newPage.id, templateBlocks);
      console.log(`  All blocks copied successfully!`);
    } else {
      console.log(`  No blocks to copy (template is empty)`);
    }

    // Final report
    const formattedPageId = newPage.id.replace(/-/g, '');
    const pageUrl = `https://www.notion.so/${formattedPageId}`;

    console.log('\n=== Duplication Complete ===');
    console.log(`\nNew page created:`);
    console.log(`  Title: "${newPageTitle}"`);
    console.log(`  Page ID: ${newPage.id}`);
    console.log(`  URL: ${pageUrl}`);
    console.log(`\nBlocks copied: ${templateBlocks.length} top-level blocks`);

    return { success: true, newPage, url: pageUrl };

  } catch (error) {
    console.error('\nERROR:', error.message);
    if (error.code === 'object_not_found') {
      console.log('\nMake sure the template page is shared with your "claude" integration.');
    }
    if (error.body) {
      console.error('Details:', JSON.stringify(error.body, null, 2));
    }
    process.exit(1);
  }
}

main();
