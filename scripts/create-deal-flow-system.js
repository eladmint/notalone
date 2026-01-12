/**
 * Create NOTALONE Deal Flow System - Complete Database Structure
 *
 * This script creates:
 * 1. Parent page: "NOTALONE Deal Flow System"
 * 2. Deal Flow Pipeline Database (main tracker)
 * 3. Screening Memos Database
 * 4. Due Diligence Tracker Database
 * 5. Growth Assets Activations Database
 * 6. Investment Committee Decisions Database
 *
 * All databases are linked with proper relations.
 *
 * Usage:
 *   node scripts/create-deal-flow-system.js [parent-page-id]
 *
 * If no parent-page-id is provided, creates in NOTALONE IL workspace.
 */

import 'dotenv/config';
import { Client } from '@notionhq/client';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DEFAULT_PARENT_PAGE = '2c960b6e8d1881f98e48c4f6acbc1f4f'; // NOTALONE IL

// ===== STEP 1: Create Parent Page =====
async function createParentPage(notion, parentPageId) {
  console.log('\n=== STEP 1: Creating Parent Page ===\n');

  const page = await notion.pages.create({
    parent: {
      type: 'page_id',
      page_id: parentPageId || DEFAULT_PARENT_PAGE
    },
    icon: {
      type: 'emoji',
      emoji: '📊'
    },
    properties: {
      title: [
        {
          type: 'text',
          text: { content: 'NOTALONE Deal Flow System' }
        }
      ]
    },
    children: [
      {
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: [{ type: 'text', text: { content: 'Deal Flow Management System' } }]
        }
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Comprehensive deal flow tracking from sourcing through exit. Based on DEAL_FLOW_PROCESS.md framework.' }
            }
          ]
        }
      },
      {
        object: 'block',
        type: 'divider',
        divider: {}
      },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '🔄 Deal Flow Pipeline' } }]
        }
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Main tracker for all deals from sourcing through active portfolio and exit.' }
            }
          ]
        }
      }
    ]
  });

  console.log('✅ Parent page created!');
  console.log('Page ID: ' + page.id);
  console.log('URL: ' + page.url);

  return page;
}

// ===== STEP 2: Create Deal Flow Pipeline Database =====
async function createDealFlowPipeline(notion, parentPageId) {
  console.log('\n=== STEP 2: Creating Deal Flow Pipeline Database ===\n');

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
            { name: 'ICP Hubs', color: 'blue' },
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
            { name: 'Sourcing', color: 'gray' },
            { name: 'Screening', color: 'yellow' },
            { name: 'Due Diligence', color: 'blue' },
            { name: 'Investment Committee', color: 'purple' },
            { name: 'Structuring', color: 'orange' },
            { name: 'Onboarding', color: 'pink' },
            { name: 'Active (Growth Assets)', color: 'green' },
            { name: 'Monitoring/Exit', color: 'brown' }
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
            { name: 'Pre-TGE', color: 'orange' },
            { name: 'Equity Only', color: 'gray' }
          ]
        }
      },
      'Market Cap ($M)': {
        number: {
          format: 'number'
        }
      },
      'Daily Volume ($K)': {
        number: {
          format: 'number'
        }
      },
      'Investment Size ($K)': {
        number: {
          format: 'number'
        }
      },
      'Discount %': {
        number: {
          format: 'percent'
        }
      },
      'Deal Lead': {
        select: {
          options: [
            { name: 'Elad', color: 'blue' },
            { name: 'Viktor', color: 'green' },
            { name: 'Nuru', color: 'purple' }
          ]
        }
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
      'Website': {
        url: {}
      },
      'Deck': {
        url: {}
      },
      'Notes': {
        rich_text: {}
      }
    }
  });

  console.log('✅ Deal Flow Pipeline created!');
  console.log('Database ID: ' + database.id);

  return database;
}

