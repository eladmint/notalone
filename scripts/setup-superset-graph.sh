#!/bin/bash
#
# Setup Superset Network Graph Chart
# Uses curl - no Python dependencies required
#

set -e

SUPERSET_URL="http://localhost:8088"
USERNAME="admin"
PASSWORD="EventsHive2025!"
COOKIE_FILE="/tmp/superset_session.txt"

echo "=================================================="
echo "Superset Network Graph Setup"
echo "=================================================="

# Cleanup
rm -f "$COOKIE_FILE"

# Step 1: Get CSRF token
echo ""
echo "[1] Getting CSRF token..."
CSRF_TOKEN=$(curl -s -c "$COOKIE_FILE" -b "$COOKIE_FILE" "$SUPERSET_URL/api/v1/security/csrf_token/" | python3 -c "import sys,json; print(json.load(sys.stdin).get('result',''))" 2>/dev/null || echo "")

if [ -z "$CSRF_TOKEN" ]; then
    echo "    Warning: No CSRF token, trying without..."
fi
echo "    CSRF: ${CSRF_TOKEN:0:20}..."

# Step 2: Login
echo ""
echo "[2] Logging in..."
LOGIN_RESULT=$(curl -s -c "$COOKIE_FILE" -b "$COOKIE_FILE" \
    -X POST "$SUPERSET_URL/api/v1/security/login" \
    -H "Content-Type: application/json" \
    -H "X-CSRFToken: $CSRF_TOKEN" \
    -d "{\"username\": \"$USERNAME\", \"password\": \"$PASSWORD\", \"provider\": \"db\", \"refresh\": true}")

ACCESS_TOKEN=$(echo "$LOGIN_RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('access_token',''))" 2>/dev/null || echo "")

if [ -z "$ACCESS_TOKEN" ]; then
    echo "    ERROR: Login failed - $LOGIN_RESULT"
    exit 1
fi
echo "    OK - Got access token"

# Set auth header for subsequent requests
AUTH_HEADER="Authorization: Bearer $ACCESS_TOKEN"

# Step 3: Check/Create Database
echo ""
echo "[3] Checking database connections..."
DB_LIST=$(curl -s -H "$AUTH_HEADER" "$SUPERSET_URL/api/v1/database/")
DB_COUNT=$(echo "$DB_LIST" | python3 -c "import sys,json; print(json.load(sys.stdin).get('count',0))" 2>/dev/null || echo "0")
echo "    Found $DB_COUNT existing databases"

