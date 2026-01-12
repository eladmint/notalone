#!/usr/bin/env node
/**
 * Template-Aware Notion Page Update for Milo
 *
 * CRITICAL: Preserves template structure by updating EXISTING blocks
 * instead of replacing them.
 */

import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const PAGE_ID = '2c585dd502d581b8907bdc6683724f85';

// Block IDs from page structure analysis
const BLOCK_IDS = {
  // Blurb section
  blurbCallout: '2c585dd5-02d5-802c-8e14-df331199eb7c', // AI-Powered Crypto Portfolio Manager
  teamParagraph: '2c585dd5-02d5-8000-8258-f30622822c93',
  dealParagraph: '2c585dd5-02d5-803a-a25d-cd06bfded39f',

  // Company Overview
  whatTheyDoParagraph: '2c585dd5-02d5-80bf-b10b-d90e38fe514a',
  problemParagraph: '2c585dd5-02d5-80c1-a33e-c9f1d87ee597',

  // Product - Value Proposition
  valuePropositionQuote: '2c585dd5-02d5-8067-a90a-db7ebe16309d',

  // Product - Components (these are heading_3 blocks with children)
  component1Heading: '2c585dd5-02d5-80d6-b075-e978e41c89d2',
  component1Bullet: '2c585dd5-02d5-8027-a103-da2741219e63',
  component2Heading: '2c585dd5-02d5-8079-bc7f-c0156ca187d6',
  component2Bullet: '2c585dd5-02d5-8002-a9c7-fd502c0f5304',
  component3Heading: '2c585dd5-02d5-8062-a3f8-c7e2e33145c7',
  component3Bullet: '2c585dd5-02d5-8043-8ffe-e93631d6799e',

  // Product - Features Table
  featuresTable: '2c585dd5-02d5-801f-8f08-e8f0b7defbfa',
  featuresRow1: '2c585dd5-02d5-8090-a235-db10c7338b88',
  featuresRow2: '2c585dd5-02d5-802c-9725-df6b51310ca1',
  featuresRow3: '2c585dd5-02d5-8003-b54b-f3e400a3fd7a',
  featuresRow4: '2c585dd5-02d5-8081-af5e-f98b24cd25d5',

  // Target Market
  primaryCustomersList: '2c585dd5-02d5-80ff-a450-d8b6d684d0c8',
  marketSegmentsBullet: '2c585dd5-02d5-80b6-a2e5-c742aa9e16ac',
  geographicFocusBullet: '2c585dd5-02d5-804b-b11b-eec009b399c9',
  customerCountBullet: '2c585dd5-02d5-80f8-93e1-e3d7212075b3',

  // Business Model
  revenueModelBullet: '2c585dd5-02d5-8005-8e8a-ee5dad620f8e',

  // Technology
  coreTechParagraph: '2c585dd5-02d5-8085-aa5f-f3aca21beb08',
  techInfraBullet: '2c585dd5-02d5-80bc-9df2-c159c0e9cee0',
  techStackBullet: '2c585dd5-02d5-8056-b248-caf92914946f',

  // Funding
  investorRosterParagraph: '2c585dd5-02d5-80a0-a0f6-c9cfd01887cf',
  valuationBullet: '2c585dd5-02d5-8003-8166-d6f842d1e5e9',
  useOfFundsBullet: '2c585dd5-02d5-8024-b2b7-e5f71a752e08',

  // Competitors
  directCompetitor1: '2c585dd5-02d5-8076-a825-d1953f29a68f',
  directCompetitor2: '2c585dd5-02d5-804f-9cd5-fc8198dda44f',
  competitiveAdvantagesList: '2c585dd5-02d5-8032-a3e2-e95c13cd83d4',
  competitiveSummaryParagraph: '2c585dd5-02d5-80e6-89c3-c9f3f666002c',

  // Market Position
  positioningParagraph: '2c585dd5-02d5-80c0-b1bb-f2e74ffad1e9',
  competitiveMoatsList: '2c585dd5-02d5-803a-81fb-c45302cb5a44',
  marketOpportunityBullet: '2c585dd5-02d5-803a-83d5-cba984553dc0',
  risksList: '2c585dd5-02d5-809e-b800-d6e08e4cad7f',

  // SWOT Tables
  swotStrengthsTable: '2c585dd5-02d5-80a7-8de0-f9113655ea9e',
  swotStrengthsRow1: '2c585dd5-02d5-80c8-a8e6-dcc31f802161',
  swotStrengthsRow2: '2c585dd5-02d5-807f-996a-d300c23237a3',
  swotStrengthsRow3: '2c585dd5-02d5-807d-80d4-f5cffc791291',
  swotStrengthsRow4: '2c585dd5-02d5-80f8-9532-ca5dee5ff66f',
  swotOpportunitiesTable: '2c585dd5-02d5-80b6-8a23-ccaba0808a73',
  swotOppRow1: '2c585dd5-02d5-80cf-baaa-c4ce78ecda0f',
  swotOppRow2: '2c585dd5-02d5-8006-82dd-ed7ad94e318b',
  swotOppRow3: '2c585dd5-02d5-8085-b1ca-fd36a71b6e3c',
  swotOppRow4: '2c585dd5-02d5-802f-8556-f1ae9f7bd2a5',

  // NOTALONE section
  whyInterestingBullet: '2c585dd5-02d5-80ec-9c47-cf227315c3cf',
  concernsBullet: '2c585dd5-02d5-803d-8e47-c612be3cb9bb',
  collaborationBullet: '2c585dd5-02d5-809d-9854-eeb480fdfd54',
};

