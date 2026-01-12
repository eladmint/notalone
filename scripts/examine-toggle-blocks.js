/**
 * Examine Toggle Blocks and Their Children
 * This script fetches and displays the structure of toggle blocks in a Notion page
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
 * Get the text content from rich_text array
 */
function getPlainText(richText) {
  return richText?.map(t => t.plain_text).join('') || '';
}

/**
 * Fetch all blocks recursively with pagination
 */
async function fetchAllBlocksWithDetails(blockId, depth = 0) {
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
      const blockInfo = {
        id: block.id,
        type: block.type,
        has_children: block.has_children,
        depth: depth,
        content: getBlockContent(block),
        children: []
      };

      if (block.has_children) {
        console.log(`${'  '.repeat(depth)}Fetching children of ${block.type}: "${blockInfo.content.substring(0, 50)}..."`);
        blockInfo.children = await fetchAllBlocksWithDetails(block.id, depth + 1);
      }

      blocks.push(blockInfo);
    }
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return blocks;
}

/**
 * Extract content summary from a block
 */
function getBlockContent(block) {
  const type = block.type;
  const content = block[type];

  if (content?.rich_text) {
    return getPlainText(content.rich_text);
  }
  if (type === 'divider') return '---';
  if (type === 'table_of_contents') return '[TOC]';
  if (type === 'column_list') return `[Column List - ${content?.children?.length || '?'} columns]`;
  if (type === 'column') return '[Column]';

  return `[${type}]`;
}

/**
 * Print the block tree structure
 */
function printBlockTree(blocks, indent = '') {
  for (const block of blocks) {
    const hasChildrenIndicator = block.has_children ? ` (has_children: true, ${block.children.length} children)` : '';
    const contentPreview = block.content.substring(0, 60) + (block.content.length > 60 ? '...' : '');

    console.log(`${indent}[${block.type}]${hasChildrenIndicator}`);
    console.log(`${indent}  ID: ${block.id}`);
    console.log(`${indent}  Content: "${contentPreview}"`);

    if (block.children.length > 0) {
      console.log(`${indent}  Children:`);
      printBlockTree(block.children, indent + '    ');
    }
    console.log('');
  }
}

/**
 * Find and report on toggle blocks specifically
 */
function findToggleBlocks(blocks, results = []) {
  for (const block of blocks) {
    if (block.type === 'toggle') {
      results.push(block);
    }
    if (block.children.length > 0) {
      findToggleBlocks(block.children, results);
    }
  }
  return results;
}

async function main() {
  console.log('=== Examining Toggle Blocks in Template Page ===\n');
  console.log(`Template Page ID: ${TEMPLATE_PAGE_ID}\n`);

  try {
    // Fetch all blocks with children
    console.log('Fetching all blocks recursively...\n');
    const allBlocks = await fetchAllBlocksWithDetails(TEMPLATE_PAGE_ID);

    console.log('\n=== COMPLETE BLOCK STRUCTURE ===\n');
    printBlockTree(allBlocks);

    // Find toggle blocks
    const toggleBlocks = findToggleBlocks(allBlocks);

    console.log('\n=== TOGGLE BLOCKS SUMMARY ===\n');
    console.log(`Found ${toggleBlocks.length} toggle blocks:\n`);

    for (const toggle of toggleBlocks) {
      console.log(`Toggle: "${toggle.content}"`);
      console.log(`  ID: ${toggle.id}`);
      console.log(`  has_children: ${toggle.has_children}`);
      console.log(`  Children fetched: ${toggle.children.length}`);
      if (toggle.children.length > 0) {
        console.log(`  Child types: ${toggle.children.map(c => c.type).join(', ')}`);
        console.log(`  Child contents:`);
        for (const child of toggle.children) {
          console.log(`    - [${child.type}] "${child.content.substring(0, 50)}..."`);
        }
      }
      console.log('');
    }

    // Output JSON for detailed inspection
    console.log('\n=== RAW TOGGLE DATA (JSON) ===\n');
    console.log(JSON.stringify(toggleBlocks, null, 2));

  } catch (error) {
    console.error('ERROR:', error.message);
    if (error.body) {
      console.error('Details:', JSON.stringify(error.body, null, 2));
    }
    process.exit(1);
  }
}

main();
