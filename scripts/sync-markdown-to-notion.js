/**
 * Sync Markdown to Notion
 * Pushes local markdown file content to a Notion page
 * Replaces all existing blocks with the markdown content
 */

import 'dotenv/config';
import { Client } from '@notionhq/client';
import { readFileSync } from 'fs';

const NOTION_TOKEN = process.env.NOTION_TOKEN;

// Markdown to Notion block converter
function parseMarkdownToBlocks(markdown) {
  const blocks = [];
  const lines = markdown.split('\n');
  let i = 0;
  let inFrontmatter = false;
  let inCodeBlock = false;
  let codeBlockContent = [];
  let codeLanguage = '';
  let inTable = false;
  let tableRows = [];
  let inDetailsBlock = false;
  let detailsSummary = '';
  let detailsContent = [];
  let inBlockquote = false;
  let blockquoteContent = [];

  // Skip frontmatter
  while (i < lines.length) {
    const line = lines[i];
    if (i === 0 && line === '---') {
      inFrontmatter = true;
      i++;
      continue;
    }
    if (inFrontmatter) {
      if (line === '---') {
        inFrontmatter = false;
        i++;
        continue;
      }
      i++;
      continue;
    }
    break;
  }

  // Process remaining lines
  while (i < lines.length) {
    const line = lines[i];

    // Code block handling
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        blocks.push({
          type: 'code',
          code: {
            language: codeLanguage || 'plain text',
            rich_text: [{ type: 'text', text: { content: codeBlockContent.join('\n') } }]
          }
        });
        codeBlockContent = [];
        codeLanguage = '';
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLanguage = line.slice(3).trim() || 'plain text';
      }
      i++;
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      i++;
      continue;
    }

    // Details/Toggle block
    if (line.trim().startsWith('<details>')) {
      inDetailsBlock = true;
      i++;
      continue;
    }

    if (inDetailsBlock && line.trim().startsWith('<summary>')) {
      detailsSummary = line.replace(/<\/?summary>/g, '').replace(/\*\*/g, '').trim();
      i++;
      continue;
    }

    if (line.trim() === '</details>') {
      if (detailsSummary || detailsContent.length > 0) {
        const toggleBlock = {
          type: 'toggle',
          toggle: {
            rich_text: [{ type: 'text', text: { content: detailsSummary || 'Details' } }],
            children: []
          }
        };

        // Parse details content into child blocks
        for (const detailLine of detailsContent) {
          if (detailLine.trim() === '---') {
            toggleBlock.toggle.children.push({
              type: 'divider',
              divider: {}
            });
          } else if (detailLine.trim().startsWith('- ')) {
            const bulletContent = detailLine.trim().slice(2);
            toggleBlock.toggle.children.push({
              type: 'bulleted_list_item',
              bulleted_list_item: {
                rich_text: parseRichText(bulletContent)
              }
            });
          } else if (detailLine.trim()) {
            toggleBlock.toggle.children.push({
              type: 'paragraph',
              paragraph: {
                rich_text: parseRichText(detailLine.trim())
              }
            });
          }
        }

        blocks.push(toggleBlock);
      }
      inDetailsBlock = false;
      detailsSummary = '';
      detailsContent = [];
      i++;
      continue;
    }

    if (inDetailsBlock) {
      detailsContent.push(line);
      i++;
      continue;
    }

    // Table handling
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      // Skip separator row (contains ---)
      if (!line.includes('---')) {
        const cells = line.split('|').slice(1, -1).map(cell => cell.trim());
        tableRows.push(cells);
      }
      i++;
      continue;
    } else if (inTable) {
      // End of table
      if (tableRows.length > 0) {
        const tableBlock = {
          type: 'table',
          table: {
            table_width: tableRows[0].length,
            has_column_header: true,
            has_row_header: false,
            children: tableRows.map((row, rowIndex) => ({
              type: 'table_row',
              table_row: {
                cells: row.map(cell => parseRichText(cell))
              }
            }))
          }
        };
        blocks.push(tableBlock);
      }
      inTable = false;
      tableRows = [];
      // Don't increment i, process this line normally
    }

    // Blockquote handling - with multi-line support
    if (line.startsWith('>')) {
      const content = line.slice(1).trim();

      // Check if this continues an existing blockquote
      if (!inBlockquote) {
        inBlockquote = true;
        blockquoteContent = [];
      }

      blockquoteContent.push(content);
      i++;
      continue;
    } else if (inBlockquote) {
      // End of blockquote - create callout block
      if (blockquoteContent.length > 0) {
        const fullContent = blockquoteContent.join('\n');

        // Check if this is a "Blurb" callout
        if (fullContent.includes('**Blurb:')) {
          // Create a callout block for the blurb
          const calloutBlock = {
            type: 'callout',
            callout: {
              icon: { type: 'emoji', emoji: '📋' },
              color: 'blue_background',
              rich_text: [],
              children: []
            }
          };

          // Parse the blurb content into separate blocks
          const blurbLines = fullContent.split('\n');
          for (const blurbLine of blurbLines) {
            if (blurbLine.trim()) {
              if (blurbLine.startsWith('- ')) {
                calloutBlock.callout.children.push({
                  type: 'bulleted_list_item',
                  bulleted_list_item: {
                    rich_text: parseRichText(blurbLine.slice(2))
                  }
                });
              } else {
                calloutBlock.callout.children.push({
                  type: 'paragraph',
                  paragraph: {
                    rich_text: parseRichText(blurbLine)
                  }
                });
              }
            }
          }

          blocks.push(calloutBlock);
        } else {
          // Regular quote block
          blocks.push({
            type: 'quote',
            quote: {
              rich_text: parseRichText(fullContent)
            }
          });
        }
      }
      inBlockquote = false;
      blockquoteContent = [];
      // Don't increment, process this line normally
    }

    // Skip empty lines (but only if not in a special block)
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Headings
    if (line.startsWith('######')) {
      blocks.push({
        type: 'heading_3',
        heading_3: { rich_text: parseRichText(line.slice(6).trim().replace(/\*\*/g, '')) }
      });
      i++;
      continue;
    }
    if (line.startsWith('#####')) {
      blocks.push({
        type: 'heading_3',
        heading_3: { rich_text: parseRichText(line.slice(5).trim().replace(/\*\*/g, '')) }
      });
      i++;
      continue;
    }
    if (line.startsWith('####')) {
      blocks.push({
        type: 'heading_3',
        heading_3: { rich_text: parseRichText(line.slice(4).trim().replace(/\*\*/g, '')) }
      });
      i++;
      continue;
    }
    if (line.startsWith('###')) {
      blocks.push({
        type: 'heading_3',
        heading_3: { rich_text: parseRichText(line.slice(3).trim().replace(/\*\*/g, '')) }
      });
      i++;
      continue;
    }
    if (line.startsWith('##')) {
      blocks.push({
        type: 'heading_2',
        heading_2: { rich_text: parseRichText(line.slice(2).trim().replace(/\*\*/g, '')) }
      });
      i++;
      continue;
    }
    if (line.startsWith('#')) {
      blocks.push({
        type: 'heading_1',
        heading_1: { rich_text: parseRichText(line.slice(1).trim().replace(/\*\*/g, '')) }
      });
      i++;
      continue;
    }

    // Divider
    if (line.trim() === '---') {
      blocks.push({ type: 'divider', divider: {} });
      i++;
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(line.trim())) {
      const content = line.trim().replace(/^\d+\.\s/, '');
      blocks.push({
        type: 'numbered_list_item',
        numbered_list_item: {
          rich_text: parseRichText(content)
        }
      });
      i++;
      continue;
    }

    // Bullet list
    if (line.trim().startsWith('- ')) {
      const content = line.trim().slice(2);
      const indent = line.match(/^(\s*)/)[1].length;

      // Check for nested content (indented sub-items)
      if (indent >= 2) {
        // This is a nested item - add as child to previous block if possible
        blocks.push({
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: parseRichText(content)
          }
        });
      } else {
        blocks.push({
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: parseRichText(content)
          }
        });
      }
      i++;
      continue;
    }

    // Regular paragraph
    if (line.trim()) {
      blocks.push({
        type: 'paragraph',
        paragraph: {
          rich_text: parseRichText(line.trim())
        }
      });
    }
    i++;
  }

  // Handle any remaining table
  if (inTable && tableRows.length > 0) {
    blocks.push({
      type: 'table',
      table: {
        table_width: tableRows[0].length,
        has_column_header: true,
        has_row_header: false,
        children: tableRows.map(row => ({
          type: 'table_row',
          table_row: {
            cells: row.map(cell => parseRichText(cell))
          }
        }))
      }
    });
  }

  // Handle remaining blockquote
  if (inBlockquote && blockquoteContent.length > 0) {
    blocks.push({
      type: 'quote',
      quote: {
        rich_text: parseRichText(blockquoteContent.join('\n'))
      }
    });
  }

  return blocks;
}

