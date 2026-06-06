# VoltEdge HubSpot API Demo

Portfolio demo showing HubSpot, n8n and RevOps automation patterns for B2B SaaS operations.

This project is designed as an interview and client-facing evidence pack. It demonstrates how CRM data quality, lead/product sync, revenue sync, conversion feedback, dedupe controls, validation rules, reconciliation queues and reporting outputs can work together in a controlled RevOps workflow.

## Positioning

This is not a generic lead generation demo.

It is a RevOps automation demo focused on:

- HubSpot CRM data quality
- n8n workflow design
- Lead and product data sync
- Stripe-style revenue sync
- Ad conversion feedback modelling
- Lifecycle and revenue event mapping
- Company/contact dedupe logic
- Association logic
- Validation and error routing
- Reconciliation queues
- Budget recommendation outputs

## Demo build summary

| Day | Demo area | Status | Evidence |
|---|---|---:|---|
| Day 11 | Lead/Product Data Sync | Complete | Validation, company dedupe, contact upsert, association logic, error queue |
| Day 12 | Stripe Revenue Sync | Complete | Revenue field mapping, internal values, company revenue update, failed payment path |
| Day 13 | Ad Conversion Feedback | Complete | MQL/SQL event logic, closed-won revenue logic, dedupe, budget rules, reporting output |

## Repository structure

```text
.
├── docs/
│   ├── day-11-lead-product-sync.md
│   ├── day-12-stripe-revenue-sync.md
│   ├── day-13-ad-conversion-feedback.md
│   ├── environment-notes.md
│   └── private-app-token-handling.md
├── evidence/
│   └── README.md
├── hubspot-properties/
│   └── README.md
├── n8n-workflows/
│   └── README.md
├── scripts/
│   └── push-to-github.sh
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

## Environment notes

This repository does not contain live credentials, production API keys or private tokens.

The current demo environment uses:

- HubSpot test/demo portal
- n8n development workspace
- Mock Stripe-style revenue events
- Mock ad conversion feedback events
- Mock Slack/reporting outputs
- Manual n8n execution for screenshots and evidence

Full environment notes are documented here:

[Environment Notes](docs/environment-notes.md)

## Private app and API token handling

Private app tokens and API credentials must never be committed to this repository.

This repo includes a token handling plan covering:

- Where tokens should be stored
- Which systems require credentials
- How scopes should be reviewed
- How to rotate credentials
- What should be mocked in the demo
- What must be confirmed before production use

See:

[Private App/API Token Handling Notes](docs/private-app-token-handling.md)

## Current demo workflow status

The n8n workflows are manual demo/evidence workflows. They are not published production automations.

Current workflow evidence includes:

- Day 11 lead/product sync path
- Day 11 broken record/reconciliation path
- Day 12 revenue sync path
- Day 12 failed payment/alert path
- Day 13 ad conversion feedback path
- Day 13 reporting recommendation path

## What this proves

This project proves practical RevOps implementation thinking:

- How to map external source data into HubSpot
- How to validate required fields before creating or updating CRM records
- How to dedupe companies by domain
- How to upsert contacts by email
- How to associate contacts and companies
- How to handle failed records through a reconciliation queue
- How to update revenue fields using correct internal values
- How to translate lifecycle and revenue events into ad conversion feedback
- How to prepare budget recommendations from CRM/revenue signals
- How to document limitations and production guardrails

## What this does not claim

This demo does not claim to be a live production integration.

It does not contain:

- Live Stripe API keys
- Live HubSpot private app tokens
- Live ad platform credentials
- Live Slack webhook URLs
- Real customer data
- Production retry infrastructure
- Production consent/legal review

## Production hardening checklist

Before using a similar setup in production, confirm:

- Data processing permissions and consent basis
- HubSpot private app scopes
- n8n credential storage
- API rate limits
- Retry behaviour
- Error alerting
- Reconciliation ownership
- Dedupe strategy
- Field-level internal values
- Ad platform conversion requirements
- Data retention policy
- Audit logging requirements

## Demo talk track

> This demo shows how I would design a closed-loop RevOps automation layer around HubSpot. Instead of only moving data between tools, I built validation, dedupe, association logic, revenue mapping, reconciliation paths and recommendation outputs. The goal is clean CRM data, reliable sync behaviour and better commercial decisions from lifecycle and revenue signals.

## Security note

This repo is intentionally safe to make public because all credentials are excluded and the workflow examples are documented as demo assets only.

Do not commit `.env`, access tokens, private app tokens, webhook secrets, API keys or customer data.
