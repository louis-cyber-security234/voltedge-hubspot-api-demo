# HubSpot Auth Test Request

This document defines the basic authentication test for the VoltEdge HubSpot/n8n RevOps demo.

## Objective

Prove that the demo environment can authenticate safely against HubSpot using a private app token pattern without exposing secrets in GitHub.

This is not a production integration test. It is a controlled API connectivity check for portfolio evidence.

## Authentication Pattern

HubSpot API requests should use a private app access token stored outside GitHub.

The token should be passed as a Bearer token in the HTTP `Authorization` header:

```http
Authorization: Bearer ${HUBSPOT_PRIVATE_APP_TOKEN}
Content-Type: application/json
```

## Required Environment Variables

Create a local `.env` file or export the variable in your terminal:

```bash
export HUBSPOT_PRIVATE_APP_TOKEN="your_real_private_app_token_here"
```

Never commit the real `.env` file.

Only `.env.example` should be committed.

## Test Request

The test request searches for a contact by email using the HubSpot CRM Contacts Search endpoint.

```bash
curl --request POST \
  --url "https://api.hubapi.com/crm/v3/objects/contacts/search" \
  --header "Authorization: Bearer ${HUBSPOT_PRIVATE_APP_TOKEN}" \
  --header "Content-Type: application/json" \
  --data '{
    "filterGroups": [
      {
        "filters": [
          {
            "propertyName": "email",
            "operator": "EQ",
            "value": "sarah.jones@meridianrail.co.uk"
          }
        ]
      }
    ],
    "properties": ["email", "firstname", "lastname", "lifecyclestage", "createdate", "lastmodifieddate"],
    "limit": 1
  }'
```

## Expected Successful Result

A successful request should return HTTP 200 with a JSON response.

If the contact exists, the response should include a `results` array with the matching contact.

If the contact does not exist, the response should still authenticate successfully but return an empty `results` array.

## Common Failure Results

| Error | Likely Cause | Fix |
|---|---|---|
| 401 Unauthorized | Missing/invalid token | Check private app token and environment variable |
| 403 Forbidden | Token lacks required scope | Review private app scopes in HubSpot |
| 429 Rate limit | Too many requests | Wait and retry with backoff |
| 400 Bad request | Invalid search body | Check JSON structure and property names |

## Evidence to Capture

Take screenshots of:

1. The auth test script/file in GitHub.
2. The terminal command using the environment variable, without exposing the token.
3. The successful API response showing HTTP 200 or valid JSON output.
4. Any failed test and how it was fixed, if relevant.

## Guardrails

- Do not paste real tokens into ChatGPT.
- Do not commit `.env` files.
- Do not hard-code tokens in scripts.
- Use `.env.example` only for placeholders.
- Use least-privilege HubSpot private app scopes.
- Rotate the token immediately if it is exposed.

## Demo Talk Track

This test proves the API authentication layer before building live update logic. I kept the token outside GitHub, used an environment variable, and documented the expected success and failure responses. This shows basic API readiness without leaking credentials.
