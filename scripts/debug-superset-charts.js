#!/usr/bin/env node
/**
 * Debug failing Superset charts on Dashboard 20 (Israel Web3 Ecosystem)
 * Charts 167, 168, 171, 172, 173 - all using dataset 65 (v_web3_companies)
 */

const SUPERSET_URL = 'http://74.50.97.243:8088';
const CREDENTIALS = {
  username: 'admin',
  password: 'EventsHive2025!',
  provider: 'db'
};

let headers = {};

// Helper to delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Fetch with retry
async function fetchWithRetry(url, options = {}, maxRetries = 5) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      return response;
    } catch (error) {
      console.log(`  Attempt ${attempt + 1}/${maxRetries} failed: ${error.message}`);
      if (attempt < maxRetries - 1) {
        await delay((attempt + 1) * 2000);
      } else {
        throw error;
      }
    }
  }
}

async function authenticate() {
  console.log('Authenticating to Superset...');

  const loginResponse = await fetchWithRetry(`${SUPERSET_URL}/api/v1/security/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(CREDENTIALS)
  });

  if (!loginResponse.ok) {
    throw new Error(`Login failed: ${loginResponse.status}`);
  }

  const { access_token } = await loginResponse.json();

  await delay(500);

  const csrfResponse = await fetchWithRetry(`${SUPERSET_URL}/api/v1/security/csrf_token/`, {
    headers: { 'Authorization': `Bearer ${access_token}` }
  });

  const { result: csrfToken } = await csrfResponse.json();

  headers = {
    'Authorization': `Bearer ${access_token}`,
    'X-CSRFToken': csrfToken,
    'Content-Type': 'application/json'
  };

  console.log('Authenticated successfully!\n');
}

async function getDataset(id) {
  console.log(`\n=== Dataset ${id} ===`);

  await delay(500);
  const response = await fetchWithRetry(`${SUPERSET_URL}/api/v1/dataset/${id}`, { headers });

  if (!response.ok) {
    console.log(`Failed to get dataset: ${response.status}`);
    return null;
  }

  const { result } = await response.json();

  console.log(`Table Name: ${result.table_name}`);
  console.log(`Schema: ${result.schema}`);
  console.log(`Database ID: ${result.database?.id}`);
  console.log(`Columns: ${result.columns?.length || 0}`);

  if (result.columns?.length > 0) {
    console.log('\nColumn Details:');
    for (const col of result.columns) {
      console.log(`  - ${col.column_name}: ${col.type} (groupby=${col.groupby}, filterable=${col.filterable})`);
    }
  }

  return result;
}

async function getChart(id) {
  console.log(`\n=== Chart ${id} ===`);

  await delay(500);
  const response = await fetchWithRetry(`${SUPERSET_URL}/api/v1/chart/${id}`, { headers });

  if (!response.ok) {
    console.log(`Failed to get chart: ${response.status}`);
    return null;
  }

  const { result } = await response.json();

  console.log(`Name: ${result.slice_name}`);
  console.log(`Viz Type: ${result.viz_type}`);
  console.log(`Datasource ID: ${result.datasource_id}`);
  console.log(`Datasource Type: ${result.datasource_type}`);

  let params = result.params;
  if (typeof params === 'string') {
    params = JSON.parse(params);
  }

  console.log('\nParams:');
  console.log(JSON.stringify(params, null, 2));

  return result;
}

async function testChartData(chartId) {
  console.log(`\n=== Testing Chart ${chartId} Data Query ===`);

  await delay(500);
  const response = await fetchWithRetry(`${SUPERSET_URL}/api/v1/chart/${chartId}/data/`, {
    method: 'GET',
    headers
  });

  if (!response.ok) {
    const text = await response.text();
    console.log(`Chart data query failed: ${response.status}`);
    console.log(`Error: ${text.substring(0, 500)}`);
    return null;
  }

  const data = await response.json();
  console.log(`Success! Result keys: ${Object.keys(data.result?.[0] || data).join(', ')}`);

  return data;
}

async function main() {
  try {
    await authenticate();

    // Check dataset 65
    const dataset = await getDataset(65);

    // Check failing charts
    const chartIds = [167, 168, 171, 172, 173];

    for (const id of chartIds) {
      await getChart(id);
      await testChartData(id);
      console.log('\n' + '-'.repeat(60));
    }

    console.log('\n=== Debug Complete ===');

  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
