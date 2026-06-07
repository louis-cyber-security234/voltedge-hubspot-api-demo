# README Day 15 Snippet

Add this to the main README if you want to highlight the Day 15 API layer.

## Day 15 - API Upsert Logic

This section demonstrates custom contact/company upsert logic for HubSpot-style CRM workflows.

The demo includes:

- Sample JSON/CSV input data
- Contact upsert planning by email
- Company upsert planning by domain
- Duplicate handling by email/domain
- Missing field validation
- Success/failure logging
- Clean and broken record test outputs
- Behaviour and limitations documentation

Run locally:

```bash
node scripts/day15-upsert-logic.js
```

Output:

```text
logs/day15-generated-run-log.json
```

The script is mock-first and does not write to live HubSpot. It is designed to show safe RevOps API decisioning before production implementation.
