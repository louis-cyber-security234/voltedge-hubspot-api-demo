# Day 17 - Failure Test Output

## Test scenarios covered

The Day 17 failure tests cover:

1. Clean record prepared successfully
2. Missing email validation failure
3. Missing company domain validation failure
4. Simulated 429 rate-limit response
5. Simulated 401 auth/scope failure
6. Simulated 503 transient API failure
7. Duplicate deal conflict
8. Association error

## Expected evidence

Run:

```bash
node scripts/day17-error-reconciliation-logic.js
cat logs/day17-generated-run-summary.json
cat logs/day17-generated-reconciliation-queue.json
```

Expected summary includes:

- `success_prepared`
- `failed_or_queued`
- `retryable_records`
- `manual_review_records`
- `validation_errors`
- `auth_errors`
- `rate_limit_errors`
- `transient_api_errors`
- `duplicate_conflicts`
- `association_errors`

## Screenshot list

Capture:

- terminal summary
- reconciliation queue
- error taxonomy in generated log
- validation error queue item
- rate-limit queue item
- auth/scope queue item
- duplicate conflict queue item
- association review queue item
