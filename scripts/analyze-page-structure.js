#!/usr/bin/env node
/**
 * Analyze Notion Page Structure for Formatting Improvements
 * Fetches block structure and identifies formatting opportunities
 */

import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const PAGE_ID = '2c585dd502d581b8907bdc6683724f85';

// Sections we want to analyze
const TARGET_SECTIONS = ['Target Market', 'Business Model'];

async function fetchAllBlocks(blockId, depth = 0) {
  const blocks = [];
  let cursor = undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    });

    for (const block of response.results) {
      blocks.push({ ...block, depth });

      // Recursively fetch children if they exist
      if (block.has_children) {
        const children = await fetchAllBlocks(block.id, depth + 1);
        blocks.push(...children);
      }
    }

    cursor = response.next_cursor;
  } while (cursor);

  return blocks;
}

function extractText(richTextArray) {
  if (!richTextArray || !Array.isArray(richTextArray)) return '';
  return richTextArray.map(rt => rt.plain_text || '').join('');
}

function getBlockContent(block) {
  const type = block.type;
  const data = block[type];

  if (!data) return { type, content: '[no data]' };

  switch (type) {
    case 'paragraph':
    case 'heading_1':
    case 'heading_2':
    case 'heading_3':
    case 'bulleted_list_item':
    case 'numbered_list_item':
    case 'quote':
    case 'callout':
    case 'toggle':
      return {
        type,
        content: extractText(data.rich_text),
        color: data.color,
        icon: data.icon?.emoji || data.icon?.external?.url || null
      };
    case 'table':
      return {
        type,
        content: `Table: ${data.table_width} columns`,
        tableWidth: data.table_width,
        hasColumnHeader: data.has_column_header,
        hasRowHeader: data.has_row_header
      };
    case 'table_row':
      return {
        type,
        content: data.cells?.map(cell => extractText(cell)).join(' | ')
      };
    case 'divider':
      return { type, content: '---' };
    default:
      return { type, content: JSON.stringify(data).substring(0, 100) };
  }
}

async function analyzePageStructure() {
  console.log('='.repeat(80));
  console.log('NOTION PAGE STRUCTURE ANALYSIS');
  console.log('Page ID:', PAGE_ID);
  console.log('='.repeat(80));
  console.log('');

  try {
    // Get page info
    const page = await notion.pages.retrieve({ page_id: PAGE_ID });
    const title = page.properties?.title?.title?.[0]?.plain_text ||
                  page.properties?.Name?.title?.[0]?.plain_text ||
                  'Unknown';
    console.log('Page Title:', title);
    console.log('');

    // Fetch all blocks
    console.log('Fetching blocks...');
    const allBlocks = await fetchAllBlocks(PAGE_ID);
    console.log(`Total blocks: ${allBlocks.length}`);
    console.log('');

    // Find Target Market and Business Model sections
    let inTargetSection = null;
    let sectionBlocks = {
      'Target Market': [],
      'Business Model': []
    };

    for (const block of allBlocks) {
      const { type, content } = getBlockContent(block);

      // Check if this is a section header we care about
      if (type.startsWith('heading')) {
        const contentLower = content.toLowerCase();
        if (contentLower.includes('target market')) {
          inTargetSection = 'Target Market';
          sectionBlocks[inTargetSection].push({ block, type, content, depth: block.depth });
        } else if (contentLower.includes('business model')) {
          inTargetSection = 'Business Model';
          sectionBlocks[inTargetSection].push({ block, type, content, depth: block.depth });
        } else if (inTargetSection && type === 'heading_2') {
          // Another H2 means we've left our section
          inTargetSection = null;
        } else if (inTargetSection) {
          sectionBlocks[inTargetSection].push({ block, type, content, depth: block.depth });
        }
      } else if (inTargetSection) {
        sectionBlocks[inTargetSection].push({ block, type, content, depth: block.depth });
      }
    }

    // Output detailed analysis
    for (const section of TARGET_SECTIONS) {
      console.log('='.repeat(80));
      console.log(`SECTION: ${section}`);
      console.log('='.repeat(80));
      console.log(`Total blocks in section: ${sectionBlocks[section].length}`);
      console.log('');

      for (const { block, type, content, depth } of sectionBlocks[section]) {
        const indent = '  '.repeat(depth);
        const truncContent = content.length > 120 ? content.substring(0, 120) + '...' : content;
        console.log(`${indent}[${type}] ${truncContent}`);

        // Flag long content that should be broken up
        if (content.length > 100 && type === 'bulleted_list_item') {
          console.log(`${indent}  ^^^ WARNING: Long bullet point (${content.length} chars) - candidate for restructuring`);
        }

        // Check for numbered patterns that should be actual lists
        if (content.match(/1\.\s.*2\.\s.*3\./)) {
          console.log(`${indent}  ^^^ WARNING: Contains inline numbering - should be separate numbered list items`);
        }

        // Check for comma-separated lists
        if ((content.match(/,/g) || []).length >= 3) {
          console.log(`${indent}  ^^^ WARNING: Multiple comma-separated items - candidate for bullet list or table`);
        }
      }
      console.log('');
    }

    // Output block IDs for modification
    console.log('='.repeat(80));
    console.log('BLOCK IDs FOR MODIFICATION');
    console.log('='.repeat(80));

    for (const section of TARGET_SECTIONS) {
      console.log(`\n${section}:`);
      for (const { block, type, content } of sectionBlocks[section]) {
        if (content.length > 50) {
          console.log(`  ID: ${block.id}`);
          console.log(`  Type: ${type}`);
          console.log(`  Content preview: ${content.substring(0, 80)}...`);
          console.log('');
        }
      }
    }

    // Return data for further processing
    return { sectionBlocks, allBlocks };

  } catch (error) {
    console.error('Error:', error.message);
    if (error.code === 'object_not_found') {
      console.error('Page not found. Ensure the page is shared with the integration.');
    }
    throw error;
  }
}

// Run the analysis
analyzePageStructure()
  .then(() => console.log('\nAnalysis complete.'))
  .catch(err => process.exit(1));
