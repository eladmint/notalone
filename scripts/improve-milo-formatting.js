#!/usr/bin/env node
/**
 * Improve formatting of Technology and Funding/Investors sections on Milo page
 * Target: https://www.notion.so/Milo-2c585dd502d581b8907bdc6683724f85
 */

import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const MILO_PAGE_ID = '2c585dd502d581b8907bdc6683724f85';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper to create rich text
function richText(content, bold = false) {
  return [{
    type: 'text',
    text: { content },
    annotations: { bold }
  }];
}

// Block builders
const blocks = {
  paragraph: (text) => ({
    type: 'paragraph',
    paragraph: { rich_text: richText(text) }
  }),

  heading3: (text) => ({
    type: 'heading_3',
    heading_3: { rich_text: richText(text) }
  }),

  bulletItem: (text) => ({
    type: 'bulleted_list_item',
    bulleted_list_item: { rich_text: richText(text) }
  }),

  numberItem: (text) => ({
    type: 'numbered_list_item',
    numbered_list_item: { rich_text: richText(text) }
  }),

  callout: (text, icon = '💡', color = 'gray_background') => ({
    type: 'callout',
    callout: {
      rich_text: richText(text),
      icon: { type: 'emoji', emoji: icon },
      color
    }
  }),

  table: (rows, hasHeader = true) => ({
    type: 'table',
    table: {
      table_width: rows[0]?.length || 2,
      has_column_header: hasHeader,
      has_row_header: false,
      children: rows.map(cells => ({
        type: 'table_row',
        table_row: {
          cells: cells.map(text => richText(text))
        }
      }))
    }
  }),

  divider: () => ({
    type: 'divider',
    divider: {}
  }),

  empty: () => ({
    type: 'paragraph',
    paragraph: { rich_text: [] }
  })
};

/**
 * Find the toggle heading block for a section
 */
async function findSectionBlock(pageId, sectionName) {
  let cursor;
  do {
    await delay(350);
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100
    });

    for (const block of response.results) {
      if (block.type === 'heading_2') {
        const text = block.heading_2.rich_text.map(t => t.plain_text).join('').trim();
        if (text.includes(sectionName)) {
          return block;
        }
      }
    }

    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return null;
}

/**
 * Get all child blocks of a section
 */
