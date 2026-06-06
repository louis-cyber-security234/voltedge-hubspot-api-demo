# HubSpot API Read Test

## Objective

Fetch one sample contact and one sample company from HubSpot to prove that the API token, scopes and read request pattern are working.

## Why This Matters

This is the first non-write API proof step. It confirms that the integration can safely authenticate and read CRM records before any update/upsert logic is attempted.

## Test Files

- `api-requests/hubspot-read-test.http`
- `scripts/hubspot-read-test.sh`

## Required Local Environment Variables

Do not commit real values. Set these locally only:

```bash
export HUBSPOT_PRIVATE_APP_TOKEN="your-private-app-token"
export HUBSPOT_SAMPLE_EMAIL="sample@example.com"
export HUBSPOT_SAMPLE_COMPANY_DOMAIN="example.com"
```

## Contact Read Test

The contact read test searches HubSpot contacts by email and returns a single matching contact.

Requested properties:

- `email`
- `firstname`
- `lastname`
- `lifecyclestage`
- `company`
- `createdate`
- `lastmodifieddate`

## Company Read Test

The company read test searches HubSpot companies by domain and returns a single matching company.

Requested properties:

- `name`
- `domain`
- `industry`
- `lifecyclestage`
- `createdate`
- `hs_lastmodifieddate`

## Expected Success Evidence

A successful response should return:

- HTTP status `200`
- `total` count
- `results` array
- HubSpot object `id`
- `properties` object
- `createdAt` and `updatedAt` metadata

## Expected Failure Examples

- `401` or `403`: token missing, invalid or lacking scopes
- `400`: invalid request body or property name
- `200` with empty results: request worked but no matching record was found

## Evidence to Capture

- Screenshot of the request file
- Screenshot of the terminal/API client response
- Redacted response structure
- Notes on any status codes or scope issues

## Guardrail

Do not paste real tokens, raw customer data or private response payloads into the public repo. Use screenshots with sensitive values blurred or use mock/redacted response examples.
