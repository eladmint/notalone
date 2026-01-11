# Israeli Tech Ecosystem Database
## Airtable Schema Specification

**Version:** 1.0
**Purpose:** Track talent flow, company relationships, and LP prospects in Israeli tech ecosystem
**Tables:** 15
**Primary Use Case:** LP fundraising + ecosystem intelligence

---

## Quick Setup Guide

### Option 1: Manual Setup (Recommended)
1. Create a new Airtable base called "Israeli Tech Ecosystem"
2. Create each table below in order (core tables first, then junction tables)
3. Add fields as specified
4. Link records between tables as indicated

### Option 2: CSV Import
1. Import each CSV file from the `/database/csv/` folder
2. After import, convert text fields to linked record fields
3. Add formula and rollup fields manually

---

## TABLE 1: People

**Description:** All individuals - founders, executives, investors, advisors

| Field Name | Field Type | Options/Formula | Required |
|------------|-----------|-----------------|----------|
| `Name` | Single line text | Primary field | Yes |
| `Hebrew Name` | Single line text | | No |
| `Email` | Email | | No |
| `Phone` | Phone | | No |
| `LinkedIn URL` | URL | | Yes |
| `Twitter Handle` | Single line text | | No |
| `Photo` | Attachment | | No |
| `Birth Year` | Number | Integer | No |
| `Current Role` | Single line text | | No |
| `Current Company` | Link to Companies | Allow linking to multiple: No | No |
| `Primary Type` | Single select | `Founder`, `Investor`, `Executive`, `Engineer`, `Advisor`, `Operator`, `Academic` | Yes |
| `Secondary Types` | Multiple select | Same as above | No |
| `Is 8200 Alumni` | Checkbox | | No |
| `Is Talpiot Alumni` | Checkbox | | No |
| `Is Technion Alumni` | Checkbox | | No |
| `LP Potential` | Single select | `Hot`, `Warm`, `Cold`, `Not Relevant`, `Already LP` | No |
| `LP Segment` | Single select | `Frustrated Allocator`, `Exit Millionaire`, `Crypto Curious Traditional`, `Crypto OG`, `Connector` | No |
| `Estimated Net Worth` | Single select | `<$1M`, `$1-5M`, `$5-20M`, `$20-50M`, `$50-100M`, `$100M+`, `Unknown` | No |
| `Location` | Single select | `Tel Aviv`, `Herzliya`, `Haifa`, `Jerusalem`, `NYC`, `SF Bay Area`, `London`, `Other Israel`, `Other US`, `Other` | No |
| `Tags` | Multiple select | Custom tags | No |
| `Notes` | Long text | | No |
| `Created` | Created time | Auto | Auto |
| `Last Modified` | Last modified time | Auto | Auto |

**Rollup Fields (add after creating junction tables):**
| Field Name | Type | Source | Aggregation |
|------------|------|--------|-------------|
| `Companies Founded` | Rollup | Employment History.Company | ARRAYUNIQUE() where Role Type contains "Founder" |
| `Founder Count` | Count | Employment History | Where Role Type = Founder |
| `Total Investments` | Count | Investment Relationships | All |
| `Education Summary` | Rollup | Education Records.Institution | ARRAYUNIQUE() |
| `Military Service` | Rollup | Military Service.Unit | ARRAYUNIQUE() |

---

## TABLE 2: Companies

**Description:** Startups, corporations, acquirers, funds, accelerators

