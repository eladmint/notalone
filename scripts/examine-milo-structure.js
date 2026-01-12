/**
 * Examine the structure of the Milo page to understand how to update it
 */

import { Client } from '@notionhq/client';
import 'dotenv/config';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Target page ID
const MILO_PAGE_ID = '2c585dd502d581b8907bdc6683724f85';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function examineBlock(blockId, indent = '') {
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
      const isToggleable = content?.is_toggleable || false;

      let info = `${indent}[${block.type}]`;
      if (isToggleable) info += ' (toggleable)';
      if (block.has_children) info += ' (has_children)';
      info += ` "${text.substring(0, 60)}"`;

      console.log(info);

      // Recursively examine children
      if (block.has_children && !['child_database', 'child_page'].includes(block.type)) {
        await examineBlock(block.id, indent + '  ');
      }
    }

    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);
}

async function main() {
  console.log('========================================');
  console.log('Examining Milo Page Structure');
  console.log(`Page ID: ${MILO_PAGE_ID}`);
  console.log('========================================\n');

  await examineBlock(MILO_PAGE_ID);

  console.log('\n========================================');
  console.log('Done!');
  console.log('========================================');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
