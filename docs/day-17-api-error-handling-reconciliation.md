# Day 17 - API Error Handling and Reconciliation

## Objective

Build logging, exception handling and reconciliation output for the VoltEdge HubSpot/n8n RevOps API demo.

## Commercial purpose

A production RevOps integration should not silently fail, duplicate records, or keep retrying bad data. Day 17 demonstrates the control layer around API work:

- error taxonomy
- validation before API calls
- try/catch exception handling
- failed record logging
- retry/review queue output
- rate-limit handling notes
- clean failure tests
- portfolio-ready walkthrough notes

## Files

- `data/day17-error-test-input.json`
- `data/day17-error-test-input.csv`
- `scripts/day17-error-reconciliation-logic.js`
- `scripts/day17-run-failure-tests.sh`
- `logs/day17-generated-error-log.json`
- `logs/day17-generated-reconciliation-queue.json`
- `logs/day17-generated-run-summary.json`
- `docs/day17-error-taxonomy.md`
- `docs/day17-rate-limit-handling-notes.md`
- `docs/day17-failure-test-output.md`
- `docs/day17-api-loom-outline.md`
- `api-requests/day17-error-handling-pattern.http`

## How to run

```bash
node scripts/day17-error-reconciliation-logic.js
cat logs/day17-generated-run-summary.json
cat logs/day17-generated-reconciliation-queue.json
```

Or:

```bash
bash scripts/day17-run-failure-tests.sh
```

## Expected output

The script should produce:

- successful prepared records
- validation failures
- auth/security review queue item
- rate-limit retry queue item
- transient API retry queue item
- duplicate conflict review queue item
- association review queue item

## Portfolio evidence to capture

Screenshot:

1. The terminal summary output
2. `logs/day17-generated-run-summary.json`
3. `logs/day17-generated-reconciliation-queue.json`
4. One validation error record
5. One rate-limit retry record
6. One auth/scope review record
7. One duplicate conflict record
8. The script showing the try/catch/error taxonomy pattern

## Demo explanation

Day 17 proves the integration is not just a happy-path sync. It shows what happens when records are incomplete, the API rejects a request, authentication/scopes fail, rate limits are hit, server errors occur, duplicates appear, or associations cannot be completed.

The reconciliation queue gives RevOps a place to review, fix, retry or block records instead of letting failures disappear.
