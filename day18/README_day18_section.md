# README Update - Day 18 Section

## Day 18 - HubSpot Lead Routing, SLA and Review Workflows

Day 18 adds a HubSpot RevOps workflow layer for inbound lead routing, MQL notification, SLA task creation and stale lead review.

### What was built

- HubSpot custom properties for routing, assigned team, SLA status, stale flag and routing notes.
- Imported sample contacts for controlled workflow testing.
- Inbound lead routing workflow with eligibility and territory/priority branch logic.
- MQL notification workflow.
- SLA task creation workflow.
- Stale lead review fallback workflow.
- Safe HubSpot workflow testing with all workflows kept OFF.

### Validation

All workflows were tested using HubSpot's workflow Test function. The tested records reached the end of their expected paths, and screenshots were captured as evidence.

### Important note

The stale lead workflow is a controlled fallback review workflow, not true date-based stale detection. True stale-date logic is documented as a v2 enhancement using Last Activity Date, Last Contacted, Create Date, or custom SLA timestamp logic.

See:

- `docs/day18_hubspot_lead_routing_sla_workflows.md`
- `docs/day18_workflow_map.md`
