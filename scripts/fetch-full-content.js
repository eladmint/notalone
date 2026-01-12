#!/usr/bin/env node
/**
 * Fetch full content of specific blocks for detailed analysis
 */

import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const BLOCKS_TO_ANALYZE = [
  '2c585dd5-02d5-80ff-a450-d8b6d684d0c8', // Primary Customers
  '2c585dd5-02d5-80b6-a2e5-c742aa9e16ac', // Market Segments
  '2c585dd5-02d5-804b-b11b-eec009b399c9', // Geographic Focus
  '2c585dd5-02d5-80f8-93e1-e3d7212075b3', // Customer Count
  '2c585dd5-02d5-8005-8e8a-ee5dad620f8e', // Revenue Model
];

function extractText(richTextArray) {
  if (!richTextArray || !Array.isArray(richTextArray)) return '';
  return richTextArray.map(rt => rt.plain_text || '').join('');
}

async function fetchBlockDetails() {
  console.log('FULL BLOCK CONTENT ANALYSIS');
  console.log('='.repeat(80));
  console.log('');

  for (const blockId of BLOCKS_TO_ANALYZE) {
    try {
      const block = await notion.blocks.retrieve({ block_id: blockId });
      const type = block.type;
      const data = block[type];
      const content = extractText(data?.rich_text);

      console.log(`Block ID: ${blockId}`);
      console.log(`Type: ${type}`);
      console.log(`Full Content:`);
      console.log(content);
      console.log('');
      console.log('-'.repeat(80));
      console.log('');
    } catch (error) {
      console.error(`Error fetching block ${blockId}:`, error.message);
    }
  }
}

fetchBlockDetails();
