/**
 * Examine raw block structure including is_toggleable property
 */

import 'dotenv/config';
import { Client } from '@notionhq/client';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const TEMPLATE_PAGE_ID = '2c585dd502d580eeb974c1f3cd8afc57';

const notion = new Client({ auth: NOTION_TOKEN });

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('=== Examining Raw Block Structure ===\n');

  try {
    await delay(350);
    const response = await notion.blocks.children.list({
      block_id: TEMPLATE_PAGE_ID,
      page_size: 100
    });

    console.log('Top-level blocks:\n');

    for (const block of response.results) {
      const type = block.type;
      const content = block[type];

      console.log(`Block Type: ${type}`);
      console.log(`  ID: ${block.id}`);
      console.log(`  has_children: ${block.has_children}`);

      // Check for is_toggleable on heading blocks
      if (type.startsWith('heading_')) {
        console.log(`  is_toggleable: ${content.is_toggleable}`);
        console.log(`  color: ${content.color}`);
        const text = content.rich_text?.map(t => t.plain_text).join('') || '';
        console.log(`  text: "${text.substring(0, 50)}..."`);
      }

      // For toggle blocks
      if (type === 'toggle') {
        const text = content.rich_text?.map(t => t.plain_text).join('') || '';
        console.log(`  text: "${text}"`);
        console.log(`  color: ${content.color}`);
      }

      console.log(`  Full content:`, JSON.stringify(content, null, 4));
      console.log('');
    }

  } catch (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
}

main();
