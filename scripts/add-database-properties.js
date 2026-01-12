/**
 * Add Properties to Deal Flow System Databases
 *
 * This script adds all required properties to the existing databases.
 * The databases were created but are missing their property schemas.
 *
 * Usage:
 *   node scripts/add-database-properties.js
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

// === 1. Deal Flow Pipeline Properties ===
const PIPELINE_PROPERTIES = {
  'Deal Name': {
    title: {}
  },
  'Source': {
    select: {
      options: [
        { name: 'Services Pipeline', color: 'green' },
        { name: 'ICP Hubs Network', color: 'blue' },
        { name: 'Conference', color: 'purple' },
        { name: 'LP Referral', color: 'pink' },
        { name: 'VC Network', color: 'orange' },
        { name: 'Inbound', color: 'gray' }
      ]
    }
  },
  'Stage': {
    select: {
      options: [
        { name: '1-Sourcing', color: 'gray' },
        { name: '2-Screening', color: 'yellow' },
        { name: '3-Due Diligence', color: 'blue' },
        { name: '4-Investment Committee', color: 'purple' },
        { name: '5-Structuring', color: 'orange' },
        { name: '6-Onboarding', color: 'pink' },
        { name: '7-Active', color: 'green' },
        { name: '8-Exit', color: 'brown' }
      ]
    }
  },
  'Classification': {
    select: {
      options: [
        { name: 'OTC + Growth Assets', color: 'green' },
        { name: 'OTC Only', color: 'blue' },
        { name: 'Services First', color: 'purple' },
        { name: 'Pass', color: 'red' }
      ]
    }
  },
  'Token Status': {
    select: {
      options: [
        { name: 'Post-TGE', color: 'green' },
        { name: 'Pre-TGE', color: 'orange' }
      ]
    }
  },
  'Market Cap': {
    number: {
      format: 'dollar'
    }
  },
  'Daily Volume': {
    number: {
      format: 'dollar'
    }
  },
  'Investment Size': {
    number: {
      format: 'dollar'
    }
  },
  'Discount %': {
    number: {
      format: 'percent'
    }
  },
  'Deal Lead': {
    rich_text: {}
  },
  'First Contact': {
    date: {}
  },
  'Last Updated': {
    last_edited_time: {}
  },
  'Status': {
    select: {
      options: [
        { name: 'Active', color: 'green' },
        { name: 'On Hold', color: 'yellow' },
        { name: 'Closed Won', color: 'blue' },
        { name: 'Closed Lost', color: 'red' }
      ]
    }
  },
  'Notes': {
    rich_text: {}
  }
};

// === 2. Screening Memos Properties ===
const SCREENING_PROPERTIES = {
  'Memo Title': {
    title: {}
  },
  'Deal': {
    relation: {
      database_id: DATABASE_IDS.pipeline,
      type: 'dual_property',
      dual_property: {}
    }
  },
  'Screening Date': {
    date: {}
  },
  'Growth Need': {
    rich_text: {}
  },
  'Team Fit': {
    checkbox: {}
  },
  'Token Health': {
    checkbox: {}
  },
  'Market Position': {
    rich_text: {}
  },
  'Cap Table Clean': {
    checkbox: {}
  },
  'Classification': {
    select: {
      options: [
        { name: 'OTC + Growth Assets', color: 'green' },
        { name: 'OTC Only', color: 'blue' },
        { name: 'Services First', color: 'purple' },
        { name: 'Pass', color: 'red' }
      ]
    }
  },
  'Recommendation': {
    select: {
      options: [
        { name: 'Proceed to DD', color: 'green' },
        { name: 'More Info Needed', color: 'yellow' },
        { name: 'Pass', color: 'red' }
      ]
    }
  },
  'Next Steps': {
    rich_text: {}
  }
};

// === 3. Due Diligence Tracker Properties ===
const DD_PROPERTIES = {
  'DD Title': {
    title: {}
  },
  'Deal': {
    relation: {
      database_id: DATABASE_IDS.pipeline,
      type: 'dual_property',
      dual_property: {}
    }
  },
  'Token Economics Done': {
    checkbox: {}
  },
  'Token Economics Notes': {
    rich_text: {}
  },
  'On-Chain Metrics Done': {
    checkbox: {}
  },
  'On-Chain Notes': {
    rich_text: {}
  },
  'Competitive Position Done': {
    checkbox: {}
  },
  'Competitive Notes': {
    rich_text: {}
  },
  'Team Background Done': {
    checkbox: {}
  },
  'Team Notes': {
    rich_text: {}
  },
  'Cap Table Done': {
    checkbox: {}
  },
  'Cap Table Notes': {
    rich_text: {}
  },
  'Legal Status Done': {
    checkbox: {}
  },
  'Legal Notes': {
    rich_text: {}
  },
  'Growth Gaps': {
    rich_text: {}
  },
  'Audience Alignment': {
    multi_select: {
      options: [
        { name: 'Builders', color: 'blue' },
        { name: 'Investors', color: 'green' },
        { name: 'Strategic Partners', color: 'purple' }
      ]
    }
  },
  'Geographic Fit': {
    multi_select: {
      options: [
        { name: 'APAC', color: 'orange' },
        { name: 'Europe', color: 'green' },
        { name: 'US', color: 'blue' },
        { name: 'MENA', color: 'pink' },
        { name: 'LATAM', color: 'purple' }
      ]
    }
  },
  'DD Complete Date': {
    date: {}
  },
  'Recommendation': {
    select: {
      options: [
        { name: 'Proceed to IC', color: 'green' },
        { name: 'More DD Needed', color: 'yellow' },
        { name: 'Pass', color: 'red' }
      ]
    }
  }
};

// === 4. Investment Committee Properties ===
const IC_PROPERTIES = {
  'IC Record': {
    title: {}
  },
  'Deal': {
    relation: {
      database_id: DATABASE_IDS.pipeline,
      type: 'dual_property',
      dual_property: {}
    }
  },
  'IC Date': {
    date: {}
  },
  'Token Fundamentals': {
    number: {
      format: 'number'
    }
  },
  'Growth Opportunity': {
    number: {
      format: 'number'
    }
  },
  'Team Quality': {
    number: {
      format: 'number'
    }
  },
  'Deal Terms': {
    number: {
      format: 'number'
    }
  },
  'Strategic Fit': {
    number: {
      format: 'number'
    }
  },
  'Decision': {
    select: {
      options: [
        { name: 'Approve', color: 'green' },
        { name: 'Approve with Conditions', color: 'yellow' },
        { name: 'Request More DD', color: 'orange' },
        { name: 'Decline', color: 'red' }
      ]
    }
  },
  'Conditions': {
    rich_text: {}
  },
  'Terms Approved': {
    rich_text: {}
  }
};

// === 5. Growth Assets Activations Properties ===
const GROWTH_PROPERTIES = {
  'Activation Name': {
    title: {}
  },
  'Deal': {
    relation: {
      database_id: DATABASE_IDS.pipeline,
      type: 'dual_property',
      dual_property: {}
    }
  },
  'Conference/Event': {
    rich_text: {}
  },
  'Event Date': {
    date: {}
  },
  'Activation Type': {
    select: {
      options: [
        { name: 'House Event', color: 'green' },
        { name: 'Speaking Slot', color: 'blue' },
        { name: 'Panel', color: 'purple' },
        { name: 'Demo Station', color: 'orange' },
        { name: 'Hackathon Challenge', color: 'pink' }
      ]
    }
  },
  'Package': {
    select: {
      options: [
        { name: 'Essential ($20K)', color: 'blue' },
        { name: 'Growth ($35K)', color: 'green' },
        { name: 'Premium ($50K)', color: 'purple' },
        { name: 'Custom', color: 'gray' }
      ]
    }
  },
  'Token Value Released': {
    number: {
      format: 'dollar'
    }
  },
  'Leads Generated': {
    number: {
      format: 'number'
    }
  },
  'Partnerships Initiated': {
    number: {
      format: 'number'
    }
  },
  'Debrief Notes': {
    rich_text: {}
  },
  'Status': {
    select: {
      options: [
        { name: 'Planned', color: 'gray' },
        { name: 'Confirmed', color: 'yellow' },
        { name: 'Completed', color: 'green' },
        { name: 'Cancelled', color: 'red' }
      ]
    }
  }
};

async function addProperties(notion, dbId, properties, dbName) {
  console.log(`\n=== Adding Properties to ${dbName} ===`);
  console.log(`Database ID: ${dbId}`);
  console.log(`Properties to add: ${Object.keys(properties).length}`);

  try {
    await notion.databases.update({
      database_id: dbId,
      properties: properties
    });

    console.log(`✅ Successfully added ${Object.keys(properties).length} properties to ${dbName}`);

    // List added properties
    for (const propName of Object.keys(properties)) {
      console.log(`  ✓ ${propName}`);
    }

  } catch (error) {
    console.error(`❌ Error adding properties to ${dbName}:`);
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Status:', error.status);
    if (error.body) {
      console.error('Body:', JSON.stringify(error.body, null, 2));
    }
    throw error;
  }
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  Add Properties to Deal Flow System Databases         ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  if (!NOTION_TOKEN) {
    console.error('\n❌ ERROR: NOTION_TOKEN not found');
    process.exit(1);
  }

  const notion = new Client({ auth: NOTION_TOKEN });

  try {
    // Add properties to each database
    await addProperties(notion, DATABASE_IDS.pipeline, PIPELINE_PROPERTIES, 'Deal Flow Pipeline');
    await addProperties(notion, DATABASE_IDS.screening, SCREENING_PROPERTIES, 'Screening Memos');
    await addProperties(notion, DATABASE_IDS.dueDiligence, DD_PROPERTIES, 'Due Diligence Tracker');
    await addProperties(notion, DATABASE_IDS.investmentCommittee, IC_PROPERTIES, 'Investment Committee');
    await addProperties(notion, DATABASE_IDS.growthAssets, GROWTH_PROPERTIES, 'Growth Assets Activations');

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║  ✅ All Properties Added Successfully!                 ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    console.log('📊 Summary:');
    console.log(`  - Deal Flow Pipeline: ${Object.keys(PIPELINE_PROPERTIES).length} properties`);
    console.log(`  - Screening Memos: ${Object.keys(SCREENING_PROPERTIES).length} properties`);
    console.log(`  - Due Diligence Tracker: ${Object.keys(DD_PROPERTIES).length} properties`);
    console.log(`  - Investment Committee: ${Object.keys(IC_PROPERTIES).length} properties`);
    console.log(`  - Growth Assets Activations: ${Object.keys(GROWTH_PROPERTIES).length} properties`);
    console.log('');
    console.log('🎯 Next Steps:');
    console.log('  1. Open databases in Notion to verify properties');
    console.log('  2. Add process overview to main page');
    console.log('  3. Start tracking deals!');
    console.log('');

  } catch (error) {
    console.error('\n❌ Failed to add properties');
    process.exit(1);
  }
}

main();
