# Day 17 - API Loom Walkthrough Outline

## Opening

"This Day 17 demo shows the error handling and reconciliation layer around the HubSpot API integration."

## Problem

"Most CRM syncs look fine on the happy path, but real issues happen when records are incomplete, tokens fail, rate limits are hit, duplicates appear or association IDs are missing."

## Walkthrough

1. Show the mock error test input.
2. Show the error taxonomy.
3. Run the script.
4. Show the summary output.
5. Open the error log.
6. Open the reconciliation queue.
7. Explain which records should be retried vs manually reviewed.
8. Explain the rate-limit/backoff approach.
9. Explain why validation failures should not be retried blindly.
10. Explain production hardening.

## Key phrases

- "This is not a live HubSpot write - it is a safe portfolio simulation."
- "The point is controlled failure handling, not just success-path automation."
- "Every failed record lands somewhere reviewable."
- "Retryable errors are separated from data-quality and security errors."
- "This prevents silent data loss and uncontrolled retry loops."

## Close

"This gives RevOps a practical control layer: log the failure, classify the error, decide whether to retry, and push unresolved items into a review queue."
