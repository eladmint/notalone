/**
 * Fix Database Properties Using Update Endpoint
 *
 * The create endpoint seems to be creating databases without properties.
 * This script uses the update endpoint to add properties to existing databases.
 *
 * Usage:
 *   node scripts/fix-database-properties.js
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

async function updatePipeline(notion) {
  console.log('\n=== Updating Deal Flow Pipeline ===');

  try {
    await notion.databases.update({
      database_id: DATABASE_IDS.pipeline,
      title: [{ type: 'text', text: { content: 'Deal Flow Pipeline' } }],
      properties: {
        'Deal Name': { title: {} },
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
        'Market Cap': { number: { format: 'dollar' } },
        'Daily Volume': { number: { format: 'dollar' } },
        'Investment Size': { number: { format: 'dollar' } },
        'Discount %': { number: { format: 'percent' } },
        'Deal Lead': { rich_text: {} },
        'First Contact': { date: {} },
        'Last Updated': { last_edited_time: {} },
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
        'Notes': { rich_text: {} }
      }
    });
    console.log('✅ Deal Flow Pipeline updated');
    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.body) {
      console.error('Body:', JSON.stringify(error.body, null, 2));
    }
    return false;
  }
}

async function updateScreening(notion) {
  console.log('\n=== Updating Screening Memos ===');

  try {
    await notion.databases.update({
      database_id: DATABASE_IDS.screening,
      title: [{ type: 'text', text: { content: 'Screening Memos' } }],
      properties: {
        'Memo Title': { title: {} },
        'Deal': {
          relation: {
            database_id: DATABASE_IDS.pipeline,
            type: 'dual_property',
            dual_property: {}
          }
        },
        'Screening Date': { date: {} },
        'Growth Need': { rich_text: {} },
        'Team Fit': { checkbox: {} },
        'Token Health': { checkbox: {} },
        'Market Position': { rich_text: {} },
        'Cap Table Clean': { checkbox: {} },
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
        'Next Steps': { rich_text: {} }
      }
    });
    console.log('✅ Screening Memos updated');
    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function updateDueDiligence(notion) {
  console.log('\n=== Updating Due Diligence Tracker ===');

  try {
    await notion.databases.update({
      database_id: DATABASE_IDS.dueDiligence,
      title: [{ type: 'text', text: { content: 'Due Diligence Tracker' } }],
      properties: {
        'DD Title': { title: {} },
        'Deal': {
          relation: {
            database_id: DATABASE_IDS.pipeline,
            type: 'dual_property',
            dual_property: {}
          }
        },
        'Token Economics Done': { checkbox: {} },
        'Token Economics Notes': { rich_text: {} },
        'On-Chain Metrics Done': { checkbox: {} },
        'On-Chain Notes': { rich_text: {} },
        'Competitive Position Done': { checkbox: {} },
        'Competitive Notes': { rich_text: {} },
        'Team Background Done': { checkbox: {} },
        'Team Notes': { rich_text: {} },
        'Cap Table Done': { checkbox: {} },
        'Cap Table Notes': { rich_text: {} },
        'Legal Status Done': { checkbox: {} },
        'Legal Notes': { rich_text: {} },
        'Growth Gaps': { rich_text: {} },
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
        'DD Complete Date': { date: {} },
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
    console.log('✅ Due Diligence Tracker updated');
    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function updateInvestmentCommittee(notion) {
  console.log('\n=== Updating Investment Committee ===');

  try {
    await notion.databases.update({
      database_id: DATABASE_IDS.investmentCommittee,
      title: [{ type: 'text', text: { content: 'Investment Committee Decisions' } }],
      properties: {
        'IC Record': { title: {} },
        'Deal': {
          relation: {
            database_id: DATABASE_IDS.pipeline,
            type: 'dual_property',
            dual_property: {}
          }
        },
        'IC Date': { date: {} },
        'Token Fundamentals': { number: { format: 'number' } },
        'Growth Opportunity': { number: { format: 'number' } },
        'Team Quality': { number: { format: 'number' } },
        'Deal Terms': { number: { format: 'number' } },
        'Strategic Fit': { number: { format: 'number' } },
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
        'Conditions': { rich_text: {} },
        'Terms Approved': { rich_text: {} }
      }
    });
    console.log('✅ Investment Committee updated');
    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function updateGrowthAssets(notion) {
  console.log('\n=== Updating Growth Assets Activations ===');

  try {
    await notion.databases.update({
      database_id: DATABASE_IDS.growthAssets,
      title: [{ type: 'text', text: { content: 'Growth Assets Activations' } }],
      properties: {
        'Activation Name': { title: {} },
        'Deal': {
          relation: {
            database_id: DATABASE_IDS.pipeline,
            type: 'dual_property',
            dual_property: {}
          }
        },
        'Conference/Event': { rich_text: {} },
        'Event Date': { date: {} },
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
        'Token Value Released': { number: { format: 'dollar' } },
        'Leads Generated': { number: { format: 'number' } },
        'Partnerships Initiated': { number: { format: 'number' } },
        'Debrief Notes': { rich_text: {} },
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
    console.log('✅ Growth Assets Activations updated');
    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  Fix Database Properties Using Update Endpoint        ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  if (!NOTION_TOKEN) {
    console.error('\n❌ ERROR: NOTION_TOKEN not found');
    process.exit(1);
  }

  const notion = new Client({ auth: NOTION_TOKEN });

  try {
    const results = [];

    results.push(await updatePipeline(notion));
    results.push(await updateScreening(notion));
    results.push(await updateDueDiligence(notion));
    results.push(await updateInvestmentCommittee(notion));
    results.push(await updateGrowthAssets(notion));

    const allPassed = results.every(r => r === true);

    console.log('\n╔════════════════════════════════════════════════════════╗');
    if (allPassed) {
      console.log('║  ✅ All Databases Updated Successfully!                ║');
      console.log('╚════════════════════════════════════════════════════════╝\n');
      console.log('Run verify-new-databases.js to confirm properties are set.');
    } else {
      console.log('║  ⚠️  Some Updates Failed                              ║');
      console.log('╚════════════════════════════════════════════════════════╝');
    }
    console.log('');

  } catch (error) {
    console.error('\n❌ Update failed:', error.message);
    process.exit(1);
  }
}

main();
