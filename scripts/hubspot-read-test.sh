#!/usr/bin/env bash
set -euo pipefail

# HubSpot API Read Test
# Purpose: fetch one sample contact and one sample company without committing any secrets.
# Required environment variables:
#   HUBSPOT_PRIVATE_APP_TOKEN
#   HUBSPOT_SAMPLE_EMAIL
#   HUBSPOT_SAMPLE_COMPANY_DOMAIN

: "${HUBSPOT_PRIVATE_APP_TOKEN:?Set HUBSPOT_PRIVATE_APP_TOKEN first}"
: "${HUBSPOT_SAMPLE_EMAIL:?Set HUBSPOT_SAMPLE_EMAIL first}"
: "${HUBSPOT_SAMPLE_COMPANY_DOMAIN:?Set HUBSPOT_SAMPLE_COMPANY_DOMAIN first}"

echo "Running HubSpot contact read test..."

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
            \"value\": \"${HUBSPOT_SAMPLE_EMAIL}\"
          }
        ]
      }
    ],
    \"properties\": [\"email\", \"firstname\", \"lastname\", \"lifecyclestage\", \"company\", \"createdate\", \"lastmodifieddate\"],
    \"limit\": 1
  }"

echo ""
echo "Running HubSpot company read test..."

curl --request POST \
  --url "https://api.hubapi.com/crm/v3/objects/companies/search" \
  --header "Authorization: Bearer ${HUBSPOT_PRIVATE_APP_TOKEN}" \
  --header "Content-Type: application/json" \
  --data "{
    \"filterGroups\": [
      {
        \"filters\": [
          {
            \"propertyName\": \"domain\",
            \"operator\": \"EQ\",
            \"value\": \"${HUBSPOT_SAMPLE_COMPANY_DOMAIN}\"
          }
        ]
      }
    ],
    \"properties\": [\"name\", \"domain\", \"industry\", \"lifecyclestage\", \"createdate\", \"hs_lastmodifieddate\"],
    \"limit\": 1
  }"

echo ""
echo "Read test complete. Save response screenshots/redacted output as portfolio evidence."