// Content extracted from research.md
const CONTENT = {
  blurb: "Milo is an AI-powered autonomous trading agent and crypto portfolio manager that enables natural language trading with automated execution across multiple blockchains. After 5 weeks post-Auto Trader launch: 2,480 WAU, $120K AUM, $95.7K weekly trading volume, $3.5K MRR with 81% monthly retention and 100% organic acquisition.",

  team: "Team: Moti Cohen (CEO, ex-Apester founder) & Omri Kerel (CTO, VP R&D) - both crypto degens since 2017",

  deal: "Deal: $2.5M-$4M SAFE at $15M cap with 1:1 token warrants",

  whatTheyDo: "Milo provides an AI-powered digital portfolio manager and crypto companion that allows users to: (1) Trade with natural language - execute trades by simply typing commands like 'milo swap all my dust to USDC', (2) Automate portfolio management - deploy AI agents that trade autonomously based on user risk profiles and market conditions, (3) Unify cross-chain operations - manage all chains and wallets through a single interface, (4) Access simplified DeFi - navigate complex DeFi protocols with AI guidance.",

  problem: "Trading/Investing On Chain in 2025 is Still Broken. Pain points: 84% report missing opportunities, 76% struggle with portfolio management, 92% want simplified DeFi access, 68% fear making mistakes. Users face too many feeds, too many steps, too much risk - multiple wallets per chain, scattered trading tools, complex DeFi interfaces, disconnected data sources, and execution errors. Milo solves this as a unified AI companion that simplifies the entire trading journey through: Collaborate, Explain, Execute, and Optimize.",

  valueProposition: '"One Agent, All of Crypto" - The first AI Agent asset manager for internet capital markets. Milo simplifies crypto trading from discovery through execution and optimization.',

  component1: {
    name: "Smart Agent Wallet",
    bullets: [
      "Unified portfolio view across all chains",
      "Simplified DeFi access",
      "Cross-chain operations (10+ blockchains supported)",
      "Both custody wallet and user wallet integration"
    ]
  },

  component2: {
    name: "AI Quant Engine (Talk2Trade)",
    bullets: [
      "Natural language trading interface",
      "Automated trading execution",
      "Risk-adjusted position sizing",
      "Personal market analysis feed"
    ]
  },

  component3: {
    name: "AutoMode (Auto Trader)",
    bullets: [
      "Agent-powered autonomous trading",
      "Real-time on-chain data integration",
      "Discover alpha opportunities",
      "Build, execute, and optimize strategies hands-free"
    ]
  },

  features: [
    ["Natural Language Trading", "Type commands like 'milo swap all my dust to USDC' and AI executes"],
    ["Alpha Hunter Personal Feed", "Personalized discovery of trading opportunities"],
    ["Smart Watchlist", "Track coins and wallets with AI-powered monitoring"],
    ["On-chain Analysis", "Real-time blockchain data analysis for decision-making"]
  ],

  primaryCustomers: "1. Crypto Traders - active traders seeking to reduce complexity. 2. DeFi Users - struggling with fragmented protocols. 3. Crypto Beginners - wanting simplified access (92% want simplified DeFi). 4. Portfolio Managers - managing multiple positions across chains.",

  marketSegments: "By Risk Tolerance: Low risk (~$10K AUM), Medium risk (~$70K AUM, largest segment), High risk (~$22K AUM). By Engagement: Average top-up $201.30, 50.1% of Auto Traders topped up.",

  geographicFocus: "United States (89 users, $22K AUM - largest), Australia (16 users), Germany (17 users), Israel (13 users), Spain (7 users). Also Singapore, UK, France, Norway, Italy.",

  customerCount: "712K overall active users, 2,480 WAU, 562 DAU, 314 active Auto Traders (>=1 SOL), 81% monthly retention, ~50% daily retention.",

  revenueModel: "Trading Fees (~0.77% implied rate) - $10K generated on $1.3M volume. Subscription/Staking - Advanced Auto Trader features require token staking. Current: $3.5K MRR, $42K ARR run rate.",

  coreTech: "Built on Eliza OS AI Agent Framework with multi-agent orchestration: Analyst Agent (market research), Chain Action Agent (blockchain execution), Strategy Agent (trading strategies). ML/AI Engine includes regression, classification, clustering models and reinforcement learning for investor profiling, asset allocation, and algo trading.",

  techInfra: "miloOS Framework: System layer for fast responses, Agent Crew orchestration, Model Adapter for multi-model AI, Data Pipeline for real-time on-chain data, Telegram integration, Agent swarm coordination.",

  techStack: "AI Framework: Eliza OS. Blockchains: 10+ (Bitcoin, Ethereum, Solana, Base, Avalanche, TON, Binance, Optimism). Data Partners: Helius (Solana RPC), Birdeye (market data). Integrations: Trust Wallet, MetaMask, BullX, Photon trading bots.",

  investorRoster: "Wix Ventures (leading Israeli tech investor), PrimeVC (active crypto/Web3 VC), Ariel Maislos (ex-CEO Kraken US, McKinsey, Google), Tal Cohen (CMO at partner network).",

  valuation: "Entry FDV: $15M cap. Pre-money: $9M. Current metrics: 357x ARR multiple, $6,048 valuation per WAU. Below Notalone ideal range ($25-40M) but acceptable.",

  useOfFunds: "1. Accelerate Go-To-Market 2. Run open beta 3. Enhance product capabilities. Estimated burn: $100-150K/month, runway: 17-40 months with $2.5-4M raise.",

  directCompetitors: [
    "AI Trading Assistants - other AI-powered crypto trading platforms (specific names not disclosed in deck)",
    "Trading Bots (BullX, Photon) - integration partners but potential competitors"
  ],

  competitiveAdvantages: "1. First AI Agent Asset Manager claim. 2. Natural Language Interface (Talk2Trade). 3. Cross-Chain Unification (10+ blockchains). 4. 100% Organic Growth (strong PMF signal).",

  competitiveSummary: "Deck does not mention competitors - red flag. Claims to be creating new 'DeFAi' (DeFi + AI) category. If truly new category, lack of competitors makes sense but requires validation. Large incumbents (Binance, Coinbase) could enter space.",

  positioning: '"The first AI Agent asset manager for internet capital markets." Category creator in DeFAi, simplification layer for complex crypto trading, autonomous agent as personal portfolio manager.',

  competitiveMoats: "1. Technology Moat (MEDIUM) - Multi-model AI, natural language, cross-chain. 2. Data Moat (WEAK-MEDIUM) - Early stage, limited data. 3. Network Effects (WEAK) - Social trading graph nascent. 4. Execution Moat (MEDIUM-STRONG) - 81% retention, organic growth. 5. First-Mover (UNCLEAR) - Need validation.",

  marketOpportunity: "TAM: $94T annual crypto trading, $100B+ DeFi TVL, 420M crypto users, 50M active traders. SAM: 5-10M users struggling with complexity. SOM: 100K-500K users achievable in 3-5 years.",

  risks: "1. Crypto Market Dependency (HIGH) - Bear market would crush volume. 2. Regulatory Risk (HIGH) - AI financial advice + crypto trading uncertainty. 3. Competition (MEDIUM-HIGH) - Large exchanges could build similar. 4. AI Reliability (HIGH) - ML trading decisions carry risk. 5. Small Scale (HIGH) - $120K AUM needs 1000x growth.",

  swotStrengths: [
    "Strong early traction (81% retention)",
    "100% organic growth",
    "Experienced crypto-native founders",
    "Quality investors (Wix, ex-Kraken CEO)"
  ],

  swotWeaknesses: [
    "Extremely small scale ($120K AUM)",
    "Very early revenue ($42K ARR)",
    "Small team (7 people)",
    "Incomplete tokenomics"
  ],

  swotOpportunities: [
    "Emerging DeFAi category",
    "DeFi complexity driving demand",
    "Token launch for growth",
    "Network effects from social trading"
  ],

  swotThreats: [
    "Crypto bear market impact",
    "Regulatory crackdown risk",
    "Large incumbents entering space",
    "AI model failures causing losses"
  ],

  whyInteresting: "Strong PMF signals (81% retention, 29% conversion, 100% organic). AI + DeFi convergence aligns with Notalone thesis. Entry at $15M cap below ideal range. Quality investors validate team.",

  concerns: "Incomplete tokenomics (no TGE timeline, no unlock schedule). No competitor analysis in deck. Very early stage ($120K AUM, $42K ARR). No regulatory/compliance discussion.",

  collaboration: "Portfolio company synergy with Zengo (wallet infrastructure). AI agent integration opportunities. Cross-promotion with Notalone portfolio companies in crypto space."
};

