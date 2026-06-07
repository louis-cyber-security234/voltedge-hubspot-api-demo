# Day 16 - API Deal and Association Logic

## Objective

Build mock API logic for creating/updating deals and preparing HubSpot-style association operations.

This demo is deliberately mock-first. It does not call live HubSpot. It prepares the logic, payloads, validation, dedupe keys and association plans that a production implementation would use.

## Commercial Problem

B2B RevOps teams often have contacts and companies in the CRM, but pipeline data is messy:

- duplicate deals are created
- deals are not associated to contacts
- deals are not associated to companies
- lifecycle stages do not match deal stages
- revenue reporting is unreliable
- attribution breaks because deal objects are disconnected from original contact/company records

Day 16 demonstrates the control layer needed before sending deal data into HubSpot.

## Included Files

- `data/day16-opportunity-input.json`
- `data/day16-opportunity-input.csv`
- `scripts/day16-deal-association-logic.js`
- `scripts/day16-run-local-test.sh`
- `logs/day16-generated-association-log.json`
- `api-requests/day16-hubspot-deal-association-pattern.http`
- `docs/day16-behaviour-and-limits.md`
- `docs/day16-test-output.md`
- `evidence/day16-evidence-checklist.md`

## Logic Summary

The script:

1. Loads mock opportunity records.
2. Validates required deal/contact/company fields.
3. Normalises email and company domain.
4. Builds a deal dedupe key.
5. Decides whether to create/update a deal.
6. Prepares contact-company association.
7. Prepares deal-company association.
8. Prepares deal-contact association.
9. Applies lifecycle/deal stage rules.
10. Writes a structured run log.

## Dedupe Logic

Preferred deal dedupe key:

```text
external_id:<external_opportunity_id>
```

Fallback deal dedupe key:

```text
fallback:<company_domain>|<normalised_deal_name>
```

## Association Logic

The script prepares three association paths:

```text
contact > company
deal > company
deal > contact
```

The actual production API call should only be made after HubSpot returns object IDs from the contact/company/deal search or create/update calls.

## Stage Logic

The script maps source opportunity stages into HubSpot-style deal stages and recommends lifecycle movement.

Example:

```text
qualified_opportunity > appointmentscheduled > contact lifecycle = opportunity
closed_won > closedwon > contact lifecycle = customer
```

Guardrail: lifecycle should only move forward unless there is explicit business approval.

## Demo Talk Track

> Day 16 builds the deal and association layer. The workflow logic validates opportunity records, prevents duplicate deals, creates a deal dedupe key, prepares deal create/update payloads and plans the required HubSpot associations between contacts, companies and deals. This matters because pipeline reporting fails when deals are orphaned or duplicated.
