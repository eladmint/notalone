#!/usr/bin/env node

/**
 * Fetch a Notion page via search first, then retrieve its blocks
 */

import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const targetPageId = process.argv[2] || '2bb60b6e-8d18-80fa-be41-ce8bf0683588';

async function fetchBlocksRecursively(blockId, level = 0) {
  const blocks = [];
  let cursor = undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    });

    for (const block of response.results) {
      blocks.push({ ...block, level });

      // Recursively fetch children if has_children is true
      if (block.has_children) {
        const children = await fetchBlocksRecursively(block.id, level + 1);
        blocks.push(...children);
      }
    }

    cursor = response.next_cursor;
  } while (cursor);

  return blocks;
}

function blockToMarkdown(block, level = 0) {
  const indent = '  '.repeat(level);

  try {
    switch (block.type) {
      case 'paragraph': {
        const text = block.paragraph.rich_text.map(t => t.plain_text).join('');
        return text ? `${indent}${text}\n\n` : '\n';
      }

      case 'heading_1': {
        const text = block.heading_1.rich_text.map(t => t.plain_text).join('');
        return `${indent}# ${text}\n\n`;
      }

      case 'heading_2': {
        const text = block.heading_2.rich_text.map(t => t.plain_text).join('');
        return `${indent}## ${text}\n\n`;
      }

      case 'heading_3': {
        const text = block.heading_3.rich_text.map(t => t.plain_text).join('');
        return `${indent}### ${text}\n\n`;
      }

      case 'bulleted_list_item': {
        const text = block.bulleted_list_item.rich_text.map(t => t.plain_text).join('');
        return `${indent}- ${text}\n`;
      }

      case 'numbered_list_item': {
        const text = block.numbered_list_item.rich_text.map(t => t.plain_text).join('');
        return `${indent}1. ${text}\n`;
      }

      case 'to_do': {
        const text = block.to_do.rich_text.map(t => t.plain_text).join('');
        const checked = block.to_do.checked ? 'x' : ' ';
        return `${indent}- [${checked}] ${text}\n`;
      }

      case 'toggle': {
        const text = block.toggle.rich_text.map(t => t.plain_text).join('');
        return `${indent}<details>\n${indent}<summary>${text}</summary>\n\n`;
      }

      case 'code': {
        const text = block.code.rich_text.map(t => t.plain_text).join('');
        const language = block.code.language || '';
        return `${indent}\`\`\`${language}\n${text}\n\`\`\`\n\n`;
      }

      case 'quote': {
        const text = block.quote.rich_text.map(t => t.plain_text).join('');
        return `${indent}> ${text}\n\n`;
      }

      case 'callout': {
        const text = block.callout.rich_text.map(t => t.plain_text).join('');
        const icon = block.callout.icon?.emoji || '💡';
        return `${indent}${icon} ${text}\n\n`;
      }

      case 'divider':
        return `${indent}---\n\n`;

      case 'table_of_contents':
        return `${indent}[Table of Contents]\n\n`;

      default:
        return `${indent}[${block.type}]\n\n`;
    }
  } catch (error) {
    console.error(`Error processing block ${block.id}:`, error.message);
    return `${indent}[Error processing ${block.type}]\n\n`;
  }
}

async function main() {
  try {
    console.error('Searching for page...');

    // First, search for the page to confirm access
    const searchResponse = await notion.search({
      filter: {
        property: 'object',
        value: 'page'
      },
      page_size: 100
    });

    const page = searchResponse.results.find(p => p.id === targetPageId);

    if (!page) {
      console.error('Page not found in search results');
      process.exit(1);
    }

    const title = page.properties?.title?.title?.[0]?.plain_text ||
                 page.properties?.Name?.title?.[0]?.plain_text ||
                 '(Untitled)';

    console.error(`Found page: ${title}`);
    console.error('Fetching blocks...');

    // Try to fetch blocks directly
    const blocks = await fetchBlocksRecursively(targetPageId);

    console.error(`Retrieved ${blocks.length} blocks`);

    // Convert to markdown
    let markdown = `# ${title}\n\n`;

    for (const block of blocks) {
      markdown += blockToMarkdown(block, block.level);
    }

    // Output to stdout
    console.log(markdown);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
