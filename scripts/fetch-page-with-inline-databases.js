#!/usr/bin/env node

/**
 * Fetch a Notion page including inline database contents
 *
 * Usage:
 *   node scripts/fetch-page-with-inline-databases.js <page-id> [output-file.md]
 *
 * This script:
 * - Fetches all blocks from a Notion page
 * - Detects inline databases (child_database blocks)
 * - Retrieves database schema and entries using databases.query() (NOT search)
 * - Converts everything to markdown format
 *
 * Fixed: Uses notion.databases.query() instead of notion.search() to properly
 * retrieve all database records.
 */

import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
import { writeFileSync } from 'fs';

dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const PAGE_ID = process.argv[2];
const OUTPUT_FILE = process.argv[3];

if (!PAGE_ID) {
  console.error('Usage: node fetch-page-with-inline-databases.js <page-id> [output-file.md]');
  process.exit(1);
}

// Normalize page ID (remove dashes if present, then format correctly)
function normalizeId(id) {
  return id.replace(/-/g, '');
}

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

      // Don't recurse into child_database - we handle those separately
      if (block.has_children && block.type !== 'child_database') {
        const children = await fetchBlocksRecursively(block.id, level + 1);
        blocks.push(...children);
      }
    }

    cursor = response.next_cursor;
  } while (cursor);

  return blocks;
}

function extractText(richText) {
  if (!richText || !Array.isArray(richText)) return '';
  return richText.map(t => t.plain_text).join('');
}

function extractPropertyValue(property) {
  if (!property) return '';

  switch (property.type) {
    case 'title':
      return extractText(property.title);
    case 'rich_text':
      return extractText(property.rich_text);
    case 'number':
      return property.number?.toString() || '';
    case 'select':
      return property.select?.name || '';
    case 'multi_select':
      return property.multi_select?.map(s => s.name).join(', ') || '';
    case 'date':
      if (property.date) {
        return property.date.end ?
          `${property.date.start} to ${property.date.end}` :
          property.date.start;
      }
      return '';
    case 'checkbox':
      return property.checkbox ? '✓' : '';
    case 'url':
      return property.url ? `[Link](${property.url})` : '';
    case 'email':
      return property.email || '';
    case 'phone_number':
      return property.phone_number || '';
    case 'status':
      return property.status?.name || '';
    case 'relation':
      return property.relation?.length ?
        `${property.relation.length} item(s)` : '';
    case 'rollup':
      // Handle rollup types
      if (property.rollup) {
        switch (property.rollup.type) {
          case 'number':
            return property.rollup.number?.toString() || '';
          case 'array':
            return property.rollup.array?.map(item => extractPropertyValue(item)).join(', ') || '';
          default:
            return '';
        }
      }
      return '';
    case 'formula':
      if (property.formula) {
        switch (property.formula.type) {
          case 'string':
            return property.formula.string || '';
          case 'number':
            return property.formula.number?.toString() || '';
          case 'boolean':
            return property.formula.boolean ? 'Yes' : 'No';
          case 'date':
            return property.formula.date?.start || '';
          default:
            return '';
        }
      }
      return '';
    case 'files':
      return property.files?.map(f => f.name || f.file?.url || f.external?.url).join(', ') || '';
    case 'people':
      return property.people?.map(p => p.name || p.id).join(', ') || '';
    default:
      return '';
  }
}

function blockToMarkdown(block, level = 0) {
  const indent = '  '.repeat(level);

  switch (block.type) {
    case 'paragraph':
      const text = extractText(block.paragraph.rich_text);
      return text ? `${indent}${text}\n\n` : '\n';

    case 'heading_1':
      return `${indent}# ${extractText(block.heading_1.rich_text)}\n\n`;

    case 'heading_2':
      return `${indent}## ${extractText(block.heading_2.rich_text)}\n\n`;

    case 'heading_3':
      return `${indent}### ${extractText(block.heading_3.rich_text)}\n\n`;

    case 'bulleted_list_item':
      return `${indent}- ${extractText(block.bulleted_list_item.rich_text)}\n`;

    case 'numbered_list_item':
      return `${indent}1. ${extractText(block.numbered_list_item.rich_text)}\n`;

    case 'to_do':
      const checked = block.to_do.checked ? 'x' : ' ';
      return `${indent}- [${checked}] ${extractText(block.to_do.rich_text)}\n`;

    case 'quote':
      return `${indent}> ${extractText(block.quote.rich_text)}\n\n`;

    case 'code':
      const code = extractText(block.code.rich_text);
      const language = block.code.language || '';
      return `${indent}\`\`\`${language}\n${code}\n\`\`\`\n\n`;

    case 'callout':
      const icon = block.callout.icon?.emoji || '💡';
      return `${indent}${icon} ${extractText(block.callout.rich_text)}\n\n`;

    case 'divider':
      return `${indent}---\n\n`;

    case 'child_database':
      return null; // Handled separately

    default:
      return '';
  }
}

