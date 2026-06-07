# Day 16 - Test Output Notes

## Expected Summary

Running:

```bash
node scripts/day16-deal-association-logic.js
```

should produce a summary similar to:

```json
{
  "total_records": 6,
  "ready_for_deal_upsert": 4,
  "failed_validation": 2,
  "duplicate_deal_records": 0,
  "duplicate_contact_company_associations": 1,
  "closed_won_revenue_records": 1
}
```

## Test Scenarios

### Clean opportunity

Expected:

- `ready_for_deal_upsert`
- create/update deal action
- contact-company association
- deal-company association
- deal-contact association

### Duplicate contact/company association

Expected:

- duplicate association flag set to `true`
- deal still prepared
- association should be idempotent in production

### Closed-won opportunity

Expected:

- `dealstage = closedwon`
- `commercial_signal = revenue`
- recommended contact lifecycle stage = `customer`

### Missing contact email

Expected:

- `failed_validation`
- error: `Missing required field: contact_email`
- no action plan

### Missing company domain

Expected:

- `failed_validation`
- error: `Missing required field: company_domain`
- no action plan

## Evidence Screenshots To Capture

- Terminal command run
- Summary output
- Generated log file
- Valid deal action plan
- Contact-company association
- Deal-company association
- Deal-contact association
- Failed validation record
- Closed-won stage rule
