# Airtable Setup Guide for Israeli Tech Ecosystem Database

## Quick Start

### Step 1: Create New Base
1. Go to [Airtable](https://airtable.com) and create new base
2. Name it: "Notalone Israeli Tech Ecosystem"

### Step 2: Import Tables in Order

Import CSV files in this exact order (relationships depend on it):

| Order | Table Name | CSV File | Records |
|-------|-----------|----------|---------|
| 1 | Institutions | 01_institutions.csv | 16 |
| 2 | Companies | 02_companies.csv | 28 |
| 3 | People | 03_people.csv | 33 |
| 4 | Employment History | 04_employment_history.csv | 57 |
| 5 | Education Records | 05_education_records.csv | 14 |
| 6 | Military Service | 06_military_service.csv | 11 |
| 7 | Investment Relationships | 07_investment_relationships.csv | 11 |
| 8 | Board Positions | 08_board_positions.csv | 8 |
| 9 | Funding Rounds | 09_funding_rounds.csv | 26 |
| 10 | Acquisitions | 10_acquisitions.csv | 13 |
| 11 | Co-Founder Relationships | 11_cofounder_relationships.csv | 18 |
| 12 | Person Connections | 12_person_connections.csv | 16 |
| 13 | LP Prospects | 13_lp_prospects.csv | 16 |

### Step 3: Convert Text to Links

After import, convert these columns to "Link to another record":

**People table:**
- Current Company → Link to Companies

**Employment History table:**
- Person → Link to People
- Company → Link to Companies

**Education Records table:**
- Person → Link to People
- Institution → Link to Institutions

**Military Service table:**
- Person → Link to People
- Unit → Link to Institutions

**Investment Relationships table:**
- Investor → Link to People
- Company → Link to Companies

**LP Prospects table:**
- Person → Link to People

### Step 4: Create Key Views

**People Table Views:**
1. "Hot LP Prospects" - Filter: LP Potential = "Hot"
2. "8200 Alumni" - Filter: Is 8200 Alumni = TRUE
3. "Exit Millionaires" - Filter: LP Segment = "Exit Millionaire"
4. "Crypto OGs" - Filter: LP Segment = "Crypto OG"

**Companies Table Views:**
1. "Active Startups" - Filter: Status = "Active"
2. "Successful Exits" - Filter: Exit Value > 0
3. "Crypto/Web3" - Filter: Sector = "Crypto/Web3"

**Employment History Views:**
1. "Modu Alumni" - Filter: Company = "Modu"
2. "Check Point Alumni" - Filter: Company = "Check Point"
3. "Current Positions" - Filter: Is Current = TRUE

---

## Kumu.io Visualization Setup

### Step 1: Create Kumu Account
Go to [Kumu.io](https://kumu.io) - free tier available

### Step 2: Create New Project
- Name: "Israeli Tech Ecosystem"
- Template: "Network"

### Step 3: Import Data
1. Click "Import" → "Spreadsheet (Excel/CSV)"
2. Upload `kumu/elements.csv` first (nodes)
3. Upload `kumu/connections.csv` second (edges)

### Step 4: Configure Visualization
- Color elements by: Type (Person = blue, Company = green, Institution = yellow)
- Size nodes by: Net Worth or LP Potential
- Cluster by: Location or Sector

### Step 5: Key Queries to Explore

**"Where did Modu alumni go?"**
- Filter: connections where From = "Modu"
- Shows talent dispersion pattern

**"8200 Network"**
- Filter: connections where To = "Unit 8200"
- Shows military-to-startup pipeline

**"Check Point Mafia"**
- Filter: connections where From/To includes "Check Point"
- Shows cyber ecosystem origin

---

## Database Statistics

| Category | Count |
|----------|-------|
| People | 33 |
| Companies | 28 |
| Institutions | 16 |
| Employment Records | 57 |
| Investment Relationships | 11 |
| Acquisitions Tracked | 13 |
| Total Exit Value Tracked | $68B+ |

## LP Prospect Summary

| Segment | Count | Priority |
|---------|-------|----------|
| Hot Leads | 6 | Tier 1 |
| Warm Leads | 7 | Tier 2-3 |
| Connectors | 4 | Amplification |

**Recommended Outreach Order:**
1. Ben Samocha (existing contact)
2. Avishay Ovadia (via Ben)
3. Itay Malinger (via Ben/Avishay)
4. Ido Ben-Natan (via Avishay)
5. Omer Goldberg (via Avishay)

---

## Maintenance

### Adding New People
1. Add to People table
2. Add employment history records
3. Add any education/military records
4. Update LP Prospects if relevant

### Tracking New Exits
1. Update Companies table with exit details
2. Update People net worth estimates
3. Move to appropriate LP segment

### Updating Connections
1. Add to Person Connections table
2. Re-export to Kumu if visualization needed
