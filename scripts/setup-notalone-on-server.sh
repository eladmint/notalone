#!/bin/bash
# Notalone Superset Setup Script
# Run this ON XNode3 server: ssh xnode3 && bash setup-notalone-on-server.sh

SUPERSET_URL="http://localhost:8088"
USERNAME="admin"
PASSWORD="EventsHive2025!"

echo "=========================================="
echo "Notalone Superset Dashboard Setup"
echo "=========================================="
echo "Running on: $(hostname)"
echo "Time: $(date)"
echo ""

# Step 1: Login and get token
echo "Step 1: Authenticating..."
LOGIN_RESPONSE=$(curl -s -X POST "$SUPERSET_URL/api/v1/security/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\",\"provider\":\"db\"}")

ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin).get('access_token',''))" 2>/dev/null)

if [ -z "$ACCESS_TOKEN" ]; then
  echo "ERROR: Failed to authenticate"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi
echo "  OK - Token received"

# Step 2: Get CSRF token
echo "Step 2: Getting CSRF token..."
CSRF_RESPONSE=$(curl -s "$SUPERSET_URL/api/v1/security/csrf_token/" \
  -H "Authorization: Bearer $ACCESS_TOKEN")
CSRF_TOKEN=$(echo "$CSRF_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin).get('result',''))" 2>/dev/null)

if [ -z "$CSRF_TOKEN" ]; then
  echo "ERROR: Failed to get CSRF token"
  exit 1
fi
echo "  OK - CSRF token received"

# Headers for API calls
AUTH_HEADER="Authorization: Bearer $ACCESS_TOKEN"
CSRF_HEADER="X-CSRFToken: $CSRF_TOKEN"

# Step 3: Check databases
echo ""
echo "Step 3: Checking databases..."
DB_RESPONSE=$(curl -s "$SUPERSET_URL/api/v1/database/" -H "$AUTH_HEADER")
echo "$DB_RESPONSE" | python3 -c "
import sys,json
data = json.load(sys.stdin)
print(f'  Found {data.get(\"count\", 0)} databases:')
for db in data.get('result', []):
    print(f'    ID {db[\"id\"]}: {db[\"database_name\"]}')
"

# Step 4: Check if Notalone database exists
NOTALONE_DB_ID=$(echo "$DB_RESPONSE" | python3 -c "
import sys,json
data = json.load(sys.stdin)
for db in data.get('result', []):
    if 'notalone' in db['database_name'].lower():
        print(db['id'])
        break
" 2>/dev/null)

if [ -z "$NOTALONE_DB_ID" ]; then
  echo ""
  echo "Step 4: Creating Notalone database connection..."

  CREATE_DB_RESPONSE=$(curl -s -X POST "$SUPERSET_URL/api/v1/database/" \
    -H "$AUTH_HEADER" \
    -H "$CSRF_HEADER" \
    -H "Content-Type: application/json" \
    -d '{
      "database_name": "Notalone - Israeli Tech Ecosystem",
      "engine": "postgresql",
      "configuration_method": "sqlalchemy_form",
      "sqlalchemy_uri": "postgresql://postgres:notalone2026@host.docker.internal:5433/calendar_monitoring",
      "expose_in_sqllab": true,
      "allow_ctas": false,
      "allow_cvas": false,
      "allow_dml": false,
      "extra": "{\"schemas_allowed_for_file_upload\": [\"notalone\"], \"engine_params\": {\"connect_args\": {\"options\": \"-csearch_path=notalone\"}}}"
    }')

  NOTALONE_DB_ID=$(echo "$CREATE_DB_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null)

  if [ -n "$NOTALONE_DB_ID" ]; then
    echo "  OK - Created database ID: $NOTALONE_DB_ID"
  else
    echo "  Database may already exist or error occurred"
    echo "  Response: $CREATE_DB_RESPONSE"
    # Try to find it again
    NOTALONE_DB_ID=$(curl -s "$SUPERSET_URL/api/v1/database/" -H "$AUTH_HEADER" | python3 -c "
import sys,json
data = json.load(sys.stdin)
for db in data.get('result', []):
    if 'notalone' in db['database_name'].lower():
        print(db['id'])
        break
" 2>/dev/null)
  fi
else
  echo "  OK - Notalone database exists (ID: $NOTALONE_DB_ID)"
fi

if [ -z "$NOTALONE_DB_ID" ]; then
  echo "ERROR: Could not find or create Notalone database"
  exit 1
fi

# Step 5: Create datasets
echo ""
echo "Step 5: Creating datasets for Notalone tables..."

TABLES="notalone_people notalone_companies notalone_lp_prospects notalone_institutions notalone_employment_history notalone_funding_rounds notalone_person_connections notalone_cofounder_relationships notalone_board_positions notalone_acquisitions notalone_investment_relationships notalone_military_service notalone_education_records notalone_interactions_log"

VIEWS="v_lp_pipeline v_people_careers v_company_funding v_8200_network"

for TABLE in $TABLES $VIEWS; do
  RESULT=$(curl -s -X POST "$SUPERSET_URL/api/v1/dataset/" \
    -H "$AUTH_HEADER" \
    -H "$CSRF_HEADER" \
    -H "Content-Type: application/json" \
    -d "{\"database\": $NOTALONE_DB_ID, \"schema\": \"notalone\", \"table_name\": \"$TABLE\"}")

  ID=$(echo "$RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null)

  if [ -n "$ID" ]; then
    echo "  Created: $TABLE (ID: $ID)"
  else
    if echo "$RESULT" | grep -q "already exists"; then
      echo "  Exists: $TABLE"
    else
      echo "  Failed: $TABLE - $(echo $RESULT | head -c 100)"
    fi
  fi
done

# Step 6: List created datasets
echo ""
echo "Step 6: Listing Notalone datasets..."
curl -s "$SUPERSET_URL/api/v1/dataset/?q=(page_size:100)" -H "$AUTH_HEADER" | python3 -c "
import sys,json
data = json.load(sys.stdin)
notalone = [d for d in data.get('result', []) if 'notalone' in d.get('table_name', '').lower() or d.get('schema') == 'notalone']
print(f'  Found {len(notalone)} Notalone datasets:')
for d in notalone:
    print(f'    ID {d[\"id\"]}: {d[\"table_name\"]}')
"

echo ""
echo "=========================================="
echo "Setup complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Access Superset: http://74.50.97.243:8088"
echo "2. Login: admin / EventsHive2025!"
echo "3. Go to Charts > + Chart to create visualizations"
echo "4. Create dashboards from your charts"
echo ""
echo "For programmatic dashboard creation, run:"
echo "  node scripts/setup-notalone-dashboards.js"
