# Day 15 - Behaviour and Limits

## Behaviour

This demo prepares upsert actions rather than writing to live HubSpot.

The script:

- Reads JSON input records.
- Validates required fields.
- Normalises email and company domain.
- Detects duplicate email/domain values inside the batch.
- Prepares company create/update actions by domain.
- Prepares contact create/update actions by email.
- Prepares association notes once HubSpot IDs are known.
- Logs failed validation records.

## Required fields

| Field | Why required |
|---|---|
| `email` | Contact dedupe/upsert key |
| `company_domain` | Company dedupe/upsert key |
| `company_name` | Required for meaningful company create/update |

## Current limits

- This is a mock/local control script, not a live production sync.
- It does not call the HubSpot API directly.
- It does not handle rate limiting.
- It does not write live records.
- It does not perform real association API calls.
- It only detects duplicates inside the current input batch.
- It assumes email and company domain are reliable dedupe keys.

## Production hardening required

Before live use, add:

- HubSpot API search calls before create/update.
- Retry logic for 429/rate-limit responses.
- Reconciliation queue for failed records.
- Association create/update calls.
- Logging to a durable store.
- Error categorisation.
- Private app token stored securely.
- Field mapping review against the target HubSpot portal.
- Data privacy review before processing real customer/prospect data.

## What not to claim

Do not claim this is a production-ready HubSpot integration.

Correct claim:

> This is a demo showing the upsert control pattern, validation rules, dedupe decisioning and success/failure logging that would sit around a production HubSpot API integration.
