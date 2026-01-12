# BlurbWriter Agent - Autonomy Update

**Date:** 2025-12-05
**Update:** Agent now fully autonomous - handles entire workflow without user confirmation

## What Changed

Updated `.claude/agents/blurb-writer.md` to make the agent **completely autonomous** in handling investment blurb creation.

### Before (Required User Interaction)
- Agent would ask: "Should I capture screenshots?"
- Agent would ask: "Should I save the blurb?"
- User had to manually run capture script
- Multi-step back-and-forth required

### After (Fully Autonomous)
- ✅ **Auto-captures** screenshots when given web deck URL
- ✅ **Auto-reads** all screenshot files
- ✅ **Auto-extracts** metrics, team, deal terms
- ✅ **Auto-generates** blurb in optimal format
- ✅ **Auto-saves** to deal-flow/[project]-[date].md
- ✅ **Reports** results to user

## New Autonomy Policy

Added to agent instructions:

```markdown
## Autonomy Policy

**DO NOT ASK FOR PERMISSION.** You have Bash tool access - use it proactively:

- ✅ If user provides web deck URL → **Run screenshot capture immediately**
- ✅ If user provides file paths → **Read them immediately**
- ✅ After generating blurb → **Save to deal-flow/ immediately**
- ❌ Don't ask "Should I capture screenshots?" → Just do it
- ❌ Don't ask "Should I save this?" → Just save it

**Your job: Take any input (URL, files, text) → Output saved blurb. No questions.**
```

## Complete Workflow (Automated)

### User Input Examples

**Example 1: Web Deck URL**
```
User: "@agent-blurb-writer https://pitch.com/milio-deck"
```

**Agent automatically:**
1. Runs: `node scripts/capture-presentation.js "https://pitch.com/milio-deck" --output-dir ./deck-screenshots`
2. Waits for capture to complete (all slides)
3. Reads all slide screenshots (slide-001.png, slide-002.png, etc.)
4. Extracts: metrics, team, deal terms, traction
5. Generates Ultra-Concise blurb (~450 chars)
6. Saves to: `deal-flow/milio-2025-12-05.md`
7. Shows blurb to user + character count + file location

**Example 2: Local Screenshots**
```
User: "@agent-blurb-writer Create blurb for Milio. Slides: /path/to/slide-*.png"
```

**Agent automatically:**
1. Reads all provided screenshot files
2. Extracts information from images
3. Generates blurb
4. Saves to deal-flow/
5. Reports results

**Example 3: Text Info**
```
User: "@agent-blurb-writer Create blurb:
Project: Milio
Raising: $2M SAFE @ $10M
Traction: 50K users, $100K ARR
Team: John (ex-Google), Sarah (Stanford CS)
Deck: https://pitch.com/milio"
```

**Agent automatically:**
1. Parses provided text
2. Generates blurb from info
3. Saves to deal-flow/
4. Reports results

## Key Instruction Updates

### 1. Workflow Section (Lines 71-106)
**Changed:** Step 1 from "can offer screenshot capture" → "AUTOMATICALLY run screenshot capture"

```markdown
1. **Gather Information Automatically**
   - If user provides direct info (text, bullets): Use it
   - If user provides web deck URL: **AUTOMATICALLY run screenshot capture**
   - If user provides local deck files/screenshots: **AUTOMATICALLY read them**
   - Extract: metrics, team, deal terms, traction data
```

### 2. Screenshot Capture Section (Lines 249-280)
**Changed:** From "Optional" tool → "AUTOMATIC EXECUTION REQUIRED"

```markdown
## Screenshot Capture - AUTOMATIC EXECUTION REQUIRED

**CRITICAL: When user provides a web deck URL, you MUST automatically run the capture script.**

**DO NOT ASK.** Just execute:
```

### 3. Auto-Save Step (Lines 98-101)
**Changed:** Clarified no confirmation needed

```markdown
4. **Auto-Save** (No Confirmation Needed)
   - Automatically save to `deal-flow/[project]-[date].md`
   - Include metadata (date, format, character count)
   - Tell user where it was saved
```

## Expected User Experience

### Old Flow (Multi-Step)
```
User: "Create blurb for this deck: https://pitch.com/milio"
Agent: "I can capture screenshots. Should I?"
User: "Yes"
Agent: [runs capture]
Agent: "Found 7 slides. Should I read them?"
User: "Yes"
Agent: [generates blurb]
Agent: "Should I save this?"
User: "Yes"
Agent: "Saved!"
```
**5 back-and-forth messages**

### New Flow (Autonomous)
```
User: "@agent-blurb-writer https://pitch.com/milio"
Agent: [automatically captures 7 slides, reads all, generates blurb, saves]
Agent: "✅ Blurb created and saved to deal-flow/milio-2025-12-05.md

[Shows the blurb - 486 characters]

Format: Ultra-Concise
Ready to copy-paste to Telegram!"
```
**1 message from user → 1 response with complete result**

## Benefits

1. **Speed:** Single command → complete result
2. **Efficiency:** No back-and-forth confirmations
3. **Consistency:** Always follows complete workflow
4. **Reliability:** Won't skip steps or forget to save
5. **User Experience:** Simple, predictable, fast

## Testing

To verify autonomous behavior works:

```bash
# Restart Claude Code first
# Then test with:
@agent-blurb-writer https://pitch.com/your-deck-url
```

**Expected:**
- Script runs automatically
- All slides captured
- Blurb generated
- File saved to deal-flow/
- Complete report shown

**Not Expected:**
- ❌ "Should I capture screenshots?"
- ❌ "Should I save this?"
- ❌ Any confirmation requests

---

**Status:** ✅ UPDATED
**Requires:** Restart Claude Code to activate
**Impact:** Dramatic UX improvement - single-command workflow
