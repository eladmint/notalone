/**
 * Create Opportunities Database with Recommended Properties
 *
 * This script creates a new Notion database with all the properties
 * recommended for Notalone deal flow management.
 *
 * Usage:
 *   node scripts/create-opportunities-db.js [parent-page-id]
 *
 * If no parent-page-id is provided, it will create in the default workspace.
 */

import 'dotenv/config';
import { Client } from '@notionhq/client';

const NOTION_TOKEN = process.env.NOTION_TOKEN;

// Database configuration with all recommended properties
const DATABASE_CONFIG = {
  title: 'Opportunities (Example)',

  properties: {
    // ===== CORE PROPERTIES =====
    'Name': {
      title: {}
    },

    'Status': {
      select: {
        options: [
          { name: 'Pipeline', color: 'gray' },
          { name: 'Screening', color: 'yellow' },
          { name: 'Intro Call', color: 'orange' },
          { name: 'DD', color: 'blue' },
          { name: 'IC', color: 'purple' },
          { name: 'Portfolio', color: 'green' },
          { name: 'Pass', color: 'red' },
          { name: 'On Hold', color: 'brown' },
        ]
      }
    },

    'Deal Type': {
      select: {
        options: [
          { name: 'Investment', color: 'green' },
          { name: 'Services', color: 'blue' },
          { name: 'Showcase', color: 'purple' },
        ]
      }
    },

    'Recommendation': {
      select: {
        options: [
          { name: 'INVEST', color: 'green' },
          { name: 'INVEST (conditional)', color: 'yellow' },
          { name: 'SERVICES', color: 'blue' },
          { name: 'SHOWCASE', color: 'purple' },
          { name: 'PASS', color: 'red' },
          { name: 'Pending', color: 'gray' },
        ]
      }
    },

    // ===== TOKEN & VALUATION =====
    'Token Status': {
      select: {
        options: [
          { name: 'Token', color: 'green' },
          { name: 'Equity-only', color: 'orange' },
          { name: 'Hybrid', color: 'blue' },
          { name: 'Unknown', color: 'gray' },
        ]
      }
    },

    'FDV ($M)': {
      number: {
        format: 'number'
      }
    },

    'TGE Date': {
      date: {}
    },

    'TGE Unlock %': {
      number: {
        format: 'percent'
      }
    },

    // ===== INDUSTRY & FIT =====
    'Industry': {
      select: {
        options: [
          { name: 'RWA', color: 'green' },
          { name: 'AI', color: 'blue' },
          { name: 'DePIN', color: 'purple' },
          { name: 'DeFi', color: 'orange' },
          { name: 'Payments', color: 'yellow' },
          { name: 'Privacy', color: 'pink' },
          { name: 'Infrastructure', color: 'gray' },
          { name: 'Consumer', color: 'brown' },
          { name: 'Other', color: 'default' },
        ]
      }
    },

    'Industry Fit': {
      select: {
        options: [
          { name: '✅ Liked', color: 'green' },
          { name: '⚠️ Neutral', color: 'yellow' },
          { name: '❌ Excluded', color: 'red' },
        ]
      }
    },

    'Kill Criteria': {
      multi_select: {
        options: [
          { name: 'Equity-only', color: 'orange' },
          { name: 'Gaming', color: 'red' },
          { name: 'Metaverse', color: 'red' },
          { name: 'NFT', color: 'red' },
          { name: 'Anon Team', color: 'pink' },
          { name: 'No Product', color: 'yellow' },
          { name: 'FDV>100M', color: 'purple' },
          { name: 'Clone', color: 'brown' },
          { name: 'No Problem', color: 'gray' },
        ]
      }
    },

    // ===== QUALITY & SCORING =====
    'Scorecard': {
      number: {
        format: 'number'
      }
    },

    'Research Confidence': {
      select: {
        options: [
          { name: 'HIGH', color: 'green' },
          { name: 'MEDIUM', color: 'yellow' },
          { name: 'LOW', color: 'red' },
        ]
      }
    },

    'Research Date': {
      date: {}
    },

    // ===== PEOPLE =====
    'PoC Name': {
      rich_text: {}
    },

    'Lead Source': {
      rich_text: {}
    },

    // ===== LINKS & RESOURCES =====
    'Website': {
      url: {}
    },

    'Deck': {
      url: {}
    },

    'Research File': {
      url: {}
    },

    'Crunchbase': {
      url: {}
    },

    // ===== KEY METRICS =====
    'Funding Raised ($M)': {
      number: {
        format: 'number'
      }
    },

    'ARR ($M)': {
      number: {
        format: 'number'
      }
    },

    'Users': {
      number: {
        format: 'number'
      }
    },
  }
};

async function createDatabase(parentPageId) {
  console.log('=== Creating Opportunities Database ===\n');

  if (!NOTION_TOKEN) {
    console.error('ERROR: NOTION_TOKEN not found in environment variables');
    process.exit(1);
  }

  const notion = new Client({ auth: NOTION_TOKEN });

  try {
    // Build the create database request
    const createRequest = {
      parent: parentPageId
        ? { type: 'page_id', page_id: parentPageId }
        : { type: 'page_id', page_id: '2c585dd502d580739744f33cc9bd2859' }, // Default to NOTALONE-IL page
      title: [
        {
          type: 'text',
          text: { content: DATABASE_CONFIG.title }
        }
      ],
      properties: DATABASE_CONFIG.properties,
      // Optional: Set as inline database
      is_inline: false,
    };

    console.log('Creating database with properties:');
    console.log('- ' + Object.keys(DATABASE_CONFIG.properties).join('\n- '));
    console.log('\n');

    const database = await notion.databases.create(createRequest);

    console.log('SUCCESS: Database created!\n');
    console.log('Database ID: ' + database.id);
    console.log('URL: ' + database.url);
    console.log('\n=== Property Summary ===\n');

    // Print property summary grouped by category
    const categories = {
      'Core': ['Status', 'Deal Type', 'Recommendation'],
      'Token & Valuation': ['Token Status', 'FDV ($M)', 'TGE Date', 'TGE Unlock %'],
      'Industry & Fit': ['Industry', 'Industry Fit', 'Kill Criteria'],
      'Quality & Scoring': ['Scorecard', 'Research Confidence', 'Research Date'],
      'People': ['PoC Name', 'Lead Source'],
      'Links': ['Website', 'Deck', 'Research File', 'Crunchbase'],
      'Metrics': ['Funding Raised ($M)', 'ARR ($M)', 'Users'],
    };

    for (const [category, props] of Object.entries(categories)) {
      console.log(`${category}:`);
      for (const prop of props) {
        const type = Object.keys(DATABASE_CONFIG.properties[prop])[0];
        console.log(`  - ${prop} (${type})`);
      }
      console.log('');
    }

    return database;

  } catch (error) {
    console.error('\nERROR: Failed to create database');
    console.error('Status:', error.status);
    console.error('Code:', error.code);
    console.error('Message:', error.message);

    if (error.code === 'validation_error') {
      console.log('\nValidation error details:', JSON.stringify(error.body, null, 2));
    }

    process.exit(1);
  }
}

// Get parent page ID from command line args
const parentPageId = process.argv[2];

if (parentPageId) {
  console.log('Using parent page ID: ' + parentPageId);
}

createDatabase(parentPageId);