// ===== STEP 3: Create Screening Memos Database =====
async function createScreeningMemos(notion, parentPageId, pipelineDbId) {
  console.log('\n=== STEP 3: Creating Screening Memos Database ===\n');

  // First add a heading
  await notion.blocks.children.append({
    block_id: parentPageId,
    children: [
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '📋 Screening Memos' } }]
        }
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Initial screening assessments for deals entering the pipeline.' }
            }
          ]
        }
      }
    ]
  });

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
        select: {
          options: [
            { name: 'Differentiated', color: 'green' },
            { name: 'Competitive', color: 'yellow' },
            { name: 'Crowded', color: 'orange' },
            { name: 'Unclear', color: 'gray' }
          ]
        }
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
            { name: 'Services Only', color: 'blue' },
            { name: 'Pass', color: 'red' }
          ]
        }
      },
      'Next Steps': {
        rich_text: {}
      },
      'Screener': {
        select: {
          options: [
            { name: 'Elad', color: 'blue' },
            { name: 'Viktor', color: 'green' },
            { name: 'Nuru', color: 'purple' }
          ]
        }
      }
    }
  });

  console.log('✅ Screening Memos created!');
  console.log('Database ID: ' + database.id);

  return database;
}

// ===== STEP 4: Create Due Diligence Tracker Database =====
async function createDueDiligenceTracker(notion, parentPageId, pipelineDbId) {
  console.log('\n=== STEP 4: Creating Due Diligence Tracker Database ===\n');

  // Add heading
  await notion.blocks.children.append({
    block_id: parentPageId,
    children: [
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '🔍 Due Diligence Tracker' } }]
        }
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Comprehensive investment and growth fit due diligence tracking.' }
            }
          ]
        }
      }
    ]
  });

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
      'DD Report': {
        title: {}
      },
      'Deal': {
        relation: {
          database_id: pipelineDbId,
          type: 'dual_property',
          dual_property: {}
        }
      },
      'Token Economics': {
        checkbox: {}
      },
      'Token Economics Notes': {
        rich_text: {}
      },
      'On-Chain Metrics': {
        checkbox: {}
      },
      'On-Chain Notes': {
        rich_text: {}
      },
      'Competitive Position': {
        checkbox: {}
      },
      'Competitive Notes': {
        rich_text: {}
      },
      'Team Background': {
        checkbox: {}
      },
      'Team Notes': {
        rich_text: {}
      },
      'Cap Table Review': {
        checkbox: {}
      },
      'Cap Table Notes': {
        rich_text: {}
      },
      'Legal Status': {
        checkbox: {}
      },
      'Legal Notes': {
        rich_text: {}
      },
      'Growth Gaps Analysis': {
        rich_text: {}
      },
      'Audience Alignment': {
        multi_select: {
          options: [
            { name: 'Builders', color: 'blue' },
            { name: 'Investors', color: 'green' },
            { name: 'Strategic', color: 'purple' }
          ]
        }
      },
      'Geographic Fit': {
        multi_select: {
          options: [
            { name: 'North America', color: 'blue' },
            { name: 'Europe', color: 'green' },
            { name: 'Asia', color: 'orange' },
            { name: 'LATAM', color: 'purple' },
            { name: 'MENA', color: 'pink' }
          ]
        }
      },
      'DD Complete Date': {
        date: {}
      },
      'Recommendation': {
        select: {
          options: [
            { name: 'Strong Invest', color: 'green' },
            { name: 'Invest', color: 'blue' },
            { name: 'Conditional Invest', color: 'yellow' },
            { name: 'Pass', color: 'red' }
          ]
        }
      },
      'DD Lead': {
        select: {
          options: [
            { name: 'Elad', color: 'blue' },
            { name: 'Viktor', color: 'green' },
            { name: 'Nuru', color: 'purple' }
          ]
        }
      }
    }
  });

  console.log('✅ Due Diligence Tracker created!');
  console.log('Database ID: ' + database.id);

  return database;
}

