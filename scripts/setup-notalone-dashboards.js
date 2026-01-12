#!/usr/bin/env node
/**
 * Setup Superset dashboards for Notalone - Israeli Tech Ecosystem
 * Based on Lava/CardanoScale patterns
 *
 * Creates:
 * - Dashboard 1: LP Pipeline & Fundraising
 * - Dashboard 2: 8200 Network & People
 * - Dashboard 3: Companies & Funding
 */

import 'dotenv/config';

const SUPERSET_URL = process.env.SUPERSET_URL || 'http://74.50.97.243:8088';
const DATABASE_ID = 3; // Notalone - Israeli Tech Ecosystem

const CREDENTIALS = {
  username: process.env.SUPERSET_USER || 'admin',
  password: process.env.SUPERSET_PASSWORD || 'EventsHive2025!',
  provider: 'db',
  refresh: true
};

let headers = {};

/**
 * Authenticate with Superset
 */
async function authenticate() {
  console.log('🔐 Authenticating with Superset...');

  const loginResponse = await fetch(`${SUPERSET_URL}/api/v1/security/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(CREDENTIALS)
  });

  if (!loginResponse.ok) {
    throw new Error(`Login failed: ${loginResponse.status}`);
  }

  const { access_token } = await loginResponse.json();

  // Get CSRF token
  const csrfResponse = await fetch(`${SUPERSET_URL}/api/v1/security/csrf_token/`, {
    headers: { 'Authorization': `Bearer ${access_token}` }
  });

  const { result: csrfToken } = await csrfResponse.json();

  headers = {
    'Authorization': `Bearer ${access_token}`,
    'X-CSRFToken': csrfToken,
    'Content-Type': 'application/json'
  };

  console.log('  ✓ Authentication successful\n');
}

/**
 * Cache for all datasets
 */
let allDatasets = null;

/**
 * Load all datasets once
 */
async function loadAllDatasets() {
  if (allDatasets) return allDatasets;

  console.log('  Loading all datasets...');
  const response = await fetch(
    `${SUPERSET_URL}/api/v1/dataset/?q=(page_size:500)`,
    { headers }
  );

  const data = await response.json();
  allDatasets = data.result || [];
  console.log(`  Found ${allDatasets.length} total datasets\n`);

  // Show notalone datasets
  const notaloneDatasets = allDatasets.filter(d =>
    d.table_name?.includes('notalone') || d.schema === 'notalone'
  );

  if (notaloneDatasets.length > 0) {
    console.log('  Notalone datasets:');
    notaloneDatasets.forEach(d => {
      console.log(`    ID ${d.id}: ${d.table_name} (schema: ${d.schema})`);
    });
    console.log('');
  }

  return allDatasets;
}

/**
 * Get dataset ID by table name
 */
async function getDatasetId(tableName) {
  await loadAllDatasets();

  // Find by exact table name match
  let dataset = allDatasets.find(d => d.table_name === tableName);

  // If not found, try with schema prefix
  if (!dataset) {
    dataset = allDatasets.find(d =>
      d.table_name === tableName && d.schema === 'notalone'
    );
  }

  // Try partial match
  if (!dataset) {
    dataset = allDatasets.find(d =>
      d.table_name?.includes(tableName) || tableName.includes(d.table_name)
    );
  }

  if (dataset) {
    console.log(`  ✓ Found: ${tableName} (ID: ${dataset.id})`);
    return dataset.id;
  }

  console.log(`  ⚠ Dataset not found: ${tableName}`);
  return null;
}

/**
 * Create or get a chart
 */
async function createChart(config) {
  const { datasetId, name, vizType, params } = config;

  if (!datasetId) {
    console.log(`  ⚠ Skipping chart "${name}" - no dataset`);
    return null;
  }

  // Check if chart exists
  const listResponse = await fetch(
    `${SUPERSET_URL}/api/v1/chart/?q=(filters:!((col:slice_name,opr:eq,value:'${encodeURIComponent(name)}')))`,
    { headers }
  );

  const listData = await listResponse.json();

  if (listData.result?.length > 0) {
    console.log(`  ✓ Chart exists: "${name}" (ID: ${listData.result[0].id})`);
    return listData.result[0].id;
  }

  // Create chart
  const createResponse = await fetch(`${SUPERSET_URL}/api/v1/chart/`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      datasource_id: datasetId,
      datasource_type: 'table',
      slice_name: name,
      viz_type: vizType,
      params: JSON.stringify(params)
    })
  });

  if (!createResponse.ok) {
    const error = await createResponse.text();
    console.log(`  ✗ Failed: "${name}" - ${error.substring(0, 100)}`);
    return null;
  }

  const createData = await createResponse.json();
  console.log(`  ✓ Created: "${name}" (ID: ${createData.id})`);
  return createData.id;
}

/**
 * Generate random component ID
 */
function genId(prefix) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const suffix = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${prefix}-${suffix}`;
}

/**
 * Build dashboard layout
 */
function buildDashboardLayout(chartIds, layout) {
  const position = {
    'DASHBOARD_VERSION_KEY': 'v2',
    'ROOT_ID': {
      type: 'ROOT',
      id: 'ROOT_ID',
      children: ['GRID_ID']
    },
    'HEADER_ID': {
      type: 'HEADER',
      id: 'HEADER_ID',
      meta: { text: layout.title }
    },
    'GRID_ID': {
      type: 'GRID',
      id: 'GRID_ID',
      children: [],
      parents: ['ROOT_ID']
    }
  };

  let chartIndex = 0;

  for (const row of layout.rows) {
    const rowId = genId('ROW');
    const rowChildren = [];

    for (const cell of row.cells) {
      const chartId = chartIds[chartIndex++];
      if (!chartId) continue;

      const componentId = genId('CHART');
      rowChildren.push(componentId);

      position[componentId] = {
        type: 'CHART',
        id: componentId,
        children: [],
        parents: ['ROOT_ID', 'GRID_ID', rowId],
        meta: {
          chartId: chartId,
          sliceName: cell.name,
          width: cell.width,
          height: cell.height
        }
      };
    }

    position[rowId] = {
      type: 'ROW',
      id: rowId,
      children: rowChildren,
      parents: ['ROOT_ID', 'GRID_ID'],
      meta: { background: 'BACKGROUND_TRANSPARENT' }
    };

    position['GRID_ID'].children.push(rowId);
  }

  return position;
}

/**
 * Create or get a dashboard
 */
async function createDashboard(name, chartIds, layout) {
  // Check if exists
  const listResponse = await fetch(
    `${SUPERSET_URL}/api/v1/dashboard/?q=(filters:!((col:dashboard_title,opr:eq,value:'${encodeURIComponent(name)}')))`,
    { headers }
  );

  const listData = await listResponse.json();

  if (listData.result?.length > 0) {
    console.log(`  ✓ Dashboard exists: "${name}" (ID: ${listData.result[0].id})`);
    return listData.result[0].id;
  }

  const positionJson = buildDashboardLayout(chartIds.filter(Boolean), layout);

  const createResponse = await fetch(`${SUPERSET_URL}/api/v1/dashboard/`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      dashboard_title: name,
      position_json: JSON.stringify(positionJson),
      json_metadata: JSON.stringify({
        color_scheme: 'supersetColors',
        cross_filters_enabled: true,
        refresh_frequency: 300
      })
    })
  });

  if (!createResponse.ok) {
    const error = await createResponse.text();
    console.log(`  ✗ Failed: "${name}" - ${error.substring(0, 100)}`);
    return null;
  }

  const createData = await createResponse.json();
  console.log(`  ✓ Created: "${name}" (ID: ${createData.id})`);
  return createData.id;
}

