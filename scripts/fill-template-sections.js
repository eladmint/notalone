/**
 * Template-Aware Content Filler
 *
 * This script fills a Notion template page with content from a markdown file
 * by finding toggleable headings and appending content as children.
 *
 * Strategy:
 * 1. Parse markdown to identify sections
 * 2. Fetch page blocks to find toggleable headings
 * 3. For each matching section, append content as children of the toggle
 * 4. Special handling for Blurb callout (executive summary)
 */

import 'dotenv/config';
import { Client } from '@notionhq/client';
import { readFileSync } from 'fs';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const notion = new Client({ auth: NOTION_TOKEN });

// Configuration - can be passed as arguments or hardcoded
const PAGE_ID = process.argv[2] || '2c585dd5-02d5-816a-8700-cf7892c8d9bb';
const MARKDOWN_FILE = process.argv[3] || '/Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/milo/research.md';
const NEW_TITLE = process.argv[4] || 'Milo';

// Section mapping: template heading -> markdown section patterns
const SECTION_MAPPING = {
  'Company Overview': ['Company Overview', '1. Company Overview'],
  'Product': ['Product/Service', 'Product', '2. Product/Service', '2. Product'],
  'Target Market': ['Target Market', '3. Target Market'],
  'Business Model': ['Business Model', '4. Business Model'],
  'Technology': ['Technology', '5. Technology'],
  'Team': ['Team/Leadership', 'Team', '6. Team/Leadership', '6. Team'],
  'Funding/Investors': ['Funding/Investors', 'Funding', '7. Funding/Investors', '7. Funding'],
  'Token Economics': ['Token Economics', '7b. Token Economics'],
  'Competitors': ['Competitors', '8. Competitors'],
  'Market Position': ['Market Position', '10. Market Position'],
  'Recent News': ['Recent News/Developments', '9. Recent News/Developments'],
  'Investment Fit': ['Investment Fit Assessment', '11. Investment Fit Assessment'],
};

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Parse markdown file into sections
 */
function parseMarkdownSections(markdownContent) {
  const sections = {};
  const lines = markdownContent.split('\n');

  let currentSection = null;
  let currentContent = [];

  for (const line of lines) {
    // Check for H2 headers (## Section Name)
    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      // Save previous section
      if (currentSection) {
        sections[currentSection] = currentContent.join('\n').trim();
      }
      currentSection = h2Match[1].trim();
      currentContent = [];
      continue;
    }

    if (currentSection) {
      currentContent.push(line);
    }
  }

  // Save last section
  if (currentSection) {
    sections[currentSection] = currentContent.join('\n').trim();
  }

  return sections;
}

/**
 * Extract executive summary from markdown
 */
function extractExecutiveSummary(markdownContent) {
  const lines = markdownContent.split('\n');
  let inSummary = false;
  let summaryLines = [];

  for (const line of lines) {
    if (line.match(/^##\s+Executive Summary/)) {
      inSummary = true;
      continue;
    }
    if (inSummary && line.match(/^##\s+/)) {
      break;
    }
    if (inSummary) {
      summaryLines.push(line);
    }
  }

  return summaryLines.join('\n').trim();
}

/**
 * Convert markdown to Notion blocks
 */
function markdownToBlocks(markdown) {
  const blocks = [];
  const lines = markdown.split('\n');

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (!line.trim()) {
      i++;
      continue;
    }

    // H3 headers
    const h3Match = line.match(/^###\s+(.+)$/);
    if (h3Match) {
      blocks.push({
        type: 'heading_3',
        heading_3: {
          rich_text: [{ type: 'text', text: { content: h3Match[1] } }],
          color: 'default'
        }
      });
      i++;
      continue;
    }

    // H4 headers
    const h4Match = line.match(/^####\s+(.+)$/);
    if (h4Match) {
      blocks.push({
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: h4Match[1] }, annotations: { bold: true } }],
          color: 'default'
        }
      });
      i++;
      continue;
    }

    // Bulleted list items
    const bulletMatch = line.match(/^[-*]\s+(.+)$/);
    if (bulletMatch) {
      const content = parseInlineFormatting(bulletMatch[1]);
      blocks.push({
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: content,
          color: 'default'
        }
      });
      i++;
      continue;
    }

    // Numbered list items
    const numberMatch = line.match(/^\d+\.\s+(.+)$/);
    if (numberMatch) {
      const content = parseInlineFormatting(numberMatch[1]);
      blocks.push({
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: content,
          color: 'default'
        }
      });
      i++;
      continue;
    }

    // Checkbox items
    const checkMatch = line.match(/^-\s+\[([ xX])\]\s+(.+)$/);
    if (checkMatch) {
      blocks.push({
        type: 'to_do',
        to_do: {
          rich_text: parseInlineFormatting(checkMatch[2]),
          checked: checkMatch[1].toLowerCase() === 'x',
          color: 'default'
        }
      });
      i++;
      continue;
    }

    // Table detection
    if (line.includes('|') && lines[i + 1]?.includes('|') && lines[i + 1]?.includes('-')) {
      const tableResult = parseTable(lines, i);
      if (tableResult.block) {
        blocks.push(tableResult.block);
      }
      i = tableResult.nextIndex;
      continue;
    }

    // Quote blocks
    if (line.startsWith('>')) {
      blocks.push({
        type: 'quote',
        quote: {
          rich_text: parseInlineFormatting(line.substring(1).trim()),
          color: 'default'
        }
      });
      i++;
      continue;
    }

    // Code blocks
    if (line.startsWith('```')) {
      const codeLines = [];
      const language = line.substring(3).trim() || 'plain text';
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({
        type: 'code',
        code: {
          rich_text: [{ type: 'text', text: { content: codeLines.join('\n') } }],
          language: language
        }
      });
      i++;
      continue;
    }

    // [Confidence: XXX] tags - convert to callout
    const confidenceMatch = line.match(/^\[Confidence:\s*(\w+)\]$/);
    if (confidenceMatch) {
      blocks.push({
        type: 'callout',
        callout: {
          rich_text: [{ type: 'text', text: { content: `Confidence: ${confidenceMatch[1]}` } }],
          icon: { type: 'emoji', emoji: getConfidenceEmoji(confidenceMatch[1]) },
          color: 'gray_background'
        }
      });
      i++;
      continue;
    }

    // Regular paragraph
    const content = parseInlineFormatting(line);
    if (content.length > 0 && content[0].text?.content?.trim()) {
      blocks.push({
        type: 'paragraph',
        paragraph: {
          rich_text: content,
          color: 'default'
        }
      });
    }
    i++;
  }

  return blocks;
}

