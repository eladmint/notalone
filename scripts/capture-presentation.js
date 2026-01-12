#!/usr/bin/env node

/**
 * Presentation Slide Capture Script
 *
 * Captures screenshots of web-based presentations (Google Slides, Pitch, etc.)
 * and navigates through pages automatically.
 *
 * Usage:
 *   node scripts/capture-presentation.js <url> [options]
 *
 * Options:
 *   --output-dir <dir>    Output directory for screenshots (default: ./slides)
 *   --max-slides <num>    Maximum number of slides to capture (default: 50)
 *   --delay <ms>          Delay between slides in ms (default: 2000)
 *   --headless            Run in headless mode (default: false for debugging)
 *
 * Examples:
 *   node scripts/capture-presentation.js "https://docs.google.com/presentation/d/..."
 *   node scripts/capture-presentation.js "https://pitch.com/..." --output-dir ./pitch-deck
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
Presentation Slide Capture Script

Usage:
  node scripts/capture-presentation.js <url> [options]

Options:
  --output-dir <dir>    Output directory for screenshots (default: ./slides)
  --max-slides <num>    Maximum number of slides to capture (default: 50)
  --delay <ms>          Delay between slides in ms (default: 2000)
  --headless            Run in headless mode (default: false)
  --email <email>       Email for deck access gates (default: elad@notalone.xyz)
  --help, -h            Show this help message

Examples:
  node scripts/capture-presentation.js "https://docs.google.com/presentation/d/..."
  node scripts/capture-presentation.js "https://pitch.com/..." --output-dir ./pitch-deck
    `);
    process.exit(0);
  }

  const config = {
    url: args[0],
    outputDir: './slides',
    maxSlides: 50,
    delay: 2000,
    headless: false,
    email: 'elad@notalone.xyz',  // Default email for deck access requests
    password: null  // Password for password-protected documents
  };

  for (let i = 1; i < args.length; i++) {
    switch (args[i]) {
      case '--output-dir':
        config.outputDir = args[++i];
        break;
      case '--max-slides':
        config.maxSlides = parseInt(args[++i]);
        break;
      case '--delay':
        config.delay = parseInt(args[++i]);
        break;
      case '--headless':
        config.headless = true;
        break;
      case '--email':
        config.email = args[++i];
        break;
      case '--password':
        config.password = args[++i];
        break;
    }
  }

  return config;
}

// Detect presentation platform and get navigation strategy
function detectPlatform(url) {
  if (url.includes('docs.google.com/presentation')) {
    return {
      name: 'Google Slides',
      nextSelector: '[aria-label="Next slide"]',
      slideNumberSelector: '.goog-flat-menu-button-caption',
      containerSelector: '#canvas-container'
    };
  } else if (url.includes('pitch.com')) {
    return {
      name: 'Pitch',
      nextSelector: '[data-testid="next-slide-button"]',
      slideNumberSelector: '[data-testid="slide-counter"]',
      containerSelector: '.slide-container'
    };
  } else if (url.includes('docsend.com')) {
    return {
      name: 'DocSend',
      nextSelector: '[data-testid="next-page-button"], .next-page-button, [aria-label="Next page"], button[class*="next"]',
      slideNumberSelector: '.page-number, [data-testid="page-indicator"]',
      containerSelector: '.document-viewer, .page-container'
    };
  } else if (url.includes('canva.com/design') || url.includes('canva.com')) {
    return {
      name: 'Canva',
      nextSelector: '[aria-label="Next page"], [data-test-id="next-page-button"], button[aria-label*="Next"]',
      slideNumberSelector: '.page-indicator, [data-test-id="page-number"]',
      containerSelector: '.presentation-canvas, [role="main"], main'
    };
  } else {
    // Generic fallback
    return {
      name: 'Generic',
      nextSelector: null, // Will use arrow keys
      slideNumberSelector: null,
      containerSelector: 'body'
    };
  }
}

// Main capture function
async function capturePresentation(config) {
  console.log(`🚀 Starting presentation capture...`);
  console.log(`📍 URL: ${config.url}`);
  console.log(`📁 Output: ${config.outputDir}`);

  // Create output directory
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
    console.log(`✅ Created output directory: ${config.outputDir}`);
  }

  const platform = detectPlatform(config.url);
  console.log(`🎯 Detected platform: ${platform.name}`);

  // Launch browser
  const browser = await chromium.launch({
    headless: config.headless,
    args: ['--start-maximized']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  try {
    console.log(`📖 Loading presentation...`);
    await page.goto(config.url, { waitUntil: 'networkidle', timeout: 60000 });

    // Wait for presentation to load (longer for Canva)
    const waitTime = platform.name === 'Canva' ? 5000 : 3000;
    await page.waitForTimeout(waitTime);

    // Check for email access gate and handle it
    await handleEmailAccessGate(page, config.email, config.password);

    // Dismiss cookie banner if present - try multiple times with delays
    await dismissCookieBanner(page);
    await page.waitForTimeout(1000);
    await dismissCookieBanner(page);  // Try again in case it reappeared
    await page.waitForTimeout(500);

    // Focus for keyboard navigation - platform specific
    if (platform.name === 'Canva') {
      // For Canva: DON'T click center (advances slide). Click on nav area or use Tab
      // First, check if we're not on slide 1 and navigate back
      const slideIndicator = await page.$eval('[class*="page"] span, .page-indicator', el => el.textContent).catch(() => null);
      if (slideIndicator && !slideIndicator.includes('1 /') && !slideIndicator.startsWith('1/')) {
        console.log(`📍 Canva not on slide 1, navigating to first slide...`);
        // Press Home key to go to first slide
        await page.keyboard.press('Home');
        await page.waitForTimeout(1500);
      }
      // Focus by pressing Tab then Escape to ensure keyboard nav works without advancing
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    } else {
      // For other platforms: click on document area to restore focus
      await page.mouse.click(960, 540);  // Center of 1920x1080 viewport
      await page.waitForTimeout(300);
    }

    // Check if we need to start presentation mode
    await tryStartPresentationMode(page, platform);

    console.log(`📸 Starting slide capture...`);

    const slides = [];
    let slideNumber = 1;
    let consecutiveFailures = 0;

    while (slideNumber <= config.maxSlides && consecutiveFailures < 3) {
      console.log(`\n📷 Capturing slide ${slideNumber}...`);

      try {
        // Wait for current slide to fully render
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(config.delay);

        // Dismiss any cookie/consent banners before taking screenshot
        await dismissCookieBanner(page);

        // Take screenshot of CURRENT slide
        const screenshotPath = path.join(
          config.outputDir,
          `slide-${String(slideNumber).padStart(3, '0')}.png`
        );

        await page.screenshot({
          path: screenshotPath,
          fullPage: false
        });

        console.log(`✅ Saved: ${screenshotPath}`);

        slides.push({
          number: slideNumber,
          path: screenshotPath,
          timestamp: new Date().toISOString()
        });

        // NOW navigate to next slide for the NEXT iteration
        console.log(`⏭️  Navigating to next slide...`);

        // Platform-specific navigation
        if (platform.name === 'Canva') {
          // Check if we've reached the Canva end screen before navigating
          const isEndScreen = await page.evaluate(() => {
            const bodyText = document.body.innerText;
            return bodyText.includes('Thanks for viewing') ||
                   bodyText.includes('Create your own design') ||
                   bodyText.includes('Restart');
          });

          if (isEndScreen) {
            console.log(`🏁 Detected Canva end screen. Stopping capture.`);
            break;
          }

          await page.keyboard.press('ArrowRight');
          await page.waitForTimeout(1500); // Wait for transition

          // Check again after navigation if we've hit the end screen
          const isNowEndScreen = await page.evaluate(() => {
            const bodyText = document.body.innerText;
            return bodyText.includes('Thanks for viewing') ||
                   bodyText.includes('Create your own design') ||
                   bodyText.includes('Restart');
          });

          if (isNowEndScreen) {
            console.log(`🏁 Reached Canva end screen. Stopping capture.`);
            break;
          }
        } else if (platform.name === 'DocSend') {
          // DocSend navigation - click on right side of document or use keyboard
          const navigated = await navigateDocSend(page);
          if (!navigated) {
            console.log(`⚠️  Could not navigate to next slide. Assuming end of presentation.`);
            break;
          }
        } else {
          const navigated = await navigateToNextSlide(page, platform);
          if (!navigated) {
            console.log(`⚠️  Could not navigate to next slide. Assuming end of presentation.`);
            break;
          }
        }

        consecutiveFailures = 0;
        slideNumber++;

      } catch (error) {
        console.error(`❌ Error capturing slide ${slideNumber}:`, error.message);
        consecutiveFailures++;

        if (consecutiveFailures >= 3) {
          console.log(`⚠️  Too many consecutive failures. Stopping.`);
          break;
        }
      }
    }

    console.log(`\n✨ Capture complete!`);
    console.log(`📊 Total slides captured: ${slides.length}`);

    // Save metadata
    const metadataPath = path.join(config.outputDir, 'metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify({
      url: config.url,
      platform: platform.name,
      captureDate: new Date().toISOString(),
      totalSlides: slides.length,
      slides: slides
    }, null, 2));

    console.log(`📝 Metadata saved: ${metadataPath}`);

    return slides;

  } catch (error) {
    console.error(`❌ Fatal error:`, error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Handle email access gates (DocSend, Pitch, etc. that require email to view)
async function handleEmailAccessGate(page, email, password = null) {
  try {
    console.log(`🔐 Checking for email access gate...`);

    // First, handle cookie consent banners that might block interaction
    try {
      const cookieButtons = ['button:has-text("Accept All")', 'button:has-text("Accept")', 'button:has-text("OK")'];
      for (const selector of cookieButtons) {
        const btn = await page.$(selector);
        if (btn && await btn.isVisible()) {
          console.log(`🍪 Dismissing cookie banner...`);
          await btn.click();
          await page.waitForTimeout(500);
          break;
        }
      }
    } catch (e) { /* ignore */ }

    // Common email input selectors across platforms
    const emailSelectors = [
      // DocSend - specific patterns (modal with Email label)
      'input[type="email"]',
      'input[name="email"]',
      'input[id="email"]',
      // DocSend modal - look for input near "Email" label
      'label:has-text("Email") + input',
      'label:has-text("Email") ~ input',
      '.modal input[type="text"]',
      '[role="dialog"] input[type="text"]',
      '[role="dialog"] input[type="email"]',
      '[role="dialog"] input',
      // Pitch
      'input[name="visitor_email"]',
      // Generic
      'input[placeholder*="email" i]',
      'input[placeholder*="Email" i]',
      'input[id*="email" i]',
      'input[data-testid*="email" i]',
      'input[autocomplete="email"]',
      '#email',
      '.email-input',
      '[data-cy="email-input"]',
      // Fallback - any visible text input in a form
      'form input[type="text"]'
    ];

    // Wait a bit more for modal to appear
    await page.waitForTimeout(2000);

    // Try specific DocSend selector first by ID
    const docsendEmailInput = await page.$('#link_auth_form_email');
    if (docsendEmailInput) {
      console.log(`📧 Found DocSend email input by ID, entering: ${email}`);
      try {
        await docsendEmailInput.click({ force: true });
        await docsendEmailInput.fill(email);

        // Check if password field exists
        const passwordInput = await page.$('#link_auth_form_passcode');
        if (passwordInput && password) {
          console.log(`🔐 Found password field, entering password...`);
          await passwordInput.click();
          await passwordInput.fill(password);
        }

        // Click Continue button
        const continueBtn = await page.$('button:has-text("Continue")');
        if (continueBtn) {
          console.log(`✅ Clicking Continue...`);
          await continueBtn.click();
          await page.waitForTimeout(3000);
          await page.waitForLoadState('networkidle');
          console.log(`✅ Email access granted`);
          return true;
        }
      } catch (e) {
        console.log(`⚠️  DocSend specific handling failed: ${e.message}`);
      }
    }

    // Try each generic selector
    for (const selector of emailSelectors) {
      try {
        // Get ALL matching elements and check each one
        const emailInputs = await page.$$(selector);
        for (const emailInput of emailInputs) {
          // Check both Playwright visibility and DOM visibility
          const isPlaywrightVisible = await emailInput.isVisible();
          const isDomVisible = await emailInput.evaluate(el => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            return rect.width > 0 && rect.height > 0 &&
                   style.display !== 'none' &&
                   style.visibility !== 'hidden' &&
                   style.opacity !== '0';
          });


          // Use either visibility check
          if (isPlaywrightVisible || isDomVisible) {
            console.log(`📧 Found email gate, entering: ${email}`);

            // Clear any existing value and type email
            await emailInput.click();
            await emailInput.fill(email);

            // Look for submit button
            const submitSelectors = [
              // DocSend specific
              'button:has-text("Continue")',
              '[role="dialog"] button',
              '.modal button',
              // Generic
              'button[type="submit"]',
              'input[type="submit"]',
              'button:has-text("Submit")',
              'button:has-text("View")',
              'button:has-text("Access")',
              'button:has-text("Get access")',
              'button:has-text("Enter")',
              'button:has-text("Verify")',
              '[data-testid*="submit" i]',
              '.submit-button',
              'form button'
            ];

            for (const btnSelector of submitSelectors) {
              try {
                const submitBtn = await page.$(btnSelector);
                if (submitBtn && await submitBtn.isVisible()) {
                  console.log(`✅ Submitting email...`);
                  await submitBtn.click();

                  // Wait for page to process
                  await page.waitForTimeout(3000);
                  await page.waitForLoadState('networkidle');

                  console.log(`✅ Email access granted`);
                  return true;
                }
              } catch (e) {
                // Try next selector
              }
            }

            // If no button found, try pressing Enter
            console.log(`⏎ No submit button found, pressing Enter...`);
            await page.keyboard.press('Enter');
            await page.waitForTimeout(3000);
            await page.waitForLoadState('networkidle');

            console.log(`✅ Email submitted`);
            return true;
          }
        }
      } catch (e) {
        // Try next selector
      }
    }

    console.log(`✅ No email gate detected, proceeding...`);
    return false;

  } catch (error) {
    console.log(`⚠️  Email gate handling error: ${error.message}`);
    return false;
  }
}

