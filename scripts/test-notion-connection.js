/**
 * Test Notion API Connection
 * Verifies that the integration can connect and access the configured page
 */

import 'dotenv/config';
import { Client } from '@notionhq/client';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const PAGE_ID = '2c585dd502d580739744f33cc9bd2859';

async function testConnection() {
  console.log('=== Notion API Connection Test ===\n');

  // Check token exists
  if (!NOTION_TOKEN) {
    console.error('ERROR: NOTION_TOKEN not found in environment variables');
    console.log('Make sure .env file exists with NOTION_TOKEN=your_token');
    process.exit(1);
  }

  console.log('Token found: ' + NOTION_TOKEN.substring(0, 20) + '...');
  console.log('Page ID: ' + PAGE_ID + '\n');

  // Initialize client
  const notion = new Client({ auth: NOTION_TOKEN });

  try {
    // Test 1: Get page information
    console.log('Test 1: Fetching page information...');
    const page = await notion.pages.retrieve({ page_id: PAGE_ID });

    const title = page.properties?.title?.title?.[0]?.plain_text
      || page.properties?.Name?.title?.[0]?.plain_text
      || 'Unknown Title';

    console.log('  SUCCESS: Page retrieved');
    console.log('  - Page ID: ' + page.id);
    console.log('  - Title: ' + title);
    console.log('  - Created: ' + page.created_time);
    console.log('  - Last edited: ' + page.last_edited_time);
    console.log('');

    // Test 2: Get page content (blocks)
    console.log('Test 2: Fetching page content blocks...');
    const blocks = await notion.blocks.children.list({
      block_id: PAGE_ID,
      page_size: 10,
    });

    console.log('  SUCCESS: Blocks retrieved');
    console.log('  - Block count (first page): ' + blocks.results.length);
    console.log('  - Has more: ' + blocks.has_more);

    if (blocks.results.length > 0) {
      console.log('  - First block type: ' + blocks.results[0].type);
    }
    console.log('');

    // Summary
    console.log('=== Connection Test PASSED ===');
    console.log('\nYour Notion integration "claude" is working correctly!');
    console.log('The page "NOTALONE-IL" is accessible and ready for sync.');

    return { success: true, page, blocks };

  } catch (error) {
    console.error('\nERROR: Connection test failed');
    console.error('Status:', error.status);
    console.error('Code:', error.code);
    console.error('Message:', error.message);

    if (error.code === 'unauthorized') {
      console.log('\nPossible fixes:');
      console.log('1. Check that your NOTION_TOKEN is correct');
      console.log('2. Ensure the integration "claude" is still active');
    } else if (error.code === 'object_not_found') {
      console.log('\nPossible fixes:');
      console.log('1. Share the page with your integration:');
      console.log('   - Open the Notion page');
      console.log('   - Click "Share" button');
      console.log('   - Invite "claude" integration');
      console.log('2. Check that the page ID is correct');
    }

    process.exit(1);
  }
}

testConnection();
