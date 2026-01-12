# Network Visualization Options for Notalone

**Date**: January 11, 2026
**Research By**: WebArchitect
**Status**: Research Complete

---

## Executive Summary

This document evaluates alternatives to Kumu.io for network visualizations that can integrate with the existing Notalone infrastructure (PostgreSQL on XNode3, Apache Superset). The goal is to find solutions that provide Kumu-like interactive network graphs while either embedding in Superset or working alongside it.

### Recommendation Summary

| Priority | Solution | Effort | Integration | Best For |
|----------|----------|--------|-------------|----------|
| **1** | **Apache ECharts Graph (Superset native)** | Low | Native | Quick win, basic networks |
| **2** | **Sigma.js/Gephi Lite standalone + iframe** | Medium | Embed | Full Kumu-like experience |
| **3** | **Grafana Node Graph** | Medium | Standalone | If already using Grafana |
| **4** | **Cytoscape.js + Dash** | High | Custom app | Advanced analysis |
| **5** | **Custom viz plugin** | High | Native | Long-term investment |

---

## Current Architecture

```
PostgreSQL (XNode3:5433)
    |
    +-- notalone.mv_network_edges (materialized view)
    |       - edge_type: cofounder, colleague, investor, board
    |       - source_id, source_name
    |       - target_id, target_name
    |       - context_id, context_name
    |       - strength, weight
    |
    +-- notalone.v_network_elements (view for Kumu elements.csv)
    +-- notalone.v_network_connections (view for Kumu connections.csv)
    |
    +-- Apache Superset (http://74.50.97.243:8088)
            - 3 dashboards: LP Pipeline, 8200 Network, Companies & Funding
            - 14 datasets connected
```

---

## Option 1: Apache ECharts Graph Chart (RECOMMENDED START)

### Overview
Superset already includes an ECharts Graph visualization that supports force-directed layouts. This is the fastest path to network visualization within existing infrastructure.

### Capabilities
- Force-directed and circular layouts
- Node sizing by metrics
- Edge styling by type/weight
- Interactive hover tooltips
- Zoom and pan
- Node dragging

### Implementation

**Step 1: Create a Graph-Compatible Dataset**

```sql
-- Create a view that ECharts Graph can consume
CREATE OR REPLACE VIEW notalone.v_echarts_network AS
WITH nodes AS (
    SELECT DISTINCT
        source_id AS id,
        source_name AS name,
        'person' AS category
    FROM notalone.mv_network_edges
    WHERE source_id IS NOT NULL
    UNION
    SELECT DISTINCT
        target_id AS id,
        target_name AS name,
        'person' AS category
    FROM notalone.mv_network_edges
    WHERE target_id IS NOT NULL
),
edges AS (
    SELECT
        source_id AS source,
        target_id AS target,
        weight AS value,
        edge_type AS name
    FROM notalone.mv_network_edges
    WHERE source_id IS NOT NULL
      AND target_id IS NOT NULL
)
SELECT * FROM nodes
UNION ALL
SELECT
    source::text,
    target::text,
    value::text,
    name
FROM edges;
```

**Step 2: Create Chart in Superset**
1. Go to Charts > Create New Chart
2. Select "Graph Chart" visualization
3. Configure:
   - Source column: `source`
   - Target column: `target`
   - Metric: `COUNT(*)`
   - Layout: "force" or "circular"

### Limitations
- Less polished than Kumu
- Limited styling options
- No persistent layouts
- Max ~1000 nodes performant

### Effort: LOW (1-2 hours)

---

## Option 2: Embed External Visualization via iframe (BEST Kumu ALTERNATIVE)

### Overview
Create a standalone network visualization using Sigma.js or Gephi Lite, then embed it in Superset using an iframe in a Markdown chart.

### Architecture

```
PostgreSQL --> Node.js API --> JSON --> Sigma.js/Gephi Lite
                                             |
                                        Static HTML
                                             |
                              Superset Dashboard (iframe embed)
```

### Option 2A: Gephi Lite (Recommended)