// Dismiss cookie/consent banners
async function dismissCookieBanner(page) {
  try {
    // Check if there's a cookie banner visible first
    const hasBanner = await page.evaluate(() => {
      const text = document.body.innerText.toLowerCase();
      return text.includes('we use cookies') || text.includes('cookie') && text.includes('privacy');
    });

    if (!hasBanner) {
      return false;
    }

    console.log(`🍪 Cookie banner detected, attempting to dismiss...`);

    // Check for iframes that might contain the cookie banner (common on DocSend, etc.)
    const frames = page.frames();

    // Try to click Decline or Accept All in each frame
    for (const frame of frames) {
      try {
        const declineBtn = await frame.$('button:has-text("Decline")');
        if (declineBtn) {
          await declineBtn.click();
          console.log(`🍪 Dismissed cookie banner (Decline)`);
          await page.waitForTimeout(500);
          return true;
        }
        const acceptBtn = await frame.$('button:has-text("Accept All")');
        if (acceptBtn) {
          await acceptBtn.click();
          console.log(`🍪 Dismissed cookie banner (Accept All)`);
          await page.waitForTimeout(500);
          return true;
        }
      } catch (e) { /* try next frame */ }
    }

    // Fallback: Try clicking buttons in main page by coordinates
    const buttonInfo = await page.evaluate(() => {
      const clickables = document.querySelectorAll('button, [role="button"]');
      for (const btn of clickables) {
        const text = btn.textContent.trim();
        if (text.includes('Decline') || text.includes('Accept All') || text === 'Accept') {
          const rect = btn.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
          }
        }
      }
      return null;
    });

    if (buttonInfo) {
      await page.mouse.click(buttonInfo.x, buttonInfo.y);
      console.log(`🍪 Dismissed cookie banner (mouse click)`);
      await page.waitForTimeout(500);
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}

// DocSend-specific navigation
async function navigateDocSend(page) {
  try {
    // Get current page number from UI (format: "1 / 26")
    const pageText = await page.$eval('[class*="page"]', el => el.textContent).catch(() => null);
    const currentPage = pageText ? parseInt(pageText.split('/')[0].trim()) : 0;

    // Method 1: Click the right arrow/next button if visible
    const nextButtons = [
      '[data-testid="next-page-button"]',
      '[aria-label="Next page"]',
      'button[class*="next"]',
      '.next-button',
      '[class*="NavigationButton"][class*="right"]'
    ];

    for (const selector of nextButtons) {
      const btn = await page.$(selector);
      if (btn && await btn.isVisible()) {
        await btn.click();
        await page.waitForTimeout(1000);
        console.log(`✓ DocSend navigation succeeded (button click)`);
        return true;
      }
    }

    // Method 2: Click on the right side of the document viewer
    const viewer = await page.$('.document-viewer, .page-container, [class*="DocumentPage"], main');
    if (viewer) {
      const box = await viewer.boundingBox();
      if (box) {
        // Click on the right third of the viewer
        await page.mouse.click(box.x + box.width * 0.85, box.y + box.height * 0.5);
        await page.waitForTimeout(1000);

        // Check if page changed
        const newPageText = await page.$eval('[class*="page"]', el => el.textContent).catch(() => null);
        const newPage = newPageText ? parseInt(newPageText.split('/')[0].trim()) : 0;
        if (newPage > currentPage) {
          console.log(`✓ DocSend navigation succeeded (click right side)`);
          return true;
        }
      }
    }

    // Method 3: Keyboard navigation
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(800);

    // Check if page changed
    const afterKeyPageText = await page.$eval('[class*="page"]', el => el.textContent).catch(() => null);
    const afterKeyPage = afterKeyPageText ? parseInt(afterKeyPageText.split('/')[0].trim()) : 0;
    if (afterKeyPage > currentPage) {
      console.log(`✓ DocSend navigation succeeded (ArrowRight)`);
      return true;
    }

    // Method 4: Page Down
    await page.keyboard.press('PageDown');
    await page.waitForTimeout(800);

    const afterPgDnPageText = await page.$eval('[class*="page"]', el => el.textContent).catch(() => null);
    const afterPgDnPage = afterPgDnPageText ? parseInt(afterPgDnPageText.split('/')[0].trim()) : 0;
    if (afterPgDnPage > currentPage) {
      console.log(`✓ DocSend navigation succeeded (PageDown)`);
      return true;
    }

    console.log(`⚠️  DocSend navigation: no method worked`);
    return false;

  } catch (error) {
    console.error(`❌ DocSend navigation error:`, error.message);
    return false;
  }
}

// Try to start presentation mode (for platforms that require it)
async function tryStartPresentationMode(page, platform) {
  try {
    if (platform.name === 'Google Slides') {
      // Click present button if available
      const presentButton = await page.$('[aria-label="Start presentation"]');
      if (presentButton) {
        console.log(`▶️  Starting presentation mode...`);
        await presentButton.click();
        await page.waitForTimeout(2000);
      }
    }
  } catch (error) {
    console.log(`⚠️  Could not start presentation mode (may not be needed)`);
  }
}

// Navigate to next slide
async function navigateToNextSlide(page, platform) {
  try {
    // Capture current page state to detect changes
    const beforeState = await page.evaluate(() => {
      // Get a snapshot of current content
      const body = document.body;
      return {
        html: body.innerHTML.substring(0, 1000), // First 1000 chars as fingerprint
        scrollPos: window.scrollY,
        activeElement: document.activeElement?.tagName
      };
    });

    // Try platform-specific selector first
    if (platform.nextSelector) {
      const nextButton = await page.$(platform.nextSelector);
      if (nextButton) {
        await nextButton.click();
        await page.waitForTimeout(800);

        // Check if content changed
        const changed = await didPageChange(page, beforeState);
        if (changed) {
          console.log(`✓ Navigation succeeded (button click)`);
          return true;
        }
      }
    }

    // Fallback: try keyboard navigation methods

    // Method 1: Arrow Right key (most common)
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(800);

    let changed = await didPageChange(page, beforeState);
    if (changed) {
      console.log(`✓ Navigation succeeded (ArrowRight)`);
      return true;
    }

    // Method 2: Space key
    await page.keyboard.press('Space');
    await page.waitForTimeout(800);

    changed = await didPageChange(page, beforeState);
    if (changed) {
      console.log(`✓ Navigation succeeded (Space)`);
      return true;
    }

    // Method 3: Page Down
    await page.keyboard.press('PageDown');
    await page.waitForTimeout(800);

    changed = await didPageChange(page, beforeState);
    if (changed) {
      console.log(`✓ Navigation succeeded (PageDown)`);
      return true;
    }

    // No method worked - we're at the end
    console.log(`⚠️  No navigation method changed the page - likely at end`);
    return false;

  } catch (error) {
    console.error(`❌ Navigation error:`, error.message);
    return false;
  }
}

// Helper: Detect if page content actually changed
async function didPageChange(page, beforeState) {
  const afterState = await page.evaluate(() => {
    const body = document.body;
    return {
      html: body.innerHTML.substring(0, 1000),
      scrollPos: window.scrollY,
      activeElement: document.activeElement?.tagName
    };
  });

  // Check if content changed meaningfully
  const htmlChanged = beforeState.html !== afterState.html;
  const scrollChanged = Math.abs(beforeState.scrollPos - afterState.scrollPos) > 50;

  return htmlChanged || scrollChanged;
}

// Run the script
(async () => {
  try {
    const config = parseArgs();
    await capturePresentation(config);
    process.exit(0);
  } catch (error) {
    console.error(`\n❌ Script failed:`, error);
    process.exit(1);
  }
})();
