/**
 * Create Notion page with improved formatting demonstration
 * Shows proper use of numbered lists, tables, callouts, and groupings
 */

import { Client } from '@notionhq/client';
import 'dotenv/config';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Helper to create rich text
const richText = (content, annotations = {}) => [{
  type: 'text',
  text: { content },
  annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, ...annotations }
}];

// Helper to create bold text
const boldText = (content) => richText(content, { bold: true });

// Helper to combine multiple text segments
const combinedText = (...segments) => segments.flat();

async function createImprovedFormatPage() {
  console.log('Creating improved format demonstration page...');

  // Step 1: Search for a suitable parent (workspace or Opportunities database)
  // We'll create as a standalone page in the workspace

  // First, let's find the parent page ID from config
  const parentPageId = '2c585dd502d580739744f33cc9bd2859';

  // Create the new page as a child of the workspace
  const newPage = await notion.pages.create({
    parent: {
      page_id: parentPageId,
    },
    icon: {
      type: 'emoji',
      emoji: '📊'
    },
    properties: {
      title: {
        title: richText('Milo - Improved Format Example')
      }
    }
  });

  const pageId = newPage.id;
  console.log(`Created page: ${pageId}`);

  // Build all the content blocks
  const blocks = [];

  // ==========================================
  // SECTION 1: TARGET MARKET
  // ==========================================

  // Main heading
  blocks.push({
    object: 'block',
    type: 'heading_1',
    heading_1: { rich_text: richText('Target Market') }
  });

  // Divider for visual separation
  blocks.push({ object: 'block', type: 'divider', divider: {} });

  // Sub-heading: Primary Customers
  blocks.push({
    object: 'block',
    type: 'heading_2',
    heading_2: { rich_text: richText('Primary Customers') }
  });

  // Numbered list items with proper formatting
  // Item 1: Crypto Traders
  blocks.push({
    object: 'block',
    type: 'numbered_list_item',
    numbered_list_item: {
      rich_text: combinedText(boldText('Crypto Traders')),
      children: [{
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: richText('Active traders seeking to reduce complexity')
        }
      }]
    }
  });

  // Item 2: DeFi Users
  blocks.push({
    object: 'block',
    type: 'numbered_list_item',
    numbered_list_item: {
      rich_text: combinedText(boldText('DeFi Users')),
      children: [{
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: richText('Struggling with fragmented protocols')
        }
      }]
    }
  });

  // Item 3: Crypto Beginners (with callout)
  blocks.push({
    object: 'block',
    type: 'numbered_list_item',
    numbered_list_item: {
      rich_text: combinedText(boldText('Crypto Beginners')),
      children: [
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: richText('Wanting simplified access')
          }
        },
        {
          object: 'block',
          type: 'callout',
          callout: {
            rich_text: richText('92% want simplified DeFi'),
            icon: { type: 'emoji', emoji: '💡' },
            color: 'blue_background'
          }
        }
      ]
    }
  });

  // Item 4: Portfolio Managers
  blocks.push({
    object: 'block',
    type: 'numbered_list_item',
    numbered_list_item: {
      rich_text: combinedText(boldText('Portfolio Managers')),
      children: [{
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: richText('Managing multiple positions across chains')
        }
      }]
    }
  });

  // Spacing
  blocks.push({ object: 'block', type: 'paragraph', paragraph: { rich_text: [] } });

  // Sub-heading: Market Segments
  blocks.push({
    object: 'block',
    type: 'heading_2',
    heading_2: { rich_text: richText('Market Segments') }
  });

  // Table: Market Segments
  blocks.push({
    object: 'block',
    type: 'table',
    table: {
      table_width: 4,
      has_column_header: true,
      has_row_header: false,
      children: [
        // Header row
        {
          object: 'block',
          type: 'table_row',
          table_row: {
            cells: [
              richText('Segment'),
              richText('Risk Level'),
              richText('AUM'),
              richText('Notes')
            ]
          }
        },
        // Data rows
        {
          object: 'block',
          type: 'table_row',
          table_row: {
            cells: [
              richText('Low Risk'),
              richText('Conservative'),
              richText('~$10K'),
              richText('Entry level')
            ]
          }
        },
        {
          object: 'block',
          type: 'table_row',
          table_row: {
            cells: [
              richText('Medium Risk'),
              richText('Moderate'),
              richText('~$70K'),
              richText('Largest segment')
            ]
          }
        },
        {
          object: 'block',
          type: 'table_row',
          table_row: {
            cells: [
              richText('High Risk'),
              richText('Aggressive'),
              richText('~$22K'),
              richText('Active traders')
            ]
          }
        }
      ]
    }
  });

  // Spacing
  blocks.push({ object: 'block', type: 'paragraph', paragraph: { rich_text: [] } });

  // Sub-heading: Geographic Focus
  blocks.push({
    object: 'block',
    type: 'heading_2',
    heading_2: { rich_text: richText('Geographic Focus') }
  });

  // Primary Market Callout (yellow)
  blocks.push({
    object: 'block',
    type: 'callout',
    callout: {
      rich_text: combinedText(
        boldText('Primary Market'),
        richText('\nUnited States - 89 users, $22K AUM (largest)')
      ),
      icon: { type: 'emoji', emoji: '🎯' },
      color: 'yellow_background'
    }
  });

  // Secondary Markets Callout (gray)
  blocks.push({
    object: 'block',
    type: 'callout',
    callout: {
      rich_text: combinedText(boldText('Secondary Markets')),
      icon: { type: 'emoji', emoji: '🌍' },
      color: 'gray_background',
      children: [
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: richText('Europe: Australia (16), Germany (17), Israel (13), Spain (7)')
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: richText('Also: Singapore, UK, France, Norway, Italy')
          }
        }
      ]
    }
  });

  // Spacing
  blocks.push({ object: 'block', type: 'paragraph', paragraph: { rich_text: [] } });

  // Sub-heading: Customer Metrics
  blocks.push({
    object: 'block',
    type: 'heading_2',
    heading_2: { rich_text: richText('Customer Metrics') }
  });

  // Overall active users callout
  blocks.push({
    object: 'block',
    type: 'callout',
    callout: {
      rich_text: combinedText(
        boldText('712K'),
        richText(' overall active users')
      ),
      icon: { type: 'emoji', emoji: '🔢' },
      color: 'blue_background'
    }
  });

  // Metrics table
  blocks.push({
    object: 'block',
    type: 'table',
    table: {
      table_width: 2,
      has_column_header: true,
      has_row_header: false,
      children: [
        {
          object: 'block',
          type: 'table_row',
          table_row: {
            cells: [richText('Metric'), richText('Value')]
          }
        },
        {
          object: 'block',
          type: 'table_row',
          table_row: {
            cells: [richText('WAU'), richText('2,480')]
          }
        },
        {
          object: 'block',
          type: 'table_row',
          table_row: {
            cells: [richText('DAU'), richText('562')]
          }
        },
        {
          object: 'block',
          type: 'table_row',
          table_row: {
            cells: [richText('Active Auto Traders'), richText('314 (>=1 SOL)')]
          }
        }
      ]
    }
  });

  // Retention callout (green)
  blocks.push({
    object: 'block',
    type: 'callout',
    callout: {
      rich_text: combinedText(
        boldText('Retention: '),
        richText('81% monthly, ~50% daily')
      ),
      icon: { type: 'emoji', emoji: '✅' },
      color: 'green_background'
    }
  });

  // ==========================================
  // SECTION 2: BUSINESS MODEL
  // ==========================================

  // Divider
  blocks.push({ object: 'block', type: 'divider', divider: {} });

  // Main heading
  blocks.push({
    object: 'block',
    type: 'heading_1',
    heading_1: { rich_text: richText('Business Model') }
  });

  // Divider
  blocks.push({ object: 'block', type: 'divider', divider: {} });

  // Sub-heading: Revenue Snapshot
  blocks.push({
    object: 'block',
    type: 'heading_2',
    heading_2: { rich_text: richText('Revenue Snapshot') }
  });

  // Revenue callout (yellow)
  blocks.push({
    object: 'block',
    type: 'callout',
    callout: {
      rich_text: combinedText(boldText('$3.5K MRR | $42K ARR run rate')),
      icon: { type: 'emoji', emoji: '💰' },
      color: 'yellow_background'
    }
  });

  // Spacing
  blocks.push({ object: 'block', type: 'paragraph', paragraph: { rich_text: [] } });

  // Sub-heading: Revenue Streams
  blocks.push({
    object: 'block',
    type: 'heading_2',
    heading_2: { rich_text: richText('Revenue Streams') }
  });

  // Numbered list: Revenue streams
  // 1. Trading Fees
  blocks.push({
    object: 'block',
    type: 'numbered_list_item',
    numbered_list_item: {
      rich_text: combinedText(
        boldText('Trading Fees'),
        richText(' (~0.77% implied rate)')
      ),
      children: [{
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: richText('$10K generated on $1.3M volume')
        }
      }]
    }
  });

  // 2. Subscription/Staking
  blocks.push({
    object: 'block',
    type: 'numbered_list_item',
    numbered_list_item: {
      rich_text: combinedText(boldText('Subscription/Staking')),
      children: [{
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: richText('Advanced Auto Trader features require token staking')
        }
      }]
    }
  });

  // 3. Premium Services
  blocks.push({
    object: 'block',
    type: 'numbered_list_item',
    numbered_list_item: {
      rich_text: combinedText(
        boldText('Premium Services'),
        richText(' (future)')
      ),
      children: [{
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: richText('Additional value-added services')
        }
      }]
    }
  });

  // Final divider
  blocks.push({ object: 'block', type: 'divider', divider: {} });

  // Footer note
  blocks.push({
    object: 'block',
    type: 'callout',
    callout: {
      rich_text: combinedText(
        boldText('Format Improvements Demonstrated:'),
        richText('\n- Proper numbered lists (not bullets for sequential items)\n- Tables for structured data\n- Callouts with colors for key metrics\n- Nested content for related information\n- Visual hierarchy with headings and dividers')
      ),
      icon: { type: 'emoji', emoji: '📝' },
      color: 'purple_background'
    }
  });

  // Append all blocks to the page
  console.log(`Appending ${blocks.length} blocks...`);

  // Notion API limits blocks per request, so we batch
  const batchSize = 100;
  for (let i = 0; i < blocks.length; i += batchSize) {
    const batch = blocks.slice(i, i + batchSize);
    await notion.blocks.children.append({
      block_id: pageId,
      children: batch
    });
    console.log(`  Appended blocks ${i + 1} to ${Math.min(i + batchSize, blocks.length)}`);
  }

  // Get the page URL
  const pageUrl = `https://www.notion.so/${pageId.replace(/-/g, '')}`;

  console.log('\n========================================');
  console.log('Page created successfully!');
  console.log(`Page ID: ${pageId}`);
  console.log(`URL: ${pageUrl}`);
  console.log('========================================\n');

  return { pageId, url: pageUrl };
}

// Run
createImprovedFormatPage()
  .then(result => {
    console.log('Done!');
    console.log(`View page at: ${result.url}`);
  })
  .catch(err => {
    console.error('Error:', err.message);
    if (err.body) console.error('Details:', err.body);
    process.exit(1);
  });
