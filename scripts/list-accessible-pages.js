#!/usr/bin/env node

/**
 * List all pages accessible to the Notion integration
 */

import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

async function listAccessiblePages() {
  console.log('=== Listing Accessible Notion Pages ===\n');

  try {
    // Search for all pages the integration can access
    console.log('Searching for pages...\n');

    const response = await notion.search({
      filter: {
        property: 'object',
        value: 'page'
      },
      sort: {
        direction: 'descending',
        timestamp: 'last_edited_time'
      },
      page_size: 100
    });

    if (response.results.length === 0) {
      console.log('No pages found. The integration may not have access to any pages.');
      console.log('\nTo grant access:');
      console.log('1. Open a Notion page');
      console.log('2. Click "Share" or "..." menu');
      console.log('3. Search for and add the "Claude Code" integration');
      return;
    }

    console.log(`Found ${response.results.length} accessible page(s):\n`);

    for (const page of response.results) {
      const title = page.properties?.title?.title?.[0]?.plain_text ||
                   page.properties?.Name?.title?.[0]?.plain_text ||
                   '(Untitled)';

      console.log(`Title: ${title}`);
      console.log(`ID: ${page.id}`);
      console.log(`URL: https://notion.so/${page.id.replace(/-/g, '')}`);
      console.log(`Last edited: ${page.last_edited_time}`);
      console.log('---\n');
    }

    // Also search for databases
    console.log('\n=== Listing Accessible Databases ===\n');

    const dbResponse = await notion.search({
      filter: {
        property: 'object',
        value: 'database'
      },
      sort: {
        direction: 'descending',
        timestamp: 'last_edited_time'
      },
      page_size: 100
    });

    if (dbResponse.results.length === 0) {
      console.log('No databases found.');
    } else {
      console.log(`Found ${dbResponse.results.length} accessible database(s):\n`);

      for (const db of dbResponse.results) {
        const title = db.title?.[0]?.plain_text || '(Untitled)';

        console.log(`Title: ${title}`);
        console.log(`ID: ${db.id}`);
        console.log(`URL: https://notion.so/${db.id.replace(/-/g, '')}`);
        console.log(`Last edited: ${db.last_edited_time}`);
        console.log('---\n');
      }
    }

  } catch (error) {
    console.error('Error listing pages:', error.message);
    if (error.code === 'unauthorized') {
      console.error('\nThe API token appears to be invalid or expired.');
      console.error('Check your NOTION_TOKEN in .env file.');
    }
  }
}

listAccessiblePages();