// Parse inline markdown to Notion rich text
function parseRichText(text) {
  const richText = [];

  // Handle links: [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  // Handle bold: **text**
  const boldRegex = /\*\*([^*]+)\*\*/g;
  // Handle italic: *text* or _text_
  const italicRegex = /(?<!\*)\*([^*]+)\*(?!\*)|_([^_]+)_/g;

  let lastIndex = 0;
  let match;

  // Simple approach: process the text and create rich text segments
  // First, split by bold markers
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/);

  for (const part of parts) {
    if (!part) continue;

    // Check if it's a link
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      richText.push({
        type: 'text',
        text: {
          content: linkMatch[1],
          link: { url: linkMatch[2] }
        }
      });
      continue;
    }

    // Check if it's bold
    const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
    if (boldMatch) {
      richText.push({
        type: 'text',
        text: { content: boldMatch[1] },
        annotations: { bold: true }
      });
      continue;
    }

    // Regular text
    if (part.trim() || part.includes(' ')) {
      richText.push({
        type: 'text',
        text: { content: part }
      });
    }
  }

  // If no rich text was created, return the original text
  if (richText.length === 0 && text) {
    return [{ type: 'text', text: { content: text } }];
  }

  return richText;
}

// Delete all blocks from a page
async function deleteAllBlocks(notion, pageId) {
  console.log('Deleting existing blocks...');

  let hasMore = true;
  let startCursor = undefined;
  let deletedCount = 0;

  while (hasMore) {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: startCursor,
      page_size: 100
    });

    // Delete blocks in parallel (with rate limiting)
    const deletePromises = response.results.map(async (block, index) => {
      // Stagger requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, index * 50));
      try {
        await notion.blocks.delete({ block_id: block.id });
        deletedCount++;
      } catch (err) {
        console.warn(`  Warning: Could not delete block ${block.id}: ${err.message}`);
      }
    });

    await Promise.all(deletePromises);

    hasMore = response.has_more;
    startCursor = response.next_cursor;
  }

  console.log(`  Deleted ${deletedCount} blocks`);
}

