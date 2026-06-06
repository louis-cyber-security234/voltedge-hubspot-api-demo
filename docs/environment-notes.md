# Environment Notes

This demo uses a controlled sandbox-style setup for HubSpot, n8n and mock API-style workflows.

## Systems Used

- HubSpot CRM
- n8n workflow automation
- Mock Stripe-style revenue payloads
- Mock ad conversion feedback events
- GitHub repository for documentation and portfolio evidence

## Demo Environment

The workflows are designed as manual demo/evidence workflows. They should not be treated as production automations without further hardening.

## Key Assumptions

- HubSpot custom properties have been created before running update workflows.
- n8n credentials are managed inside n8n and are not exported to GitHub.
- Mock payloads are used instead of live customer data.
- Screenshots and documentation are used as evidence outputs.
- Ad platform conversion events are prepared, not sent live.

## Production Requirements

Before production use, this setup would need:

- Confirmed HubSpot object schema
- Private app scopes reviewed
- Token storage policy
- Webhook authentication
- Error handling and retry logic
- Reconciliation queue
- Dedupe controls
- Consent/privacy review
- Audit logging
