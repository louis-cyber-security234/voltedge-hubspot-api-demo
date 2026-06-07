#!/usr/bin/env node
/**
 * Day 15 - API Upsert Logic Demo
 *
 * Purpose:
 * - Demonstrate contact/company upsert logic without calling live HubSpot.
 * - Search key for contacts: email.
 * - Search key for companies: domain.
 * - Validate required fields before preparing API operations.
 * - Deduplicate repeated records in the same input batch.
 * - Log clean success/failure evidence for portfolio review.
 *
 * This script is intentionally mock-first. Real HubSpot writes should be handled
 * through n8n credentials or secure server-side environment variables.
 */

const fs = require('fs');
const path = require('path');

const inputPath =
  process.argv[2] || path.join(__dirname, '..', 'data', 'day15-sample-input.json');

const outputPath =
  process.argv[3] || path.join(__dirname, '..', 'logs', 'day15-generated-run-log.json');

function normaliseEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function normaliseDomain(domain) {
  return String(domain || '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0];
}

function validateRecord(record) {
  const errors = [];

  if (!normaliseEmail(record.email)) {
    errors.push('Missing required field: email');
  }

  if (!normaliseDomain(record.company_domain)) {
    errors.push('Missing required field: company_domain');
  }

  if (!String(record.company_name || '').trim()) {
    errors.push('Missing required field: company_name');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

function createCompanyPayload(record) {
  return {
    properties: {
      name: record.company_name,
      domain: normaliseDomain(record.company_domain),
      industry: record.industry || '',
      ve_source_system: record.source_system || 'day15_mock_source'
    }
  };
}

function createContactPayload(record) {
  return {
    properties: {
      email: normaliseEmail(record.email),
      firstname: record.firstname || '',
      lastname: record.lastname || '',
      jobtitle: record.jobtitle || '',
      phone: record.phone || '',
      lifecyclestage: record.lifecyclestage || record.lifecycle_stage || '',
      ve_source_system: record.source_system || 'day15_mock_source'
    }
  };
}

function buildUpsertPlan(records) {
  const seenEmails = new Map();
  const seenDomains = new Map();
  const results = [];

  records.forEach((record, index) => {
    const email = normaliseEmail(record.email);
    const domain = normaliseDomain(record.company_domain);
    const validation = validateRecord(record);

    if (!validation.isValid) {
      results.push({
        index,
        external_record_id: record.external_record_id || null,
        status: 'failed_validation',
        errors: validation.errors,
        contact_key: email || null,
        company_key: domain || null,
        action_plan: []
      });

      return;
    }

    const duplicateEmailInBatch = seenEmails.has(email);
    const duplicateDomainInBatch = seenDomains.has(domain);

    const companyAction = duplicateDomainInBatch
      ? 'update_company'
      : 'create_or_update_company_by_domain';

    const contactAction = duplicateEmailInBatch
      ? 'update_contact'
      : 'create_or_update_contact_by_email';

    seenEmails.set(email, index);
    seenDomains.set(domain, index);

    results.push({
      index,
      external_record_id: record.external_record_id || null,
      status: 'ready_for_upsert',
      errors: [],
      duplicate_flags: {
        duplicate_email_in_batch: duplicateEmailInBatch,
        duplicate_domain_in_batch: duplicateDomainInBatch
      },
      contact_key: email,
      company_key: domain,
      action_plan: [
        {
          step: 1,
          object: 'company',
          lookup_property: 'domain',
          lookup_value: domain,
          action: companyAction,
          payload: createCompanyPayload(record)
        },
        {
          step: 2,
          object: 'contact',
          lookup_property: 'email',
          lookup_value: email,
          action: contactAction,
          payload: createContactPayload(record)
        },
        {
          step: 3,
          object: 'association',
          action: 'associate_contact_to_company_after_ids_are_known',
          note: 'In production, associate the returned contact ID to the returned company ID.'
        }
      ]
    });
  });

  return {
    run_name: 'Day 15 - API Upsert Logic Demo',
    generated_at: new Date().toISOString(),
    input_file: inputPath,
    summary: {
      total_records: records.length,
      ready_for_upsert: results.filter((r) => r.status === 'ready_for_upsert').length,
      failed_validation: results.filter((r) => r.status === 'failed_validation').length,
      duplicate_email_records: results.filter(
        (r) => r.duplicate_flags?.duplicate_email_in_batch
      ).length,
      duplicate_domain_records: results.filter(
        (r) => r.duplicate_flags?.duplicate_domain_in_batch
      ).length
    },
    results
  };
}

function main() {
  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    console.error('Expected file: data/day15-sample-input.json');
    process.exit(1);
  }

  const records = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const output = buildUpsertPlan(records);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log(JSON.stringify(output.summary, null, 2));
  console.log(`\nWrote log: ${outputPath}`);
}

main();
