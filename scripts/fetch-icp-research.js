#!/usr/bin/env node

/**
 * Fetch ICP Hubs Network Research page with database contents
 */

import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const PAGE_ID = '2bb60b6e-8d18-80fa-be41-ce8bf0683588';

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

      if (block.has_children) {
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
      return property.checkbox ? 'Yes' : 'No';
    case 'url':
      return property.url || '';
    case 'email':
      return property.email || '';
    case 'phone_number':
      return property.phone_number || '';
    case 'status':
      return property.status?.name || '';
    case 'relation':
      return property.relation?.length ?
        `${property.relation.length} related item(s)` : '';
    case 'files':
      return property.files?.map(f => f.name).join(', ') || '';
    default:
      return '';
  }
}

async function fetchDatabasePages(databaseId, limit = 100) {
  try {
    // Use search to find pages in this database
    const response = await notion.search({
      filter: {
        property: 'object',
        value: 'page'
      },
      page_size: limit
    });

    // Filter pages that belong to this database (parent.database_id matches)
    const dbPages = response.results.filter(page =>
      page.parent?.type === 'database_id' &&
      page.parent?.database_id === databaseId
    );

    return dbPages;
  } catch (error) {
    console.error(`Error fetching database pages ${databaseId}:`, error.message);
    return [];
  }
}

async function main() {
  try {
    console.error('Fetching page content...\n');

    // Fetch the main page content
    const blocks = await fetchBlocksRecursively(PAGE_ID);
    console.error(`Retrieved ${blocks.length} blocks\n`);

    // Find child databases
    const databases = blocks.filter(b => b.type === 'child_database');
    console.error(`Found ${databases.length} database view(s)\n`);

    let markdown = `# ICP Hubs Network Research\n\n`;
    markdown += `*Research on ICP Hubs Network ecosystem*\n\n`;

    // Process each database
    for (const dbBlock of databases) {
      const dbId = dbBlock.id;

      try {
        // Get database metadata
        const db = await notion.databases.retrieve({ database_id: dbId });
        const dbTitle = extractText(db.title) || 'Database';

        console.error(`Processing database: ${dbTitle}`);

        // Get pages in this database
        const pages = await fetchDatabasePages(dbId);
        console.error(`  Found ${pages.length} entries\n`);

        if (pages.length === 0) {
          markdown += `## ${dbTitle}\n\n`;
          markdown += `*No entries found or database is empty*\n\n`;
          continue;
        }

        markdown += `## ${dbTitle}\n\n`;

        // Get property names from database schema
        const schema = db.properties || {};
        const propertyNames = Object.keys(schema).filter(name => {
          // Skip some internal/computed properties
          const prop = schema[name];
          return !['created_time', 'created_by', 'last_edited_time', 'last_edited_by'].includes(prop.type);
        });

        // Create table header
        markdown += `| ${propertyNames.join(' | ')} |\n`;
        markdown += `| ${propertyNames.map(() => '---').join(' | ')} |\n`;

        // Add rows
        for (const page of pages) {
          const values = propertyNames.map(name => {
            const value = extractPropertyValue(page.properties?.[name] || {});
            // Sanitize for markdown table
            return value.replace(/\|/g, '\\|').replace(/\n/g, ' ').trim() || '-';
          });
          markdown += `| ${values.join(' | ')} |\n`;
        }

        markdown += '\n';

      } catch (error) {
        console.error(`Error processing database ${dbId}:`, error.message);
        markdown += `## Database View\n\n`;
        markdown += `*Error loading database: ${error.message}*\n\n`;
      }
    }

    // Add metadata
    markdown += `\n---\n\n`;
    markdown += `*Fetched from Notion: ${new Date().toISOString()}*\n`;
    markdown += `*Page ID: ${PAGE_ID}*\n`;

    console.log(markdown);

  } catch (error) {
    console.error('Fatal error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