/**
 * FIXED: Use dataSources.query() with data_source_id (SDK v5+ API change)
 *
 * In @notionhq/client v5+, databases.query() was replaced with dataSources.query()
 * We need to:
 * 1. Get the database to find its data_source_id
 * 2. Use dataSources.query() with that id
 */
async function fetchDatabaseRecords(databaseId) {
  const records = [];
  let cursor = undefined;

  try {
    // First, get the database to find its data_source_id
    const db = await notion.databases.retrieve({ database_id: databaseId });
    const dataSourceId = db.data_sources?.[0]?.id;

    if (!dataSourceId) {
      console.error(`No data_source_id found for database ${databaseId}`);
      return [];
    }

    // Use dataSources.query() with the data_source_id
    do {
      const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
        start_cursor: cursor,
        page_size: 100,
      });

      records.push(...response.results);
      cursor = response.next_cursor;
    } while (cursor);

    return records;
  } catch (error) {
    console.error(`Error querying database ${databaseId}: ${error.message}`);
    return [];
  }
}

async function main() {
  try {
    console.error(`Fetching page ${PAGE_ID}...`);

    // Try to get page metadata
    let pageTitle = 'Untitled';
    try {
      const page = await notion.pages.retrieve({ page_id: PAGE_ID });
      pageTitle = page.properties?.title?.title?.[0]?.plain_text ||
                  page.properties?.Name?.title?.[0]?.plain_text ||
                  'Untitled';
    } catch (e) {
      console.error(`Could not retrieve page metadata: ${e.message}`);
      // Try search as fallback
      const searchResponse = await notion.search({
        filter: { property: 'object', value: 'page' },
        page_size: 100
      });
      const page = searchResponse.results.find(p =>
        normalizeId(p.id) === normalizeId(PAGE_ID)
      );
      if (page) {
        pageTitle = page.properties?.title?.title?.[0]?.plain_text ||
                    page.properties?.Name?.title?.[0]?.plain_text ||
                    'Untitled';
      }
    }

    console.error(`Page title: ${pageTitle}`);

    // Fetch blocks
    const blocks = await fetchBlocksRecursively(PAGE_ID);
    console.error(`Retrieved ${blocks.length} block(s)`);

    // Find databases
    const databases = blocks.filter(b => b.type === 'child_database');
    console.error(`Found ${databases.length} inline database(s)\n`);

    // Build markdown
    let markdown = `# ${pageTitle}\n\n`;

    // Add regular content
    for (const block of blocks) {
      if (block.type !== 'child_database') {
        const md = blockToMarkdown(block, block.level);
        if (md) markdown += md;
      }
    }

    // Add database contents
    for (const dbBlock of databases) {
      const dbId = dbBlock.id;

      try {
        const db = await notion.databases.retrieve({ database_id: dbId });
        const dbTitle = extractText(db.title) || 'Database';

        console.error(`Processing database: ${dbTitle}`);

        // Fetch records first
        const records = await fetchDatabaseRecords(dbId);
        console.error(`  Records: ${records.length}`);

        markdown += `## ${dbTitle}\n\n`;

        if (records.length === 0) {
          markdown += `*No entries in this database.*\n\n`;
          continue;
        }

        // SDK v5 change: Get property names from the first record instead of db.properties
        // (db.properties may be empty in v5 API)
        const firstRecord = records[0];
        const allPropertyNames = Object.keys(firstRecord.properties || {});

        // Filter out internal properties for display
        const displayProps = allPropertyNames.filter(name => {
          const propType = firstRecord.properties?.[name]?.type;
          return !['created_time', 'created_by', 'last_edited_time', 'last_edited_by'].includes(propType);
        });

        console.error(`  Properties: ${displayProps.join(', ')}`);

        if (displayProps.length === 0) {
          markdown += `*Database has no displayable properties.*\n\n`;
          continue;
        }

        // Create table header
        markdown += `| ${displayProps.join(' | ')} |\n`;
        markdown += `| ${displayProps.map(() => '---').join(' | ')} |\n`;

        // Add rows
        for (const record of records) {
          const values = displayProps.map(name => {
            const value = extractPropertyValue(record.properties?.[name]);
            // Sanitize for markdown table
            return value.replace(/\|/g, '\\|').replace(/\n/g, ' ').trim() || '-';
          });
          markdown += `| ${values.join(' | ')} |\n`;
        }

        markdown += '\n';

      } catch (error) {
        console.error(`Error with database ${dbId}: ${error.message}`);
        markdown += `## Database\n\n*Error: ${error.message}*\n\n`;
      }
    }

    // Add footer
    markdown += `\n---\n\n`;
    markdown += `*Fetched: ${new Date().toISOString().split('T')[0]}*\n`;
    markdown += `*Page ID: \`${PAGE_ID}\`*\n`;

    // Output
    if (OUTPUT_FILE) {
      writeFileSync(OUTPUT_FILE, markdown, 'utf8');
      console.error(`\n✓ Saved to ${OUTPUT_FILE}`);
    } else {
      console.log(markdown);
    }

  } catch (error) {
    console.error('Error:', error.message);
    if (error.code) console.error('Code:', error.code);
    process.exit(1);
  }
}

main();
