# Day 15 - Evidence Checklist

Use these screenshots for your portfolio evidence.

## Required screenshots

- Sample input data in `data/day15-sample-input.json`.
- Terminal output after running `node scripts/day15-upsert-logic.js`.
- Generated log file at `logs/day15-generated-run-log.json`.
- Failed validation records showing missing email/domain.
- Duplicate flags showing email/domain duplicate handling.
- API request pattern file at `api-requests/day15-hubspot-upsert-pattern.http`.
- Documentation page at `docs/day-15-api-upsert-logic.md`.

## Loom outline

1. Explain the problem: create-only syncs pollute HubSpot.
2. Show sample input data.
3. Explain required validation fields.
4. Show email/domain dedupe rules.
5. Run the local script.
6. Show success/failure log.
7. Explain where real HubSpot search/create/update API calls would be added.
8. Explain production limits and security guardrails.

## Strong demo line

> This upsert layer prevents duplicate CRM records by validating required fields and deciding create/update paths before writing anything to HubSpot.
