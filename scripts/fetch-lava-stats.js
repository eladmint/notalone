/**
 * Fetch Lava Network Statistics
 *
 * Uses Playwright to render the page and extract stats from the info.lavanet.xyz dashboard.
 *
 * Usage:
 *   node scripts/fetch-lava-stats.js
 */

import { chromium } from 'playwright';

async function fetchLavaStats() {
  console.log('=== Fetching Lava Network Stats ===\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Loading https://info.lavanet.xyz/ ...');
    await page.goto('https://info.lavanet.xyz/', {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    // Wait for content to load
    await page.waitForTimeout(5000);

    console.log('Page loaded. Extracting stats...\n');

    // Get page title
    const title = await page.title();
    console.log('Page Title:', title);

    // Take a screenshot for reference
    await page.screenshot({
      path: '/Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/lava-stats-screenshot.png',
      fullPage: true
    });
    console.log('\nScreenshot saved to: deal-flow/lava-stats-screenshot.png');

    // Extract all text content
    const bodyText = await page.evaluate(() => {
      return document.body.innerText;
    });

    console.log('\n=== Page Content ===\n');
    console.log(bodyText);

    // Try to find specific stat elements
    const stats = await page.evaluate(() => {
      const results = {};

      // Look for common stat patterns
      const allElements = document.querySelectorAll('*');
      const statPatterns = [];

      allElements.forEach(el => {
        const text = el.innerText?.trim();
        // Look for numbers with common stat formats
        if (text && /^\$?[\d,]+\.?\d*[KMB]?%?$/.test(text)) {
          const label = el.previousElementSibling?.innerText ||
                       el.parentElement?.querySelector('label')?.innerText ||
                       el.closest('[class*="card"]')?.querySelector('h3,h4,label')?.innerText ||
                       'unknown';
          if (label !== text) {
            statPatterns.push({ label: label.trim(), value: text });
          }
        }
      });

      return statPatterns;
    });

    if (stats.length > 0) {
      console.log('\n=== Extracted Stats ===\n');
      stats.forEach(s => {
        console.log(`${s.label}: ${s.value}`);
      });
    }

    // Also try stats.lavanet.xyz
    console.log('\n\n=== Checking stats.lavanet.xyz ===\n');
    await page.goto('https://stats.lavanet.xyz/', {
      waitUntil: 'networkidle',
      timeout: 60000
    });
    await page.waitForTimeout(5000);

    const statsPageText = await page.evaluate(() => document.body.innerText);
    console.log(statsPageText);

    await page.screenshot({
      path: '/Users/eladm/Projects/Nuru-AI/Notalone/deal-flow/lava-stats-page-screenshot.png',
      fullPage: true
    });
    console.log('\nScreenshot saved to: deal-flow/lava-stats-page-screenshot.png');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

fetchLavaStats();
