/**
 * Recreate Deal Flow System Databases with Proper Properties
 *
 * The existing databases appear to be data sources (synced databases)
 * which cannot be modified via API. This script creates new native
 * Notion databases with all required properties.
 *
 * Usage:
 *   node scripts/recreate-deal-flow-databases.js <parent-page-id>
 *
 * Parent page ID is the "NOTALONE Deal Flow System" page ID.
 */

import 'dotenv/config';
import { Client } from '@notionhq/client';

const NOTION_TOKEN = process.env.NOTION_TOKEN;

// Parent page - the Deal Flow System main page
const PARENT_PAGE_ID = process.argv[2] || '2d960b6e-8d18-81c2-b139-e9a8d37d70b9';

async function createDealFlowPipeline(notion, parentPageId) {
  console.log('\n=== Creating Deal Flow Pipeline Database ===');

  const database = await notion.databases.create({
    parent: {
      type: 'page_id',
      page_id: parentPageId
    },
    title: [
      {
        type: 'text',
        text: { content: 'Deal Flow Pipeline' }
      }
    ],
    is_inline: true,
    properties: {
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
    }
  });

  console.log('✅ Deal Flow Pipeline created');
  console.log('Database ID:', database.id);
  if (database.properties) {
    console.log('Properties:', Object.keys(database.properties).length);
  }

  return database;
}

async function createScreeningMemos(notion, parentPageId, pipelineDbId) {
  console.log('\n=== Creating Screening Memos Database ===');

  const database = await notion.databases.create({
    parent: {
      type: 'page_id',
      page_id: parentPageId
    },
    title: [
      {
        type: 'text',
        text: { content: 'Screening Memos' }
      }
    ],
    is_inline: true,
    properties: {
      'Memo Title': {
        title: {}
      },
      'Deal': {
        relation: {
          database_id: pipelineDbId,
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
    }
  });

  console.log('✅ Screening Memos created');
  console.log('Database ID:', database.id);
  if (database.properties) {
    console.log('Properties:', Object.keys(database.properties).length);
  }

  return database;
}

async function createDueDiligenceTracker(notion, parentPageId, pipelineDbId) {
  console.log('\n=== Creating Due Diligence Tracker Database ===');

  const database = await notion.databases.create({
    parent: {
      type: 'page_id',
      page_id: parentPageId
    },
    title: [
      {
        type: 'text',
        text: { content: 'Due Diligence Tracker' }
      }
    ],
    is_inline: true,
    properties: {
      'DD Title': {
        title: {}
      },
      'Deal': {
        relation: {
          database_id: pipelineDbId,
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
    }
  });

  console.log('✅ Due Diligence Tracker created');
  console.log('Database ID:', database.id);
  if (database.properties) {
    console.log('Properties:', Object.keys(database.properties).length);
  }

  return database;
}

async function createInvestmentCommittee(notion, parentPageId, pipelineDbId) {
  console.log('\n=== Creating Investment Committee Database ===');

  const database = await notion.databases.create({
    parent: {
      type: 'page_id',
      page_id: parentPageId
    },
    title: [
      {
        type: 'text',
        text: { content: 'Investment Committee Decisions' }
      }
    ],
    is_inline: true,
    properties: {
      'IC Record': {
        title: {}
      },
      'Deal': {
        relation: {
          database_id: pipelineDbId,
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
    }
  });

  console.log('✅ Investment Committee created');
  console.log('Database ID:', database.id);
  if (database.properties) {
    console.log('Properties:', Object.keys(database.properties).length);
  }

  return database;
}

async function createGrowthAssetsActivations(notion, parentPageId, pipelineDbId) {
  console.log('\n=== Creating Growth Assets Activations Database ===');

  const database = await notion.databases.create({
    parent: {
      type: 'page_id',
      page_id: parentPageId
    },
    title: [
      {
        type: 'text',
        text: { content: 'Growth Assets Activations' }
      }
    ],
    is_inline: true,
    properties: {
      'Activation Name': {
        title: {}
      },
      'Deal': {
        relation: {
          database_id: pipelineDbId,
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
    }
  });

  console.log('✅ Growth Assets Activations created');
  console.log('Database ID:', database.id);
  if (database.properties) {
    console.log('Properties:', Object.keys(database.properties).length);
  }

  return database;
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  Recreate Deal Flow System Databases                  ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  console.log('\nParent Page ID:', PARENT_PAGE_ID);

  if (!NOTION_TOKEN) {
    console.error('\n❌ ERROR: NOTION_TOKEN not found');
    process.exit(1);
  }

  const notion = new Client({ auth: NOTION_TOKEN });

  try {
    // Create databases in sequence (due to relations)
    const pipelineDb = await createDealFlowPipeline(notion, PARENT_PAGE_ID);
    const screeningDb = await createScreeningMemos(notion, PARENT_PAGE_ID, pipelineDb.id);
    const ddDb = await createDueDiligenceTracker(notion, PARENT_PAGE_ID, pipelineDb.id);
    const icDb = await createInvestmentCommittee(notion, PARENT_PAGE_ID, pipelineDb.id);
    const growthDb = await createGrowthAssetsActivations(notion, PARENT_PAGE_ID, pipelineDb.id);

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║  ✅ All Databases Created Successfully!                ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    console.log('📊 New Database IDs:');
    console.log('');
    console.log('Deal Flow Pipeline:', pipelineDb.id);
    console.log('  URL:', pipelineDb.url);
    console.log('');
    console.log('Screening Memos:', screeningDb.id);
    console.log('  URL:', screeningDb.url);
    console.log('');
    console.log('Due Diligence Tracker:', ddDb.id);
    console.log('  URL:', ddDb.url);
    console.log('');
    console.log('Investment Committee:', icDb.id);
    console.log('  URL:', icDb.url);
    console.log('');
    console.log('Growth Assets Activations:', growthDb.id);
    console.log('  URL:', growthDb.url);
    console.log('');

    console.log('🎯 Next Steps:');
    console.log('  1. Delete old empty databases from the page');
    console.log('  2. Add process overview content to main page');
    console.log('  3. Open databases in Notion to verify structure');
    console.log('');

  } catch (error) {
    console.error('\n❌ Failed to create databases');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    if (error.body) {
      console.error('Body:', JSON.stringify(error.body, null, 2));
    }
    process.exit(1);
  }
}

main();
