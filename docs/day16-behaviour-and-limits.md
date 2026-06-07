# Day 16 - Behaviour and Limits

## Behaviour

The Day 16 script processes mock opportunity records and creates an API-ready action plan.

For each valid opportunity, it prepares:

- deal create/update payload
- contact to company association plan
- deal to company association plan
- deal to contact association plan
- lifecycle/deal stage recommendation

For invalid records, it writes failure details to the log and creates no action plan.

## Required Fields

A record must have:

- `deal_name`
- `amount`
- `contact_email`
- `company_name`
- `company_domain`

## Duplicate Handling

The script detects duplicate deals inside the input batch using:

1. `external_opportunity_id`, where available
2. fallback of company domain + deal name

The first record is treated as create/update by dedupe key.
Repeated records are treated as update candidates.

## Association Handling

Associations are planned, not executed.

The script assumes production logic would first search/create:

- contact by email
- company by domain
- deal by dedupe key

Then associate returned object IDs.

## Lifecycle Guardrails

The script recommends lifecycle movement based on deal stage.

However, production logic should avoid dangerous downgrades.

Examples:

- Do not downgrade a customer to opportunity.
- Do not overwrite lifecycle stage without checking current CRM state.
- Do not move lifecycle stage based on untrusted source data.
- Closed-won should trigger customer logic only after revenue and deal ownership are verified.

## Limits

This demo does not:

- call live HubSpot
- authenticate against the HubSpot API
- create actual deals
- create actual associations
- handle every possible HubSpot pipeline/stage ID
- verify object IDs from live API responses
- handle rate limits or retries

## Production Requirements

Before production use, add:

- HubSpot private app credential handling
- exact pipeline and dealstage internal IDs
- live search-before-create logic
- retry/error handling
- reconciliation queue
- idempotency controls
- object association API calls
- audit logging
- permission/scope review
