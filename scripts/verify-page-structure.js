/**
 * Verify page structure - compare original and copy
 */

import 'dotenv/config';
import { Client } from '@notionhq/client';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const TEMPLATE_PAGE_ID = '2c585dd502d580eeb974c1f3cd8afc57';
const NEW_PAGE_ID = '2c585dd502d5814fa7c9e7f32f446196';

const notion = new Client({ auth: NOTION_TOKEN });

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchAllBlocksRecursive(blockId, depth = 0) {
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
        type: block.type,
        has_children: block.has_children,
        depth: depth,
        children: []
      };

      // Get content
      const content = block[block.type];
      if (content?.rich_text) {
        blockInfo.text = content.rich_text.map(t => t.plain_text).join('');
      }
      if (content?.is_toggleable !== undefined) {
        blockInfo.is_toggleable = content.is_toggleable;
      }

      if (block.has_children && !['child_database', 'child_page'].includes(block.type)) {
        blockInfo.children = await fetchAllBlocksRecursive(block.id, depth + 1);
      }

      blocks.push(blockInfo);
    }
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return blocks;
}

function countBlocksDeep(blocks) {
  let count = blocks.length;
  for (const block of blocks) {
    if (block.children) {
      count += countBlocksDeep(block.children);
    }
  }
  return count;
}

function countToggleableHeadings(blocks) {
  let count = 0;
  for (const block of blocks) {
    if (block.type.startsWith('heading_') && block.is_toggleable) {
      count++;
      // Count children of toggleable headings
      if (block.children && block.children.length > 0) {
        console.log(`  Toggleable ${block.type}: "${block.text?.substring(0, 30)}..." has ${block.children.length} children`);
      }
    }
    if (block.children) {
      count += countToggleableHeadings(block.children);
    }
  }
  return count;
}

function getBlockTypeSummary(blocks, summary = {}) {
  for (const block of blocks) {
    summary[block.type] = (summary[block.type] || 0) + 1;
    if (block.children) {
      getBlockTypeSummary(block.children, summary);
    }
  }
  return summary;
}

async function main() {
  console.log('=== Verifying Page Structure ===\n');

  try {
    console.log('Fetching ORIGINAL template page structure...');
    const originalBlocks = await fetchAllBlocksRecursive(TEMPLATE_PAGE_ID);

    console.log('\nFetching NEW copied page structure...');
    const newBlocks = await fetchAllBlocksRecursive(NEW_PAGE_ID);

    console.log('\n=== COMPARISON ===\n');

    const originalTotal = countBlocksDeep(originalBlocks);
    const newTotal = countBlocksDeep(newBlocks);

    console.log(`Original page total blocks (recursive): ${originalTotal}`);
    console.log(`New page total blocks (recursive): ${newTotal}`);

    const originalSummary = getBlockTypeSummary(originalBlocks);
    const newSummary = getBlockTypeSummary(newBlocks);

    console.log('\nOriginal block types:', originalSummary);
    console.log('New block types:', newSummary);

    console.log('\n=== TOGGLEABLE HEADINGS (ORIGINAL) ===');
    const originalToggles = countToggleableHeadings(originalBlocks);
    console.log(`Total toggleable headings: ${originalToggles}`);

    console.log('\n=== TOGGLEABLE HEADINGS (NEW) ===');
    const newToggles = countToggleableHeadings(newBlocks);
    console.log(`Total toggleable headings: ${newToggles}`);

    // Find differences
    console.log('\n=== DIFFERENCES ===');
    const allTypes = new Set([...Object.keys(originalSummary), ...Object.keys(newSummary)]);
    let hasDiffs = false;
    for (const type of allTypes) {
      const orig = originalSummary[type] || 0;
      const newC = newSummary[type] || 0;
      if (orig !== newC) {
        console.log(`  ${type}: original=${orig}, new=${newC} (diff=${newC - orig})`);
        hasDiffs = true;
      }
    }
    if (!hasDiffs) {
      console.log('  No differences found! Block counts match.');
    }

    // Summary
    console.log('\n=== SUMMARY ===');
    if (newTotal >= originalTotal - 4) { // Allow for skipped child_databases
      console.log('SUCCESS: New page has expected block structure');
      console.log(`  (Original: ${originalTotal}, New: ${newTotal})`);
      console.log('  Note: child_database blocks cannot be duplicated via API');
    } else {
      console.log('WARNING: New page may be missing blocks');
      console.log(`  (Original: ${originalTotal}, New: ${newTotal})`);
    }

  } catch (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
}

main();
