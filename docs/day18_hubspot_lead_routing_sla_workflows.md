# Day 18 - HubSpot Lead Routing, SLA and Review Workflows

## Objective

Build and validate a HubSpot RevOps workflow system for inbound lead routing, MQL notification, SLA task creation and stale lead review.

This demo forms part of the VoltEdge HubSpot/n8n RevOps portfolio project. It demonstrates CRM data quality handling, routing logic, SLA governance, safe workflow testing, and operational documentation.

## Workflows Created

1. `VoltEdge | Inbound Lead Routing & Owner Assignment`
2. `VoltEdge | MQL Notification Workflow`
3. `VoltEdge | SLA Task Creation Workflow`
4. `VoltEdge | Stale Lead Review Workflow`

## Custom Properties Used

The following VoltEdge custom contact properties were used during the Day 18 workflow build and test process:

| Property | Purpose |
|---|---|
| `VE Routing Rule` | Stores or references the routing category used for branch logic. |
| `VE Assigned Team` | Indicates the team or queue responsible for follow-up. |
| `VE SLA Hours` | Stores the target response window. |
| `VE SLA Status` | Tracks whether the lead is pending, in review, or otherwise controlled by SLA logic. |
| `VE Stale Lead Flag` | Flags whether the record is stale, not stale, or requires review. |
| `VE Routing Notes` | Provides a human-readable explanation of the routing decision. |

## Test Data

Sample contacts were imported via CSV to validate routing, SLA, review and notification behaviour.

Import route:

`CRM > Contacts > Import > File from computer > One file > One object > Contacts`

Test contacts included:

| Test Contact | Intended Purpose |
|---|---|
| `test.enterprise.uk@voltedge-demo.com` | Enterprise routing branch test. |
| `test.uk.sdr@voltedge-demo.com` | UK routing branch test. |
| `test.us.mql.routing@voltedge-demo.com` | US routing branch test. |
| `test.review.queue@voltedge-demo.com` | RevOps review branch test. |
| `test.mql.notification@voltedge-demo.com` | MQL notification workflow test. |
| `test.sla.task@voltedge-demo.com` | SLA task workflow test. |
| `test.stale.review@voltedge-demo.com` | Stale lead review workflow test. |

## Validation Method

All HubSpot workflows remained **OFF** during testing.

HubSpot's workflow **Test** function was used to safely preview expected workflow paths without activating live automation.

The validation focused on confirming that records could:

- Enter the workflow test path.
- Pass eligibility logic.
- Move through the correct branch logic.
- Trigger simulated property updates, notifications or tasks.
- Reach the end of the workflow safely.
- Produce evidence screenshots for documentation.

## Test Results

| Workflow | Test Record | Expected Result | Outcome |
|---|---|---|---|
| `VoltEdge | Inbound Lead Routing & Owner Assignment` | `test.mql.notification@voltedge-demo.com` | US territory path, SLA/status/stale flag/routing note updates | PASS |
| `VoltEdge | MQL Notification Workflow` | `test.mql.notification@voltedge-demo.com` | MQL notification path completed | PASS |
| `VoltEdge | SLA Task Creation Workflow` | `test.sla.task@voltedge-demo.com` | SLA task creation path completed | PASS |
| `VoltEdge | Stale Lead Review Workflow` | `test.stale.review@voltedge-demo.com` | Stale/review fallback path completed | PASS |

## Data Quality Finding

The `Test Enterprise UK` record was excluded from final routing validation because the imported CSV row did not include a `VE Routing Rule` value.

This was treated as a **data-quality finding**, not a workflow failure.

The workflow correctly blocked an incomplete record at the eligibility gate. This demonstrates the value of testing imported records before enabling automation.

## Stale Lead Review Note

The `VoltEdge | Stale Lead Review Workflow` is an honest fallback review workflow, not true date-based stale detection.

True stale-date logic using `Last Activity Date`, `Last Contacted`, `Create Date`, or custom SLA timestamp logic is documented as a v2 enhancement.

## Evidence Captured

Screenshots were captured for:

- Imported test contacts.
- Workflow test record selection.
- Eligibility gate testing.
- Routing branch validation.
- Workflow actions reaching the end.
- SLA/status/routing note property updates.
- Stale/review fallback validation.

Suggested screenshot folder:

`/screenshots/day18/`

## Portfolio Summary

This demo shows a HubSpot RevOps workflow layer that routes inbound leads, sets SLA fields, triggers MQL notifications, creates SLA follow-up actions, and flags stale or review-needed records.

The system was validated using imported test contacts while keeping workflows inactive. A data-quality mismatch was identified and documented during testing, showing realistic RevOps validation rather than a purely idealised demo.