| Field Name | Field Type | Options/Formula | Required |
|------------|-----------|-----------------|----------|
| `Company Name` | Single line text | Primary field | Yes |
| `Legal Name` | Single line text | | No |
| `Website` | URL | | No |
| `LinkedIn URL` | URL | | No |
| `Logo` | Attachment | | No |
| `Founded Year` | Number | Integer | Yes |
| `Shutdown Year` | Number | Integer (if applicable) | No |
| `Company Type` | Single select | `Startup`, `Corporation`, `Acquirer`, `VC Fund`, `Accelerator`, `Government`, `University` | Yes |
| `Stage` | Single select | `Pre-Seed`, `Seed`, `Series A`, `Series B`, `Series C+`, `Growth`, `Public`, `Acquired`, `Shut Down` | Yes |
| `Status` | Single select | `Active`, `Acquired`, `Shut Down`, `IPO` | Yes |
| `Sector` | Multiple select | `Cybersecurity`, `Fintech`, `Crypto/Web3`, `AI/ML`, `Enterprise SaaS`, `Consumer`, `Hardware`, `Biotech`, `Cleantech`, `Defense`, `Other` | Yes |
| `Technologies` | Multiple select | `MPC`, `ZK Proofs`, `Blockchain`, `Machine Learning`, `Computer Vision`, `NLP`, `Cloud`, `Mobile`, `IoT`, `Semiconductors` | No |
| `HQ Location` | Single select | `Tel Aviv`, `Herzliya`, `Haifa`, `Jerusalem`, `NYC`, `SF Bay Area`, `Other Israel`, `Other US`, `Other` | No |
| `Description` | Long text | What they do/did | Yes |
| `Total Raised` | Currency | USD | No |
| `Last Valuation` | Currency | USD | No |
| `Exit Value` | Currency | USD (if exited) | No |
| `Exit Type` | Single select | `IPO`, `Acquisition`, `Shut Down`, `Active`, `Acqui-hire` | No |
| `Exit Date` | Date | | No |
| `Acquirer` | Link to Companies | If acquired | No |
| `Employee Count Peak` | Number | | No |
| `Employee Count Current` | Number | | No |
| `Crunchbase URL` | URL | | No |
| `Tags` | Multiple select | `Modu Effect`, `8200 Origin`, `Unicorn`, `Crypto Infrastructure`, `Serial Founder Led` | No |
| `Notes` | Long text | | No |

**Rollup Fields:**
| Field Name | Type | Source | Aggregation |
|------------|------|--------|-------------|
| `Founders` | Rollup | Employment History.Person | Where Role Type = Founder |
| `All Employees Ever` | Count | Employment History | All |
| `Current Employees` | Count | Employment History | Where Is Current = true |
| `Alumni Who Founded` | Count | Employment History | Complex - see formula |
| `Investors` | Rollup | Funding Rounds.Investors | ARRAYUNIQUE() |

---

## TABLE 3: Institutions

**Description:** Universities, military units, accelerators, research institutes

| Field Name | Field Type | Options/Formula | Required |
|------------|-----------|-----------------|----------|
| `Institution Name` | Single line text | Primary field | Yes |
| `Full Name` | Single line text | Official full name | No |
| `Type` | Single select | `University`, `Military Unit`, `Research Institute`, `Accelerator`, `Government Program` | Yes |
| `Subtype` | Single select | `Intelligence`, `Special Forces`, `Technical`, `Business School`, `Incubator` | No |
| `Location` | Single line text | | No |
| `Founded Year` | Number | | No |
| `Website` | URL | | No |
| `Description` | Long text | | No |
| `Notable Programs` | Multiple select | `Computer Science`, `Electrical Engineering`, `Cryptography`, `MBA`, `SIGINT`, `Cyber` | No |
| `Prestige Tier` | Single select | `Tier 1`, `Tier 2`, `Tier 3` | No |
| `Tags` | Multiple select | | No |
| `Notes` | Long text | | No |

**Pre-populated Institutions:**

| Name | Type | Subtype | Prestige |
|------|------|---------|----------|
| Technion | University | Technical | Tier 1 |
| Weizmann Institute | Research Institute | Technical | Tier 1 |
| Tel Aviv University | University | | Tier 1 |
| Hebrew University | University | | Tier 1 |
| Ben-Gurion University | University | | Tier 2 |
| IDC Herzliya (Reichman) | University | Business School | Tier 2 |
| Bar-Ilan University | University | | Tier 2 |
| Unit 8200 | Military Unit | Intelligence | Tier 1 |
| Talpiot | Military Unit | Technical | Tier 1 |
| Mamram | Military Unit | Technical | Tier 1 |
| Unit 81 | Military Unit | Intelligence | Tier 1 |
| 8200 EISP | Accelerator | Incubator | Tier 1 |
| The Junction | Accelerator | Incubator | Tier 2 |
| Microsoft Accelerator TLV | Accelerator | | Tier 2 |
| Techstars TLV | Accelerator | | Tier 2 |

---

## TABLE 4: Employment History

**Description:** CRITICAL - tracks who worked where, when, and what happened next