function getConfidenceEmoji(level) {
  switch (level.toUpperCase()) {
    case 'HIGH': return '\u2705'; // checkmark
    case 'MEDIUM': return '\u26A0\uFE0F'; // warning
    case 'MEDIUM-HIGH': return '\u2705';
    case 'LOW': return '\u274C'; // x
    default: return '\u2139\uFE0F'; // info
  }
}

/**
 * Parse inline formatting (bold, italic, links, etc.)
 */
function parseInlineFormatting(text) {
  const richText = [];

  // Simple regex-based parsing for common patterns
  // Pattern: **bold**, *italic*, `code`, [link](url)
  const patterns = [
    { regex: /\*\*(.+?)\*\*/g, annotation: 'bold' },
    { regex: /\*(.+?)\*/g, annotation: 'italic' },
    { regex: /`(.+?)`/g, annotation: 'code' },
  ];

  // For simplicity, we'll handle basic cases
  // Replace links first
  let processedText = text;
  const links = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  while ((match = linkRegex.exec(text)) !== null) {
    links.push({ text: match[1], url: match[2], fullMatch: match[0] });
  }

  // If there are links, process them
  if (links.length > 0) {
    let lastIndex = 0;
    for (const link of links) {
      const startIndex = text.indexOf(link.fullMatch, lastIndex);
      if (startIndex > lastIndex) {
        const beforeText = text.substring(lastIndex, startIndex);
        if (beforeText.trim()) {
          richText.push(...parseTextWithAnnotations(beforeText));
        }
      }
      richText.push({
        type: 'text',
        text: { content: link.text, link: { url: link.url } }
      });
      lastIndex = startIndex + link.fullMatch.length;
    }
    if (lastIndex < text.length) {
      const afterText = text.substring(lastIndex);
      if (afterText.trim()) {
        richText.push(...parseTextWithAnnotations(afterText));
      }
    }
    return richText;
  }

  return parseTextWithAnnotations(text);
}

function parseTextWithAnnotations(text) {
  const richText = [];

  // Simple approach: split by bold markers first
  const boldParts = text.split(/\*\*(.+?)\*\*/);
  let isBold = false;

  for (let i = 0; i < boldParts.length; i++) {
    const part = boldParts[i];
    if (!part) {
      isBold = !isBold;
      continue;
    }

    if (i % 2 === 1) {
      // This is bold text
      richText.push({
        type: 'text',
        text: { content: part },
        annotations: { bold: true }
      });
    } else {
      // Regular text - check for other formatting
      const italicParts = part.split(/\*(.+?)\*/);
      for (let j = 0; j < italicParts.length; j++) {
        const iPart = italicParts[j];
        if (!iPart) continue;

        if (j % 2 === 1) {
          richText.push({
            type: 'text',
            text: { content: iPart },
            annotations: { italic: true }
          });
        } else {
          // Check for code
          const codeParts = iPart.split(/`(.+?)`/);
          for (let k = 0; k < codeParts.length; k++) {
            const cPart = codeParts[k];
            if (!cPart) continue;

            if (k % 2 === 1) {
              richText.push({
                type: 'text',
                text: { content: cPart },
                annotations: { code: true }
              });
            } else if (cPart) {
              richText.push({
                type: 'text',
                text: { content: cPart }
              });
            }
          }
        }
      }
    }
  }

  if (richText.length === 0 && text.trim()) {
    richText.push({
      type: 'text',
      text: { content: text }
    });
  }

  return richText;
}

