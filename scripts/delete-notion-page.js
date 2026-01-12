/**
 * Delete a Notion Page (archive it)
 * Usage: node scripts/delete-notion-page.js <page-id>
 */

import 'dotenv/config';
import { Client } from '@notionhq/client';

const NOTION_TOKEN = process.env.NOTION_TOKEN;

// Page to delete - the incorrectly duplicated one
const PAGE_TO_DELETE = process.argv[2] || '2c585dd502d5816a8ce3f8e7b220728c';

const notion = new Client({ auth: NOTION_TOKEN });

async function main() {
  console.log('=== Delete Notion Page ===\n');

  if (!NOTION_TOKEN) {
    console.error('ERROR: NOTION_TOKEN not found');
    process.exit(1);
  }

  console.log(`Page ID to delete: ${PAGE_TO_DELETE}`);

  try {
    // First, get page info to confirm
    const page = await notion.pages.retrieve({ page_id: PAGE_TO_DELETE });

    // Get title
    const titleProp = page.properties?.Name?.title ||
                      page.properties?.title?.title ||
                      Object.values(page.properties).find(p => p.type === 'title')?.title;
    const title = titleProp?.[0]?.plain_text || 'Untitled';

    console.log(`Page title: "${title}"`);
    console.log(`Created: ${page.created_time}`);
    console.log(`Already archived: ${page.archived}`);

    if (page.archived) {
      console.log('\nPage is already archived (deleted).');
      return;
    }

    // Archive (delete) the page
    console.log('\nArchiving page...');
    await notion.pages.update({
      page_id: PAGE_TO_DELETE,
      archived: true
    });

    console.log('\nPage successfully archived (deleted)!');

  } catch (error) {
    console.error('\nERROR:', error.message);
    if (error.code === 'object_not_found') {
      console.log('The page was not found. It may already be deleted or not shared with the integration.');
    }
    process.exit(1);
  }
}

main();