| Field Name | Field Type | Options/Formula | Required |
|------------|-----------|-----------------|----------|
| `Record ID` | Formula | `{Person} & " @ " & {Company}` | Auto |
| `Person` | Link to People | Single link | Yes |
| `Company` | Link to Companies | Single link | Yes |
| `Role Title` | Single line text | e.g., "CEO & Co-founder" | Yes |
| `Role Type` | Single select | `Founder`, `Co-founder`, `C-Suite`, `VP`, `Director`, `Manager`, `Senior IC`, `IC`, `Intern`, `Advisor`, `Board Member` | Yes |
| `Department` | Single select | `Engineering`, `Product`, `Sales`, `Marketing`, `Operations`, `Finance`, `HR`, `Legal`, `Research`, `General Management` | No |
| `Seniority` | Single select | `Founder`, `Executive`, `Senior`, `Mid`, `Junior`, `Intern` | No |
| `Start Date` | Date | | Yes |
| `End Date` | Date | Blank = current | No |
| `Is Current` | Formula | `IF({End Date}, FALSE(), TRUE())` | Auto |
| `Tenure Months` | Formula | `DATETIME_DIFF(IF({End Date}, {End Date}, TODAY()), {Start Date}, 'months')` | Auto |
| `Is Founder` | Formula | `IF(OR({Role Type}="Founder", {Role Type}="Co-founder"), TRUE(), FALSE())` | Auto |
| `Exit Reason` | Single select | `Still There`, `Founded Company`, `Joined Another`, `Acquired Out`, `Laid Off`, `Retired`, `Unknown` | No |
| `Next Company` | Link to Companies | Where they went after | No |
| `Equity Outcome` | Single select | `Significant Exit ($10M+)`, `Moderate Exit ($1-10M)`, `Small Exit (<$1M)`, `No Exit`, `Unknown` | No |
| `Source` | Single line text | Where this info came from | No |
| `Verified` | Checkbox | Data verified | No |
| `Notes` | Long text | | No |

---

## TABLE 5: Education Records

**Description:** Academic history for each person

| Field Name | Field Type | Options/Formula | Required |
|------------|-----------|-----------------|----------|
| `Record ID` | Formula | `{Person} & " - " & {Institution}` | Auto |
| `Person` | Link to People | | Yes |
| `Institution` | Link to Institutions | | Yes |
| `Degree Type` | Single select | `Bachelor`, `Master`, `PhD`, `MBA`, `Certificate`, `Dropout`, `Postdoc` | Yes |
| `Field of Study` | Single line text | e.g., "Computer Science" | Yes |
| `Specialization` | Single line text | e.g., "Cryptography" | No |
| `Start Year` | Number | | No |
| `Graduation Year` | Number | | No |
| `Completed` | Checkbox | | Yes |
| `Honors` | Single line text | | No |
| `Thesis Topic` | Single line text | | No |
| `Advisor` | Link to People | Academic advisor | No |
| `Notes` | Long text | | No |

---

## TABLE 6: Military Service

**Description:** Military/intelligence service history (critical for Israeli ecosystem)

| Field Name | Field Type | Options/Formula | Required |
|------------|-----------|-----------------|----------|
| `Record ID` | Formula | `{Person} & " - " & {Unit}` | Auto |
| `Person` | Link to People | | Yes |
| `Unit` | Link to Institutions | Filter to Military Units | Yes |
| `Role` | Single line text | e.g., "Team Leader" | No |
| `Specialization` | Single line text | e.g., "SIGINT Analysis" | No |
| `Rank Achieved` | Single select | `Private`, `Corporal`, `Sergeant`, `Lieutenant`, `Captain`, `Major`, `Lt. Colonel`, `Colonel`, `General` | No |
| `Start Year` | Number | | Yes |
| `End Year` | Number | | Yes |
| `Service Type` | Single select | `Mandatory`, `Career Officer`, `Reserves` | Yes |
| `Unit Cohort Year` | Number | Year of cohort/class | No |
| `Notes` | Long text | | No |

---

## TABLE 7: Investment Relationships

**Description:** Who invested in what (angel investments, fund LP commitments)

| Field Name | Field Type | Options/Formula | Required |
|------------|-----------|-----------------|----------|
| `Record ID` | Formula | `{Investor} & " → " & {Target Company}` | Auto |
| `Investor Person` | Link to People | Individual investor | No |
| `Investor Entity` | Link to Companies | VC/Fund if via entity | No |
| `Target Company` | Link to Companies | Company invested in | No |
| `Target Fund` | Link to Companies | Fund invested in (for LPs) | No |
| `Investment Type` | Single select | `Angel`, `Seed`, `Series A`, `Series B+`, `Growth`, `LP Commitment`, `Secondary`, `SPV` | Yes |
| `Investment Date` | Date | | Yes |
| `Amount` | Currency | USD | No |
| `Ownership Percent` | Percent | | No |
| `Board Seat` | Checkbox | Received board seat | No |
| `Lead Investor` | Checkbox | Was lead | No |
| `Exit Date` | Date | | No |
| `Exit Value` | Currency | Proceeds received | No |
| `Exit Multiple` | Formula | `IF(AND({Exit Value}, {Amount}), {Exit Value}/{Amount}, BLANK())` | Auto |
| `Source of Deal` | Single line text | How they found it | No |
| `Co-Investors` | Link to People | Other angels in deal | No |
| `Notes` | Long text | | No |

