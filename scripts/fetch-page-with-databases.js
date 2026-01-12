#!/usr/bin/env node

/**
 * Fetch a Notion page including database information
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

async function fetchDatabaseInfo(databaseId) {
  try {
    // First get the database metadata
    const db = await notion.databases.retrieve({ database_id: databaseId });

    // Then query for entries
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 100,
    });

    return { database: db, entries: response.results };
  } catch (error) {
    console.error(`Error fetching database ${databaseId}:`, error.message);
    return { database: null, entries: [] };
  }
}

function extractTextFromRichText(richText) {
  if (!richText || !Array.isArray(richText)) return '';
  return richText.map(t => t.plain_text).join('');
}

function extractPropertyValue(property) {
  if (!property) return '';

  switch (property.type) {
    case 'title':
      return extractTextFromRichText(property.title);
    case 'rich_text':
      return extractTextFromRichText(property.rich_text);
    case 'number':
      return property.number?.toString() || '';
    case 'select':
      return property.select?.name || '';
    case 'multi_select':
      return property.multi_select?.map(s => s.name).join(', ') || '';
    case 'date':
      return property.date?.start || '';
    case 'checkbox':
      return property.checkbox ? 'Yes' : 'No';
    case 'url':
      return property.url || '';
    case 'email':
      return property.email || '';
    case 'phone_number':
      return property.phone_number || '';
    case 'status':
      return property.status?.name || '';
    default:
      return `[${property.type}]`;
  }
}

function blockToMarkdown(block, level = 0) {
  const indent = '  '.repeat(level);

  try {
    switch (block.type) {
      case 'paragraph': {
        const text = extractTextFromRichText(block.paragraph.rich_text);
        return text ? `${indent}${text}\n\n` : '\n';
      }

      case 'heading_1': {
        const text = extractTextFromRichText(block.heading_1.rich_text);
        return `${indent}# ${text}\n\n`;
      }

      case 'heading_2': {
        const text = extractTextFromRichText(block.heading_2.rich_text);
        return `${indent}## ${text}\n\n`;
      }

      case 'heading_3': {
        const text = extractTextFromRichText(block.heading_3.rich_text);
        return `${indent}### ${text}\n\n`;
      }

      case 'bulleted_list_item': {
        const text = extractTextFromRichText(block.bulleted_list_item.rich_text);
        return `${indent}- ${text}\n`;
      }

      case 'numbered_list_item': {
        const text = extractTextFromRichText(block.numbered_list_item.rich_text);
        return `${indent}1. ${text}\n`;
      }

      case 'to_do': {
        const text = extractTextFromRichText(block.to_do.rich_text);
        const checked = block.to_do.checked ? 'x' : ' ';
        return `${indent}- [${checked}] ${text}\n`;
      }

      case 'toggle': {
        const text = extractTextFromRichText(block.toggle.rich_text);
        return `${indent}<details>\n${indent}<summary>${text}</summary>\n\n`;
      }

      case 'code': {
        const text = extractTextFromRichText(block.code.rich_text);
        const language = block.code.language || '';
        return `${indent}\`\`\`${language}\n${text}\n\`\`\`\n\n`;
      }

      case 'quote': {
        const text = extractTextFromRichText(block.quote.rich_text);
        return `${indent}> ${text}\n\n`;
      }

      case 'callout': {
        const text = extractTextFromRichText(block.callout.rich_text);
        const icon = block.callout.icon?.emoji || '💡';
        return `${indent}${icon} ${text}\n\n`;
      }

      case 'divider':
        return `${indent}---\n\n`;

      case 'table_of_contents':
        return `${indent}[Table of Contents]\n\n`;

      case 'child_database':
        return null; // Will be handled separately

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

    // Fetch all blocks
    const blocks = await fetchBlocksRecursively(targetPageId);
    console.error(`Retrieved ${blocks.length} blocks`);

    // Find child databases
    const databases = blocks.filter(b => b.type === 'child_database');
    console.error(`Found ${databases.length} database(s)`);

    // Start building markdown
    let markdown = `# ${title}\n\n`;

    // Add regular content first
    for (const block of blocks) {
      const md = blockToMarkdown(block, block.level);
      if (md !== null) {
        markdown += md;
      }
    }

    // Add database contents
    for (const dbBlock of databases) {
      console.error(`Fetching database ${dbBlock.id}...`);

      const { database: db, entries } = await fetchDatabaseInfo(dbBlock.id);
      console.error(`  Retrieved ${entries.length} entries`);

      if (db && entries.length > 0) {
        const dbTitle = extractTextFromRichText(db.title) || 'Database';
        markdown += `\n## ${dbTitle}\n\n`;

        // Get property names from database schema
        const propertyNames = Object.keys(db.properties).filter(name => {
          // Filter out some internal properties if needed
          return true;
        });

        // Create table header
        markdown += `| ${propertyNames.join(' | ')} |\n`;
        markdown += `| ${propertyNames.map(() => '---').join(' | ')} |\n`;

        // Add rows
        for (const entry of entries) {
          const values = propertyNames.map(name => {
            const value = extractPropertyValue(entry.properties[name]);
            return value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
          });
          markdown += `| ${values.join(' | ')} |\n`;
        }

        markdown += '\n';
      } else if (!db) {
        markdown += `\n## Linked Database View\n\n`;
        markdown += `*Database ID: ${dbBlock.id}*\n\n`;
        markdown += `*Note: This is a linked database view. Access the database directly in Notion to view its contents.*\n\n`;
      }
    }

    // Output to stdout
    console.log(markdown);

  } catch (error) {
    console.error('Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
