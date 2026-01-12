/**
 * Fix Soda Labs page - Remove $SHFT/Shift Stocks contamination
 */
import 'dotenv/config';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const PAGE_ID = '2c585dd502d5815ea66edabc9b8fe2c0';

async function fetchAllBlocks(blockId) {
  const allBlocks = [];
  let cursor = undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100
    });
    allBlocks.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return allBlocks;
}

async function findBlocksToFix(blockId, depth = 0, results = []) {
  const blocks = await fetchAllBlocks(blockId);

  for (const block of blocks) {
    const type = block.type;
    let text = '';

    if (block[type]?.rich_text) {
      text = block[type].rich_text.map(t => t.plain_text).join('');
    }

    // Check if contains SHFT or Shift Stocks
    if (text.toLowerCase().includes('shft') || text.toLowerCase().includes('shift stock')) {
      results.push({
        id: block.id,
        type: type,
        text: text,
        depth: depth
      });
    }

    if (block.has_children) {
      await findBlocksToFix(block.id, depth + 1, results);
    }
  }

  return results;
}

async function main() {
  console.log('=== Finding blocks with $SHFT/Shift Stocks references ===\n');

  const blocksToFix = await findBlocksToFix(PAGE_ID);

  console.log(`Found ${blocksToFix.length} blocks to fix:\n`);

  for (const block of blocksToFix) {
    console.log(`Block ID: ${block.id}`);
    console.log(`Type: ${block.type}`);
    console.log(`Text: ${block.text}`);
    console.log('---');
  }

  // Now fix each block
  console.log('\n=== Fixing blocks ===\n');

  for (const block of blocksToFix) {
    let newText = '';

    if (block.text.includes('$SHFT Token Economics')) {
      // This is the Business Model bullet - delete it entirely
      console.log(`Deleting Business Model bullet with $SHFT: ${block.id}`);
      await notion.blocks.delete({ block_id: block.id });
      console.log('  -> Deleted');
    } else if (block.text.includes('Token confusion: $SHFT')) {
      // Replace with corrected text about investment structure
      newText = 'Investment structure unclear: Deck does not specify if investment is token, equity, or SAFE. COTI has $COTI token, but Soda Labs investment vehicle not disclosed.';
      console.log(`Updating Concerns bullet: ${block.id}`);
      console.log(`  Old: ${block.text}`);
      console.log(`  New: ${newText}`);

      await notion.blocks.update({
        block_id: block.id,
        [block.type]: {
          rich_text: [{
            type: 'text',
            text: { content: newText }
          }]
        }
      });
      console.log('  -> Updated');
    }
  }

  console.log('\n=== Done! ===');
}

main().catch(console.error);