/**
 * Parse markdown table
 */
function parseTable(lines, startIndex) {
  const headerLine = lines[startIndex];
  const separatorLine = lines[startIndex + 1];

  if (!headerLine || !separatorLine) {
    return { block: null, nextIndex: startIndex + 1 };
  }

  const headers = headerLine.split('|').filter(cell => cell.trim()).map(cell => cell.trim());
  const tableWidth = headers.length;

  const rows = [];

  // Header row
  rows.push({
    type: 'table_row',
    table_row: {
      cells: headers.map(header => [{ type: 'text', text: { content: header } }])
    }
  });

  // Data rows
  let i = startIndex + 2;
  while (i < lines.length && lines[i].includes('|')) {
    const cells = lines[i].split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim());
    if (cells.length > 0) {
      // Pad cells to match table width
      while (cells.length < tableWidth) {
        cells.push('');
      }
      rows.push({
        type: 'table_row',
        table_row: {
          cells: cells.slice(0, tableWidth).map(cell => [{ type: 'text', text: { content: cell } }])
        }
      });
    }
    i++;
  }

  if (rows.length < 2) {
    return { block: null, nextIndex: i };
  }

  return {
    block: {
      type: 'table',
      table: {
        table_width: tableWidth,
        has_column_header: true,
        has_row_header: false,
        children: rows
      }
    },
    nextIndex: i
  };
}

/**
 * Fetch all blocks from a page with pagination
 */
async function fetchAllBlocks(blockId) {
  const blocks = [];
  let cursor;

  do {
    await delay(350);
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100
    });

    for (const block of response.results) {
      const blockWithChildren = { ...block };
      if (block.has_children && !['child_database', 'child_page'].includes(block.type)) {
        blockWithChildren.children = await fetchAllBlocks(block.id);
      }
      blocks.push(blockWithChildren);
    }
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return blocks;
}

/**
 * Find toggleable headings in the page structure
 */
function findToggleHeadings(blocks, results = []) {
  for (const block of blocks) {
    const type = block.type;

    // Check for toggleable headings (heading with is_toggleable = true)
    if (['heading_1', 'heading_2', 'heading_3'].includes(type)) {
      const content = block[type];
      if (content.is_toggleable) {
        const text = content.rich_text?.map(t => t.plain_text).join('') || '';
        results.push({
          id: block.id,
          type: type,
          text: text,
          block: block
        });
      }
    }

    // Check for toggle blocks
    if (type === 'toggle') {
      const text = block.toggle?.rich_text?.map(t => t.plain_text).join('') || '';
      results.push({
        id: block.id,
        type: 'toggle',
        text: text,
        block: block
      });
    }

    // Check for callouts (for Blurb)
    if (type === 'callout') {
      const text = block.callout?.rich_text?.map(t => t.plain_text).join('') || '';
      if (text.toLowerCase().includes('blurb')) {
        results.push({
          id: block.id,
          type: 'callout',
          text: text,
          block: block,
          isBlurb: true
        });
      }
    }

    // Recurse into children
    if (block.children) {
      findToggleHeadings(block.children, results);
    }
  }

  return results;
}

/**
 * Delete existing children from a block
 */
async function deleteBlockChildren(blockId) {
  await delay(350);
  const response = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 100
  });

  for (const child of response.results) {
    await delay(350);
    try {
      await notion.blocks.delete({ block_id: child.id });
    } catch (error) {
      console.log(`    Warning: Could not delete block ${child.id}: ${error.message}`);
    }
  }
}

/**
 * Append blocks to a parent in batches
 */
async function appendBlocksInBatches(parentId, blocks, batchSize = 50) {
  for (let i = 0; i < blocks.length; i += batchSize) {
    const batch = blocks.slice(i, i + batchSize);
    await delay(350);
    await notion.blocks.children.append({
      block_id: parentId,
      children: batch
    });
    console.log(`    Appended ${batch.length} blocks (${i + batch.length}/${blocks.length})`);
  }
}

/**
 * Match template heading to markdown section
 */
