# Day 15 - Test Output Notes

## Test records

The sample input includes clean, duplicate and broken records.

| Record | Scenario | Expected result |
|---|---|---|
| VE-1001 | Clean Meridian Rail contact/company | Ready for upsert |
| VE-1002 | Clean VoltEdge contact/company | Ready for upsert |
| VE-1003 | Duplicate Sarah Jones email/domain | Ready for update path with duplicate flags |
| VE-1004 | Missing email | Failed validation |
| VE-1005 | Missing company domain | Failed validation |

## Expected summary

```json
{
  "total_records": 5,
  "ready_for_upsert": 3,
  "failed_validation": 2,
  "duplicate_email_records": 1,
  "duplicate_domain_records": 1
}
```

## Evidence generated

The generated log should show:

- `ready_for_upsert` for clean records.
- `failed_validation` for broken records.
- `duplicate_email_in_batch` true for the duplicate email record.
- `duplicate_domain_in_batch` true for the duplicate domain record.
- Prepared company/contact action plans.
- A future association step.

## Screenshot checklist

- Terminal output summary.
- JSON run log summary.
- Failed validation errors.
- Duplicate flags.
- Prepared contact/company payloads.