// ===== STEP 5: Create Investment Committee Decisions Database =====
async function createInvestmentCommittee(notion, parentPageId, pipelineDbId) {
  console.log('\n=== STEP 5: Creating Investment Committee Decisions Database ===\n');

  // Add heading
  await notion.blocks.children.append({
    block_id: parentPageId,
    children: [
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '⚖️ Investment Committee Decisions' } }]
        }
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'IC meeting decisions with scoring framework (min 3.5/5.0 to proceed).' }
            }
          ]
        }
      }
    ]
  });

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
      'IC Decision': {
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
      'Token Fundamentals Score': {
        select: {
          options: [
            { name: '5 - Excellent', color: 'green' },
            { name: '4 - Good', color: 'blue' },
            { name: '3 - Average', color: 'yellow' },
            { name: '2 - Below Average', color: 'orange' },
            { name: '1 - Poor', color: 'red' }
          ]
        }
      },
      'Growth Opportunity Score': {
        select: {
          options: [
            { name: '5 - Excellent', color: 'green' },
            { name: '4 - Good', color: 'blue' },
            { name: '3 - Average', color: 'yellow' },
            { name: '2 - Below Average', color: 'orange' },
            { name: '1 - Poor', color: 'red' }
          ]
        }
      },
      'Team Quality Score': {
        select: {
          options: [
            { name: '5 - Excellent', color: 'green' },
            { name: '4 - Good', color: 'blue' },
            { name: '3 - Average', color: 'yellow' },
            { name: '2 - Below Average', color: 'orange' },
            { name: '1 - Poor', color: 'red' }
          ]
        }
      },
      'Deal Terms Score': {
        select: {
          options: [
            { name: '5 - Excellent', color: 'green' },
            { name: '4 - Good', color: 'blue' },
            { name: '3 - Average', color: 'yellow' },
            { name: '2 - Below Average', color: 'orange' },
            { name: '1 - Poor', color: 'red' }
          ]
        }
      },
      'Strategic Fit Score': {
        select: {
          options: [
            { name: '5 - Excellent', color: 'green' },
            { name: '4 - Good', color: 'blue' },
            { name: '3 - Average', color: 'yellow' },
            { name: '2 - Below Average', color: 'orange' },
            { name: '1 - Poor', color: 'red' }
          ]
        }
      },
      'Overall Score': {
        number: {
          format: 'number'
        }
      },
      'Decision': {
        select: {
          options: [
            { name: 'Approve', color: 'green' },
            { name: 'Approve with Conditions', color: 'yellow' },
            { name: 'More DD Required', color: 'orange' },
            { name: 'Decline', color: 'red' }
          ]
        }
      },
      'Conditions/Notes': {
        rich_text: {}
      },
      'Terms Approved': {
        rich_text: {}
      },
      'IC Members': {
        multi_select: {
          options: [
            { name: 'Elad', color: 'blue' },
            { name: 'Viktor', color: 'green' },
            { name: 'LP Representative', color: 'purple' }
          ]
        }
      }
    }
  });

  console.log('✅ Investment Committee Decisions created!');
  console.log('Database ID: ' + database.id);

  return database;
}

// ===== STEP 6: Create Growth Assets Activations Database =====
async function createGrowthAssetsActivations(notion, parentPageId, pipelineDbId) {
  console.log('\n=== STEP 6: Creating Growth Assets Activations Database ===\n');

  // Add heading
  await notion.blocks.children.append({
    block_id: parentPageId,
    children: [
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: '🚀 Growth Assets Activations' } }]
        }
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Track conference activations and growth support delivery for portfolio companies.' }
            }
          ]
        }
      }
    ]
  });

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
      'Activation': {
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
        select: {
          options: [
            { name: 'Token2049', color: 'blue' },
            { name: 'ETH Denver', color: 'purple' },
            { name: 'Consensus', color: 'orange' },
            { name: 'Devcon', color: 'green' },
            { name: 'Chain Fusion House', color: 'pink' },
            { name: 'Other', color: 'gray' }
          ]
        }
      },
      'Date': {
        date: {}
      },
      'Activation Type': {
        multi_select: {
          options: [
            { name: 'House Event', color: 'green' },
            { name: 'Speaking', color: 'blue' },
            { name: 'Panel', color: 'purple' },
            { name: 'Demo', color: 'orange' },
            { name: 'Hackathon', color: 'pink' }
          ]
        }
      },
      'Package Used': {
        select: {
          options: [
            { name: 'Essential', color: 'blue' },
            { name: 'Growth', color: 'green' },
            { name: 'Premium', color: 'purple' }
          ]
        }
      },
      'Token Value Released ($K)': {
        number: {
          format: 'number'
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
      },
      'Coordinator': {
        select: {
          options: [
            { name: 'Elad', color: 'blue' },
            { name: 'Viktor', color: 'green' },
            { name: 'Nuru', color: 'purple' }
          ]
        }
      }
    }
  });

  console.log('✅ Growth Assets Activations created!');
  console.log('Database ID: ' + database.id);

  return database;
}

