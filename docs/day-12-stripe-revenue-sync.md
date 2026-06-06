# Day 12 - Stripe Revenue Sync Demo

## Objective

Mock a Stripe subscription/revenue sync into HubSpot company revenue properties.

## What was built

- n8n workflow: `VoltEdge Day 12 - Stripe Revenue Sync Demo`
- Mock Stripe subscription event
- Stripe revenue field mapping
- Revenue ID validation
- Company search by domain
- HubSpot company revenue field update
- Revenue sync evidence node
- Failed/revenue alert test workflow
- Revenue validation and internal value fixes
- Word evidence document: `Day_12_Stripe_Revenue_Sync_Final_Task.docx`

## Key lessons

HubSpot rejected several dropdown/date values because display labels were used instead of internal option values.

Fixed values:

- Plan tier: `enterprise`
- Revenue source: `stripe`
- Revenue sync status: `synced`
- Renewal date: Unix millisecond timestamp

A company domain search failed once because the value became `=meridianrail.co.uk` instead of `meridianrail.co.uk`.

The failed payment condition failed because boolean `false` was compared as a string.

The fix was converting boolean to string in the condition.

## Evidence to include

- Mock Stripe event
- Revenue ID validation
- HubSpot company search by domain
- Revenue fields updated in HubSpot
- Revenue sync evidence output
- Failed payment/no failed payment branch