[Gephi Lite](https://github.com/gephi/gephi-lite) is a web-based version of Gephi that can be self-hosted and embedded.

**Features:**
- Full graph visualization with force-directed layouts
- Export to GEXF, JSON
- Self-hostable via Docker
- Embed via iframe

**Docker Deployment:**
```bash
docker build -f Dockerfile -t gephi-lite .
docker run -p 8090:80 gephi-lite
```

**Data Integration:**
```javascript
// api/network-data.js - Node.js endpoint
const { Pool } = require('pg');

const pool = new Pool({
    host: '74.50.97.243',
    port: 5433,
    database: 'calendar_monitoring',
    user: 'postgres',
    password: 'notalone2026'
});

app.get('/api/network.gexf', async (req, res) => {
    const nodes = await pool.query(`
        SELECT DISTINCT source_id as id, source_name as label
        FROM notalone.mv_network_edges
        WHERE source_id IS NOT NULL
    `);

    const edges = await pool.query(`
        SELECT source_id as source, target_id as target,
               weight, edge_type as label
        FROM notalone.mv_network_edges
        WHERE source_id IS NOT NULL AND target_id IS NOT NULL
    `);

    // Convert to GEXF format
    const gexf = generateGEXF(nodes.rows, edges.rows);
    res.type('application/xml').send(gexf);
});
```

**Superset Embed:**

First, configure `superset_config.py`:
```python
HTML_SANITIZATION_SCHEMA_EXTENSIONS = {
    "attributes": {
        "*": ["style", "className"],
        "iframe": ["src", "width", "height", "frameborder"]
    },
    "tagNames": ["style", "iframe"],
}

TALISMAN_CONFIG = {
    "content_security_policy": {
        "frame-src": [
            "'self'",
            "http://74.50.97.243:8090",  # Gephi Lite
        ],
    }
}
```

Then add a Markdown chart with:
```html
<iframe
    src="http://74.50.97.243:8090/?file=http://74.50.97.243:3000/api/network.gexf"
    width="100%"
    height="600"
    frameborder="0">
</iframe>
```

### Option 2B: Sigma.js Custom App

Create a custom React app using Sigma.js for maximum control.

**Tech Stack:**
- React + TypeScript
- @react-sigma/core
- graphology
- graphology-layout-forceatlas2

**Installation:**
```bash
npm install @react-sigma/core sigma graphology graphology-layout-forceatlas2
```

**Sample Component:**
```tsx
// NetworkGraph.tsx
import { SigmaContainer, useLoadGraph } from "@react-sigma/core";
import Graph from "graphology";
import forceAtlas2 from "graphology-layout-forceatlas2";
import { useEffect } from "react";

const LoadGraph = ({ data }) => {
    const loadGraph = useLoadGraph();

    useEffect(() => {
        const graph = new Graph();

        // Add nodes
        data.nodes.forEach(node => {
            graph.addNode(node.id, {
                label: node.name,
                x: Math.random(),
                y: Math.random(),
                size: 10,
                color: getNodeColor(node.type)
            });
        });

        // Add edges
        data.edges.forEach(edge => {
            graph.addEdge(edge.source, edge.target, {
                weight: edge.weight,
                color: getEdgeColor(edge.type)
            });
        });

        // Apply force layout
        forceAtlas2.assign(graph, { iterations: 100 });
        loadGraph(graph);
    }, [data]);

    return null;
};

export const NetworkGraph = ({ apiUrl }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(apiUrl)
            .then(res => res.json())
            .then(setData);
    }, [apiUrl]);

    return (
        <SigmaContainer style={{ height: "600px" }}>
            {data && <LoadGraph data={data} />}
        </SigmaContainer>
    );
};
```

### Effort: MEDIUM (1-2 days)

---

## Option 3: Grafana Node Graph Panel

### Overview
Grafana has a built-in Node Graph panel that visualizes relationships. If you're considering adding Grafana to your stack, this is a strong option.

### Capabilities
- Native node graph visualization
- Layered and force-directed layouts
- Color coding by category
- Edge styling
- Drill-down support
- PostgreSQL data source native

### Implementation

**Install Grafana:**
```bash
docker run -d -p 3000:3000 --name=grafana grafana/grafana-oss
```

**PostgreSQL Data Source:**
1. Configuration > Data sources > Add data source
2. Select PostgreSQL
3. Configure: Host=172.17.0.1:5433, Database=calendar_monitoring

**Node Graph Query:**
```sql
-- Nodes frame
SELECT
    id,
    title,
    'person' AS mainStat,
    arc__cofounder,
    arc__colleague,
    arc__investor
FROM (
    SELECT DISTINCT
        source_id AS id,
        source_name AS title,
        SUM(CASE WHEN edge_type = 'cofounder' THEN 1 ELSE 0 END) as arc__cofounder,
        SUM(CASE WHEN edge_type = 'colleague' THEN 1 ELSE 0 END) as arc__colleague,
        SUM(CASE WHEN edge_type = 'investor' THEN 1 ELSE 0 END) as arc__investor
    FROM notalone.mv_network_edges
    GROUP BY source_id, source_name
) nodes;

-- Edges frame (separate query)
SELECT
    id,
    source,
    target,
    mainStat
FROM (
    SELECT
        ROW_NUMBER() OVER () AS id,
        source_id AS source,
        target_id AS target,
        edge_type AS mainStat
    FROM notalone.mv_network_edges
    WHERE source_id IS NOT NULL AND target_id IS NOT NULL
) edges;
```

### Plugins to Consider
- **Node Graph API Plugin**: Connect REST APIs directly to Node Graph
- **Infinity Datasource**: Generate Node Graph from JSON/CSV
- **ESnet Network Map Panel**: Geographic network topology

### Effort: MEDIUM (3-4 hours setup + ongoing)

---

## Option 4: Cytoscape.js with Dash (Advanced Analysis)

### Overview
For serious network analysis with built-in algorithms, Cytoscape.js is the scientific standard. Dash Cytoscape provides a Python-friendly wrapper.

### When to Choose This
- Need centrality calculations
- Cluster detection required
- Path finding algorithms
- Scientific rigor important

### Implementation

**Install:**
```bash
pip install dash dash-cytoscape
```

**Dash App:**
```python
# app.py
import dash
from dash import html
import dash_cytoscape as cyto
import psycopg2
import json

def get_network_data():
    conn = psycopg2.connect(
        host="74.50.97.243",
        port=5433,
        database="calendar_monitoring",
        user="postgres",
        password="notalone2026"
    )

    cur = conn.cursor()

    # Get nodes
    cur.execute("""
        SELECT DISTINCT source_id, source_name
        FROM notalone.mv_network_edges
        WHERE source_id IS NOT NULL
    """)
    nodes = [{"data": {"id": str(r[0]), "label": r[1]}} for r in cur.fetchall()]

    # Get edges
    cur.execute("""
        SELECT source_id, target_id, edge_type, weight
        FROM notalone.mv_network_edges
        WHERE source_id IS NOT NULL AND target_id IS NOT NULL
    """)
    edges = [{"data": {"source": str(r[0]), "target": str(r[1]),
                       "label": r[2], "weight": r[3]}} for r in cur.fetchall()]

    conn.close()
    return nodes + edges

app = dash.Dash(__name__)

app.layout = html.Div([
    cyto.Cytoscape(
        id='network-graph',
        layout={'name': 'cose'},  # Force-directed
        style={'width': '100%', 'height': '800px'},
        elements=get_network_data(),
        stylesheet=[
            {'selector': 'node',
             'style': {'label': 'data(label)', 'background-color': '#0074D9'}},
            {'selector': 'edge',
             'style': {'curve-style': 'bezier', 'target-arrow-shape': 'triangle'}}
        ]
    )
])

if __name__ == '__main__':
    app.run_server(debug=True, port=8050)
```

**Docker Deployment:**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "-b", "0.0.0.0:8050", "app:server"]
```

### Effort: MEDIUM-HIGH (1-2 days)

---

## Option 5: Custom Superset Visualization Plugin

### Overview
Build a custom network visualization plugin for Superset using ECharts, D3, or vis.js.

### When to Choose This
- Long-term investment in visualization
- Need native Superset integration
- Want to contribute to open source

### Implementation Steps

1. **Generate Plugin Scaffold:**
```bash
mkdir superset-plugin-chart-network
cd superset-plugin-chart-network
npx yo @superset-ui/superset
```

2. **Implement with vis.js:**
```typescript
// src/plugin/NetworkChart.tsx
import { vis } from 'vis-network';