// ===== STEP 7: Add Summary Footer =====
async function addSummaryFooter(notion, parentPageId) {
  console.log('\n=== STEP 7: Adding Summary Footer ===\n');

  await notion.blocks.children.append({
    block_id: parentPageId,
    children: [
      {
        object: 'block',
        type: 'divider',
        divider: {}
      },
      {
        object: 'block',
        type: 'callout',
        callout: {
          icon: { type: 'emoji', emoji: '📖' },
          color: 'blue_background',
          rich_text: [
            {
              type: 'text',
              text: { content: 'Reference Document: ' }
            },
            {
              type: 'text',
              text: { content: 'docs/services/DEAL_FLOW_PROCESS.md' },
              annotations: { code: true }
            }
          ]
        }
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: 'Created: ' }
            },
            {
              type: 'text',
              text: { content: new Date().toISOString().split('T')[0] },
              annotations: { bold: true }
            },
            {
              type: 'text',
              text: { content: ' | Framework: NOTALONE Deal Flow Process v1.0' }
            }
          ]
        }
      }
    ]
  });

  console.log('✅ Summary footer added!');
}

// ===== MAIN EXECUTION =====
async function main() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  NOTALONE Deal Flow System - Database Creation        ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  if (!NOTION_TOKEN) {
    console.error('\n❌ ERROR: NOTION_TOKEN not found in environment variables');
    process.exit(1);
  }

  const notion = new Client({ auth: NOTION_TOKEN });
  const parentPageId = process.argv[2];

  if (parentPageId) {
    console.log('\n📍 Using parent page ID: ' + parentPageId);
  } else {
    console.log('\n📍 Using default parent: NOTALONE IL workspace');
  }

  try {
    // Create parent page
    const parentPage = await createParentPage(notion, parentPageId);

    // Create all databases (in sequence to maintain proper relations)
    const pipelineDb = await createDealFlowPipeline(notion, parentPage.id);
    const screeningDb = await createScreeningMemos(notion, parentPage.id, pipelineDb.id);
    const ddDb = await createDueDiligenceTracker(notion, parentPage.id, pipelineDb.id);
    const icDb = await createInvestmentCommittee(notion, parentPage.id, pipelineDb.id);
    const growthDb = await createGrowthAssetsActivations(notion, parentPage.id, pipelineDb.id);

    // Add footer
    await addSummaryFooter(notion, parentPage.id);

    // Final summary
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║  ✅ SUCCESS! Deal Flow System Created                  ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    console.log('📊 System Components:');
    console.log('');
    console.log('1. Main Page: NOTALONE Deal Flow System');
    console.log('   URL: ' + parentPage.url);
    console.log('');
    console.log('2. Deal Flow Pipeline Database');
    console.log('   ID: ' + pipelineDb.id);
    console.log('');
    console.log('3. Screening Memos Database');
    console.log('   ID: ' + screeningDb.id);
    console.log('');
    console.log('4. Due Diligence Tracker Database');
    console.log('   ID: ' + ddDb.id);
    console.log('');
    console.log('5. Investment Committee Decisions Database');
    console.log('   ID: ' + icDb.id);
    console.log('');
    console.log('6. Growth Assets Activations Database');
    console.log('   ID: ' + growthDb.id);
    console.log('');

    console.log('🔗 All databases linked to Deal Flow Pipeline via relations');
    console.log('');
    console.log('📖 Next Steps:');
    console.log('   - Open the page in Notion: ' + parentPage.url);
    console.log('   - Customize database views (Kanban, Calendar, etc.)');
    console.log('   - Add team members to database permissions');
    console.log('   - Start tracking deals!');
    console.log('');

  } catch (error) {
    console.error('\n❌ ERROR: Failed to create deal flow system');
    console.error('Status:', error.status);
    console.error('Code:', error.code);
    console.error('Message:', error.message);

    if (error.code === 'validation_error') {
      console.log('\nValidation error details:', JSON.stringify(error.body, null, 2));
    }

    process.exit(1);
  }
}

main();