// Append blocks to a page (handles the 100-block limit)
async function appendBlocks(notion, pageId, blocks) {
  console.log(`Appending ${blocks.length} blocks...`);

  const BATCH_SIZE = 100;
  let appendedCount = 0;

  for (let i = 0; i < blocks.length; i += BATCH_SIZE) {
    const batch = blocks.slice(i, i + BATCH_SIZE);

    try {
      await notion.blocks.children.append({
        block_id: pageId,
        children: batch
      });
      appendedCount += batch.length;
      console.log(`  Appended batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} blocks`);

      // Rate limiting
      if (i + BATCH_SIZE < blocks.length) {
        await new Promise(resolve => setTimeout(resolve, 350));
      }
    } catch (err) {
      console.error(`  Error appending batch: ${err.message}`);
      // Try individual blocks
      for (const block of batch) {
        try {
          await notion.blocks.children.append({
            block_id: pageId,
            children: [block]
          });
          appendedCount++;
        } catch (blockErr) {
          console.error(`    Failed to append block type ${block.type}: ${blockErr.message}`);
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }

  console.log(`  Total appended: ${appendedCount} blocks`);
  return appendedCount;
}

// Main sync function
async function syncMarkdownToNotion(markdownPath, pageId) {
  console.log('=== Markdown to Notion Sync ===\n');

  if (!NOTION_TOKEN) {
    console.error('ERROR: NOTION_TOKEN not found in environment variables');
    process.exit(1);
  }

  console.log('Source file:', markdownPath);
  console.log('Target page:', pageId);
  console.log('');

  // Read markdown file
  const markdown = readFileSync(markdownPath, 'utf-8');
  console.log(`Read ${markdown.length} characters from markdown file`);

  // Parse to Notion blocks
  const blocks = parseMarkdownToBlocks(markdown);
  console.log(`Parsed ${blocks.length} Notion blocks`);
  console.log('');

  // Initialize Notion client
  const notion = new Client({ auth: NOTION_TOKEN });

  // Delete existing content
  await deleteAllBlocks(notion, pageId);
  console.log('');

  // Append new content
  await appendBlocks(notion, pageId, blocks);
  console.log('');

  console.log('=== Sync Complete ===');

  return { success: true, blocksCreated: blocks.length };
}

// Get arguments
const args = process.argv.slice(2);
const markdownPath = args[0] || './deal-flow/addressable/notion-sync.md';
const pageId = args[1] || '2c585dd502d581058a47fb8024bae29a';

syncMarkdownToNotion(markdownPath, pageId)
  .then(result => {
    console.log('\nSync successful!');
    console.log('Blocks created:', result.blocksCreated);
  })
  .catch(err => {
    console.error('\nSync failed:', err.message);
    process.exit(1);
  });