---

## TABLE 8: Board Positions

**Description:** Board memberships and advisory boards

| Field Name | Field Type | Options/Formula | Required |
|------------|-----------|-----------------|----------|
| `Record ID` | Formula | `{Person} & " on " & {Company} & " board"` | Auto |
| `Person` | Link to People | | Yes |
| `Company` | Link to Companies | | Yes |
| `Position Type` | Single select | `Board Member`, `Board Observer`, `Chairman`, `Independent Director`, `Advisory Board` | Yes |
| `Start Date` | Date | | Yes |
| `End Date` | Date | Blank = current | No |
| `Is Current` | Formula | `IF({End Date}, FALSE(), TRUE())` | Auto |
| `Appointed By` | Single line text | e.g., "Series A investor" | No |
| `Committees` | Multiple select | `Compensation`, `Audit`, `Nominating`, `Executive` | No |
| `Notes` | Long text | | No |

---

## TABLE 9: Advisor Relationships

**Description:** Advisory roles (formal and informal)

| Field Name | Field Type | Options/Formula | Required |
|------------|-----------|-----------------|----------|
| `Record ID` | Formula | `{Advisor} & " advises " & {Company}` | Auto |
| `Advisor` | Link to People | | Yes |
| `Company` | Link to Companies | | No |
| `Person Advised` | Link to People | If advising individual | No |
| `Advisory Type` | Single select | `Formal Advisor`, `Informal Mentor`, `Executive Coach`, `Technical Advisor`, `Strategic Advisor` | Yes |
| `Domain` | Multiple select | `Product`, `Engineering`, `Fundraising`, `Hiring`, `GTM`, `Strategy`, `Crypto/Web3` | No |
| `Start Date` | Date | | No |
| `End Date` | Date | | No |
| `Equity Compensation` | Checkbox | | No |
| `Equity Amount` | Percent | | No |
| `Notes` | Long text | | No |

---

## TABLE 10: Funding Rounds

**Description:** Company fundraising history

| Field Name | Field Type | Options/Formula | Required |
|------------|-----------|-----------------|----------|
| `Record ID` | Formula | `{Company} & " " & {Round Type} & " (" & YEAR({Round Date}) & ")"` | Auto |
| `Company` | Link to Companies | | Yes |
| `Round Type` | Single select | `Pre-Seed`, `Seed`, `Series A`, `Series B`, `Series C`, `Series D+`, `Growth`, `Bridge`, `IPO`, `SPAC` | Yes |
| `Round Date` | Date | | Yes |
| `Amount Raised` | Currency | USD | Yes |
| `Pre-Money Valuation` | Currency | USD | No |
| `Post-Money Valuation` | Currency | USD | No |
| `Lead Investor` | Link to Companies | | No |
| `All Investors` | Link to Companies | Multiple | No |
| `Angel Investors` | Link to People | Multiple | No |
| `Press Release URL` | URL | | No |
| `Source` | Single line text | | No |
| `Notes` | Long text | | No |

---

## TABLE 11: Acquisitions

**Description:** M&A activity

| Field Name | Field Type | Options/Formula | Required |
|------------|-----------|-----------------|----------|
| `Record ID` | Formula | `{Acquirer} & " acquires " & {Target}` | Auto |
| `Acquirer` | Link to Companies | | Yes |
| `Target` | Link to Companies | | Yes |
| `Acquisition Date` | Date | | Yes |
| `Deal Value` | Currency | USD | No |
| `Deal Type` | Single select | `Full Acquisition`, `Acqui-hire`, `Merger`, `Asset Purchase` | Yes |
| `Payment Type` | Multiple select | `Cash`, `Stock`, `Earnout`, `Mixed` | No |
| `Target Status Post` | Single select | `Integrated`, `Operated Independently`, `Shut Down`, `Spun Out` | No |
| `Key People Retained` | Link to People | Multiple | No |
| `Key People Departed` | Link to People | Multiple | No |
| `Integration Success` | Single select | `Highly Successful`, `Successful`, `Mixed`, `Failed` | No |
| `Press Release URL` | URL | | No |
| `Notes` | Long text | | No |

