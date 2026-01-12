/**
 * Detailed Database Inspection
 *
 * Get full details about a database to understand why properties aren't showing up.
 */

import 'dotenv/config';
import { Client } from '@notionhq/client';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DB_ID = process.argv[2] || 'cb35cea1-a2f9-4d0a-bdb2-80f13f64c302';

async function inspectDatabase(notion, dbId) {
  console.log('\n=== Inspecting Database ===');
  console.log('Database ID:', dbId);
  console.log('');

  try {
    const db = await notion.databases.retrieve({ database_id: dbId });

    console.log('Full Response:');
    console.log(JSON.stringify(db, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
    if (error.body) {
      console.error('Body:', JSON.stringify(error.body, null, 2));
    }
  }
}

async function main() {
  if (!NOTION_TOKEN) {
    console.error('ERROR: NOTION_TOKEN not found');
    process.exit(1);
  }

  const notion = new Client({ auth: NOTION_TOKEN });
  await inspectDatabase(notion, DB_ID);
}

main();