/**
 * Main setup
 */
async function main() {
  console.log('═'.repeat(60));
  console.log('📊 NOTALONE SUPERSET DASHBOARD SETUP');
  console.log('═'.repeat(60));
  console.log(`  Superset: ${SUPERSET_URL}`);
  console.log(`  Database ID: ${DATABASE_ID}`);
  console.log(`  Time: ${new Date().toISOString()}`);
  console.log('═'.repeat(60) + '\n');

  try {
    await authenticate();

    // Get dataset IDs
    console.log('📋 Finding datasets...\n');
    const datasets = {
      people: await getDatasetId('notalone_people'),
      companies: await getDatasetId('notalone_companies'),
      lp_prospects: await getDatasetId('notalone_lp_prospects'),
      employment: await getDatasetId('notalone_employment_history'),
      funding: await getDatasetId('notalone_funding_rounds'),
      connections: await getDatasetId('notalone_person_connections'),
      military: await getDatasetId('notalone_military_service'),
      education: await getDatasetId('notalone_education_records'),
      // Views
      v_lp_pipeline: await getDatasetId('v_lp_pipeline'),
      v_people_careers: await getDatasetId('v_people_careers'),
      v_company_funding: await getDatasetId('v_company_funding'),
      v_8200_network: await getDatasetId('v_8200_network')
    };
    console.log('');

    // ========================================
    // Dashboard 1: LP Pipeline & Fundraising
    // ========================================
    console.log('📈 Creating LP Pipeline charts...\n');

    const lpCharts = [];

    // KPI: Total LP Prospects
    lpCharts.push(await createChart({
      datasetId: datasets.lp_prospects,
      name: 'Notalone: Total LP Prospects',
      vizType: 'big_number_total',
      params: {
        metric: { label: 'count', expressionType: 'SQL', sqlExpression: 'COUNT(*)' },
        subheader: 'Total prospects'
      }
    }));
    await delay(200);

    // KPI: High Priority
    lpCharts.push(await createChart({
      datasetId: datasets.lp_prospects,
      name: 'Notalone: High Priority LPs',
      vizType: 'big_number_total',
      params: {
        metric: { label: 'count', expressionType: 'SQL', sqlExpression: "COUNT(*) FILTER (WHERE priority_tier = 1)" },
        subheader: 'Priority Tier 1'
      }
    }));
    await delay(200);

    // KPI: In Discussion
    lpCharts.push(await createChart({
      datasetId: datasets.lp_prospects,
      name: 'Notalone: LPs In Discussion',
      vizType: 'big_number_total',
      params: {
        metric: { label: 'count', expressionType: 'SQL', sqlExpression: "COUNT(*) FILTER (WHERE status = 'In Discussion')" },
        subheader: 'Active discussions'
      }
    }));
    await delay(200);

    // KPI: Committed
    lpCharts.push(await createChart({
      datasetId: datasets.lp_prospects,
      name: 'Notalone: Committed LPs',
      vizType: 'big_number_total',
      params: {
        metric: { label: 'count', expressionType: 'SQL', sqlExpression: "COUNT(*) FILTER (WHERE status = 'Committed')" },
        subheader: 'Committed investors'
      }
    }));
    await delay(200);

    // Pipeline by Status (funnel/bar)
    lpCharts.push(await createChart({
      datasetId: datasets.lp_prospects,
      name: 'Notalone: LP Pipeline by Status',
      vizType: 'dist_bar',
      params: {
        groupby: ['status'],
        metrics: [{ label: 'count', expressionType: 'SQL', sqlExpression: 'COUNT(*)' }],
        color_scheme: 'supersetColors',
        show_legend: false,
        bar_stacked: false
      }
    }));
    await delay(200);

    // By Segment (pie)
    lpCharts.push(await createChart({
      datasetId: datasets.lp_prospects,
      name: 'Notalone: LPs by Segment',
      vizType: 'pie',
      params: {
        groupby: ['segment'],
        metric: { label: 'count', expressionType: 'SQL', sqlExpression: 'COUNT(*)' },
        show_labels: true,
        label_type: 'key_percent',
        innerRadius: 30
      }
    }));
    await delay(200);

    // LP Prospects Table
    lpCharts.push(await createChart({
      datasetId: datasets.v_lp_pipeline || datasets.lp_prospects,
      name: 'Notalone: LP Prospects Table',
      vizType: 'table',
      params: {
        all_columns: ['name', 'segment', 'status', 'priority_tier', 'institution_name'],
        percent_metrics: [],
        page_length: 25,
        include_search: true
      }
    }));
    await delay(200);

    console.log('\n🎛️  Creating LP Pipeline dashboard...\n');
    await createDashboard('Notalone - LP Pipeline & Fundraising', lpCharts, {
      title: 'LP Pipeline & Fundraising',
      rows: [
        { cells: [
          { name: 'Total', width: 3, height: 12 },
          { name: 'High Priority', width: 3, height: 12 },
          { name: 'In Discussion', width: 3, height: 12 },
          { name: 'Committed', width: 3, height: 12 }
        ]},
        { cells: [
          { name: 'By Status', width: 6, height: 40 },
          { name: 'By Segment', width: 6, height: 40 }
        ]},
        { cells: [
          { name: 'Prospects Table', width: 12, height: 50 }
        ]}
      ]
    });

    // ========================================
    // Dashboard 2: 8200 Network & People
    // ========================================
    console.log('\n📈 Creating 8200 Network charts...\n');

    const peopleCharts = [];

    // KPI: Total People
    peopleCharts.push(await createChart({
      datasetId: datasets.people,
      name: 'Notalone: Total People',
      vizType: 'big_number_total',
      params: {
        metric: { label: 'count', expressionType: 'SQL', sqlExpression: 'COUNT(*)' },
        subheader: 'In network'
      }
    }));
    await delay(200);

    // KPI: 8200 Alumni
    peopleCharts.push(await createChart({
      datasetId: datasets.people,
      name: 'Notalone: 8200 Alumni',
      vizType: 'big_number_total',
      params: {
        metric: { label: 'count', expressionType: 'SQL', sqlExpression: 'COUNT(*) FILTER (WHERE is_8200_alumni = true)' },
        subheader: 'Unit 8200 alumni'
      }
    }));
    await delay(200);

    // KPI: Founders
    peopleCharts.push(await createChart({
      datasetId: datasets.people,
      name: 'Notalone: Founders',
      vizType: 'big_number_total',
      params: {
        metric: { label: 'count', expressionType: 'SQL', sqlExpression: "COUNT(*) FILTER (WHERE person_current_role ILIKE '%founder%' OR person_current_role ILIKE '%ceo%')" },
        subheader: 'Founders & CEOs'
      }
    }));
    await delay(200);

    // KPI: Total Connections
    peopleCharts.push(await createChart({
      datasetId: datasets.connections,
      name: 'Notalone: Network Connections',
      vizType: 'big_number_total',
      params: {
        metric: { label: 'count', expressionType: 'SQL', sqlExpression: 'COUNT(*)' },
        subheader: 'Total connections'
      }
    }));
    await delay(200);

    // Connections by Type
    peopleCharts.push(await createChart({
      datasetId: datasets.connections,
      name: 'Notalone: Connections by Type',
      vizType: 'pie',
      params: {
        groupby: ['connection_type'],
        metric: { label: 'count', expressionType: 'SQL', sqlExpression: 'COUNT(*)' },
        show_labels: true,
        innerRadius: 30
      }
    }));
    await delay(200);

    // People by Location
    peopleCharts.push(await createChart({
      datasetId: datasets.people,
      name: 'Notalone: People by Location',
      vizType: 'dist_bar',
      params: {
        groupby: ['location'],
        metrics: [{ label: 'count', expressionType: 'SQL', sqlExpression: 'COUNT(*)' }],
        row_limit: 10,
        order_desc: true
      }
    }));
    await delay(200);

    // People Directory Table
    peopleCharts.push(await createChart({
      datasetId: datasets.v_8200_network || datasets.people,
      name: 'Notalone: People Directory',
      vizType: 'table',
      params: {
        all_columns: ['full_name', 'person_current_role', 'location', 'is_8200_alumni'],
        percent_metrics: [],
        page_length: 25,
        include_search: true
      }
    }));
    await delay(200);

    console.log('\n🎛️  Creating 8200 Network dashboard...\n');
    await createDashboard('Notalone - 8200 Network & People', peopleCharts, {
      title: '8200 Network & People',
      rows: [
        { cells: [
          { name: 'Total People', width: 3, height: 12 },
          { name: '8200 Alumni', width: 3, height: 12 },
          { name: 'Founders', width: 3, height: 12 },
          { name: 'Connections', width: 3, height: 12 }
        ]},
        { cells: [
          { name: 'Connection Types', width: 6, height: 40 },
          { name: 'By Location', width: 6, height: 40 }
        ]},
        { cells: [
          { name: 'Directory', width: 12, height: 50 }
        ]}
      ]
    });

    // ========================================
    // Dashboard 3: Companies & Funding
    // ========================================
    console.log('\n📈 Creating Companies & Funding charts...\n');

    const companyCharts = [];

    // KPI: Total Companies
    companyCharts.push(await createChart({
      datasetId: datasets.companies,
      name: 'Notalone: Total Companies',
      vizType: 'big_number_total',
      params: {
        metric: { label: 'count', expressionType: 'SQL', sqlExpression: 'COUNT(*)' },
        subheader: 'Tracked companies'
      }
    }));
    await delay(200);

    // KPI: Total Raised
    companyCharts.push(await createChart({
      datasetId: datasets.companies,
      name: 'Notalone: Total Raised',
      vizType: 'big_number_total',
      params: {
        metric: { label: 'sum', expressionType: 'SQL', sqlExpression: 'SUM(total_raised_usd) / 1000000' },
        subheader: 'Million USD'
      }
    }));
    await delay(200);

    // KPI: Funding Rounds
    companyCharts.push(await createChart({
      datasetId: datasets.funding,
      name: 'Notalone: Funding Rounds',
      vizType: 'big_number_total',
      params: {
        metric: { label: 'count', expressionType: 'SQL', sqlExpression: 'COUNT(*)' },
        subheader: 'Total rounds'
      }
    }));
    await delay(200);

    // KPI: Avg Round Size
    companyCharts.push(await createChart({
      datasetId: datasets.funding,
      name: 'Notalone: Avg Round Size',
      vizType: 'big_number_total',
      params: {
        metric: { label: 'avg', expressionType: 'SQL', sqlExpression: 'AVG(amount_raised_usd) / 1000000' },
        subheader: 'Million USD'
      }
    }));
    await delay(200);

    // Companies by Stage
    companyCharts.push(await createChart({
      datasetId: datasets.companies,
      name: 'Notalone: Companies by Stage',
      vizType: 'pie',
      params: {
        groupby: ['stage'],
        metric: { label: 'count', expressionType: 'SQL', sqlExpression: 'COUNT(*)' },
        show_labels: true,
        innerRadius: 30
      }
    }));
    await delay(200);

    // Funding by Round Type
    companyCharts.push(await createChart({
      datasetId: datasets.funding,
      name: 'Notalone: Funding by Round Type',
      vizType: 'dist_bar',
      params: {
        groupby: ['round_type'],
        metrics: [{ label: 'total', expressionType: 'SQL', sqlExpression: 'SUM(amount_raised_usd) / 1000000' }],
        order_desc: true
      }
    }));
    await delay(200);

    // Top Companies Table
    companyCharts.push(await createChart({
      datasetId: datasets.v_company_funding || datasets.companies,
      name: 'Notalone: Top Companies',
      vizType: 'table',
      params: {
        all_columns: ['company_name', 'stage', 'total_raised_usd', 'employee_count'],
        percent_metrics: [],
        page_length: 25,
        include_search: true,
        order_desc: true
      }
    }));
    await delay(200);

    console.log('\n🎛️  Creating Companies dashboard...\n');
    await createDashboard('Notalone - Companies & Funding', companyCharts, {
      title: 'Companies & Funding',
      rows: [
        { cells: [
          { name: 'Total Companies', width: 3, height: 12 },
          { name: 'Total Raised', width: 3, height: 12 },
          { name: 'Funding Rounds', width: 3, height: 12 },
          { name: 'Avg Round', width: 3, height: 12 }
        ]},
        { cells: [
          { name: 'By Stage', width: 6, height: 40 },
          { name: 'By Round Type', width: 6, height: 40 }
        ]},
        { cells: [
          { name: 'Top Companies', width: 12, height: 50 }
        ]}
      ]
    });

    // Summary
    console.log('\n' + '═'.repeat(60));
    console.log('✅ NOTALONE DASHBOARD SETUP COMPLETE');
    console.log('═'.repeat(60));
    console.log('  Dashboards created:');
    console.log('    • Notalone - LP Pipeline & Fundraising');
    console.log('    • Notalone - 8200 Network & People');
    console.log('    • Notalone - Companies & Funding');
    console.log(`\n  View at: ${SUPERSET_URL}`);
    console.log('═'.repeat(60));

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main();
