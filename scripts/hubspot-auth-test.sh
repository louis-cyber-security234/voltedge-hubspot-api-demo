#!/usr/bin/env bash
set -euo pipefail

# VoltEdge RevOps Demo - HubSpot Auth Test
# Usage:
#   export HUBSPOT_PRIVATE_APP_TOKEN="your_real_token_here"
#   ./scripts/hubspot-auth-test.sh
#
# Do not commit real tokens or .env files to GitHub.

if [[ -z "${HUBSPOT_PRIVATE_APP_TOKEN:-}" ]]; then
  echo "ERROR: HUBSPOT_PRIVATE_APP_TOKEN is not set."
  echo "Run: export HUBSPOT_PRIVATE_APP_TOKEN=your_real_private_app_token_here"
  exit 1
fi

CONTACT_EMAIL="${CONTACT_EMAIL:-sarah.jones@meridianrail.co.uk}"

curl --request POST \
  --url "https://api.hubapi.com/crm/v3/objects/contacts/search" \
  --header "Authorization: Bearer ${HUBSPOT_PRIVATE_APP_TOKEN}" \
  --header "Content-Type: application/json" \
  --data "{
    \"filterGroups\": [
      {
        \"filters\": [
          {
            \"propertyName\": \"email\",
            \"operator\": \"EQ\",
            \"value\": \"${CONTACT_EMAIL}\"
          }
        ]
      }
    ],
    \"properties\": [\"email\", \"firstname\", \"lastname\", \"lifecyclestage\", \"createdate\", \"lastmodifieddate\"],
    \"limit\": 1
  }"

echo ""
echo "Auth test complete. If JSON returned without 401/403, authentication is working."