export default function NetworkChart({ data, height, width }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const nodes = new vis.DataSet(data.nodes);
        const edges = new vis.DataSet(data.edges);

        const network = new vis.Network(
            containerRef.current,
            { nodes, edges },
            { physics: { enabled: true } }
        );

        return () => network.destroy();
    }, [data]);

    return <div ref={containerRef} style={{ height, width }} />;
}
```

3. **Register Plugin:**
```javascript
import NetworkChartPlugin from 'superset-plugin-chart-network';
new NetworkChartPlugin().configure({ key: 'network' }).register();
```

4. **Build and Deploy:**
```bash
npm run build
# Copy to superset-frontend/plugins/
# Rebuild Superset
```

### Effort: HIGH (3-5 days + maintenance)

---

## Option 6: deck.gl Integration (Geospatial Networks)

### Overview
If your network has geographic components (company HQ locations, person locations), deck.gl provides stunning geospatial network visualizations.

### Current Superset deck.gl Support
- Arc Layer (connections between geo points)
- Scatter Layer (nodes)
- Path Layer (routes)

### Implementation for Notalone

```sql
-- Create geo-enabled network view
CREATE VIEW notalone.v_geo_network AS
SELECT
    p.id,
    p.name,
    p.current_location,
    ST_X(p.location_geom) as longitude,
    ST_Y(p.location_geom) as latitude,
    COUNT(DISTINCT e.target_id) as connection_count