async function getSectionChildren(sectionBlockId) {
  const children = [];
  let cursor;

  do {
    await delay(350);
    const response = await notion.blocks.children.list({
      block_id: sectionBlockId,
      start_cursor: cursor,
      page_size: 100
    });

    children.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return children;
}

/**
 * Delete blocks by ID
 */
async function deleteBlocks(blockIds) {
  for (const id of blockIds) {
    await delay(350);
    try {
      await notion.blocks.delete({ block_id: id });
      console.log(`  Deleted block: ${id.substring(0, 8)}...`);
    } catch (err) {
      console.log(`  Warning: Could not delete ${id}: ${err.message}`);
    }
  }
}

/**
 * Append blocks to a parent
 */
async function appendBlocks(parentId, newBlocks) {
  // Notion API limits appending to 100 blocks at a time
  const batchSize = 100;
  for (let i = 0; i < newBlocks.length; i += batchSize) {
    const batch = newBlocks.slice(i, i + batchSize);
    await delay(350);
    await notion.blocks.children.append({
      block_id: parentId,
      children: batch
    });
    console.log(`  Appended ${batch.length} blocks`);
  }
}

/**
 * Create improved Technology section blocks
 */
function createTechnologyBlocks() {
  return [
    blocks.divider(),

    // Core Technology Approach with Agent Table
    blocks.heading3('Core Technology Approach'),
    blocks.paragraph('Built on Eliza OS AI Agent Framework with multi-agent orchestration:'),
    blocks.table([
      ['Agent', 'Purpose'],
      ['Analyst Agent', 'Market research and data analysis'],
      ['Chain Action Agent', 'Blockchain execution and transactions'],
      ['Strategy Agent', 'Trading strategies and optimization']
    ]),
    blocks.empty(),
    blocks.paragraph('ML/AI Engine includes regression, classification, and clustering models for pattern recognition and predictive analytics.'),
    blocks.empty(),

    // Technical Infrastructure as separate bullets
    blocks.heading3('Technical Infrastructure'),
    blocks.bulletItem('miloOS Framework: System layer for fast responses'),
    blocks.bulletItem('Agent Crew: Multi-agent orchestration system'),
    blocks.bulletItem('Model Adapter: Multi-model AI integration (GPT-4, Claude, etc.)'),
    blocks.bulletItem('Data Pipeline: Real-time on-chain data processing'),
    blocks.bulletItem('Telegram Integration: Primary user interface'),
    blocks.bulletItem('Agent Swarm Coordination: Distributed agent management'),
    blocks.empty(),

    // Technology Stack - Grouped format
    blocks.heading3('Technology Stack'),
    blocks.callout('AI Framework: Eliza OS', '🤖', 'blue_background'),
    blocks.empty(),
    blocks.paragraph('Blockchains Supported (10+):'),
    blocks.bulletItem('Bitcoin, Ethereum, Solana, Base, Avalanche'),
    blocks.bulletItem('TON, Binance Smart Chain, Optimism'),
    blocks.empty(),
    blocks.paragraph('Data Partners:'),
    blocks.bulletItem('Helius: Solana RPC provider'),
    blocks.bulletItem('Birdeye: Market data and analytics'),
    blocks.empty(),
    blocks.paragraph('Wallet Integrations:'),
    blocks.bulletItem('Trust Wallet, MetaMask'),
    blocks.bulletItem('BullX, Photon (trading bots)')
  ];
}

/**
 * Create improved Funding/Investors section blocks
 */
function createFundingBlocks() {
  return [
    // Funding History heading (preserved)
    blocks.heading3('Funding History'),
    blocks.empty(),

    // Investor Roster as table
    blocks.heading3('Investor Roster'),
    blocks.table([
      ['Investor', 'Notes'],
      ['Wix Ventures', 'Leading Israeli tech investor'],
      ['PrimeVC', 'Active crypto/Web3 VC'],
      ['Ariel Maislos', 'Ex-CEO Kraken US, McKinsey, Google'],
      ['Tal Cohen', 'CMO at partner network']
    ]),
    blocks.empty(),

    // Valuation with callout headline
    blocks.heading3('Valuation'),
    blocks.callout('$15M FDV | $9M Pre-money', '💰', 'yellow_background'),
    blocks.table([
      ['Metric', 'Value', 'Notes'],
      ['ARR Multiple', '357x', 'Current metrics'],
      ['Valuation per WAU', '$6,048', 'Below Notalone ideal ($25-40M) but acceptable']
    ]),
    blocks.empty(),

    // Use of Funds as numbered list
    blocks.heading3('Use of Funds'),
    blocks.numberItem('Accelerate Go-To-Market'),
    blocks.numberItem('Run open beta'),
    blocks.numberItem('Enhance product capabilities'),
    blocks.callout('Estimated burn: $100-150K/month | Runway: 17-40 months', '📊', 'gray_background'),
    blocks.empty()
  ];
}

async function main() {
  console.log('========================================');
  console.log('Improving Milo Page Formatting');
  console.log(`Page ID: ${MILO_PAGE_ID}`);
  console.log('========================================\n');

  try {
    // ===== TECHNOLOGY SECTION =====
    console.log('1. Finding Technology section...');
    const techSection = await findSectionBlock(MILO_PAGE_ID, 'Technology');

    if (!techSection) {
      console.error('ERROR: Technology section not found!');
      return;
    }
    console.log(`   Found: ${techSection.id}`);

    // Get current children
    console.log('2. Getting Technology section children...');
    const techChildren = await getSectionChildren(techSection.id);
    console.log(`   Found ${techChildren.length} children`);

    // Delete all current children
    console.log('3. Removing old Technology content...');
    await deleteBlocks(techChildren.map(b => b.id));

    // Add new formatted content
    console.log('4. Adding improved Technology content...');
    const newTechBlocks = createTechnologyBlocks();
    await appendBlocks(techSection.id, newTechBlocks);
    console.log('   Technology section updated successfully!\n');

    // ===== FUNDING/INVESTORS SECTION =====
    console.log('5. Finding Funding/Investors section...');
    const fundingSection = await findSectionBlock(MILO_PAGE_ID, 'Funding/Investors');

    if (!fundingSection) {
      console.error('ERROR: Funding/Investors section not found!');
      return;
    }
    console.log(`   Found: ${fundingSection.id}`);

    // Get current children
    console.log('6. Getting Funding/Investors section children...');
    const fundingChildren = await getSectionChildren(fundingSection.id);
    console.log(`   Found ${fundingChildren.length} children`);

    // Delete all current children
    console.log('7. Removing old Funding/Investors content...');
    await deleteBlocks(fundingChildren.map(b => b.id));

    // Add new formatted content
    console.log('8. Adding improved Funding/Investors content...');
    const newFundingBlocks = createFundingBlocks();
    await appendBlocks(fundingSection.id, newFundingBlocks);
    console.log('   Funding/Investors section updated successfully!\n');

    console.log('========================================');
    console.log('DONE! Both sections have been reformatted.');
    console.log('View at: https://www.notion.so/Milo-2c585dd502d581b8907bdc6683724f85');
    console.log('========================================');

  } catch (error) {
    console.error('Error:', error.message);
    if (error.body) {
      console.error('Details:', JSON.stringify(error.body, null, 2));
    }
    process.exit(1);
  }
}

main();
