#!/bin/bash
#
# Fix Superset Chart 179 - Network Graph "Metric 'weight' does not exist"
#
# Run this script ON THE XNODE3 SERVER where Superset is accessible at localhost:8088
#
# Usage: bash fix-superset-chart-179.sh
#

set -e

SUPERSET_URL="http://localhost:8088"
CHART_ID=179
USERNAME="admin"
PASSWORD="EventsHive2025!"

echo "=============================================="
echo "Fix Superset Chart 179 - Network Graph"
echo "=============================================="

# Step 1: Get login page CSRF token
echo "[1] Getting login page..."
LOGIN_CSRF=$(curl -s "$SUPERSET_URL/login/" | grep -oP 'name="csrf_token"[^>]*value="\K[^"]+' || true)

if [ -z "$LOGIN_CSRF" ]; then
    echo "ERROR: Could not extract CSRF token from login page"
    echo "Make sure Superset is running at $SUPERSET_URL"
    exit 1
fi

echo "    Got login CSRF token"

# Step 2: Login and save session cookies
echo "[2] Logging in..."
LOGIN_RESPONSE=$(curl -s -c /tmp/superset_cookies.txt -b /tmp/superset_cookies.txt \
    -X POST "$SUPERSET_URL/login/" \
    -d "username=$USERNAME&password=$PASSWORD&csrf_token=$LOGIN_CSRF" \
    -w "%{http_code}" -o /dev/null)

if [ "$LOGIN_RESPONSE" != "200" ] && [ "$LOGIN_RESPONSE" != "302" ]; then
    echo "ERROR: Login failed with status $LOGIN_RESPONSE"
    exit 1
fi

echo "    Login successful"

# Step 3: Get API CSRF token
echo "[3] Getting API CSRF token..."
API_CSRF=$(curl -s -b /tmp/superset_cookies.txt "$SUPERSET_URL/api/v1/security/csrf_token/" | grep -oP '"result":\s*"\K[^"]+' || true)

if [ -z "$API_CSRF" ]; then
    echo "ERROR: Could not get API CSRF token"
    exit 1
fi

echo "    Got API CSRF token"

# Step 4: Get current chart config
echo "[4] Getting current chart configuration..."
CURRENT_CHART=$(curl -s -b /tmp/superset_cookies.txt "$SUPERSET_URL/api/v1/chart/$CHART_ID")
echo "    Current chart retrieved"

# Step 5: Update chart with fixed params (removing metric or using COUNT)
echo "[5] Updating chart with fixed configuration..."

# New params without the problematic 'metric' string
# The graph chart will work fine without a metric - edges just have equal visual weight
NEW_PARAMS='{
    "datasource": "66__table",
    "viz_type": "graph_chart",
    "source": "source",
    "target": "target",
    "source_category": "category",
    "target_category": "category",
    "layout": "force",
    "roam": true,
    "draggable": true,
    "repulsion": 1000,
    "gravity": 0.2,
    "friction": 0.6,
    "edge_length": 400,
    "show_legend": true,
    "legend_orientation": "horizontal",
    "row_limit": 500
}'

# Compact JSON for API call (remove newlines)
PARAMS_COMPACT=$(echo "$NEW_PARAMS" | tr -d '\n' | tr -s ' ')

UPDATE_RESPONSE=$(curl -s -b /tmp/superset_cookies.txt \
    -H "X-CSRFToken: $API_CSRF" \
    -H "Content-Type: application/json" \
    -X PUT "$SUPERSET_URL/api/v1/chart/$CHART_ID" \
    -d "{\"params\": \"$(echo "$PARAMS_COMPACT" | sed 's/"/\\"/g')\"}" \
    -w "\n%{http_code}")

HTTP_CODE=$(echo "$UPDATE_RESPONSE" | tail -1)
RESPONSE_BODY=$(echo "$UPDATE_RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "    Chart updated successfully!"
else
    echo "    Warning: Update returned status $HTTP_CODE"
    echo "    Response: $RESPONSE_BODY"
fi

# Step 6: Verify
echo "[6] Verifying fix..."
VERIFY=$(curl -s -b /tmp/superset_cookies.txt "$SUPERSET_URL/api/v1/chart/$CHART_ID" | grep -c '"id":' || echo "0")

if [ "$VERIFY" -gt 0 ]; then
    echo "    Chart exists and is accessible"
else
    echo "    Warning: Could not verify chart"
fi

# Cleanup
rm -f /tmp/superset_cookies.txt

echo ""
echo "=============================================="
echo "DONE"
echo "=============================================="
echo ""
echo "Chart URL: $SUPERSET_URL/explore/?slice_id=$CHART_ID"
echo "Dashboard: $SUPERSET_URL/superset/dashboard/18/"
echo ""
echo "The chart should now render without the 'Metric does not exist' error."
echo "The graph will display with equal edge weights (no numeric metric)."
echo ""