FROM notalone.notalone_people p
LEFT JOIN notalone.mv_network_edges e ON e.source_id = p.id
WHERE p.location_geom IS NOT NULL
GROUP BY p.id, p.name, p.current_location, p.location_geom;
```

**Use deck.gl Arc in Superset:**
1. Create chart with deck.gl Arc type
2. Source: starting location
3. Target: ending location
4. Color by edge type

### Effort: MEDIUM (requires PostGIS + location data)

---

## Comparison Matrix

| Feature | ECharts Graph | Gephi Lite | Grafana | Cytoscape | Custom Plugin |
|---------|--------------|------------|---------|-----------|---------------|
| Native Superset | Yes | iframe | No | No | Yes |
| Setup Effort | 1-2 hrs | 1-2 days | 3-4 hrs | 1-2 days | 3-5 days |
| Max Nodes | ~1000 | ~10000 | ~5000 | ~10000 | Depends |
| Interactivity | Medium | High | Medium | High | Full control |
| Kumu Similarity | Low | High | Medium | High | Full control |
| Maintenance | Low | Medium | Medium | Medium | High |
| Layout Control | Basic | Full | Basic | Full | Full |

---

## Recommended Implementation Path

### Phase 1: Quick Win (This Week)
1. **Enable ECharts Graph in Superset**
   - Create `v_echarts_network` view
   - Add Graph Chart to 8200 Network dashboard
   - Time: 2-3 hours

### Phase 2: Enhanced Visualization (Next 2 Weeks)
2. **Deploy Gephi Lite + API**
   - Set up Node.js API for network data
   - Deploy Gephi Lite via Docker on XNode3
   - Configure Superset iframe embedding
   - Time: 1-2 days

### Phase 3: Long-term (Optional)
3. **Custom Plugin or Cytoscape Dash App**
   - Only if Phases 1-2 don't meet needs
   - Consider Grafana if monitoring use cases emerge

---

## Next Steps

1. [ ] Test ECharts Graph with current mv_network_edges data
2. [ ] Evaluate node count for performance (check `SELECT COUNT(*) FROM notalone.mv_network_edges`)
3. [ ] Decide on Phase 2 approach (Gephi Lite vs Sigma.js)
4. [ ] Configure superset_config.py for iframe support
5. [ ] Create Node.js API for dynamic network data

---

## Sources

### Superset Embedding
- [Superset Embedded SDK](https://www.npmjs.com/package/@superset-ui/embedded-sdk)
- [Embed External iframe Discussion](https://github.com/apache/superset/discussions/33129)
- [Embedding Dashboards in React](https://medium.com/@khushbu.adav/embedding-superset-dashboards-in-your-react-application-7f282e3dbd88)

### ECharts and Superset
- [Nine New ECharts Visualizations](https://preset.io/blog/2021-6-14-superset-nine-new-charts/)
- [Building Custom Viz Plugins](https://preset.io/blog/building-custom-viz-plugins-in-superset-v2/)
- [Apache ECharts Graph Examples](https://echarts.apache.org/examples/en/editor.html?c=graph-force)

### Grafana
- [Node Graph Panel Documentation](https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/visualizations/node-graph/)
- [Node Graph API Plugin](https://grafana.com/grafana/plugins/hamedkarbasi93-nodegraphapi-datasource/)
- [ESnet Network Map Panel](https://grafana.com/grafana/plugins/esnet-networkmap-panel/)

### Standalone Libraries
- [Sigma.js Documentation](https://www.sigmajs.org/)
- [Gephi Lite GitHub](https://github.com/gephi/gephi-lite)
- [Cytoscape.js](https://js.cytoscape.org/)
- [Dash Cytoscape](https://dash.plotly.com/cytoscape)

### deck.gl
- [deck.gl Superset Integration](https://docs.preset.io/docs/deckgl-chart)
- [deck.gl Examples](https://deck.gl/examples)

### Kumu Alternatives
- [Top 8 Kumu Alternatives](https://alternativeto.net/software/kumu/)
- [Network Graph Visualization Tools](https://noduslabs.com/portfolio/network-graph-visualization-tools-mapping-software/)
- [JavaScript Graph Libraries Comparison](https://www.cylynx.io/blog/a-comparison-of-javascript-graph-network-visualisation-libraries/)

---

*Last updated: January 11, 2026*
