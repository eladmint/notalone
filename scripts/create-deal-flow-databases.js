import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const PARENT_PAGE_ID = '2d960b6e8d1881c2b139e9a8d37d70b9';

async function createDatabases() {
  console.log('Creating Deal Flow databases...\n');

  // 1. CREATE PIPELINE DATABASE FIRST
  console.log('1. Creating Deal Flow Pipeline database...');
  const pipelineDb = await notion.databases.create({
    parent: {
      type: 'page_id',
      page_id: PARENT_PAGE_ID,
    },
    title: [
      {
        type: 'text',
        text: {
          content: 'Deal Flow Pipeline',
        },
      },
    ],
    properties: {
      'Deal Name': {
        title: {},
      },
      'Source': {
        select: {
          options: [
            { name: 'Services Pipeline', color: 'green' },
            { name: 'ICP Hubs Network', color: 'blue' },
            { name: 'Conference', color: 'purple' },
            { name: 'LP Referral', color: 'pink' },
            { name: 'VC Network', color: 'orange' },
            { name: 'Inbound', color: 'gray' },
          ],
        },
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
            { name: '8-Exit', color: 'brown' },
          ],
        },
      },
      'Classification': {
        select: {
          options: [
            { name: 'OTC + Growth Assets', color: 'green' },
            { name: 'OTC Only', color: 'blue' },
            { name: 'Services First', color: 'purple' },
            { name: 'Pass', color: 'red' },
          ],
        },
      },
      'Token Status': {
        select: {
          options: [
            { name: 'Post-TGE', color: 'green' },
            { name: 'Pre-TGE', color: 'orange' },
          ],
        },
      },
      'Market Cap': {
        number: {
          format: 'dollar',
        },
      },
      'Daily Volume': {
        number: {
          format: 'dollar',
        },
      },
      'Investment Size': {
        number: {
          format: 'dollar',
        },
      },
      'Discount %': {
        number: {
          format: 'percent',
        },
      },
      'Deal Lead': {
        rich_text: {},
      },
      'First Contact': {
        date: {},
      },
      'Status': {
        select: {
          options: [
            { name: 'Active', color: 'green' },
            { name: 'On Hold', color: 'yellow' },
            { name: 'Closed Won', color: 'blue' },
            { name: 'Closed Lost', color: 'red' },
          ],
        },
      },
      'Notes': {
        rich_text: {},
      },
    },
  });

  console.log(`✓ Pipeline created: ${pipelineDb.id}\n`);
  const pipelineDbId = pipelineDb.id.replace(/-/g, '');

  // 2. CREATE SCREENING MEMOS DATABASE
  console.log('2. Creating Screening Memos database...');
  const screeningDb = await notion.databases.create({
    parent: {
      type: 'page_id',
      page_id: PARENT_PAGE_ID,
    },
    title: [
      {
        type: 'text',
        text: {
          content: 'Screening Memos',
        },
      },
    ],
    properties: {
      'Memo Title': {
        title: {},
      },
      'Deal': {
        relation: {
          database_id: pipelineDbId,
        },
      },
      'Screening Date': {
        date: {},
      },
      'Growth Need': {
        rich_text: {},
      },
      'Team Fit': {
        checkbox: {},
      },
      'Token Health': {
        checkbox: {},
      },
      'Market Position': {
        rich_text: {},
      },
      'Cap Table Clean': {
        checkbox: {},
      },
      'Classification': {
        select: {
          options: [
            { name: 'OTC + Growth Assets', color: 'green' },
            { name: 'OTC Only', color: 'blue' },
            { name: 'Services First', color: 'purple' },
            { name: 'Pass', color: 'red' },
          ],
        },
      },
      'Recommendation': {
        select: {
          options: [
            { name: 'Proceed to DD', color: 'green' },
            { name: 'More Info Needed', color: 'yellow' },
            { name: 'Pass', color: 'red' },
          ],
        },
      },
      'Next Steps': {
        rich_text: {},
      },
    },
  });

  console.log(`✓ Screening Memos created: ${screeningDb.id}\n`);

  // 3. CREATE DUE DILIGENCE TRACKER DATABASE
  console.log('3. Creating Due Diligence Tracker database...');
  const ddDb = await notion.databases.create({
    parent: {
      type: 'page_id',
      page_id: PARENT_PAGE_ID,
    },
    title: [
      {
        type: 'text',
        text: {
          content: 'Due Diligence Tracker',
        },
      },
    ],
    properties: {
      'DD Title': {
        title: {},
      },
      'Deal': {
        relation: {
          database_id: pipelineDbId,
        },
      },
      'Token Economics Done': {
        checkbox: {},
      },
      'Token Economics Notes': {
        rich_text: {},
      },
      'On-Chain Metrics Done': {
        checkbox: {},
      },
      'On-Chain Notes': {
        rich_text: {},
      },
      'Competitive Position Done': {
        checkbox: {},
      },
      'Competitive Notes': {
        rich_text: {},
      },
      'Team Background Done': {
        checkbox: {},
      },
      'Team Notes': {
        rich_text: {},
      },
      'Cap Table Done': {
        checkbox: {},
      },
      'Cap Table Notes': {
        rich_text: {},
      },
      'Legal Status Done': {
        checkbox: {},
      },
      'Legal Notes': {
        rich_text: {},
      },
      'Growth Gaps': {
        rich_text: {},
      },
      'Audience Alignment': {
        multi_select: {
          options: [
            { name: 'Builders', color: 'blue' },
            { name: 'Investors', color: 'green' },
            { name: 'Strategic Partners', color: 'purple' },
          ],
        },
      },
      'Geographic Fit': {
        multi_select: {
          options: [
            { name: 'APAC', color: 'orange' },
            { name: 'Europe', color: 'green' },
            { name: 'US', color: 'blue' },
            { name: 'MENA', color: 'pink' },
            { name: 'LATAM', color: 'purple' },
          ],
        },
      },
      'DD Complete Date': {
        date: {},
      },
      'Recommendation': {
        select: {
          options: [
            { name: 'Proceed to IC', color: 'green' },
            { name: 'More DD Needed', color: 'yellow' },
            { name: 'Pass', color: 'red' },
          ],
        },
      },
    },
  });

  console.log(`✓ Due Diligence Tracker created: ${ddDb.id}\n`);

  // 4. CREATE INVESTMENT COMMITTEE DECISIONS DATABASE
  console.log('4. Creating Investment Committee Decisions database...');
  const icDb = await notion.databases.create({
    parent: {
      type: 'page_id',
      page_id: PARENT_PAGE_ID,
    },
    title: [
      {
        type: 'text',
        text: {
          content: 'Investment Committee Decisions',
        },
      },
    ],
    properties: {
      'IC Record': {
        title: {},
      },
      'Deal': {
        relation: {
          database_id: pipelineDbId,
        },
      },
      'IC Date': {
        date: {},
      },
      'Token Fundamentals': {
        number: {
          format: 'number',
        },
      },
      'Growth Opportunity': {
        number: {
          format: 'number',
        },
      },
      'Team Quality': {
        number: {
          format: 'number',
        },
      },
      'Deal Terms': {
        number: {
          format: 'number',
        },
      },
      'Strategic Fit': {
        number: {
          format: 'number',
        },
      },
      'Decision': {
        select: {
          options: [
            { name: 'Approve', color: 'green' },
            { name: 'Approve with Conditions', color: 'yellow' },
            { name: 'Request More DD', color: 'orange' },
            { name: 'Decline', color: 'red' },
          ],
        },
      },
      'Conditions': {
        rich_text: {},
      },
      'Terms Approved': {
        rich_text: {},
      },
    },
  });

  console.log(`✓ Investment Committee Decisions created: ${icDb.id}\n`);

  // 5. CREATE GROWTH ASSETS ACTIVATIONS DATABASE
  console.log('5. Creating Growth Assets Activations database...');
  const activationsDb = await notion.databases.create({
    parent: {
      type: 'page_id',
      page_id: PARENT_PAGE_ID,
    },
    title: [
      {
        type: 'text',
        text: {
          content: 'Growth Assets Activations',
        },
      },
    ],
    properties: {
      'Activation Name': {
        title: {},
      },
      'Deal': {
        relation: {
          database_id: pipelineDbId,
        },
      },
      'Conference/Event': {
        rich_text: {},
      },
      'Event Date': {
        date: {},
      },
      'Activation Type': {
        select: {
          options: [
            { name: 'House Event', color: 'green' },
            { name: 'Speaking Slot', color: 'blue' },
            { name: 'Panel', color: 'purple' },
            { name: 'Demo Station', color: 'orange' },
            { name: 'Hackathon Challenge', color: 'pink' },
          ],
        },
      },
      'Package': {
        select: {
          options: [
            { name: 'Essential $20K', color: 'blue' },
            { name: 'Growth $35K', color: 'green' },
            { name: 'Premium $50K', color: 'purple' },
            { name: 'Custom', color: 'gray' },
          ],
        },
      },
      'Token Value Released': {
        number: {
          format: 'dollar',
        },
      },
      'Leads Generated': {
        number: {
          format: 'number',
        },
      },
      'Partnerships Initiated': {
        number: {
          format: 'number',
        },
      },
      'Debrief Notes': {
        rich_text: {},
      },
      'Status': {
        select: {
          options: [
            { name: 'Planned', color: 'gray' },
            { name: 'Confirmed', color: 'yellow' },
            { name: 'Completed', color: 'green' },
            { name: 'Cancelled', color: 'red' },
          ],
        },
      },
    },
  });

  console.log(`✓ Growth Assets Activations created: ${activationsDb.id}\n`);

  // SUMMARY
  console.log('\n========================================');
  console.log('ALL DATABASES CREATED SUCCESSFULLY');
  console.log('========================================\n');

  console.log('Database IDs:');
  console.log(`1. Deal Flow Pipeline: ${pipelineDb.id}`);
  console.log(`2. Screening Memos: ${screeningDb.id}`);
  console.log(`3. Due Diligence Tracker: ${ddDb.id}`);
  console.log(`4. Investment Committee Decisions: ${icDb.id}`);
  console.log(`5. Growth Assets Activations: ${activationsDb.id}`);

  console.log('\nView them at:');
  console.log(`https://www.notion.so/${pipelineDb.id.replace(/-/g, '')}`);
  console.log(`https://www.notion.so/${screeningDb.id.replace(/-/g, '')}`);
  console.log(`https://www.notion.so/${ddDb.id.replace(/-/g, '')}`);
  console.log(`https://www.notion.so/${icDb.id.replace(/-/g, '')}`);
  console.log(`https://www.notion.so/${activationsDb.id.replace(/-/g, '')}`);

  return {
    pipeline: pipelineDb.id,
    screening: screeningDb.id,
    dueDiligence: ddDb.id,
    investmentCommittee: icDb.id,
    growthAssets: activationsDb.id,
  };
}

createDatabases().catch(console.error);