// Helper to create rich text
function richText(text) {
  return [{ type: 'text', text: { content: text } }];
}

// Helper to create table cell
function tableCell(text) {
  return [{ type: 'text', text: { content: text } }];
}

async function updateBlock(blockId, blockType, content) {
  const updateData = {};

  if (blockType === 'paragraph') {
    updateData.paragraph = { rich_text: richText(content) };
  } else if (blockType === 'callout') {
    updateData.callout = { rich_text: richText(content) };
  } else if (blockType === 'quote') {
    updateData.quote = { rich_text: richText(content) };
  } else if (blockType === 'bulleted_list_item') {
    updateData.bulleted_list_item = { rich_text: richText(content) };
  } else if (blockType === 'numbered_list_item') {
    updateData.numbered_list_item = { rich_text: richText(content) };
  } else if (blockType === 'heading_3') {
    updateData.heading_3 = { rich_text: richText(content) };
  }

  try {
    await notion.blocks.update({
      block_id: blockId,
      ...updateData
    });
    console.log(`  [OK] Updated ${blockType}: ${content.substring(0, 50)}...`);
  } catch (error) {
    console.error(`  [ERROR] Failed to update ${blockId}: ${error.message}`);
  }
}

async function updateTableRow(rowId, cells) {
  try {
    await notion.blocks.update({
      block_id: rowId,
      table_row: {
        cells: cells.map(cell => tableCell(cell))
      }
    });
    console.log(`  [OK] Updated table row: ${cells[0].substring(0, 30)}...`);
  } catch (error) {
    console.error(`  [ERROR] Failed to update table row ${rowId}: ${error.message}`);
  }
}

