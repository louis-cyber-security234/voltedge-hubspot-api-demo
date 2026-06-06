# API Scope and Security Logic

## Objective

Document the security logic for HubSpot private app/API access in the VoltEdge RevOps demo.

## Core Principle

Use the minimum permissions required for the workflow. Do not request broad CRM access if the workflow only needs specific read/write operations.

## Demo Scope Assumptions

For the current read-test stage, the private app should only need read access to the relevant CRM objects.

Likely scope categories, depending on HubSpot account setup and exact API version:

- Contacts read access
- Companies read access
- Deals read access if revenue/deal testing is included
- Property read access if workflow needs to inspect custom property definitions
- Association read access if contact/company/deal relationship testing is included

For later update/upsert stages, additional write permissions may be required:

- Contacts write access
- Companies write access
- Deals write access
- Association write access where relationship updates are performed

## Token Handling Rules

- Store the real private app token in n8n credentials or local environment variables only.
- Never commit real tokens to GitHub.
- Never paste real tokens into documentation or screenshots.
- Use `.env.example` for placeholder variable names only.
- Use `.gitignore` to exclude real `.env` files.

## Request Security Logic

All HubSpot API requests should use:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

The token should be injected from a secure credential store or environment variable, not hardcoded into workflow nodes or scripts.

## Operational Guardrails

- Start with read-only tests before write/update tests.
- Validate request body before sending.
- Log status codes and response shape.
- Do not log full headers.
- Redact sensitive response values before adding screenshots to a portfolio repo.
- Rotate the token immediately if it is exposed.
- Use separate sandbox/test credentials for demos where possible.

## Scope Failure Handling

If the API returns `401`:

- Check whether the token is missing, malformed or revoked.

If the API returns `403`:

- Check whether the private app has the required object scopes.

If the API returns `400`:

- Check the request body, property names and filter syntax.

If the API returns `200` with zero results:

- The request probably worked, but the search criteria did not match an object.

## Demo Positioning

The point of this stage is not just to prove that an API call works. The point is to show safe integration practice:

- Read test before write logic
- Environment variables instead of hardcoded secrets
- Least-privilege scope thinking
- Redacted evidence
- Clear separation between demo data and production credentials
