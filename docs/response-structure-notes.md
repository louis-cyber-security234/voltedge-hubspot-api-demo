# HubSpot API Response Structure Notes

## Objective

Document the structure of the HubSpot API read response so the next workflow step can safely map CRM data into validation, dedupe and update logic.

## Contact Search Response Shape

Expected top-level fields:

```json
{
  "total": 1,
  "results": [
    {
      "id": "123456",
      "properties": {
        "email": "sample@example.com",
        "firstname": "Sample",
        "lastname": "Contact",
        "lifecyclestage": "marketingqualifiedlead",
        "createdate": "2026-01-01T10:00:00.000Z",
        "lastmodifieddate": "2026-01-02T10:00:00.000Z"
      },
      "createdAt": "2026-01-01T10:00:00.000Z",
      "updatedAt": "2026-01-02T10:00:00.000Z",
      "archived": false
    }
  ]
}
```

## Company Search Response Shape

Expected top-level fields:

```json
{
  "total": 1,
  "results": [
    {
      "id": "78910",
      "properties": {
        "name": "Sample Company",
        "domain": "example.com",
        "industry": "Technology",
        "lifecyclestage": "opportunity",
        "createdate": "2026-01-01T10:00:00.000Z",
        "hs_lastmodifieddate": "2026-01-02T10:00:00.000Z"
      },
      "createdAt": "2026-01-01T10:00:00.000Z",
      "updatedAt": "2026-01-02T10:00:00.000Z",
      "archived": false
    }
  ]
}
```

## Mapping Notes

- `results[0].id` becomes the HubSpot object ID used for future update operations.
- `properties.email` is the contact dedupe/read key.
- `properties.domain` is the company dedupe/read key.
- `properties.lifecyclestage` should use internal values, not display labels.
- `total = 0` should route to create/new-record logic or a reconciliation queue depending on workflow objective.
- More than one result should be treated carefully and may require review or a stricter search key.

## Error Handling Notes

- Empty result is not an API failure.
- Missing property values should be handled by validation logic.
- Unexpected response shape should be logged before downstream mapping.
- Production workflows should store failed reads in a reconciliation queue.

## Evidence Notes

For portfolio screenshots, redact:

- Real emails
- Company names if not demo data
- Object IDs if sensitive
- Any headers or tokens
