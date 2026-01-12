/**
 * Add Process Overview Content to Deal Flow System Page
 *
 * This script adds explanatory content about the 8-stage deal flow process
 * to the NOTALONE Deal Flow System page.
 *
 * Usage:
 *   node scripts/add-process-overview.js <page-id>
 */

import 'dotenv/config';
import { Client } from '@notionhq/client';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const PAGE_ID = process.argv[2] || '2d960b6e-8d18-81c2-b139-e9a8d37d70b9';

async function addProcessOverview(notion, pageId) {
  console.log('\n=== Adding Process Overview Content ===');
  console.log('Page ID:', pageId);

  try {
    await notion.blocks.children.append({
      block_id: pageId,
      children: [
        // Main heading
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [{ type: 'text', text: { content: 'Process Overview' } }]
          }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: { content: 'This system tracks deals through 8 stages from initial sourcing to exit:' }
              }
            ]
          }
        },
        {
          object: 'block',
          type: 'divider',
          divider: {}
        },

        // The 8 Stages section
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'The 8 Stages' } }]
          }
        },
        {
          object: 'block',
          type: 'table',
          table: {
            table_width: 3,
            has_column_header: true,
            has_row_header: false,
            children: [
              // Header row
              {
                type: 'table_row',
                table_row: {
                  cells: [
                    [{ type: 'text', text: { content: 'Stage' }, annotations: { bold: true } }],
                    [{ type: 'text', text: { content: 'Purpose' }, annotations: { bold: true } }],
                    [{ type: 'text', text: { content: 'Deliverable' }, annotations: { bold: true } }]
                  ]
                }
              },
              // Data rows
              {
                type: 'table_row',
                table_row: {
                  cells: [
                    [{ type: 'text', text: { content: '1. Sourcing' } }],
                    [{ type: 'text', text: { content: 'Initial deal identification' } }],
                    [{ type: 'text', text: { content: 'Deal log entry' } }]
                  ]
                }
              },
              {
                type: 'table_row',
                table_row: {
                  cells: [
                    [{ type: 'text', text: { content: '2. Screening' } }],
                    [{ type: 'text', text: { content: '30-min call, quick filter' } }],
                    [{ type: 'text', text: { content: 'Screening memo' } }]
                  ]
                }
              },
              {
                type: 'table_row',
                table_row: {
                  cells: [
                    [{ type: 'text', text: { content: '3. Due Diligence' } }],
                    [{ type: 'text', text: { content: 'Deep dive on token + growth fit' } }],
                    [{ type: 'text', text: { content: 'DD report' } }]
                  ]
                }
              },
              {
                type: 'table_row',
                table_row: {
                  cells: [
                    [{ type: 'text', text: { content: '4. Investment Committee' } }],
                    [{ type: 'text', text: { content: 'Decision with scoring' } }],
                    [{ type: 'text', text: { content: 'IC decision' } }]
                  ]
                }
              },
              {
                type: 'table_row',
                table_row: {
                  cells: [
                    [{ type: 'text', text: { content: '5. Structuring' } }],
                    [{ type: 'text', text: { content: 'Terms + Growth Assets lock' } }],
                    [{ type: 'text', text: { content: 'Signed agreements' } }]
                  ]
                }
              },
              {
                type: 'table_row',
                table_row: {
                  cells: [
                    [{ type: 'text', text: { content: '6. Onboarding' } }],
                    [{ type: 'text', text: { content: 'Kickoff, asset collection' } }],
                    [{ type: 'text', text: { content: 'First activation scheduled' } }]
                  ]
                }
              },
              {
                type: 'table_row',
                table_row: {
                  cells: [
                    [{ type: 'text', text: { content: '7. Active' } }],
                    [{ type: 'text', text: { content: 'Growth Assets delivery' } }],
                    [{ type: 'text', text: { content: 'Activation reports' } }]
                  ]
                }
              },
              {
                type: 'table_row',
                table_row: {
                  cells: [
                    [{ type: 'text', text: { content: '8. Exit' } }],
                    [{ type: 'text', text: { content: 'Monitoring and liquidation' } }],
                    [{ type: 'text', text: { content: 'Exit execution' } }]
                  ]
                }
              }
            ]
          }
        },

        // Deal Classifications
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Deal Classifications' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              { type: 'text', text: { content: 'OTC + Growth Assets' }, annotations: { bold: true } },
              { type: 'text', text: { content: ': Needs capital + active growth support → Full process' } }
            ]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              { type: 'text', text: { content: 'OTC Only' }, annotations: { bold: true } },
              { type: 'text', text: { content: ': Capital need, limited Growth Assets engagement → Simplified DD' } }
            ]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              { type: 'text', text: { content: 'Services First' }, annotations: { bold: true } },
              { type: 'text', text: { content: ': Not ready for investment → Refer to Services team' } }
            ]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              { type: 'text', text: { content: 'Pass' }, annotations: { bold: true } },
              { type: 'text', text: { content: ': Doesn\'t fit criteria → Decline with feedback' } }
            ]
          }
        },

        // Key Criteria
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Key Criteria' } }]
          }
        },
        {
          object: 'block',
          type: 'heading_3',
          heading_3: {
            rich_text: [{ type: 'text', text: { content: 'Quick Filter (Sourcing):' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Post-TGE with live token' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Market cap $10M - $500M' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Daily volume >$100K' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Team responds within 48 hours' } }]
          }
        },

        {
          object: 'block',
          type: 'heading_3',
          heading_3: {
            rich_text: [{ type: 'text', text: { content: 'Screening Pass/Fail:' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Clear growth gap (adoption, BD, ecosystem)' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Team willing to engage with Growth Assets' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'No major token unlocks in 6 months' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Differentiated product/narrative' } }]
          }
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Clean cap table' } }]
          }
        },

        {
          object: 'block',
          type: 'callout',
          callout: {
            icon: { type: 'emoji', emoji: '🎯' },
            color: 'blue_background',
            rich_text: [
              { type: 'text', text: { content: 'IC Minimum Score: ' }, annotations: { bold: true } },
              { type: 'text', text: { content: '3.5 out of 5.0 to proceed' } }
            ]
          }
        },

        // How to Use
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'How to Use' } }]
          }
        },
        {
          object: 'block',
          type: 'numbered_list_item',
          numbered_list_item: {
            rich_text: [
              { type: 'text', text: { content: 'New Deal' }, annotations: { bold: true } },
              { type: 'text', text: { content: ': Add to Pipeline database with source and basic info' } }
            ]
          }
        },
        {
          object: 'block',
          type: 'numbered_list_item',
          numbered_list_item: {
            rich_text: [
              { type: 'text', text: { content: 'After Screening Call' }, annotations: { bold: true } },
              { type: 'text', text: { content: ': Create Screening Memo, link to deal' } }
            ]
          }
        },
        {
          object: 'block',
          type: 'numbered_list_item',
          numbered_list_item: {
            rich_text: [
              { type: 'text', text: { content: 'During DD' }, annotations: { bold: true } },
              { type: 'text', text: { content: ': Create DD Tracker entry, check off areas as complete' } }
            ]
          }
        },
        {
          object: 'block',
          type: 'numbered_list_item',
          numbered_list_item: {
            rich_text: [
              { type: 'text', text: { content: 'For IC' }, annotations: { bold: true } },
              { type: 'text', text: { content: ': Create IC Decision record with scores' } }
            ]
          }
        },
        {
          object: 'block',
          type: 'numbered_list_item',
          numbered_list_item: {
            rich_text: [
              { type: 'text', text: { content: 'Post-Investment' }, annotations: { bold: true } },
              { type: 'text', text: { content: ': Create Activation records for each conference' } }
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
          type: 'callout',
          callout: {
            icon: { type: 'emoji', emoji: '🔗' },
            color: 'gray_background',
            rich_text: [
              { type: 'text', text: { content: 'All databases are linked via relations to track the complete deal journey.' } }
            ]
          }
        }
      ]
    });

    console.log('✅ Process overview content added successfully!');

  } catch (error) {
    console.error('❌ Error adding content:', error.message);
    console.error('Code:', error.code);
    if (error.body) {
      console.error('Body:', JSON.stringify(error.body, null, 2));
    }
    throw error;
  }
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  Add Process Overview to Deal Flow System Page        ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  if (!NOTION_TOKEN) {
    console.error('\n❌ ERROR: NOTION_TOKEN not found');
    process.exit(1);
  }

  const notion = new Client({ auth: NOTION_TOKEN });

  try {
    await addProcessOverview(notion, PAGE_ID);

    console.log('\n✅ Done! Process overview added to page.');
    console.log('\n🎯 Next: Open page in Notion to review:');
    console.log(`https://www.notion.so/${PAGE_ID.replace(/-/g, '')}`);
    console.log('');

  } catch (error) {
    console.error('\n❌ Failed to add content');
    process.exit(1);
  }
}

main();