# Look for existing postgres database
DB_ID=$(echo "$DB_LIST" | python3 -c "
import sys,json
data = json.load(sys.stdin)
for db in data.get('result', []):
    if 'postgres' in db.get('database_name','').lower() or 'notalone' in db.get('database_name','').lower():
        print(db['id'])
        break
" 2>/dev/null || echo "")

if [ -n "$DB_ID" ]; then
    echo "    Using existing database ID: $DB_ID"
else
    echo "    Creating new database connection..."
    # Get fresh CSRF
    CSRF_TOKEN=$(curl -s -b "$COOKIE_FILE" "$SUPERSET_URL/api/v1/security/csrf_token/" | python3 -c "import sys,json; print(json.load(sys.stdin).get('result',''))" 2>/dev/null || echo "")

    DB_RESULT=$(curl -s -H "$AUTH_HEADER" -H "X-CSRFToken: $CSRF_TOKEN" \
        -H "Content-Type: application/json" \
        -X POST "$SUPERSET_URL/api/v1/database/" \
        -d '{
            "database_name": "Notalone PostgreSQL",
            "sqlalchemy_uri": "postgresql://postgres:notalone2026@172.17.0.1:5433/calendar_monitoring",
            "expose_in_sqllab": true,
            "allow_ctas": true,
            "allow_cvas": true,
            "allow_dml": true
        }')

    DB_ID=$(echo "$DB_RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null || echo "")

    if [ -z "$DB_ID" ]; then
        echo "    ERROR: Failed to create database - $DB_RESULT"
        exit 1
    fi
    echo "    Created database ID: $DB_ID"
fi

# Step 4: Check/Create Dataset
echo ""
echo "[4] Checking datasets..."
DS_LIST=$(curl -s -H "$AUTH_HEADER" "$SUPERSET_URL/api/v1/dataset/")
DS_COUNT=$(echo "$DS_LIST" | python3 -c "import sys,json; print(json.load(sys.stdin).get('count',0))" 2>/dev/null || echo "0")
echo "    Found $DS_COUNT existing datasets"

# Look for network graph dataset
DS_ID=$(echo "$DS_LIST" | python3 -c "
import sys,json
data = json.load(sys.stdin)
for ds in data.get('result', []):
    if 'network' in ds.get('table_name','').lower() or 'edge' in ds.get('table_name','').lower():
        print(ds['id'])
        break
" 2>/dev/null || echo "")

if [ -n "$DS_ID" ]; then
    echo "    Using existing dataset ID: $DS_ID"
else
    echo "    Creating dataset from v_network_graph_edges..."
    CSRF_TOKEN=$(curl -s -b "$COOKIE_FILE" "$SUPERSET_URL/api/v1/security/csrf_token/" | python3 -c "import sys,json; print(json.load(sys.stdin).get('result',''))" 2>/dev/null || echo "")

    DS_RESULT=$(curl -s -H "$AUTH_HEADER" -H "X-CSRFToken: $CSRF_TOKEN" \
        -H "Content-Type: application/json" \
        -X POST "$SUPERSET_URL/api/v1/dataset/" \
        -d "{
            \"database\": $DB_ID,
            \"schema\": \"notalone\",
            \"table_name\": \"v_network_graph_edges\"
        }")

    DS_ID=$(echo "$DS_RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null || echo "")

    if [ -z "$DS_ID" ]; then
        echo "    ERROR: Failed to create dataset - $DS_RESULT"
        exit 1
    fi
    echo "    Created dataset ID: $DS_ID"
fi

# Step 5: Create Chart
echo ""
echo "[5] Creating graph chart..."
CSRF_TOKEN=$(curl -s -b "$COOKIE_FILE" "$SUPERSET_URL/api/v1/security/csrf_token/" | python3 -c "import sys,json; print(json.load(sys.stdin).get('result',''))" 2>/dev/null || echo "")

# Chart params without metric to avoid the error
PARAMS=$(cat <<'EOF'
{
    "viz_type": "graph_chart",
    "source": "source",
    "target": "target",
    "source_category": "category",
    "target_category": "category",
    "layout": "force",
    "roam": true,
    "draggable": true,
    "selected_mode": "single",
    "show_legend": true,
    "legend_orientation": "top",
    "repulsion": 1000,
    "gravity": 0.2,
    "friction": 0.6,
    "edge_length": 400,
    "row_limit": 500
}
EOF
)

# Escape for JSON
PARAMS_ESCAPED=$(echo "$PARAMS" | python3 -c "import sys,json; print(json.dumps(sys.stdin.read()))" 2>/dev/null)

CHART_RESULT=$(curl -s -H "$AUTH_HEADER" -H "X-CSRFToken: $CSRF_TOKEN" \
    -H "Content-Type: application/json" \
    -X POST "$SUPERSET_URL/api/v1/chart/" \
    -d "{
        \"slice_name\": \"Israeli Tech Network Graph\",
        \"viz_type\": \"graph_chart\",
        \"datasource_id\": $DS_ID,
        \"datasource_type\": \"table\",
        \"params\": $PARAMS_ESCAPED
    }")

CHART_ID=$(echo "$CHART_RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null || echo "")

if [ -z "$CHART_ID" ]; then
    echo "    Warning: Chart creation response - $CHART_RESULT"
    echo "    Checking if chart was created..."

    # List charts to find it
    CHART_LIST=$(curl -s -H "$AUTH_HEADER" "$SUPERSET_URL/api/v1/chart/")
    CHART_ID=$(echo "$CHART_LIST" | python3 -c "
import sys,json
data = json.load(sys.stdin)
for c in data.get('result', []):
    if 'network' in c.get('slice_name','').lower() or 'graph' in c.get('slice_name','').lower():
        print(c['id'])
        break
" 2>/dev/null || echo "")
fi

if [ -n "$CHART_ID" ]; then
    echo "    OK - Chart ID: $CHART_ID"
else
    echo "    ERROR: Could not create or find chart"
fi

# Cleanup
rm -f "$COOKIE_FILE"

echo ""
echo "=================================================="
echo "DONE!"
echo "=================================================="
echo ""
if [ -n "$CHART_ID" ]; then
    echo "Chart URL: $SUPERSET_URL/explore/?slice_id=$CHART_ID"
fi
echo "Dashboard: $SUPERSET_URL/superset/dashboard/18/"
echo ""
