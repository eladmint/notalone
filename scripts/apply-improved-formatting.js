/**
 * Apply improved formatting to the original Milo page
 *
 * Target Page: https://www.notion.so/Milo-2c585dd502d581b8907bdc6683724f85
 *
 * Strategy:
 * - The page uses toggleable heading_2 for main sections
 * - Subsections are non-toggleable heading_3 followed by content blocks as siblings
 * - We need to delete old content blocks and insert new ones after each heading_3
 */

import { Client } from '@notionhq/client';
import 'dotenv/config';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Target page ID
const MILO_PAGE_ID = '2c585dd502d581b8907bdc6683724f85';

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

// Rate limiting delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get all children of a block
 */
async function getChildren(blockId) {
  const children = [];
  let cursor;

  do {
    await delay(350);
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100
    });

    children.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return children;
}

/**
 * Create the improved Primary Customers content
 */
function createPrimaryCustomersBlocks() {
  return [
    // Item 1: Crypto Traders
    {
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
    },
    // Item 2: DeFi Users
    {
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
    },
    // Item 3: Crypto Beginners
    {
      object: 'block',
      type: 'numbered_list_item',
      numbered_list_item: {
        rich_text: combinedText(boldText('Crypto Beginners')),
        children: [{
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: richText('Wanting simplified access')
          }
        }]
      }
    },
    // Item 4: Portfolio Managers
    {
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
    },
    // Blue callout for stat
    {
      object: 'block',
      type: 'callout',
      callout: {
        rich_text: richText('92% want simplified DeFi'),
        icon: { type: 'emoji', emoji: '💡' },
        color: 'blue_background'
      }
    }
  ];
}

/**
 * Create the improved Market Segments table
 */
function createMarketSegmentsBlocks() {
  return [
    {
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
    }
  ];
}

/**
 * Create the improved Geographic Focus callouts
 */
function createGeographicFocusBlocks() {
  return [
    // Primary Market Callout (yellow)
    {
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
    },
    // Secondary Markets Callout (gray)
    {
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
    }
  ];
}

/**
 * Create the improved Customer Metrics blocks
 */
function createCustomerMetricsBlocks() {
  return [
    // Overall active users callout
    {
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
    },
    // Metrics table
    {
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
    },
    // Retention callout (green)
    {
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
    }
  ];
}

/**
 * Create the improved Revenue Model blocks
 */
function createRevenueModelBlocks() {
  return [
    // Revenue callout (yellow)
    {
      object: 'block',
      type: 'callout',
      callout: {
        rich_text: combinedText(boldText('$3.5K MRR | $42K ARR run rate')),
        icon: { type: 'emoji', emoji: '💰' },
        color: 'yellow_background'
      }
    },
    // Spacing
    { object: 'block', type: 'paragraph', paragraph: { rich_text: [] } },
    // Numbered list: Revenue streams
    // 1. Trading Fees
    {
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
    },
    // 2. Subscription/Staking
    {
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
    },
    // 3. Premium Services
    {
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
    }
  ];
}

/**
 * Process a section: find headings and replace their following content
 */
async function processSection(sectionId, updates) {
  console.log('  Getting section children...');
  const children = await getChildren(sectionId);
  console.log(`  Found ${children.length} children`);

  // Map heading text to their position and following content
  const headingMap = {};
  for (let i = 0; i < children.length; i++) {
    const block = children[i];
    const text = block[block.type]?.rich_text?.map(t => t.plain_text).join('') || '';

    if (block.type === 'heading_3' && !block.heading_3?.is_toggleable) {
      headingMap[text.trim().toLowerCase()] = {
        headingIndex: i,
        headingId: block.id,
        headingText: text
      };
    }
  }

  // For each update, find the heading and determine content blocks to replace
  for (const [searchText, newBlocks] of Object.entries(updates)) {
    const key = searchText.toLowerCase();
    let headingInfo = null;

    // Find matching heading
    for (const [headingKey, info] of Object.entries(headingMap)) {
      if (headingKey.includes(key) || key.includes(headingKey)) {
        headingInfo = info;
        break;
      }
    }

    if (!headingInfo) {
      console.log(`  WARNING: Could not find heading for "${searchText}"`);
      continue;
    }

    console.log(`\n  Processing: ${headingInfo.headingText}`);

    // Find content blocks that follow this heading (until next heading or divider)
    const contentBlockIds = [];
    for (let i = headingInfo.headingIndex + 1; i < children.length; i++) {
      const block = children[i];
      // Stop at next heading or divider
      if (block.type.startsWith('heading_') || block.type === 'divider') {
        break;
      }
      contentBlockIds.push(block.id);
    }

    console.log(`    Found ${contentBlockIds.length} content blocks to replace`);

    // Delete old content blocks
    for (const blockId of contentBlockIds) {
      await delay(350);
      try {
        await notion.blocks.delete({ block_id: blockId });
        console.log(`    Deleted block ${blockId}`);
      } catch (err) {
        console.log(`    Failed to delete ${blockId}: ${err.message}`);
      }
    }

    // Append new blocks after the heading
    await delay(350);
    try {
      await notion.blocks.children.append({
        block_id: sectionId,
        children: newBlocks,
        after: headingInfo.headingId
      });
      console.log(`    Appended ${newBlocks.length} new blocks`);
    } catch (err) {
      console.log(`    Failed to append: ${err.message}`);
    }
  }
}

/**
 * Main function to apply improved formatting
 */
async function applyImprovedFormatting() {
  console.log('========================================');
  console.log('Applying Improved Formatting to Milo Page');
  console.log('========================================\n');

  // Step 1: Get top-level blocks to find Target Market and Business Model
  console.log('Step 1: Finding main sections...');
  const topBlocks = await getChildren(MILO_PAGE_ID);

  let targetMarketId = null;
  let businessModelId = null;

  for (const block of topBlocks) {
    const text = block[block.type]?.rich_text?.map(t => t.plain_text).join('') || '';
    if (text.toLowerCase().includes('target market') && block.type === 'heading_2') {
      targetMarketId = block.id;
      console.log(`  Found Target Market: ${block.id}`);
    }
    if (text.toLowerCase().includes('business model') && block.type === 'heading_2') {
      businessModelId = block.id;
      console.log(`  Found Business Model: ${block.id}`);
    }
  }

  if (!targetMarketId) {
    console.error('ERROR: Could not find Target Market section');
    process.exit(1);
  }
  if (!businessModelId) {
    console.error('ERROR: Could not find Business Model section');
    process.exit(1);
  }

  // Step 2: Update Target Market section
  console.log('\nStep 2: Updating Target Market section...');
  await processSection(targetMarketId, {
    'primary customer': createPrimaryCustomersBlocks(),
    'market segment': createMarketSegmentsBlocks(),
    'geographic': createGeographicFocusBlocks(),
    'customer count': createCustomerMetricsBlocks()
  });

  // Step 3: Update Business Model section
  console.log('\nStep 3: Updating Business Model section...');
  await processSection(businessModelId, {
    'revenue model': createRevenueModelBlocks()
  });

  console.log('\n========================================');
  console.log('Formatting applied successfully!');
  console.log(`View at: https://www.notion.so/Milo-${MILO_PAGE_ID.replace(/-/g, '')}`);
  console.log('========================================\n');
}

// Run
applyImprovedFormatting()
  .then(() => console.log('Done!'))
  .catch(err => {
    console.error('Error:', err.message);
    if (err.body) console.error('Details:', err.body);
    process.exit(1);
  });
