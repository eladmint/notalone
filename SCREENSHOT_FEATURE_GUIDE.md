# Screenshot Feature Guide

## Overview

The blurb-writer agent now supports capturing screenshots from web-based pitch decks that can't be downloaded. This allows you to extract information from presentations hosted on Google Slides, Pitch, DocSend, and other platforms.

---

## Installation

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `playwright`: Browser automation library
- `@notionhq/client`: Existing Notion integration

### 2. Install Browser Binaries

Playwright requires browser binaries (Chromium in this case):

```bash
npm run install-browsers
```

Or directly:
```bash
npx playwright install chromium
```

---

## How to Use

### Method 1: Via the Agent (Recommended)

Invoke the agent with a web-based deck URL:

```
@agent-blurb-writer I have this deck: https://docs.google.com/presentation/d/abc123/edit
```

The agent will:
1. Detect it's a web-based deck
2. Offer to capture screenshots
3. Run the capture script
4. Read the screenshots to extract information
5. Generate the blurb with extracted details

### Method 2: Manual Script Execution

Run the script directly:

```bash
# Basic usage
node scripts/capture-presentation.js "https://docs.google.com/presentation/d/abc123/edit"

# With custom output directory
node scripts/capture-presentation.js "https://pitch.com/..." --output-dir ./my-deck

# Limit slides and run headless
node scripts/capture-presentation.js "https://docsend.com/..." --max-slides 20 --headless
```

---

## Supported Platforms

The script automatically detects and optimizes for:

| Platform | Detection | Navigation Method |
|----------|-----------|-------------------|
| **Google Slides** | `docs.google.com/presentation` | Next slide button + Arrow keys |
| **Pitch** | `pitch.com` | Next slide button |
| **DocSend** | `docsend.com` | Next page button |
| **Canva** | `canva.com/design` | Next page button |
| **Generic** | Any other URL | Keyboard navigation (Arrow Right, Space) |

---

## Script Options

```bash
node scripts/capture-presentation.js <url> [options]
```

### Required Arguments

- `<url>`: The presentation URL (quoted)

### Optional Arguments

| Option | Description | Default |
|--------|-------------|---------|
| `--output-dir <dir>` | Directory to save screenshots | `./slides` |
| `--max-slides <num>` | Maximum number of slides to capture | `50` |
| `--delay <ms>` | Delay between slides (milliseconds) | `2000` |
| `--headless` | Run browser in headless mode | `false` (visible) |
| `--help`, `-h` | Show help message | - |

---

## Output Structure

After running the script, you'll get:

```
./slides/                    # or your custom output directory
├── slide-001.png           # First slide
├── slide-002.png           # Second slide
├── slide-003.png           # Third slide
├── ...
└── metadata.json           # Capture metadata
```

### metadata.json

Contains information about the capture:

```json
{
  "url": "https://docs.google.com/presentation/d/...",
  "platform": "Google Slides",
  "captureDate": "2025-12-05T11:00:00.000Z",
  "totalSlides": 15,
  "slides": [
    {
      "number": 1,
      "path": "./slides/slide-001.png",
      "timestamp": "2025-12-05T11:00:05.000Z"
    },
    // ... more slides
  ]
}
```

---

## Examples

### Example 1: Google Slides Deck

```bash
# Capture a Google Slides presentation
node scripts/capture-presentation.js \
  "https://docs.google.com/presentation/d/1abc123/edit" \
  --output-dir ./catapult-deck \
  --max-slides 30
```

**Output:**
```
🚀 Starting presentation capture...
📍 URL: https://docs.google.com/presentation/d/1abc123/edit
📁 Output: ./catapult-deck
🎯 Detected platform: Google Slides
📖 Loading presentation...
▶️  Starting presentation mode...
📸 Starting slide capture...

📷 Capturing slide 1...
✅ Saved: ./catapult-deck/slide-001.png

📷 Capturing slide 2...
✅ Saved: ./catapult-deck/slide-002.png

...

✨ Capture complete!
📊 Total slides captured: 15
📝 Metadata saved: ./catapult-deck/metadata.json
```

### Example 2: Pitch Deck

```bash
# Capture a Pitch presentation with fewer slides
node scripts/capture-presentation.js \
  "https://pitch.com/public/abc-xyz-123" \
  --output-dir ./pitch-deck \
  --max-slides 15 \
  --delay 3000
```

### Example 3: DocSend (Headless)

```bash
# Capture DocSend in background (headless mode)
node scripts/capture-presentation.js \
  "https://docsend.com/view/abc123" \
  --output-dir ./docsend-deck \
  --headless
```

---

## Agent Workflow Example

**Full workflow using the agent:**

1. **User provides deck URL:**
   ```
   @agent-blurb-writer Create a blurb for this opportunity:

   Deck: https://docs.google.com/presentation/d/abc123/edit
   ```

2. **Agent captures screenshots:**
   ```bash
   node scripts/capture-presentation.js \
     "https://docs.google.com/presentation/d/abc123/edit" \
     --output-dir ./deck-screenshots
   ```

3. **Agent reads screenshots:**
   - slide-001.png (title slide - company name, tagline)
   - slide-002.png (problem/solution)
   - slide-003.png (traction metrics)
   - slide-004.png (team)
   - slide-005.png (financials)
   - etc.

4. **Agent extracts information:**
   - Company: DeFiSwap
   - Tagline: "Cross-chain DeFi aggregator"
   - Traction: $15M volume, 10K users in 2 weeks
   - Team: Ex-Coinbase, Ex-Uniswap founders
   - Raise: $2M at $20M FDV

