#!/usr/bin/env node
/**
 * Complete Superset setup for Notalone schema
 * Creates database connection and all datasets in one go
 */

const SUPERSET_URL = 'http://74.50.97.243:8088';
const CREDENTIALS = {
  username: 'admin',
  password: 'EventsHive2025!',
  provider: 'db',
  refresh: true
};

const DB_CONFIG = {
  database_name: 'Notalone - Israeli Tech Ecosystem',
  engine: 'postgresql',
  configuration_method: 'sqlalchemy_form',
  sqlalchemy_uri: 'postgresql://postgres:notalone2026@172.17.0.1:5433/calendar_monitoring',
  expose_in_sqllab: true,
  allow_ctas: false,
  allow_cvas: false,
  allow_dml: false,
  allow_file_upload: false,
  extra: JSON.stringify({
    schemas_allowed_for_file_upload: ['notalone'],
    engine_params: {
      connect_args: {
        options: '-csearch_path=notalone'
      }
    }
  })
};

const TABLES = [
  'notalone_people',
  'notalone_companies',
  'notalone_lp_prospects',
  'notalone_institutions',
  'notalone_employment_history',
  'notalone_funding_rounds',
  'notalone_person_connections',
  'notalone_cofounder_relationships',
  'notalone_board_positions',
  'notalone_acquisitions',
  'notalone_investment_relationships',
  'notalone_military_service',
  'notalone_education_records',
  'notalone_interactions_log'
];

const VIEWS = [
  'v_lp_pipeline',
  'v_people_careers',
  'v_company_funding',
  'v_8200_network'
];

let accessToken = null;
let csrfToken = null;

async function login() {
  console.log('Authenticating...');
  const response = await fetch(`${SUPERSET_URL}/api/v1/security/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(CREDENTIALS)
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`);
  }

  const data = await response.json();
  accessToken = data.access_token;
  console.log('✓ Authenticated');
}

async function getCsrfToken() {
  const response = await fetch(`${SUPERSET_URL}/api/v1/security/csrf_token/`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    throw new Error(`CSRF token fetch failed: ${response.status}`);
  }

  const data = await response.json();
  csrfToken = data.result;
  console.log('✓ Got CSRF token');
}

async function createOrGetDatabase() {
  console.log('\nCreating database connection...');

  // First check if it already exists
  const listResp = await fetch(`${SUPERSET_URL}/api/v1/database/`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  const listData = await listResp.json();

  const existing = listData.result?.find(db =>
    db.database_name?.toLowerCase().includes('notalone')
  );

  if (existing) {
    console.log(`✓ Database already exists: ${existing.database_name} (ID: ${existing.id})`);
    return existing.id;
  }

  // Create new database connection
  const response = await fetch(`${SUPERSET_URL}/api/v1/database/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken
    },
    body: JSON.stringify(DB_CONFIG)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Database creation failed: ${response.status} - ${text}`);
  }

  const data = await response.json();
  console.log(`✓ Created database: ${DB_CONFIG.database_name} (ID: ${data.id})`);
  return data.id;
}

async function createDataset(databaseId, tableName) {
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
      console.log(`  ⚠ Already exists: ${tableName}`);
      return null;
    }
    console.log(`  ✗ Failed: ${tableName} - ${response.status}`);
    return null;
  }

  const data = await response.json();
  console.log(`  ✓ Created: ${tableName} (ID: ${data.id})`);
  return data.id;
}

async function main() {
  try {
    await login();
    await getCsrfToken();

    const databaseId = await createOrGetDatabase();

    // Wait a moment for the database to be fully registered
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('\n--- Creating Datasets for Tables ---');
    for (const table of TABLES) {
      await createDataset(databaseId, table);
    }

    console.log('\n--- Creating Datasets for Views ---');
    for (const view of VIEWS) {
      await createDataset(databaseId, view);
    }

    console.log('\n=== Setup Complete ===');
    console.log(`Database ID: ${databaseId}`);
    console.log(`Tables: ${TABLES.length}`);
    console.log(`Views: ${VIEWS.length}`);
    console.log(`\nAccess Superset: ${SUPERSET_URL}`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
