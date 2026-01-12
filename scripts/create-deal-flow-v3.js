#!/usr/bin/env node
/**
 * Create Deal Flow Databases - API Version 2025-09-03 Compatible
 *
 * CRITICAL: Uses initial_data_source wrapper for properties
 * Required for @notionhq/client v5.x
 */

import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const PARENT_PAGE_ID = '2d960b6e8d1881c2b139e9a8d37d70b9';

async function createDatabases() {
  console.log('Creating Deal Flow databases with API 2025-09-03 format...\n');

  // 1. Create Pipeline Database FIRST
  console.log('1. Creating Deal Flow Pipeline...');
  const pipelineDb = await notion.databases.create({
    parent: { type: 'page_id', page_id: PARENT_PAGE_ID },
    title: [{ type: 'text', text: { content: 'Deal Flow Pipeline' } }],
    initial_data_source: {
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
    }
  });

  const pipelineId = pipelineDb.id;
  const pipelineDataSourceId = pipelineDb.data_sources?.[0]?.id;
  console.log(`   ✅ Pipeline created: ${pipelineId}`);
  console.log(`   Data Source ID: ${pipelineDataSourceId}\n`);

  if (!pipelineDataSourceId) {
    throw new Error('Could not get data_source_id from Pipeline database');
  }

  // 2. Create Screening Memos
  console.log('2. Creating Screening Memos...');
  const screeningDb = await notion.databases.create({
    parent: { type: 'page_id', page_id: PARENT_PAGE_ID },
    title: [{ type: 'text', text: { content: 'Screening Memos' } }],
    initial_data_source: {
      properties: {
        'Memo Title': { title: {} },
        'Deal': { relation: { data_source_id: pipelineDataSourceId, single_property: {} } },
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
    }
  });
  console.log(`   ✅ Screening Memos created: ${screeningDb.id}\n`);

  // 3. Create Due Diligence Tracker
  console.log('3. Creating Due Diligence Tracker...');
  const ddDb = await notion.databases.create({
    parent: { type: 'page_id', page_id: PARENT_PAGE_ID },
    title: [{ type: 'text', text: { content: 'Due Diligence Tracker' } }],
    initial_data_source: {
      properties: {
        'DD Title': { title: {} },
        'Deal': { relation: { data_source_id: pipelineDataSourceId, single_property: {} } },
        'Token Economics Done': { checkbox: {} },
        'Token Economics Notes': { rich_text: {} },
        'On-Chain Metrics Done': { checkbox: {} },
        'On-Chain Notes': { rich_text: {} },
        'Competitive Done': { checkbox: {} },
        'Competitive Notes': { rich_text: {} },
        'Team Background Done': { checkbox: {} },
        'Team Notes': { rich_text: {} },
        'Cap Table Done': { checkbox: {} },
        'Cap Table Notes': { rich_text: {} },
        'Legal Done': { checkbox: {} },
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
    }
  });
  console.log(`   ✅ Due Diligence Tracker created: ${ddDb.id}\n`);

  // 4. Create Investment Committee Decisions
  console.log('4. Creating Investment Committee Decisions...');
  const icDb = await notion.databases.create({
    parent: { type: 'page_id', page_id: PARENT_PAGE_ID },
    title: [{ type: 'text', text: { content: 'Investment Committee Decisions' } }],
    initial_data_source: {
      properties: {
        'IC Record': { title: {} },
        'Deal': { relation: { data_source_id: pipelineDataSourceId, single_property: {} } },
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
    }
  });
  console.log(`   ✅ Investment Committee Decisions created: ${icDb.id}\n`);

  // 5. Create Growth Assets Activations
  console.log('5. Creating Growth Assets Activations...');
  const activationsDb = await notion.databases.create({
    parent: { type: 'page_id', page_id: PARENT_PAGE_ID },
    title: [{ type: 'text', text: { content: 'Growth Assets Activations' } }],
    initial_data_source: {
      properties: {
        'Activation Name': { title: {} },
        'Deal': { relation: { data_source_id: pipelineDataSourceId, single_property: {} } },
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
    }
  });
  console.log(`   ✅ Growth Assets Activations created: ${activationsDb.id}\n`);

  // Summary
  console.log('=' .repeat(60));
  console.log('ALL DATABASES CREATED SUCCESSFULLY!\n');
  console.log('Database IDs:');
  console.log(`  Pipeline:    ${pipelineId}`);
  console.log(`  Screening:   ${screeningDb.id}`);
  console.log(`  DD Tracker:  ${ddDb.id}`);
  console.log(`  IC:          ${icDb.id}`);
  console.log(`  Activations: ${activationsDb.id}`);
  console.log('\nPage URL: https://www.notion.so/2d960b6e8d1881c2b139e9a8d37d70b9');
}

createDatabases().catch(err => {
  console.error('ERROR:', err.message);
  if (err.body) console.error('Details:', JSON.stringify(err.body, null, 2));
  process.exit(1);
});
