#!/usr/bin/env node
/**
 * Setup Superset datasets and dashboard for Notalone schema
 * Based on events-hive and Lava project patterns
 */
import 'dotenv/config';

const SUPERSET_URL = process.env.SUPERSET_URL || 'http://74.50.97.243:8088';
const CREDENTIALS = {
  username: process.env.SUPERSET_USER || 'admin',
  password: process.env.SUPERSET_PASSWORD || 'EventsHive2025!',
  provider: 'db',
  refresh: true
};

// Notalone tables to create datasets for
const NOTALONE_TABLES = [
  { table: 'notalone_people', display: 'Notalone - People' },
  { table: 'notalone_companies', display: 'Notalone - Companies' },
  { table: 'notalone_lp_prospects', display: 'Notalone - LP Prospects' },
  { table: 'notalone_institutions', display: 'Notalone - Institutions' },
  { table: 'notalone_employment_history', display: 'Notalone - Employment History' },
  { table: 'notalone_funding_rounds', display: 'Notalone - Funding Rounds' },
  { table: 'notalone_person_connections', display: 'Notalone - Person Connections' },
  { table: 'notalone_cofounder_relationships', display: 'Notalone - Cofounder Relationships' },
  { table: 'notalone_board_positions', display: 'Notalone - Board Positions' },
  { table: 'notalone_acquisitions', display: 'Notalone - Acquisitions' },
  { table: 'notalone_investment_relationships', display: 'Notalone - Investment Relationships' },
  { table: 'notalone_military_service', display: 'Notalone - Military Service' },
  { table: 'notalone_education_records', display: 'Notalone - Education Records' },
  { table: 'notalone_interactions_log', display: 'Notalone - Interactions Log' }
];

// Views created for analytics
const NOTALONE_VIEWS = [
  { table: 'v_lp_pipeline', display: 'Notalone - LP Pipeline View' },
  { table: 'v_people_careers', display: 'Notalone - People Careers View' },
  { table: 'v_company_funding', display: 'Notalone - Company Funding View' },
  { table: 'v_8200_network', display: 'Notalone - 8200 Network View' }
];

let accessToken = null;
let csrfToken = null;
let cookies = null;

async function login() {
  console.log('Authenticating to Superset...');

  const response = await fetch(`${SUPERSET_URL}/api/v1/security/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(CREDENTIALS)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Login failed: ${response.status} - ${text}`);
  }

  const data = await response.json();
  accessToken = data.access_token;

  // Get cookies for session
  cookies = response.headers.get('set-cookie');

  console.log('✓ Logged in successfully');
  return accessToken;
}

async function getCsrfToken() {
  console.log('Getting CSRF token...');

  const response = await fetch(`${SUPERSET_URL}/api/v1/security/csrf_token/`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`CSRF token fetch failed: ${response.status} - ${text}`);
  }

  const data = await response.json();
  csrfToken = data.result;

  console.log('✓ Got CSRF token');
  return csrfToken;
}

async function getDatabaseId() {
  console.log('Finding Notalone database connection...');

  const response = await fetch(`${SUPERSET_URL}/api/v1/database/`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error(`Database list failed: ${response.status}`);
  }

  const data = await response.json();
  const notalone = data.result.find(db =>
    db.database_name.toLowerCase().includes('notalone')
  );

  if (notalone) {
    console.log(`✓ Found database: ${notalone.database_name} (ID: ${notalone.id})`);
    return notalone.id;
  }

  console.log('Available databases:', data.result.map(d => `${d.id}: ${d.database_name}`));

  if (data.result.length > 0) {
    console.log(`Using first database: ${data.result[0].database_name} (ID: ${data.result[0].id})`);
    return data.result[0].id;
  }

  throw new Error('No database connections found');
}

async function getExistingDatasets() {
  console.log('Checking existing datasets...');

  const response = await fetch(`${SUPERSET_URL}/api/v1/dataset/?q=(page_size:1000)`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error(`Dataset list failed: ${response.status}`);
  }

  const data = await response.json();
  return data.result.map(d => d.table_name);
}

async function createDataset(databaseId, tableName, displayName) {
  console.log(`Creating dataset: ${displayName}...`);

  const response = await fetch(`${SUPERSET_URL}/api/v1/dataset/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken
    },
    body: JSON.stringify({
      database: databaseId,
      schema: 'notalone',
      table_name: tableName
    })
  });

  if (!response.ok) {
    const text = await response.text();
    if (text.includes('already exists')) {
      console.log(`  ⚠ Dataset already exists: ${tableName}`);
      return null;
    }
    console.log(`  ✗ Failed to create ${tableName}: ${response.status} - ${text}`);
    return null;
  }

  const data = await response.json();
  console.log(`  ✓ Created dataset: ${tableName} (ID: ${data.id})`);
  return data.id;
}

async function listDashboards() {
  const response = await fetch(`${SUPERSET_URL}/api/v1/dashboard/`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error(`Dashboard list failed: ${response.status}`);
  }

  const data = await response.json();
  return data.result;
}

async function main() {
  try {
    // Step 1: Authenticate
    await login();
    await getCsrfToken();

    // Step 2: Find database connection
    const databaseId = await getDatabaseId();

    // Step 3: Get existing datasets
    const existingDatasets = await getExistingDatasets();
    console.log(`Found ${existingDatasets.length} existing datasets`);

    // Step 4: Create datasets for all Notalone tables
    console.log('\n--- Creating Datasets for Tables ---');
    const createdDatasets = [];

    for (const table of NOTALONE_TABLES) {
      if (existingDatasets.includes(table.table)) {
        console.log(`  ⚠ Skipping existing: ${table.table}`);
        continue;
      }
      const datasetId = await createDataset(databaseId, table.table, table.display);
      if (datasetId) {
        createdDatasets.push({ ...table, id: datasetId });
      }
    }

    // Step 5: Create datasets for views
    console.log('\n--- Creating Datasets for Views ---');
    for (const view of NOTALONE_VIEWS) {
      if (existingDatasets.includes(view.table)) {
        console.log(`  ⚠ Skipping existing: ${view.table}`);
        continue;
      }
      const datasetId = await createDataset(databaseId, view.table, view.display);
      if (datasetId) {
        createdDatasets.push({ ...view, id: datasetId });
      }
    }

    // Step 6: List dashboards
    console.log('\n--- Existing Dashboards ---');
    const dashboards = await listDashboards();
    dashboards.forEach(d => console.log(`  ID: ${d.id} - ${d.dashboard_title}`));

    // Summary
    console.log('\n=== Summary ===');
    console.log(`Created ${createdDatasets.length} new datasets`);
    console.log(`Total dashboards: ${dashboards.length}`);
    console.log('\nAccess Superset at: http://74.50.97.243:8088');
    console.log('Next: Create charts and dashboard in the Superset UI');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