5. **Agent generates blurb:**
   ```
   DeFiSwap | Cross-chain DeFi aggregator | Raising $2M @ $20M FDV | Deck

   Built by ex-Coinbase and ex-Uniswap founders, DeFiSwap aggregates liquidity
   across multiple chains for optimal trade execution.

   Traction:
   - $15M volume in 2 weeks
   - 10K active users
   - 50K+ transactions
   - Live on 5 chains

   Team:
   - John Doe: Ex-Coinbase Protocol Lead
   - Jane Smith: Ex-Uniswap Smart Contract Engineer

   The Deal: $2M @ $20M FDV
   - Entry: $0.20 per token
   - TGE: Q1 2026

   Deck: https://docs.google.com/presentation/d/abc123/edit
   ```

---

## Troubleshooting

### Issue: "Playwright not installed"

**Solution:**
```bash
npm install
npm run install-browsers
```

### Issue: "Could not navigate to next slide"

**Causes:**
- Presentation reached the end
- Platform changed its UI
- Network issues

**Solution:**
- The script will stop automatically after 3 consecutive failures
- Check captured slides in the output directory
- Try increasing `--delay` if slides are loading slowly

### Issue: "Script hangs on certain platforms"

**Solution:**
- Use `--headless` mode for better stability
- Increase `--delay` to give pages more time to load
- Try `--max-slides` with a lower number first

### Issue: Screenshots are blank

**Causes:**
- Slides haven't fully rendered
- Authentication required
- Platform blocks automation

**Solution:**
- Increase `--delay` (try 3000-5000ms)
- For authenticated platforms: manually login, then run without `--headless`
- Some platforms (e.g., DocSend with email gates) may require manual access

---

## Technical Details

### How It Works

1. **Browser Launch**: Uses Playwright's Chromium to open the URL
2. **Platform Detection**: Analyzes URL to determine presentation platform
3. **Navigation Strategy**: Uses platform-specific selectors or keyboard fallback
4. **Screenshot Capture**: Full-page screenshots at 1920x1080 resolution
5. **Metadata Tracking**: Records slide number, path, timestamp for each capture

### Navigation Methods

The script tries multiple navigation methods in order:

1. **Platform-specific button**: Uses CSS selector for "Next" button
2. **Arrow Right key**: Universal keyboard navigation
3. **Space key**: Alternative keyboard navigation

### Screenshot Format

- **Format**: PNG
- **Resolution**: 1920x1080 (Full HD)
- **Naming**: `slide-001.png`, `slide-002.png`, etc. (zero-padded)
- **Full page**: Captures entire visible viewport

---

## Security & Privacy

### What the script does:
- ✅ Opens presentations in a local browser
- ✅ Saves screenshots to your local filesystem
- ✅ No data sent to external services
- ✅ Respects standard browser security

### What the script does NOT do:
- ❌ No authentication bypass
- ❌ No password cracking
- ❌ No screenshot of protected content without permission
- ❌ No data exfiltration

**Important:** Only capture presentations you have permission to view.

---

## Advanced Usage

### Capture with Custom Browser Size

Edit `scripts/capture-presentation.js` and modify:

```javascript
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 }  // Change these values
});
```

### Add Custom Platform Support

Add to the `detectPlatform()` function:

```javascript
else if (url.includes('your-platform.com')) {
  return {
    name: 'Your Platform',
    nextSelector: '.next-button',
    slideNumberSelector: '.slide-num',
    containerSelector: '.slide-container'
  };
}
```

### Process Screenshots in Agent

After capture, the agent can:
1. Read screenshots using the Read tool
2. Extract text and numbers using Claude's vision capabilities
3. Analyze slide content
4. Generate comprehensive blurbs

---

## NPM Scripts

### Shortcut Commands

```bash
# Capture with default settings
npm run capture-deck -- "https://docs.google.com/..."

# Install browser binaries
npm run install-browsers
```

**Note:** The `--` is required to pass arguments to the npm script.

---

## Integration with Agent

The agent is configured to:
1. Detect web-based deck URLs automatically
2. Offer to capture screenshots proactively
3. Run the script with appropriate options
4. Read and analyze the captured slides
5. Extract key information (metrics, team, etc.)
6. Generate blurbs using extracted data

**Agent tools enabled:**
- `Read`: Read screenshots and template
- `Write`: Save generated blurbs
- `Edit`: Refine existing blurbs
- `Bash`: Run the capture script

---

## Limitations

### Current Limitations

1. **Authentication**: Can't bypass login walls automatically
2. **Rate Limiting**: Some platforms may rate-limit automation
3. **Dynamic Content**: Content loaded after navigation may not be captured
4. **Platform Changes**: UI changes may break platform-specific selectors

### Workarounds

1. **Authentication**: Run without `--headless` and manually login first
2. **Rate Limiting**: Increase `--delay` between slides
3. **Dynamic Content**: Increase `--delay` to allow content to load
4. **Platform Changes**: Script falls back to keyboard navigation

---

## Best Practices

1. **Test with low slide count first**: Use `--max-slides 5` to verify it works
2. **Use visible mode initially**: Don't use `--headless` until you verify capture works
3. **Increase delay for slow connections**: Use `--delay 3000` or higher
4. **Save to descriptive directories**: Use `--output-dir ./company-name-deck`
5. **Check metadata.json**: Verify all expected slides were captured

---

## Support

For issues with:
- **Script functionality**: Check this guide's Troubleshooting section
- **Agent usage**: See `.claude/TEST_AGENT_INVOCATION.md`
- **Playwright**: Visit https://playwright.dev/docs/intro

---

**Last Updated:** 2025-12-05
**Version:** 1.0.0
