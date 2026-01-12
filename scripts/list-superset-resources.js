#!/usr/bin/env node
/**
 * List all datasets and charts in Superset
 */

const SUPERSET_URL = 'http://74.50.97.243:8088';
const CREDENTIALS = {
  username: 'admin',
  password: 'EventsHive2025!',
  provider: 'db'
};

let headers = {};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url, options = {}, maxRetries = 5) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      return response;
    } catch (error) {
      console.log(`  Retry ${attempt + 1}/${maxRetries}: ${error.message}`);
      if (attempt < maxRetries - 1) {
        await delay((attempt + 1) * 2000);
      } else {
        throw error;
      }
    }
  }
}

async function authenticate() {
  console.log('Authenticating...');
  const loginResponse = await fetchWithRetry(`${SUPERSET_URL}/api/v1/security/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(CREDENTIALS)
  });
  if (!loginResponse.ok) throw new Error(`Login failed: ${loginResponse.status}`);
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
  console.log('Authenticated!\n');
}

async function main() {
  try {
    await authenticate();

    // List all datasets
    console.log('=== ALL DATASETS ===\n');
    await delay(500);
    const dsResponse = await fetchWithRetry(`${SUPERSET_URL}/api/v1/dataset/?q=(page_size:500)`, { headers });
    const dsData = await dsResponse.json();

    console.log(`Total datasets: ${dsData.result?.length || 0}\n`);

    // Group by schema
    const bySchema = {};
    for (const ds of dsData.result || []) {
      const schema = ds.schema || 'default';
      if (!bySchema[schema]) bySchema[schema] = [];
      bySchema[schema].push(ds);
    }

    for (const [schema, datasets] of Object.entries(bySchema)) {
      console.log(`Schema: ${schema}`);
      for (const ds of datasets) {
        console.log(`  ID ${ds.id}: ${ds.table_name} (DB: ${ds.database?.database_name})`);
      }
      console.log('');
    }

    // List datasets with v_web3 or web3 in name
    console.log('=== WEB3-RELATED DATASETS ===');
    const web3Datasets = (dsData.result || []).filter(ds =>
      ds.table_name?.toLowerCase().includes('web3') ||
      ds.table_name?.toLowerCase().includes('crypto')
    );
    if (web3Datasets.length > 0) {
      for (const ds of web3Datasets) {
        console.log(`  ID ${ds.id}: ${ds.table_name} (schema: ${ds.schema})`);
      }
    } else {
      console.log('  None found!');
    }
    console.log('');

    // List all charts on dashboard 20
    console.log('=== DASHBOARD 20 INFO ===');
    await delay(500);
    const dashResponse = await fetchWithRetry(`${SUPERSET_URL}/api/v1/dashboard/20`, { headers });

    if (dashResponse.ok) {
      const dashData = await dashResponse.json();
      const dash = dashData.result;
      console.log(`Title: ${dash.dashboard_title}`);
      console.log(`Slug: ${dash.slug}`);
      console.log(`Published: ${dash.published}`);
      console.log(`Chart count: ${dash.charts?.length || 0}`);

      // Parse position_json to get chart IDs
      const position = JSON.parse(dash.position_json || '{}');
      const chartComponents = Object.values(position).filter(c => c.type === 'CHART');
      console.log(`\nCharts in layout:`);
      for (const comp of chartComponents) {
        console.log(`  Chart ID: ${comp.meta?.chartId}, Name: ${comp.meta?.sliceName}`);
      }
    } else {
      console.log(`Dashboard 20 not found: ${dashResponse.status}`);
    }
    console.log('');

    // List all charts
    console.log('=== ALL CHARTS ===\n');
    await delay(500);
    const chartResponse = await fetchWithRetry(`${SUPERSET_URL}/api/v1/chart/?q=(page_size:500)`, { headers });
    const chartData = await chartResponse.json();

    console.log(`Total charts: ${chartData.result?.length || 0}\n`);

    for (const chart of chartData.result || []) {
      console.log(`  ID ${chart.id}: ${chart.slice_name} (viz: ${chart.viz_type}, datasource: ${chart.datasource_id})`);
    }

    // Find highest chart ID to understand if 167-173 existed
    const maxChartId = Math.max(...(chartData.result || []).map(c => c.id));
    console.log(`\nHighest chart ID: ${maxChartId}`);

    if (maxChartId < 167) {
      console.log('\n*** Charts 167-173 have never been created! ***');
    } else if (maxChartId >= 173) {
      console.log('\n*** Charts 167-173 may have been deleted ***');
    }

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
