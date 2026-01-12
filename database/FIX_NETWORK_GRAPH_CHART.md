# Fix: Superset Network Graph Chart - "Metric 'weight' does not exist"

## Problem

Chart ID 179 ("Israeli Tech Network Graph") is showing error:
```
Metric 'weight' does not exist
```

## Root Cause

The chart was configured with `"metric": "weight"` but in Superset's ECharts Graph chart:
- The `metric` field expects either a registered metric from the dataset OR
- An adhoc metric definition (object with aggregate, column, expressionType)
- Simply using a column name string `"weight"` does not work

The view `notalone.v_network_graph_edges` has a `weight` column, but it needs to be properly referenced.

## Solutions

### Solution 1: Fix via Superset UI (Recommended)

1. Open the chart in edit mode:
   - URL: http://74.50.97.243:8088/explore/?slice_id=179

2. In the **Data** tab on the left:
   - Find the "Metric" or "Value" field
   - Click the dropdown
   - Either:
     - Select "COUNT(*)" as metric (simplest)
     - OR create a custom metric: Click "Custom SQL" and enter `MAX(weight)`
     - OR remove the metric entirely (ECharts Graph works without it - edges will have equal weight)

3. Save the chart

### Solution 2: Fix via SQL (Direct Database)

If you have access to Superset's metadata database (SQLite at `/var/lib/superset/superset.db`):

```sql
-- Get current chart params
SELECT id, slice_name, params
FROM slices
WHERE id = 179;

-- Update to use COUNT(*) as metric
UPDATE slices
SET params = json_set(
    params,
    '$.metric',
    json('{"expressionType":"SQL","sqlExpression":"COUNT(*)","label":"count"}')
)
WHERE id = 179;

-- OR simply remove the metric (graph will work without it)
UPDATE slices
SET params = json_remove(params, '$.metric')
WHERE id = 179;
```

### Solution 3: Fix via Superset API (from server)

Run from the XNode3 server (where network access to port 8088 is available):

```bash
# On the server, use curl to update the chart
# First login and get CSRF token

# Get CSRF from login page
CSRF=$(curl -s http://localhost:8088/login/ | grep -oP 'name="csrf_token"[^>]*value="\K[^"]+')

# Login and save cookies
curl -c /tmp/superset_cookies.txt -b /tmp/superset_cookies.txt \
  -X POST http://localhost:8088/login/ \
  -d "username=admin&password=EventsHive2025!&csrf_token=$CSRF"

# Get API CSRF token
API_CSRF=$(curl -s -b /tmp/superset_cookies.txt http://localhost:8088/api/v1/security/csrf_token/ | jq -r '.result')

# Update chart params to use COUNT(*)
curl -b /tmp/superset_cookies.txt \
  -H "X-CSRFToken: $API_CSRF" \
  -H "Content-Type: application/json" \
  -X PUT http://localhost:8088/api/v1/chart/179 \
  -d '{"params": "{\"viz_type\":\"graph_chart\",\"source\":\"source\",\"target\":\"target\",\"source_category\":\"category\",\"target_category\":\"category\",\"layout\":\"force\",\"roam\":true,\"draggable\":true,\"repulsion\":1000,\"gravity\":0.2,\"friction\":0.6,\"edge_length\":400,\"show_legend\":true,\"row_limit\":500,\"datasource\":\"66__table\"}"}'
```

### Solution 4: Recreate the Chart

If other fixes don't work, delete chart 179 and recreate with correct config:

1. Delete via API:
```bash
curl -b /tmp/superset_cookies.txt \
  -H "X-CSRFToken: $API_CSRF" \
  -X DELETE http://localhost:8088/api/v1/chart/179
```

2. Create new chart with this configuration:

```python
params = {
    "datasource": "66__table",
    "viz_type": "graph_chart",
    "source": "source",
    "target": "target",
    "source_category": "category",
    "target_category": "category",
    # Remove 'metric' field entirely, or use:
    # "metric": {"expressionType": "SQL", "sqlExpression": "COUNT(*)", "label": "count"},
    "layout": "force",
    "roam": True,
    "draggable": True,
    "repulsion": 1000,
    "gravity": 0.2,
    "friction": 0.6,
    "edge_length": 400,
    "show_legend": True,
    "row_limit": 500
}
```

## Verification

After applying the fix:

1. Go to http://74.50.97.243:8088/explore/?slice_id=179
2. Chart should render without the "Metric does not exist" error
3. The network graph should show nodes and edges

## Technical Notes

### ECharts Graph Chart Expected Schema

The `notalone.v_network_graph_edges` view provides:
- `source` - Source node name (TEXT)
- `target` - Target node name (TEXT)
- `category` - Edge type for coloring (TEXT)
- `weight` - Edge weight/thickness (INTEGER, 1-10)
- `origin` - Source of relationship (TEXT)
- `tooltip` - Hover text (TEXT)

### Metric Configuration in Superset

For ECharts Graph, valid metric formats:

```json
// Option 1: SQL Expression
{"expressionType": "SQL", "sqlExpression": "MAX(weight)", "label": "weight"}

// Option 2: Simple Aggregate
{"expressionType": "SIMPLE", "column": {"column_name": "weight"}, "aggregate": "MAX", "label": "weight"}

// Option 3: COUNT (no column)
{"expressionType": "SIMPLE", "aggregate": "COUNT", "label": "count"}

// Option 4: Omit metric entirely (valid for graph charts)
// Just don't include the "metric" key in params
```

---

**Created**: 2026-01-11
**Status**: Ready to apply
**Chart**: http://74.50.97.243:8088/explore/?slice_id=179
**Dashboard**: http://74.50.97.243:8088/superset/dashboard/18/
