/**
 * Verify Deal Flow System Database Properties
 *
 * This script checks what properties exist in each database
 * to identify what's missing.
 *
 * Usage:
 *   node scripts/verify-database-properties.js
 */

import 'dotenv/config';
import { Client } from '@notionhq/client';

const NOTION_TOKEN = process.env.NOTION_TOKEN;

// Database IDs from creation
const DATABASE_IDS = {
  pipeline: '9c6652d9-860d-48fa-9f8c-aed4300141f7',
  screening: 'cba20df1-69e3-4bc5-ba61-7ae7565677bd',
  dueDiligence: 'f5f39f36-a4d3-48cf-bb5f-24ce6f86c089',
  investmentCommittee: 'b88ab785-0341-474f-aaca-a2038df216c7',
  growthAssets: 'd28728e1-f4fa-4cf8-a701-dcd4ce3b90cf'
};

async function verifyDatabase(notion, dbId, dbName) {
  console.log(`\n=== ${dbName} ===`);
  console.log(`Database ID: ${dbId}`);

  try {
    const db = await notion.databases.retrieve({ database_id: dbId });

    if (!db.properties || Object.keys(db.properties).length === 0) {
      console.log('⚠️  NO PROPERTIES FOUND - Database is empty!');
      console.log('Full response:', JSON.stringify(db, null, 2));
      return;
    }

    console.log(`Properties found: ${Object.keys(db.properties).length}`);
    console.log('');

    for (const [propName, propConfig] of Object.entries(db.properties)) {
      const type = propConfig.type;
      console.log(`  ✓ ${propName} (${type})`);
    }

  } catch (error) {
    console.error(`❌ Error retrieving ${dbName}:`);
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Status:', error.status);
    if (error.body) {
      console.error('Body:', JSON.stringify(error.body, null, 2));
    }
  }
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  Deal Flow System - Property Verification             ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  if (!NOTION_TOKEN) {
    console.error('\n❌ ERROR: NOTION_TOKEN not found');
    process.exit(1);
  }

  const notion = new Client({ auth: NOTION_TOKEN });

  try {
    await verifyDatabase(notion, DATABASE_IDS.pipeline, 'Deal Flow Pipeline');
    await verifyDatabase(notion, DATABASE_IDS.screening, 'Screening Memos');
    await verifyDatabase(notion, DATABASE_IDS.dueDiligence, 'Due Diligence Tracker');
    await verifyDatabase(notion, DATABASE_IDS.investmentCommittee, 'Investment Committee');
    await verifyDatabase(notion, DATABASE_IDS.growthAssets, 'Growth Assets Activations');

    console.log('\n');

  } catch (error) {
    console.error('\n❌ Verification failed:', error.message);
    process.exit(1);
  }
}

main();
