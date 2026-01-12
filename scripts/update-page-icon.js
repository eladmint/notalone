/**
 * Update Notion Page Icon
 * Sets a page icon using an external image URL
 */

import 'dotenv/config';
import { Client } from '@notionhq/client';
import https from 'https';

const NOTION_TOKEN = process.env.NOTION_TOKEN;

async function fetchTwitterProfileImage(username) {
  // Try to get the profile image from Twitter/X
  // Twitter profile images follow a pattern, but we'll also try to fetch the actual URL

  console.log(`Fetching profile image for @${username}...`);

  // Try the nitter redirect (alternative Twitter frontend that works without JS)
  const nitterUrl = `https://nitter.net/${username}`;

  return new Promise((resolve, reject) => {
    https.get(nitterUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        // Look for profile image in the HTML
        const imgMatch = data.match(/class="avatar"[^>]*src="([^"]+)"/);
        if (imgMatch && imgMatch[1]) {
          let imageUrl = imgMatch[1];
          // Convert nitter URL to direct Twitter URL
          if (imageUrl.startsWith('/')) {
            imageUrl = 'https://nitter.net' + imageUrl;
          }
          // Try to get the actual Twitter CDN URL
          const pbs = data.match(/https:\/\/pbs\.twimg\.com\/profile_images\/[^"']+/);
          if (pbs && pbs[0]) {
            resolve(pbs[0]);
          } else {
            resolve(imageUrl);
          }
        } else {
          // Fallback: construct likely URL pattern
          // X/Twitter profile images are typically at pbs.twimg.com
          reject(new Error('Could not extract profile image from page'));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function updatePageIcon(pageId, iconUrl) {
  if (!NOTION_TOKEN) {
    console.error('ERROR: NOTION_TOKEN not found in environment variables');
    process.exit(1);
  }

  const notion = new Client({ auth: NOTION_TOKEN });

  try {
    console.log('\n=== Updating Notion Page Icon ===\n');
    console.log('Page ID:', pageId);
    console.log('Icon URL:', iconUrl);
    console.log('');

    // Fetch current page info
    const currentPage = await notion.pages.retrieve({ page_id: pageId });
    const title = currentPage.properties?.title?.title?.[0]?.plain_text
      || currentPage.properties?.Name?.title?.[0]?.plain_text
      || 'Unknown Title';

    console.log('Current page title:', title);
    console.log('Current icon:', currentPage.icon || 'None');
    console.log('');

    // Update the page icon
    console.log('Updating icon...');
    const response = await notion.pages.update({
      page_id: pageId,
      icon: {
        type: 'external',
        external: {
          url: iconUrl
        }
      }
    });

    console.log('\n=== SUCCESS ===');
    console.log('Page icon updated!');
    console.log('New icon:', response.icon);
    console.log('\nView the page at: https://www.notion.so/' + pageId.replace(/-/g, ''));

    return response;

  } catch (error) {
    console.error('\nERROR: Failed to update page icon');
    console.error('Status:', error.status);
    console.error('Code:', error.code);
    console.error('Message:', error.message);

    if (error.code === 'validation_error') {
      console.log('\nThe Notion API may have rejected the image URL.');
      console.log('Possible fixes:');
      console.log('1. Ensure the URL is publicly accessible');
      console.log('2. Try using a different image URL');
      console.log('3. Use the unofficial API (NOTION_TOKEN_V2) for more flexibility');
    }

    process.exit(1);
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.length < 1) {
  console.log('Usage: node update-page-icon.js <page-id> [icon-url]');
  console.log('       node update-page-icon.js <page-id> --twitter <username>');
  console.log('');
  console.log('Examples:');
  console.log('  node update-page-icon.js 2c960b6e8d1881508334dbf96f968d80 https://example.com/image.png');
  console.log('  node update-page-icon.js 2c960b6e8d1881508334dbf96f968d80 --twitter tweemdotlol');
  process.exit(1);
}

const pageId = args[0];

if (args[1] === '--twitter' && args[2]) {
  // Fetch Twitter profile image
  fetchTwitterProfileImage(args[2])
    .then(iconUrl => updatePageIcon(pageId, iconUrl))
    .catch(async (err) => {
      console.error('Failed to fetch Twitter profile image:', err.message);
      console.log('\nTrying fallback method...');

      // Fallback: Use a generic Twitter avatar URL pattern
      // Most Twitter avatars work with this pattern
      const fallbackUrl = `https://unavatar.io/twitter/${args[2]}`;
      console.log('Using unavatar.io service:', fallbackUrl);

      await updatePageIcon(pageId, fallbackUrl);
    });
} else if (args[1]) {
  // Use provided URL
  updatePageIcon(pageId, args[1]);
} else {
  console.error('ERROR: Please provide an icon URL or use --twitter <username>');
  process.exit(1);
}
