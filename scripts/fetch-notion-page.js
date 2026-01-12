import { Client } from '@notionhq/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Convert rich text to markdown
function richTextToMarkdown(richText) {
  if (!richText || richText.length === 0) return '';

  return richText.map(text => {
    let content = '';

    if (text.type === 'text') {
      content = text.text.content;
    } else if (text.type === 'mention') {
      if (text.mention.type === 'link_preview' || text.mention.type === 'link_mention') {
        const url = text.mention.link_preview?.url || text.mention.link_mention?.href || '';
        const title = text.mention.link_mention?.title || url;
        content = '[' + title + '](' + url + ')';
      } else {
        content = text.plain_text || '';
      }
    } else {
      content = text.plain_text || '';
    }

    // Apply annotations
    if (text.annotations) {
      if (text.annotations.bold) content = '**' + content + '**';
      if (text.annotations.italic) content = '*' + content + '*';
      if (text.annotations.strikethrough) content = '~~' + content + '~~';
      if (text.annotations.code) content = '`' + content + '`';
    }

    // Handle links
    if (text.text?.link?.url) {
      content = '[' + content + '](' + text.text.link.url + ')';
    }

    return content;
  }).join('');
}

// Convert blocks to markdown recursively
function blocksToMarkdown(blocks, indentLevel = 0) {
  const lines = [];
  const indent = '  '.repeat(indentLevel);

  for (const block of blocks) {
    const blockType = block.type;
    const blockContent = block[blockType];

    switch (blockType) {
      case 'paragraph':
        const paraText = richTextToMarkdown(blockContent.rich_text);
        if (paraText) lines.push(indent + paraText);
        else lines.push('');
        break;

      case 'heading_1':
        lines.push('# ' + richTextToMarkdown(blockContent.rich_text));
        break;

      case 'heading_2':
        lines.push('## ' + richTextToMarkdown(blockContent.rich_text));
        break;

      case 'heading_3':
        lines.push('### ' + richTextToMarkdown(blockContent.rich_text));
        break;

      case 'bulleted_list_item':
        lines.push(indent + '- ' + richTextToMarkdown(blockContent.rich_text));
        break;

      case 'numbered_list_item':
        lines.push(indent + '1. ' + richTextToMarkdown(blockContent.rich_text));
        break;

      case 'to_do':
        const checked = blockContent.checked ? 'x' : ' ';
        lines.push(indent + '- [' + checked + '] ' + richTextToMarkdown(blockContent.rich_text));
        break;

      case 'toggle':
        lines.push(indent + '<details>');
        lines.push(indent + '<summary>' + richTextToMarkdown(blockContent.rich_text) + '</summary>');
        lines.push('');
        break;

      case 'callout':
        const calloutText = richTextToMarkdown(blockContent.rich_text);
        if (calloutText) {
          lines.push(indent + '> ' + calloutText);
        }
        break;

      case 'quote':
        lines.push(indent + '> ' + richTextToMarkdown(blockContent.rich_text));
        break;

      case 'code':
        const lang = blockContent.language || '';
        lines.push(indent + '```' + lang);
        lines.push(indent + richTextToMarkdown(blockContent.rich_text));
        lines.push(indent + '```');
        break;

      case 'divider':
        lines.push(indent + '---');
        break;

      case 'table_row':
        const cells = blockContent.cells.map(cell => richTextToMarkdown(cell));
        lines.push('| ' + cells.join(' | ') + ' |');
        break;

      case 'column_list':
      case 'column':
        // Skip these structural elements, process children directly
        break;

      case 'child_database':
        lines.push(indent + '> [Database: ' + (blockContent.title || 'Untitled') + ']');
        break;

      case 'bookmark':
        const bookmarkUrl = blockContent.url || '';
        const bookmarkCaption = richTextToMarkdown(blockContent.caption) || bookmarkUrl;
        lines.push(indent + '[' + bookmarkCaption + '](' + bookmarkUrl + ')');
        break;

      case 'image':
        const imgUrl = blockContent.file?.url || blockContent.external?.url || '';
        const imgCaption = richTextToMarkdown(blockContent.caption) || 'Image';
        lines.push(indent + '![' + imgCaption + '](' + imgUrl + ')');
        break;

      case 'video':
        const vidUrl = blockContent.file?.url || blockContent.external?.url || '';
        lines.push(indent + '[Video](' + vidUrl + ')');
        break;

      case 'embed':
        lines.push(indent + '[Embed: ' + (blockContent.url || '') + ']');
        break;

      case 'table':
        // Table handled by table_row children
        break;

      default:
        // Unknown block type
        if (blockContent?.rich_text) {
          const text = richTextToMarkdown(blockContent.rich_text);
          if (text) lines.push(indent + text);
        }
    }

    // Handle children
    if (block.children && block.children.length > 0) {
      const childIndent = (blockType === 'bulleted_list_item' || blockType === 'numbered_list_item') ? indentLevel + 1 : indentLevel;
      const childMd = blocksToMarkdown(block.children, childIndent);
      lines.push(...childMd);

      if (blockType === 'toggle') {
        lines.push(indent + '</details>');
        lines.push('');
      }
    }
  }

  return lines;
}

async function fetchAllBlocks(blockId) {
  const blocks = [];
  let cursor;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100
    });

    for (const block of response.results) {
      const blockWithChildren = { ...block };
      if (block.has_children) {
        blockWithChildren.children = await fetchAllBlocks(block.id);
      }
      blocks.push(blockWithChildren);
    }
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return blocks;
}

async function main() {
  const pageId = process.argv[2] || '2c585dd502d58186b73feec19f7fd845';
  const outputPath = process.argv[3] || '/Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/zengo/notion-raw.md';

  // Get page metadata
  console.log('Fetching page metadata...');
  const page = await notion.pages.retrieve({ page_id: pageId });
  const title = page.properties.Name?.title?.[0]?.plain_text || 'Untitled';

  console.log('Fetching all blocks...');
  const allBlocks = await fetchAllBlocks(pageId);

  console.log('Converting to markdown...');
  const mdLines = ['# ' + title, ''];
  mdLines.push(...blocksToMarkdown(allBlocks));

  const markdown = mdLines.join('\n');

  // Ensure directory exists
  const dir = path.dirname(outputPath);
  fs.mkdirSync(dir, { recursive: true });

  // Write to file
  fs.writeFileSync(outputPath, markdown);

  console.log('Done! Written to', outputPath);
  console.log('Total blocks processed:', allBlocks.length);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
