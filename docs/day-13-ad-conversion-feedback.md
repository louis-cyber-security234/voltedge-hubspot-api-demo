# Day 13 - Ad Conversion Feedback Demo

## Objective

Design and build conversion feedback from HubSpot lifecycle/revenue events into ad platform style conversion outputs.

## Commercial problem

Many ad accounts optimise towards cheap form fills, while the CRM contains the quality signal: MQLs, SQLs, pipeline and closed-won revenue.

This workflow demonstrates how HubSpot lifecycle/revenue outcomes can be translated into conversion feedback events, deduped, and converted into budget recommendations.

## What was built so far

Workflow: `VoltEdge - Demo`

Day 13 branches added:

### Lead lifecycle branch

Manual Trigger > Day 13 - Mock HubSpot Lifecycle Event > Create MQL SQL Conversion Event Logic > Design Lead Conversion Dedupe Control > Create Lead Budget Recommendation Rules > Create Lead Recommendation Reporting Output

### Revenue branch

Manual Trigger > Day 13 - Mock Revenue Event > Create Closed Won Revenue Event Logic > Design Revenue Conversion Dedupe Control > Create Revenue Budget Recommendation Rules > Create Revenue Recommendation Reporting Output

## Conversion event mapping

| HubSpot event | Internal value | Demo conversion event | Signal strength |
|---|---|---|---|
| Contact becomes MQL | `marketingqualifiedlead` | `qualified_lead` | Medium |
| Contact becomes SQL | `salesqualifiedlead` | `sales_qualified_lead` | High |
| Deal closed won | `closedwon` | `closed_won_revenue` | Highest |
| Validation failure | `failed` | `reconciliation_required` | Control path |

## Dedupe property

HubSpot property:

`ve_last_conversion_dedupe_key`

Purpose:

Prevent the same conversion event being counted or sent more than once.

## Budget recommendation rules

| Signal | Recommendation | Priority | Reason |
|---|---|---|---|
| MQL | Monitor | Medium | Useful quality signal, but not enough to scale budget alone |
| SQL | Increase cautiously | High | Sales accepted the lead as commercially relevant |
| Closed-won revenue above £5,000 | Increase budget | High | Revenue signal supports scaling |
| Closed-won revenue below £5,000 | Hold | Medium | Revenue exists, but may not justify scale |
| Missing click ID | Fix tracking | Critical | Attribution capture is incomplete |

## Reporting output

The workflow prepares Slack/reporting-style outputs but does not send live Slack messages.

This is intentional for demo safety.

Output status:

`prepared_not_sent`

## Guardrails

- Do not claim live ad platform API integration unless it has been connected and tested.
- Do not send conversion events without consent/privacy review.
- Do not optimise paid campaigns using MQLs alone.
- Use SQL, opportunity and revenue events as stronger quality signals.
- Dedupe conversion events before sending to any platform.
- Queue failed events for reconciliation instead of silently dropping them.
- Native HubSpot ad conversion features may be sufficient for simple use cases.
- n8n/custom logic is useful when validation, enrichment, routing, reconciliation or multi-system reporting is required.

## Demo talk track

> This workflow shows a closed-loop ad conversion feedback model. Instead of optimising campaigns around cheap form fills, it translates HubSpot lifecycle and revenue outcomes into conversion feedback events, applies dedupe controls, and generates budget recommendations. The current workflow prepares safe mock reporting outputs rather than sending live events to ad platforms.

