# Kumu Settings Template for Israeli Tech Ecosystem

## How to Apply Settings

1. Open your Kumu project
2. Click the **Settings icon** (gear) on the right sidebar
3. Click **Advanced Editor** at the bottom
4. Paste the code below and click **Save**

## Color & Style Settings (Copy-Paste This)

```css
@settings {
  template: stakeholder;
  layout: force;
  layout-gravity: 0.0001;
}

/* === ELEMENT COLORS BY TYPE === */

/* People - Blue */
element[Type="Person"] {
  color: #3B82F6;
  shape: circle;
}

/* Companies - Green */
element[Type="Company"] {
  color: #10B981;
  shape: square;
}

/* Institutions - Yellow/Gold */
element[Type="Institution"] {
  color: #F59E0B;
  shape: triangle;
}

/* === SIZE BY LP POTENTIAL === */

element["LP Potential"="Hot"] {
  scale: 2;
  shadow-color: #EF4444;
  shadow-size: 3;
  shadow-opacity: 0.5;
}

element["LP Potential"="Warm"] {
  scale: 1.5;
}

element["LP Potential"="Cold"] {
  scale: 1;
  opacity: 0.7;
}

element["LP Potential"="Not Relevant"] {
  scale: 0.8;
  opacity: 0.5;
}

/* === 8200 ALUMNI HIGHLIGHT === */

element["8200 Alumni"="Yes"] {
  border-color: #DC2626;
  border-width: 3;
}

/* === SECTOR COLORS (Alternative to Type) === */

element[Sector="Crypto/Web3"] {
  color: #8B5CF6;
}

element[Sector="Cybersecurity"] {
  color: #06B6D4;
}

element[Sector="VC"] {
  color: #22C55E;
}

element[Sector="Investor"] {
  color: #22C55E;
}

element[Sector="Consumer"] {
  color: #F97316;
}

element[Sector="Academic"] {
  color: #6366F1;
}

element[Sector="Connector"] {
  color: #EC4899;
  shape: hexagon;
}

/* === CONNECTION STYLING === */

connection[Type="Founded"] {
  color: #10B981;
  width: 3;
}

connection[Type="Co-Founder With"] {
  color: #8B5CF6;
  width: 4;
  style: dashed;
}

connection[Type="Invested In"] {
  color: #F59E0B;
  width: 2;
}

connection[Type="Acquired"] {
  color: #EF4444;
  width: 5;
}

connection[Type="Served In"] {
  color: #DC2626;
  width: 2;
  style: dotted;
}

connection[Type="Educated At"] {
  color: #6366F1;
  width: 1;
  style: dotted;
}

connection[Type="Works At"] {
  color: #94A3B8;
  width: 2;
}

connection[Type="Worked At"] {
  color: #CBD5E1;
  width: 1;
  style: dashed;
}

connection[Type="Connected To"] {
  color: #EC4899;
  width: 3;
  style: dashed;
}

/* === STRENGTH MODIFIER === */

connection[Strength="Strong"] {
  width: 4;
}

connection[Strength="Medium"] {
  width: 2;
}

/* === LABELS - ALWAYS VISIBLE === */

element {
  label: "{{Label}}";
  font-size: 14;
  font-color: #1F2937;
  font-weight: bold;
  text-align: center;
}

element[Type="Person"] {
  label: "{{Label}}";
}

element[Type="Company"] {
  label: "{{Label}}";
}

element[Type="Institution"] {
  label: "{{Label}}";
}

connection {
  label: "{{Type}}";
  font-size: 10;
  font-color: #6B7280;
}

/* === IMAGES === */

element {
  image-url: "{{image}}";
  image-size: cover;
}
```

## Quick Views to Create

### View 1: "Hot LP Prospects"
- Filter: `LP Potential` = "Hot"
- Focus: Shows only high-priority targets

### View 2: "8200 Network"
- Filter: `8200 Alumni` = "Yes"
- Focus: Military intelligence alumni connections

### View 3: "Crypto Companies"
- Filter: `Sector` = "Crypto/Web3" AND `Type` = "Company"
- Focus: Crypto/Web3 ecosystem

### View 4: "Investment Flow"
- Filter: Connection `Type` = "Invested In" OR "Founded"
- Focus: Money and founding relationships

### View 5: "Warm Intro Paths"
- Filter: Connection `Type` = "Connected To"
- Focus: Existing relationships for introductions

## Image Field

The CSV now includes an `Image` column with:
- **Company logos** from Clearbit (where available)
- **Institution logos** (Technion, Bar-Ilan, IDF)
- **People** - left empty (add LinkedIn/headshot URLs manually)

Kumu will automatically display these as node images.

## Legend

| Color | Meaning |
|-------|---------|
| Blue | Person |
| Green | Company / VC |
| Yellow | Institution |
| Purple | Crypto/Web3 |
| Cyan | Cybersecurity |
| Orange | Consumer |
| Pink | Connector |
| Red Border | 8200 Alumni |
| Red Glow | Hot LP Prospect |
