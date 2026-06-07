# Day 17 - Rate Limit Handling Notes

## Purpose

This note documents the rate-limit handling pattern for API integrations.

## Guardrails

Do not blindly retry every failed request.

Rate-limit and transient errors should use controlled retry logic:

1. Detect the response category.
2. Respect any retry-after value if provided.
3. Use exponential backoff when no retry-after value exists.
4. Set a maximum number of attempts.
5. Write the record to a retry/reconciliation queue.
6. Alert or report if the retry limit is exceeded.

## Demo pattern

The Day 17 script simulates a `429` rate-limit response and routes the record to:

- `error_category = rate_limit_error`
- `queue_action = retry_after_backoff`
- `retryable = true`
- `max_attempts = 3`

## Production pattern

In production, this should be handled in n8n or server-side code using:

- max retry attempts
- delay/backoff
- idempotency/dedupe keys
- dead-letter/reconciliation queue
- alerting if retry limit is exceeded

## What not to do

- Do not retry validation errors without fixing data.
- Do not retry auth/scope errors without reviewing credentials.
- Do not retry duplicate conflicts without dedupe review.
- Do not use unlimited retry loops.
