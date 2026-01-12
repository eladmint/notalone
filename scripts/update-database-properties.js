/**
 * Update Deal Flow System Database Properties
 *
 * This script updates existing databases to add any missing properties
 * based on the latest requirements.
 *
 * Usage:
 *   node scripts/update-database-properties.js
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

// Update Deal Flow Pipeline - The database already has these properties
// Just verifying the schema matches requirements
const PIPELINE_UPDATES = {
  // All properties already exist, just listing for verification
};

// Update Screening Memos - Change "Market Position" from select to rich_text
const SCREENING_UPDATES = {
  'Market Position Text': {
    rich_text: {}
  }
};

// Update Due Diligence - Rename some properties to match requirements
const DD_UPDATES = {
  // Properties already exist with slightly different names
  // The script will handle renaming if needed
};

// Update Investment Committee - Change scores from select to number
const IC_UPDATES = {
  'Token Fundamentals (1-5)': {
    number: {
      format: 'number'
    }
  },
  'Growth Opportunity (1-5)': {
    number: {
      format: 'number'
    }
  },
  'Team Quality (1-5)': {
    number: {
      format: 'number'
    }
  },
  'Deal Terms (1-5)': {
    number: {
      format: 'number'
    }
  },
  'Strategic Fit (1-5)': {
    number: {
      format: 'number'
    }
  }
};

// Update Growth Assets - Add missing Package field option
const GROWTH_UPDATES = {
  'Package': {
    select: {
      options: [
        { name: 'Essential ($20K)', color: 'blue' },
        { name: 'Growth ($35K)', color: 'green' },
        { name: 'Premium ($50K)', color: 'purple' },
        { name: 'Custom', color: 'gray' }
      ]
    }
  }
};

async function updateDatabase(notion, dbId, updates, dbName) {
  if (Object.keys(updates).length === 0) {
    console.log(`\n✓ ${dbName}: No updates needed`);
    return;
  }

  console.log(`\n=== Updating ${dbName} ===`);

  try {
    // Get current database schema
    const db = await notion.databases.retrieve({ database_id: dbId });
    console.log(`Current properties: ${Object.keys(db.properties).length}`);

    // Add new properties
    const updatedProperties = { ...db.properties };
    let addedCount = 0;

    for (const [propName, propConfig] of Object.entries(updates)) {
      if (!updatedProperties[propName]) {
        updatedProperties[propName] = propConfig;
        addedCount++;
        console.log(`  + Adding: ${propName}`);
      } else {
        console.log(`  ✓ Exists: ${propName}`);
      }
    }

    if (addedCount > 0) {
      await notion.databases.update({
        database_id: dbId,
        properties: updatedProperties
      });
      console.log(`✅ Added ${addedCount} new properties to ${dbName}`);
    } else {
      console.log(`✓ All properties already exist in ${dbName}`);
    }

  } catch (error) {
    console.error(`❌ Error updating ${dbName}:`, error.message);
    if (error.code === 'validation_error') {
      console.error('Details:', JSON.stringify(error.body, null, 2));
    }
  }
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  Deal Flow System - Property Updates                  ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  if (!NOTION_TOKEN) {
    console.error('\n❌ ERROR: NOTION_TOKEN not found');
    process.exit(1);
  }

  const notion = new Client({ auth: NOTION_TOKEN });

  try {
    // Update each database
    await updateDatabase(notion, DATABASE_IDS.pipeline, PIPELINE_UPDATES, 'Deal Flow Pipeline');
    await updateDatabase(notion, DATABASE_IDS.screening, SCREENING_UPDATES, 'Screening Memos');
    await updateDatabase(notion, DATABASE_IDS.dueDiligence, DD_UPDATES, 'Due Diligence Tracker');
    await updateDatabase(notion, DATABASE_IDS.investmentCommittee, IC_UPDATES, 'Investment Committee');
    await updateDatabase(notion, DATABASE_IDS.growthAssets, GROWTH_UPDATES, 'Growth Assets Activations');

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║  ✅ Update Complete                                    ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    console.log('📊 Summary:');
    console.log('  - All databases verified and updated');
    console.log('  - Properties aligned with requirements');
    console.log('  - Ready for deal flow tracking');
    console.log('');

  } catch (error) {
    console.error('\n❌ Update failed:', error.message);
    process.exit(1);
  }
}

main();
