/**
 * Verify New Deal Flow System Databases
 *
 * Verifies that all new databases have their properties correctly set up.
 *
 * Usage:
 *   node scripts/verify-new-databases.js
 */

import 'dotenv/config';
import { Client } from '@notionhq/client';

const NOTION_TOKEN = process.env.NOTION_TOKEN;

// New database IDs from recreation
const DATABASE_IDS = {
  pipeline: 'cb35cea1-a2f9-4d0a-bdb2-80f13f64c302',
  screening: '90744c07-1dd0-47f3-a7cd-104fdb529056',
  dueDiligence: 'f2d76a71-ebf2-4d38-9d42-ad4c96319e80',
  investmentCommittee: 'a9e505f6-c2db-4345-801c-417a94bb3610',
  growthAssets: '98fab9d4-6921-4333-bbc8-74b504775995'
};

const EXPECTED_COUNTS = {
  pipeline: 14,
  screening: 11,
  dueDiligence: 19,
  investmentCommittee: 11,
  growthAssets: 11
};

async function verifyDatabase(notion, dbId, dbName, expectedCount) {
  console.log(`\n=== ${dbName} ===`);
  console.log(`Database ID: ${dbId}`);

  try {
    const db = await notion.databases.retrieve({ database_id: dbId });

    if (!db.properties || Object.keys(db.properties).length === 0) {
      console.log('❌ NO PROPERTIES FOUND - Database is empty!');
      return false;
    }

    const actualCount = Object.keys(db.properties).length;
    console.log(`Properties: ${actualCount} (expected ${expectedCount})`);

    if (actualCount === expectedCount) {
      console.log('✅ Property count matches!');
    } else {
      console.log('⚠️  Property count mismatch!');
    }

    console.log('\nProperties:');
    for (const [propName, propConfig] of Object.entries(db.properties)) {
      const type = propConfig.type;
      console.log(`  ✓ ${propName} (${type})`);
    }

    return actualCount === expectedCount;

  } catch (error) {
    console.error(`❌ Error retrieving ${dbName}:`);
    console.error('Message:', error.message);
    return false;
  }
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  Verify New Deal Flow System Databases                ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  if (!NOTION_TOKEN) {
    console.error('\n❌ ERROR: NOTION_TOKEN not found');
    process.exit(1);
  }

  const notion = new Client({ auth: NOTION_TOKEN });

  try {
    const results = [];

    results.push(await verifyDatabase(notion, DATABASE_IDS.pipeline, 'Deal Flow Pipeline', EXPECTED_COUNTS.pipeline));
    results.push(await verifyDatabase(notion, DATABASE_IDS.screening, 'Screening Memos', EXPECTED_COUNTS.screening));
    results.push(await verifyDatabase(notion, DATABASE_IDS.dueDiligence, 'Due Diligence Tracker', EXPECTED_COUNTS.dueDiligence));
    results.push(await verifyDatabase(notion, DATABASE_IDS.investmentCommittee, 'Investment Committee', EXPECTED_COUNTS.investmentCommittee));
    results.push(await verifyDatabase(notion, DATABASE_IDS.growthAssets, 'Growth Assets Activations', EXPECTED_COUNTS.growthAssets));

    const allPassed = results.every(r => r === true);

    console.log('\n╔════════════════════════════════════════════════════════╗');
    if (allPassed) {
      console.log('║  ✅ All Databases Verified Successfully!               ║');
      console.log('╚════════════════════════════════════════════════════════╝\n');
      console.log('🎯 System is ready to use!');
      console.log('   Open in Notion: https://www.notion.so/2d960b6e8d1881c2b139e9a8d37d70b9');
    } else {
      console.log('║  ⚠️  Some Databases Have Issues                       ║');
      console.log('╚════════════════════════════════════════════════════════╝\n');
      console.log('Please review the errors above.');
    }
    console.log('');

  } catch (error) {
    console.error('\n❌ Verification failed:', error.message);
    process.exit(1);
  }
}

main();