async function appendBulletsToParent(parentId, bullets) {
  // First, delete existing children (empty bullet placeholder)
  try {
    const children = await notion.blocks.children.list({ block_id: parentId });
    for (const child of children.results) {
      await notion.blocks.delete({ block_id: child.id });
    }
  } catch (error) {
    console.log(`  Note: No existing children to delete for ${parentId}`);
  }

  // Append new bullets
  const bulletBlocks = bullets.map(text => ({
    type: 'bulleted_list_item',
    bulleted_list_item: { rich_text: richText(text) }
  }));

  try {
    await notion.blocks.children.append({
      block_id: parentId,
      children: bulletBlocks
    });
    console.log(`  [OK] Added ${bullets.length} bullets to parent`);
  } catch (error) {
    console.error(`  [ERROR] Failed to append bullets: ${error.message}`);
  }
}

async function main() {
  console.log('===========================================');
  console.log('  Template-Aware Notion Page Update');
  console.log('  Page: Milo (2c585dd502d581b8907bdc6683724f85)');
  console.log('===========================================\n');

  // Small delay helper
  const delay = ms => new Promise(r => setTimeout(r, ms));

  // 1. BLURB SECTION
  console.log('[1/10] Updating Blurb section...');
  await updateBlock(BLOCK_IDS.blurbCallout, 'callout', CONTENT.blurb);
  await delay(350);
  await updateBlock(BLOCK_IDS.teamParagraph, 'paragraph', CONTENT.team);
  await delay(350);
  await updateBlock(BLOCK_IDS.dealParagraph, 'paragraph', CONTENT.deal);
  await delay(350);

  // 2. COMPANY OVERVIEW
  console.log('\n[2/10] Updating Company Overview...');
  await updateBlock(BLOCK_IDS.whatTheyDoParagraph, 'paragraph', CONTENT.whatTheyDo);
  await delay(350);
  await updateBlock(BLOCK_IDS.problemParagraph, 'paragraph', CONTENT.problem);
  await delay(350);

  // 3. PRODUCT - VALUE PROPOSITION
  console.log('\n[3/10] Updating Product - Value Proposition...');
  await updateBlock(BLOCK_IDS.valuePropositionQuote, 'quote', CONTENT.valueProposition);
  await delay(350);

  // 4. PRODUCT - COMPONENTS
  console.log('\n[4/10] Updating Product - Components...');

  // Component 1: Smart Agent Wallet
  await updateBlock(BLOCK_IDS.component1Heading, 'heading_3', CONTENT.component1.name);
  await delay(350);
  await appendBulletsToParent(BLOCK_IDS.component1Heading, CONTENT.component1.bullets);
  await delay(350);

  // Component 2: AI Quant Engine
  await updateBlock(BLOCK_IDS.component2Heading, 'heading_3', CONTENT.component2.name);
  await delay(350);
  await appendBulletsToParent(BLOCK_IDS.component2Heading, CONTENT.component2.bullets);
  await delay(350);

  // Component 3: AutoMode
  await updateBlock(BLOCK_IDS.component3Heading, 'heading_3', CONTENT.component3.name);
  await delay(350);
  await appendBulletsToParent(BLOCK_IDS.component3Heading, CONTENT.component3.bullets);
  await delay(350);

  // 5. PRODUCT - FEATURES TABLE
  console.log('\n[5/10] Updating Features Table...');
  await updateTableRow(BLOCK_IDS.featuresRow1, CONTENT.features[0]);
  await delay(350);
  await updateTableRow(BLOCK_IDS.featuresRow2, CONTENT.features[1]);
  await delay(350);
  await updateTableRow(BLOCK_IDS.featuresRow3, CONTENT.features[2]);
  await delay(350);
  await updateTableRow(BLOCK_IDS.featuresRow4, CONTENT.features[3]);
  await delay(350);

  // 6. TARGET MARKET
  console.log('\n[6/10] Updating Target Market...');
  await updateBlock(BLOCK_IDS.primaryCustomersList, 'numbered_list_item', CONTENT.primaryCustomers);
  await delay(350);
  await updateBlock(BLOCK_IDS.marketSegmentsBullet, 'bulleted_list_item', CONTENT.marketSegments);
  await delay(350);
  await updateBlock(BLOCK_IDS.geographicFocusBullet, 'bulleted_list_item', CONTENT.geographicFocus);
  await delay(350);
  await updateBlock(BLOCK_IDS.customerCountBullet, 'bulleted_list_item', CONTENT.customerCount);
  await delay(350);

  // 7. BUSINESS MODEL
  console.log('\n[7/10] Updating Business Model...');
  await updateBlock(BLOCK_IDS.revenueModelBullet, 'bulleted_list_item', CONTENT.revenueModel);
  await delay(350);

  // 8. TECHNOLOGY
  console.log('\n[8/10] Updating Technology...');
  await updateBlock(BLOCK_IDS.coreTechParagraph, 'paragraph', CONTENT.coreTech);
  await delay(350);
  await updateBlock(BLOCK_IDS.techInfraBullet, 'bulleted_list_item', CONTENT.techInfra);
  await delay(350);
  await updateBlock(BLOCK_IDS.techStackBullet, 'bulleted_list_item', CONTENT.techStack);
  await delay(350);

  // 9. FUNDING/INVESTORS
  console.log('\n[9/10] Updating Funding/Investors...');
  await updateBlock(BLOCK_IDS.investorRosterParagraph, 'paragraph', CONTENT.investorRoster);
  await delay(350);
  await updateBlock(BLOCK_IDS.valuationBullet, 'bulleted_list_item', CONTENT.valuation);
  await delay(350);
  await updateBlock(BLOCK_IDS.useOfFundsBullet, 'bulleted_list_item', CONTENT.useOfFunds);
  await delay(350);

  // 10. COMPETITORS
  console.log('\n[10/10] Updating Competitors...');
  await updateBlock(BLOCK_IDS.directCompetitor1, 'bulleted_list_item', CONTENT.directCompetitors[0]);
  await delay(350);
  await updateBlock(BLOCK_IDS.directCompetitor2, 'bulleted_list_item', CONTENT.directCompetitors[1]);
  await delay(350);
  await updateBlock(BLOCK_IDS.competitiveAdvantagesList, 'numbered_list_item', CONTENT.competitiveAdvantages);
  await delay(350);
  await updateBlock(BLOCK_IDS.competitiveSummaryParagraph, 'paragraph', CONTENT.competitiveSummary);
  await delay(350);

  // 11. MARKET POSITION
  console.log('\n[11/10] Updating Market Position...');
  await updateBlock(BLOCK_IDS.positioningParagraph, 'paragraph', CONTENT.positioning);
  await delay(350);
  await updateBlock(BLOCK_IDS.competitiveMoatsList, 'numbered_list_item', CONTENT.competitiveMoats);
  await delay(350);
  await updateBlock(BLOCK_IDS.marketOpportunityBullet, 'bulleted_list_item', CONTENT.marketOpportunity);
  await delay(350);
  await updateBlock(BLOCK_IDS.risksList, 'numbered_list_item', CONTENT.risks);
  await delay(350);

  // 12. SWOT TABLES
  console.log('\n[12/10] Updating SWOT Tables...');
  // Strengths/Weaknesses table
  await updateTableRow(BLOCK_IDS.swotStrengthsRow1, [CONTENT.swotStrengths[0], CONTENT.swotWeaknesses[0]]);
  await delay(350);
  await updateTableRow(BLOCK_IDS.swotStrengthsRow2, [CONTENT.swotStrengths[1], CONTENT.swotWeaknesses[1]]);
  await delay(350);
  await updateTableRow(BLOCK_IDS.swotStrengthsRow3, [CONTENT.swotStrengths[2], CONTENT.swotWeaknesses[2]]);
  await delay(350);
  await updateTableRow(BLOCK_IDS.swotStrengthsRow4, [CONTENT.swotStrengths[3], CONTENT.swotWeaknesses[3]]);
  await delay(350);

  // Opportunities/Threats table
  await updateTableRow(BLOCK_IDS.swotOppRow1, [CONTENT.swotOpportunities[0], CONTENT.swotThreats[0]]);
  await delay(350);
  await updateTableRow(BLOCK_IDS.swotOppRow2, [CONTENT.swotOpportunities[1], CONTENT.swotThreats[1]]);
  await delay(350);
  await updateTableRow(BLOCK_IDS.swotOppRow3, [CONTENT.swotOpportunities[2], CONTENT.swotThreats[2]]);
  await delay(350);
  await updateTableRow(BLOCK_IDS.swotOppRow4, [CONTENT.swotOpportunities[3], CONTENT.swotThreats[3]]);
  await delay(350);

  // 13. NOTALONE SECTION
  console.log('\n[13/10] Updating NOTALONE & Zengo section...');
  await updateBlock(BLOCK_IDS.whyInterestingBullet, 'bulleted_list_item', CONTENT.whyInteresting);
  await delay(350);
  await updateBlock(BLOCK_IDS.concernsBullet, 'bulleted_list_item', CONTENT.concerns);
  await delay(350);
  await updateBlock(BLOCK_IDS.collaborationBullet, 'bulleted_list_item', CONTENT.collaboration);

  console.log('\n===========================================');
  console.log('  UPDATE COMPLETE!');
  console.log('  Page URL: https://www.notion.so/Milo-2c585dd502d581b8907bdc6683724f85');
  console.log('===========================================');
}

main().catch(console.error);
