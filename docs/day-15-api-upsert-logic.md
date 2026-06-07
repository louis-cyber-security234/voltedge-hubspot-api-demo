# Day 15 - API Upsert Logic

## Objective

Build custom logic to create or update contacts and companies using a safe, mock-first API control pattern.

The commercial purpose is to show that the workflow does not blindly create CRM records. It validates input, checks dedupe keys, decides whether to create/update, and logs failures for review.

## Files in this package

| File | Purpose |
|---|---|
| `data/day15-sample-input.json` | JSON input records for clean, duplicate and broken tests |
| `data/day15-sample-input.csv` | CSV version of the same input data |
| `scripts/day15-upsert-logic.js` | Local mock upsert logic script |
| `scripts/day15-run-local-test.sh` | Shell helper to run the local test |
| `logs/day15-generated-run-log.json` | Example success/failure output log |
| `api-requests/day15-hubspot-upsert-pattern.http` | Example HubSpot API search/create/update request patterns |
| `docs/day15-test-output.md` | Test output notes |
| `docs/day15-behaviour-and-limits.md` | Behaviour and limitations |
| `docs/where-we-are.md` | Current project status/checklist |

## Upsert control flow

1. Read source record.
2. Validate required fields:
   - `email`
   - `company_domain`
   - `company_name`
3. Normalise email and domain.
4. Check duplicate email/domain within the batch.
5. Prepare company upsert by domain.
6. Prepare contact upsert by email.
7. Prepare contact-to-company association after returned HubSpot IDs are known.
8. Write success/failure log.

## Why email and domain are used

- Contact dedupe key: email.
- Company dedupe key: domain.

This mirrors a practical RevOps pattern: avoid create-only CRM syncs that generate duplicate contacts and companies.

## How to run locally

From the repo root:

```bash
node scripts/day15-upsert-logic.js
```

Or:

```bash
bash scripts/day15-run-local-test.sh
```

Expected log output is written to:

```text
logs/day15-generated-run-log.json
```

## Expected result

The sample input contains:

- 3 records ready for upsert
- 2 failed validation records
- 1 duplicate email/domain scenario

## What to screenshot

- `data/day15-sample-input.json`
- Terminal output from `node scripts/day15-upsert-logic.js`
- `logs/day15-generated-run-log.json`
- `api-requests/day15-hubspot-upsert-pattern.http`
- This documentation page

## Demo wording

> Day 15 shows the custom upsert logic layer. Instead of blindly creating CRM records, the logic validates required fields, dedupes contacts by email, dedupes companies by domain, prepares create/update actions, and logs failures. This is the control layer that prevents CRM pollution and gives RevOps teams an audit trail when records fail validation.
