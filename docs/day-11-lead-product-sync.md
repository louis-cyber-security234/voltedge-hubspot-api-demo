# Day 11 - Lead/Product Data Sync Demo

## Objective

Build the first iPaaS-style sync from mock lead/product source data into HubSpot.

## What was built

- n8n workflow: `VoltEdge Day 11 - Lead Product Sync Demo`
- Mock source record
- HubSpot field mapping
- Required field validation
- Company dedupe using domain-based search/update
- Contact upsert by email
- Contact-to-company association logic
- Error path for missing required fields
- Persistent n8n reconciliation queue
- Separate broken-record test workflow
- Word evidence document: `Day_11_Lead_Product_Data_Sync_Test_Results.docx`

## Key lessons

The first version created duplicate companies because it used create-only logic.

The fix was to search company by domain first, then update existing company records where a match exists.

Contact upsert worked by email.

Broken records with missing email routed to the error queue.

## Evidence to include

- Working source record
- HubSpot company search by domain
- Existing company update
- Contact upsert by email
- Contact-to-company association
- Broken record routed to reconciliation queue

