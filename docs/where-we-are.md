# Where We Are - VoltEdge RevOps Demo

## Completed evidence so far

### Day 11 - Lead/Product Data Sync Demo
- Mock lead/product payload created.
- Required field validation added.
- Contact upsert by email completed.
- Company dedupe hardened by domain search/update.
- Contact-to-company association logic added.
- Broken record routed to reconciliation queue.
- Word doc evidence created.

### Day 12 - Stripe Revenue Sync Demo
- Mock Stripe subscription/revenue event created.
- Revenue field mapping completed.
- HubSpot internal values corrected for dropdown fields.
- Revenue date format corrected to Unix millisecond timestamp.
- Company search/update by domain completed.
- Failed payment condition fixed.
- Revenue Sync Evidence output created.

### Day 13 - Ad Conversion Feedback Demo
- Attribution/contact properties planned and documented.
- MQL/SQL conversion event logic added in n8n.
- Closed-won revenue event logic added in n8n.
- Lead and revenue dedupe controls added.
- Budget recommendation rules added.
- Mock Slack/reporting outputs added.
- Guardrails Word document created.

### API/GitHub Evidence Layer
- GitHub repo created and pushed.
- README/environment notes added.
- Token handling plan added.
- HubSpot auth test request added.
- HubSpot read test and response structure notes added.
- API scope/security notes added.
- API Loom outline added.

## Current stage

### Day 15 - API Upsert Logic
The current package adds a local/mock upsert logic layer for contacts and companies.

It does not write to live HubSpot. It demonstrates the intended control flow:

1. Validate required fields.
2. Deduplicate by email/domain inside the input batch.
3. Prepare company search/create/update action by domain.
4. Prepare contact search/create/update action by email.
5. Prepare association step after object IDs are known.
6. Log success/failure results.
7. Document behaviour and limits.

## Next evidence to capture

- Screenshot of sample input data.
- Screenshot of local script/output log.
- Screenshot of generated success/failure log.
- Screenshot of API upsert pattern request file.
- Optional Loom walkthrough explaining the upsert control flow.