---

## TABLE 12: Co-founder Relationships

**Description:** Explicit co-founder pairs (for network analysis)

| Field Name | Field Type | Options/Formula | Required |
|------------|-----------|-----------------|----------|
| `Record ID` | Formula | `{Person 1} & " + " & {Person 2} & " @ " & {Company}` | Auto |
| `Person 1` | Link to People | | Yes |
| `Person 2` | Link to People | | Yes |
| `Company` | Link to Companies | Company co-founded | Yes |
| `Relationship Origin` | Single line text | How they met | No |
| `Still Working Together` | Checkbox | | No |
| `Subsequent Collaborations` | Link to Companies | Later companies together | No |
| `Relationship Status` | Single select | `Close`, `Cordial`, `Estranged`, `Unknown` | No |
| `Notes` | Long text | | No |

---

## TABLE 13: Person Connections

**Description:** Network edges - how people know each other

| Field Name | Field Type | Options/Formula | Required |
|------------|-----------|-----------------|----------|
| `Record ID` | Formula | `{Person 1} & " ↔ " & {Person 2}` | Auto |
| `Person 1` | Link to People | | Yes |
| `Person 2` | Link to People | | Yes |
| `Connection Type` | Single select | `Co-founders`, `Former Colleagues`, `Investor-Founder`, `Mentor-Mentee`, `Co-investors`, `Board Colleagues`, `Military Cohort`, `University Classmates`, `Family`, `Friends` | Yes |
| `Connection Strength` | Single select | `Strong`, `Medium`, `Weak`, `Unknown` | No |
| `Origin Company` | Link to Companies | Where they met (company) | No |
| `Origin Institution` | Link to Institutions | Where they met (institution) | No |
| `First Connected Year` | Number | | No |
| `Last Interaction Date` | Date | | No |
| `Can Request Intro` | Checkbox | Can we ask Person 1 for intro to Person 2 | No |
| `Notes` | Long text | | No |

---

## TABLE 14: LP Prospects

**Description:** LP fundraising pipeline

| Field Name | Field Type | Options/Formula | Required |
|------------|-----------|-----------------|----------|
| `Record ID` | Formula | `{Person} & " - LP Prospect"` | Auto |
| `Person` | Link to People | | Yes |
| `Prospect Status` | Single select | `Identified`, `Researching`, `Outreach Planned`, `Contacted`, `Meeting Scheduled`, `Met`, `Follow-up`, `Soft Commit`, `Hard Commit`, `Wired`, `Passed`, `Not Now` | Yes |
| `Estimated Capacity` | Currency | Total they could invest | No |
| `Target Commitment` | Currency | What we're asking for | No |
| `Actual Commitment` | Currency | What they committed | No |
| `Source of Wealth` | Multiple select | `Founder Exit`, `Executive Comp`, `Family Wealth`, `Investment Returns`, `Inheritance`, `Other` | No |
| `Recent Liquidity Event` | Single line text | | No |
| `Warm Intro Path` | Long text | How to reach them | No |
| `Intro Person` | Link to People | Who can introduce | No |
| `Interests Alignment` | Multiple select | `Israeli Tech Believer`, `Crypto Interest`, `AI Interest`, `Network Access`, `Returns Focus`, `Impact` | No |
| `Concerns` | Multiple select | `First-time Fund`, `Check Size`, `Already Committed`, `Sector Unfamiliar`, `Timing`, `Structure` | No |
| `Outreach Date` | Date | First outreach | No |
| `Last Contact Date` | Date | Last contact | No |
| `Next Action` | Single line text | | No |
| `Next Action Date` | Date | | No |
| `Assigned To` | Single line text | Team member | No |
| `Priority` | Single select | `P1 - This Week`, `P2 - This Month`, `P3 - This Quarter`, `P4 - Backlog` | No |
| `Meeting Notes` | Long text | | No |
| `Notes` | Long text | | No |

---

## TABLE 15: Interactions Log

**Description:** Track all touchpoints with prospects

