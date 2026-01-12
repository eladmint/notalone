/**
 * Examine deeply nested blocks to understand the structure
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

async function findBlockPath(blockId, targetType, path = []) {
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
      const content = block[block.type];
      const text = content?.rich_text?.map(t => t.plain_text).join('') || '';
      const currentPath = [...path, { type: block.type, text: text.substring(0, 30), has_children: block.has_children }];

      if (block.type === targetType) {
        console.log(`Found ${targetType}:`);
        currentPath.forEach((p, i) => {
          console.log(`  ${'  '.repeat(i)}-> ${p.type}: "${p.text}" (has_children: ${p.has_children})`);
        });
        console.log(`  Full block:`, JSON.stringify(block, null, 2));
        console.log('');
      }

      if (block.has_children && !['child_database', 'child_page'].includes(block.type)) {
        await findBlockPath(block.id, targetType, currentPath);
      }
    }
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);
}

async function main() {
  console.log('=== Examining Nested Toggle Blocks ===\n');

  try {
    console.log('=== ORIGINAL PAGE - Toggle blocks ===\n');
    await findBlockPath(TEMPLATE_PAGE_ID, 'toggle');

    console.log('\n=== NEW PAGE - Looking for toggle blocks ===\n');
    await findBlockPath(NEW_PAGE_ID, 'toggle');

    // Also check heading_3 blocks with children
    console.log('\n=== ORIGINAL PAGE - heading_3 with is_toggleable ===\n');

    async function findToggleableHeading3(blockId, path = []) {
      let cursor;
      do {
        await delay(350);
        const response = await notion.blocks.children.list({
          block_id: blockId,
          start_cursor: cursor,
          page_size: 100
        });

        for (const block of response.results) {
          const content = block[block.type];
          const text = content?.rich_text?.map(t => t.plain_text).join('') || '';
          const currentPath = [...path, { type: block.type, text: text.substring(0, 30) }];

          if (block.type === 'heading_3' && content?.is_toggleable) {
            console.log(`Toggleable heading_3: "${text}"`);
            console.log(`  has_children: ${block.has_children}`);
            if (block.has_children) {
              // Get children
              const childResp = await notion.blocks.children.list({ block_id: block.id });
              console.log(`  Children: ${childResp.results.length}`);
              for (const child of childResp.results) {
                const childText = child[child.type]?.rich_text?.map(t => t.plain_text).join('') || '';
                console.log(`    -> ${child.type}: "${childText.substring(0, 50)}"`);
              }
            }
            console.log('');
          }

          if (block.has_children && !['child_database', 'child_page'].includes(block.type)) {
            await findToggleableHeading3(block.id, currentPath);
          }
        }
        cursor = response.has_more ? response.next_cursor : undefined;
      } while (cursor);
    }

    await findToggleableHeading3(TEMPLATE_PAGE_ID);

    console.log('\n=== NEW PAGE - heading_3 with is_toggleable ===\n');
    await findToggleableHeading3(NEW_PAGE_ID);

  } catch (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
}

main();