function matchSectionToHeading(headingText, sections) {
  // Check direct mapping
  for (const [templateKey, markdownKeys] of Object.entries(SECTION_MAPPING)) {
    if (headingText.includes(templateKey)) {
      for (const mdKey of markdownKeys) {
        if (sections[mdKey]) {
          return { key: mdKey, content: sections[mdKey] };
        }
      }
    }
  }

  // Try fuzzy matching
  for (const sectionKey of Object.keys(sections)) {
    const normalizedHeading = headingText.toLowerCase().replace(/[^a-z]/g, '');
    const normalizedSection = sectionKey.toLowerCase().replace(/[^a-z]/g, '');
    if (normalizedHeading.includes(normalizedSection) || normalizedSection.includes(normalizedHeading)) {
      return { key: sectionKey, content: sections[sectionKey] };
    }
  }

  return null;
}

/**
 * Main execution
 */
async function main() {
  console.log('=== Template-Aware Content Filler ===\n');

  if (!NOTION_TOKEN) {
    console.error('ERROR: NOTION_TOKEN not found');
    process.exit(1);
  }

  console.log(`Page ID: ${PAGE_ID}`);
  console.log(`Markdown file: ${MARKDOWN_FILE}`);
  console.log(`New title: ${NEW_TITLE}\n`);

  try {
    // Step 1: Read and parse markdown
    console.log('Step 1: Parsing markdown file...');
    const markdownContent = readFileSync(MARKDOWN_FILE, 'utf-8');
    const sections = parseMarkdownSections(markdownContent);
    const executiveSummary = extractExecutiveSummary(markdownContent);

    console.log(`  Found ${Object.keys(sections).length} sections:`);
    for (const key of Object.keys(sections)) {
      console.log(`    - ${key}`);
    }
    console.log(`  Executive summary: ${executiveSummary.substring(0, 100)}...\n`);

    // Step 2: Fetch page blocks
    console.log('Step 2: Fetching page blocks...');
    const blocks = await fetchAllBlocks(PAGE_ID);
    console.log(`  Total top-level blocks: ${blocks.length}\n`);

    // Step 3: Find toggleable headings
    console.log('Step 3: Finding toggleable headings and callouts...');
    const toggleHeadings = findToggleHeadings(blocks);
    console.log(`  Found ${toggleHeadings.length} toggleable sections:`);
    for (const heading of toggleHeadings) {
      console.log(`    - [${heading.type}] "${heading.text.substring(0, 50)}..."`);
    }
    console.log();

    // Step 4: Fill each section
    console.log('Step 4: Filling sections with content...\n');

    for (const heading of toggleHeadings) {
      // Handle Blurb callout specially
      if (heading.isBlurb) {
        console.log(`  Filling Blurb callout...`);

        // Delete existing children
        await deleteBlockChildren(heading.id);

        // Add executive summary as children
        const summaryBlocks = markdownToBlocks(executiveSummary);
        if (summaryBlocks.length > 0) {
          await appendBlocksInBatches(heading.id, summaryBlocks);
          console.log(`    Added executive summary (${summaryBlocks.length} blocks)\n`);
        }
        continue;
      }

      // Match section
      const match = matchSectionToHeading(heading.text, sections);
      if (!match) {
        console.log(`  [SKIP] "${heading.text}" - No matching section found`);
        continue;
      }

      console.log(`  Filling "${heading.text}" with "${match.key}"...`);

      // Delete existing children
      await deleteBlockChildren(heading.id);

      // Convert markdown to blocks
      const contentBlocks = markdownToBlocks(match.content);

      if (contentBlocks.length === 0) {
        console.log(`    Warning: No content blocks generated`);
        continue;
      }

      // Append as children
      await appendBlocksInBatches(heading.id, contentBlocks);
      console.log(`    Added ${contentBlocks.length} blocks\n`);
    }

    // Step 5: Rename page
    console.log('Step 5: Renaming page...');

    // Get database to find title property name
    const page = await notion.pages.retrieve({ page_id: PAGE_ID });

    await delay(350);

    // Find the title property
    let titlePropName = 'Name';
    for (const [propName, propValue] of Object.entries(page.properties)) {
      if (propValue.type === 'title') {
        titlePropName = propName;
        break;
      }
    }

    await notion.pages.update({
      page_id: PAGE_ID,
      properties: {
        [titlePropName]: {
          title: [{ text: { content: NEW_TITLE } }]
        }
      }
    });

    console.log(`  Page renamed to "${NEW_TITLE}"\n`);

    // Done
    const formattedPageId = PAGE_ID.replace(/-/g, '');
    console.log('=== Complete ===');
    console.log(`Page URL: https://www.notion.so/${formattedPageId}`);

  } catch (error) {
    console.error('\nERROR:', error.message);
    if (error.body) {
      console.error('Details:', JSON.stringify(error.body, null, 2));
    }
    process.exit(1);
  }
}

main();