| Field Name | Field Type | Options/Formula | Required |
|------------|-----------|-----------------|----------|
| `Record ID` | Auto number | | Auto |
| `Person` | Link to People | | Yes |
| `LP Prospect` | Link to LP Prospects | | No |
| `Interaction Type` | Single select | `Email Sent`, `Email Received`, `Call`, `Video Call`, `In-Person Meeting`, `Conference`, `Intro Made`, `Social/Event`, `WhatsApp` | Yes |
| `Interaction Date` | Date | | Yes |
| `Subject` | Single line text | | Yes |
| `Summary` | Long text | | Yes |
| `Outcome` | Single select | `Positive`, `Neutral`, `Negative`, `No Response` | No |
| `Follow-up Required` | Checkbox | | No |
| `Follow-up Date` | Date | | No |
| `Attachments` | Attachment | | No |
| `Logged By` | Single line text | | No |

---

## Relationship Diagram

```
                                    ┌─────────────┐
                                    │   PEOPLE    │
                                    └──────┬──────┘
                                           │
         ┌──────────────┬──────────────────┼──────────────────┬──────────────┐
         │              │                  │                  │              │
         ▼              ▼                  ▼                  ▼              ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────────┐ ┌─────────────┐ ┌─────────────┐
│ Employment  │ │  Education  │ │    Military     │ │ Investment  │ │    Board    │
│   History   │ │   Records   │ │    Service      │ │Relationships│ │  Positions  │
└──────┬──────┘ └──────┬──────┘ └───────┬─────────┘ └──────┬──────┘ └──────┬──────┘
       │               │                │                  │              │
       ▼               ▼                ▼                  │              │
┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │              │
│  COMPANIES  │ │INSTITUTIONS │ │INSTITUTIONS │           │              │
│             │ │(Universities)│ │  (Military) │           │              │
└──────┬──────┘ └─────────────┘ └─────────────┘           │              │
       │                                                   │              │
       ├───────────────────────────────────────────────────┴──────────────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Funding   │     │Acquisitions │     │  Advisor    │
│   Rounds    │     │             │     │Relationships│
└─────────────┘     └─────────────┘     └─────────────┘

                    NETWORK TABLES
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Co-founder  │     │   Person    │     │     LP      │
│Relationships│     │ Connections │     │  Prospects  │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │Interactions │
                                        │    Log      │
                                        └─────────────┘
```

---

## Setup Order

Create tables in this order to ensure linked record fields work:

1. **Institutions** (no dependencies)
2. **Companies** (no dependencies initially)
3. **People** (link to Companies for Current Company)
4. **Employment History** (link to People, Companies)
5. **Education Records** (link to People, Institutions)
6. **Military Service** (link to People, Institutions)
7. **Investment Relationships** (link to People, Companies)
8. **Board Positions** (link to People, Companies)
9. **Advisor Relationships** (link to People, Companies)
10. **Funding Rounds** (link to Companies, People)
11. **Acquisitions** (link to Companies, People)
12. **Co-founder Relationships** (link to People, Companies)
13. **Person Connections** (link to People, Companies, Institutions)
14. **LP Prospects** (link to People)
15. **Interactions Log** (link to People, LP Prospects)

Then go back and add:
- Companies.Acquirer → link to Companies
- Rollup fields in People and Companies

---

## Key Views to Create

### People Table Views
1. `All Founders` - Filter: Primary Type = Founder
2. `Serial Founders` - Filter: Founder Count >= 2
3. `8200 Alumni` - Filter: Is 8200 Alumni = checked
4. `LP Prospects - Hot` - Filter: LP Potential = Hot
5. `LP Prospects - Pipeline` - Filter: LP Potential = Hot or Warm, Sort by Estimated Net Worth

### Companies Table Views
1. `Active Startups` - Filter: Status = Active, Company Type = Startup
2. `Recent Exits (2 years)` - Filter: Exit Date >= 2 years ago
3. `Crypto/Web3` - Filter: Sector contains Crypto/Web3
4. `Shut Down (Talent Rich)` - Filter: Status = Shut Down
5. `Unicorns` - Filter: Last Valuation >= $1B

### Employment History Views
1. `Current Employees` - Filter: Is Current = true
2. `Founder Moves` - Filter: Role Type = Founder
3. `Company Alumni: [Company Name]` - Filter by specific company

### LP Prospects Views
1. `Pipeline - Active` - Filter: Status not in (Passed, Wired, Not Now)
2. `This Week Actions` - Filter: Priority = P1
3. `Needs Follow-up` - Filter: Next Action Date <= Today
