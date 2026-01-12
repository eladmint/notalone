/**
 * Update Notion Page Cover
 * Sets a page cover/banner using an external image URL
 */

import 'dotenv/config';
import { Client } from '@notionhq/client';
import https from 'https';

const NOTION_TOKEN = process.env.NOTION_TOKEN;

async function fetchTwitterBannerImage(username) {
  // Try to get the banner image from Twitter/X
  console.log(`Fetching banner image for @${username}...`);

  // Use Twitter syndication API (works without authentication)
  const syndicationUrl = `https://syndication.twitter.com/srv/timeline-profile/screen-name/${username}`;

  return new Promise((resolve, reject) => {
    https.get(syndicationUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        // Look for profile_banners URL pattern
        const bannerMatch = data.match(/profile_banners\/(\d+)\/(\d+)/);

        if (bannerMatch && bannerMatch[1] && bannerMatch[2]) {
          const userId = bannerMatch[1];
          const timestamp = bannerMatch[2];
          // Construct the full banner URL with 1500x500 resolution
          const bannerUrl = `https://pbs.twimg.com/profile_banners/${userId}/${timestamp}/1500x500`;
          console.log('Found banner URL:', bannerUrl);
          resolve(bannerUrl);
        } else {
          reject(new Error('Could not extract banner image from profile. The account may not have a banner set.'));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function updatePageCover(pageId, coverUrl) {
  if (!NOTION_TOKEN) {
    console.error('ERROR: NOTION_TOKEN not found in environment variables');
    process.exit(1);
  }

  const notion = new Client({ auth: NOTION_TOKEN });

  try {
    console.log('\n=== Updating Notion Page Cover ===\n');
    console.log('Page ID:', pageId);
    console.log('Cover URL:', coverUrl);
    console.log('');

    // Fetch current page info
    const currentPage = await notion.pages.retrieve({ page_id: pageId });
    const title = currentPage.properties?.title?.title?.[0]?.plain_text
      || currentPage.properties?.Name?.title?.[0]?.plain_text
      || 'Unknown Title';

    console.log('Current page title:', title);
    console.log('Current cover:', currentPage.cover || 'None');
    console.log('');

    // Update the page cover
    console.log('Updating cover...');
    const response = await notion.pages.update({
      page_id: pageId,
      cover: {
        type: 'external',
        external: {
          url: coverUrl
        }
      }
    });

    console.log('\n=== SUCCESS ===');
    console.log('Page cover updated!');
    console.log('New cover:', response.cover);
    console.log('\nView the page at: https://www.notion.so/' + pageId.replace(/-/g, ''));

    return response;

  } catch (error) {
    console.error('\nERROR: Failed to update page cover');
    console.error('Status:', error.status);
    console.error('Code:', error.code);
    console.error('Message:', error.message);

    if (error.code === 'validation_error') {
      console.log('\nThe Notion API may have rejected the image URL.');
      console.log('Possible fixes:');
      console.log('1. Ensure the URL is publicly accessible');
      console.log('2. Try using a different image URL');
      console.log('3. Verify the image is in a supported format (JPEG, PNG, GIF)');
      console.log('4. Check that the URL returns an image with proper Content-Type headers');
    }

    if (error.code === 'object_not_found') {
      console.log('\nThe page was not found. Check that:');
      console.log('1. The page ID is correct');
      console.log('2. The integration has access to the page');
      console.log('3. The page has not been deleted');
    }

    process.exit(1);
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.length < 1) {
  console.log('Usage: node update-page-cover.js <page-id> [cover-url]');
  console.log('       node update-page-cover.js <page-id> --twitter <username>');
  console.log('');
  console.log('Examples:');
  console.log('  node update-page-cover.js 2c960b6e8d1881508334dbf96f968d80 https://example.com/banner.png');
  console.log('  node update-page-cover.js 2c960b6e8d1881508334dbf96f968d80 --twitter tweemdotlol');
  console.log('');
  console.log('Notes:');
  console.log('  - Cover images work best at 1500x500 pixels');
  console.log('  - The URL must be publicly accessible');
  console.log('  - Supported formats: JPEG, PNG, GIF');
  process.exit(1);
}

const pageId = args[0];

if (args[1] === '--twitter' && args[2]) {
  // Fetch Twitter banner image
  fetchTwitterBannerImage(args[2])
    .then(coverUrl => updatePageCover(pageId, coverUrl))
    .catch(async (err) => {
      console.error('Failed to fetch Twitter banner image:', err.message);
      console.log('\nThe account may not have a banner image set.');
      console.log('You can manually provide a cover URL instead:');
      console.log(`  node update-page-cover.js ${pageId} <image-url>`);
      process.exit(1);
    });
} else if (args[1]) {
  // Use provided URL
  updatePageCover(pageId, args[1]);
} else {
  console.error('ERROR: Please provide a cover URL or use --twitter <username>');
  process.exit(1);
}
