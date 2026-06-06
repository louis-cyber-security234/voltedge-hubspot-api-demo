# API Loom Outline

## Video Title

VoltEdge RevOps Demo - HubSpot API Auth and Read Test

## Goal

Show that the demo includes a safe HubSpot API access pattern using a private app token, environment variables, read-only test requests, response structure notes and security guardrails.

## Suggested Length

4 to 6 minutes.

## Loom Structure

### 1. Intro - 20 seconds

"In this walkthrough, I’m showing the API layer behind the VoltEdge RevOps demo. The goal is to prove safe HubSpot API access before building any write/upsert automation."

### 2. Repo Overview - 45 seconds

Show:

- `README.md`
- `.env.example`
- `docs/private-app-token-handling.md`
- `docs/auth-test.md`
- `docs/api-read-test.md`

Say:

"The repo documents the integration pattern but does not contain real credentials. Secrets are handled through environment variables or n8n credentials."

### 3. Auth Test - 60 seconds

Show:

- `api-requests/hubspot-auth-test.http`
- `scripts/hubspot-auth-test.sh`

Say:

"The request uses a Bearer token pattern. The token is referenced as an environment variable, not hardcoded."

### 4. Read Test - 60 seconds

Show:

- `api-requests/hubspot-read-test.http`
- `scripts/hubspot-read-test.sh`

Say:

"The read test fetches one contact by email and one company by domain. This proves read access and gives us the object IDs and property structure needed for future update logic."

### 5. Response Structure - 60 seconds

Show:

- `docs/response-structure-notes.md`

Say:

"The workflow should not blindly assume the response shape. It needs to inspect total count, results array, object ID and properties before mapping downstream."

### 6. Security Logic - 60 seconds

Show:

- `docs/api-scope-security-logic.md`

Say:

"The security model is least privilege. Read tests come before write operations. Tokens are not committed, responses are redacted, and scope errors are handled separately from empty results."

### 7. Close - 30 seconds

Say:

"This is the foundation for the later API upsert logic: authenticate safely, read records, understand the response structure, then build controlled create/update logic with validation, dedupe and error handling."

## Screenshots to Capture

- `.env.example` showing placeholders
- Auth request file
- Read request file
- Redacted successful response
- Response structure notes
- Security/scope notes

## What Not to Show

- Real HubSpot private app token
- Real customer data
- Full request headers with secrets
- Real n8n credential screens
- Unredacted CRM object IDs if sensitive
