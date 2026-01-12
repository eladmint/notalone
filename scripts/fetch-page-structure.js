#!/usr/bin/env node
/**
 * Fetch Notion page structure recursively to understand template
 */

import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const PAGE_ID = '2c585dd502d581b8907bdc6683724f85';

async function fetchAllBlocks(blockId, depth = 0) {
  const blocks = [];
  let cursor;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    });

    for (const block of response.results) {
      const indent = '  '.repeat(depth);
      const blockInfo = {
        id: block.id,
        type: block.type,
        depth,
        has_children: block.has_children,
      };

      // Extract text content and formatting
      if (block.type === 'heading_1') {
        blockInfo.text = block.heading_1.rich_text.map(t => t.plain_text).join('');
        blockInfo.color = block.heading_1.color;
      } else if (block.type === 'heading_2') {
        blockInfo.text = block.heading_2.rich_text.map(t => t.plain_text).join('');
        blockInfo.color = block.heading_2.color;
      } else if (block.type === 'heading_3') {
        blockInfo.text = block.heading_3.rich_text.map(t => t.plain_text).join('');
        blockInfo.color = block.heading_3.color;
      } else if (block.type === 'paragraph') {
        blockInfo.text = block.paragraph.rich_text.map(t => t.plain_text).join('');
        blockInfo.color = block.paragraph.color;
      } else if (block.type === 'callout') {
        blockInfo.text = block.callout.rich_text.map(t => t.plain_text).join('');
        blockInfo.icon = block.callout.icon;
        blockInfo.color = block.callout.color;
      } else if (block.type === 'toggle') {
        blockInfo.text = block.toggle.rich_text.map(t => t.plain_text).join('');
        blockInfo.color = block.toggle.color;
      } else if (block.type === 'quote') {
        blockInfo.text = block.quote.rich_text.map(t => t.plain_text).join('');
        blockInfo.color = block.quote.color;
      } else if (block.type === 'bulleted_list_item') {
        blockInfo.text = block.bulleted_list_item.rich_text.map(t => t.plain_text).join('');
      } else if (block.type === 'numbered_list_item') {
        blockInfo.text = block.numbered_list_item.rich_text.map(t => t.plain_text).join('');
      } else if (block.type === 'table') {
        blockInfo.table_width = block.table.table_width;
        blockInfo.has_column_header = block.table.has_column_header;
        blockInfo.has_row_header = block.table.has_row_header;
      } else if (block.type === 'table_row') {
        blockInfo.cells = block.table_row.cells.map(cell =>
          cell.map(t => t.plain_text).join('')
        );
      } else if (block.type === 'column_list') {
        blockInfo.text = '[Column Layout]';
      } else if (block.type === 'column') {
        blockInfo.text = '[Column]';
      } else if (block.type === 'divider') {
        blockInfo.text = '---';
      }

      blocks.push(blockInfo);

      // Recursively fetch children
      if (block.has_children) {
        const children = await fetchAllBlocks(block.id, depth + 1);
        blocks.push(...children);
      }
    }

    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return blocks;
}

async function main() {
  console.log('Fetching page structure for:', PAGE_ID);
  console.log('---');

  try {
    const blocks = await fetchAllBlocks(PAGE_ID);

    // Save full structure to file
    fs.writeFileSync(
      join(__dirname, '..', 'deal-flow', 'milo', 'page-structure.json'),
      JSON.stringify(blocks, null, 2)
    );

    // Print summary
    console.log('\n=== PAGE STRUCTURE ===\n');

    for (const block of blocks) {
      const indent = '  '.repeat(block.depth);
      let display = `${indent}[${block.type}]`;

      if (block.color && block.color !== 'default') {
        display += ` (${block.color})`;
      }

      if (block.text) {
        const preview = block.text.substring(0, 60);
        display += ` "${preview}${block.text.length > 60 ? '...' : ''}"`;
      }

      if (block.cells) {
        display += ` cells: ${JSON.stringify(block.cells)}`;
      }

      if (block.icon) {
        display += ` icon: ${JSON.stringify(block.icon)}`;
      }

      console.log(display);
    }

    console.log('\n---');
    console.log('Total blocks:', blocks.length);
    console.log('Structure saved to: deal-flow/milo/page-structure.json');

  } catch (error) {
    console.error('Error:', error.message);
    if (error.code) console.error('Code:', error.code);
  }
}

main();
