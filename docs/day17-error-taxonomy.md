# Day 17 - Error Taxonomy

## Error categories

| Category | Meaning | Retry? | Queue action |
|---|---|---:|---|
| `validation_error` | Required fields or payload values are missing/invalid | No | Manual review |
| `auth_error` | Token missing, expired or scope is insufficient | No | Security review |
| `rate_limit_error` | API returned a rate-limit style response | Yes | Retry after backoff |
| `transient_api_error` | Temporary server/API failure | Yes | Retry later |
| `duplicate_conflict` | Duplicate or conflict detected | No | Dedupe review |
| `association_error` | Object IDs missing or association could not be completed | Usually no | Association review |
| `unexpected_exception` | Code-level unexpected failure | No | Developer review |

## Why this matters

Bad integrations do not fail loudly. They silently drop records, duplicate CRM data or retry broken payloads until the system becomes untrustworthy.

A clean error taxonomy allows the operator to decide:

- fix the source record
- retry later
- review permissions
- dedupe records
- patch the integration code
- escalate to RevOps/admin
