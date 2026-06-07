#!/usr/bin/env node
/**
 * Day 16 - API Deal and Association Logic Demo
 *
 * Purpose:
 * - Demonstrate deal create/update logic without calling live HubSpot.
 * - Search/dedupe key for contacts: email.
 * - Search/dedupe key for companies: domain.
 * - Dedupe key for deals: external_opportunity_id if present, otherwise domain + deal_name.
 * - Prepare association operations for:
 *   1. contact to company
 *   2. deal to company
 *   3. deal to contact
 * - Apply simple lifecycle/deal-stage rules.
 * - Log clean success/failure evidence for portfolio review.
 *
 * This script is mock-first. Real HubSpot writes should be handled through
 * n8n credentials or secure server-side environment variables.
 */

const fs = require('fs');
const path = require('path');

const inputPath =
  process.argv[2] || path.join(__dirname, '..', 'data', 'day16-opportunity-input.json');

const outputPath =
  process.argv[3] || path.join(__dirname, '..', 'logs', 'day16-generated-association-log.json');

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

function normaliseDealName(name) {
  return String(name || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function mapStage(record) {
  const sourceStage = String(record.source_stage || '').trim().toLowerCase();
  const providedDealStage = String(record.dealstage || '').trim().toLowerCase();

  const stageMap = {
    new_opportunity: 'appointmentscheduled',
    qualified_opportunity: 'appointmentscheduled',
    discovery_booked: 'appointmentscheduled',
    demo_booked: 'qualifiedtobuy',
    proposal_sent: 'presentationscheduled',
    negotiation: 'decisionmakerboughtin',
    closed_won: 'closedwon',
    closed_lost: 'closedlost'
  };

  const dealstage = providedDealStage || stageMap[sourceStage] || 'appointmentscheduled';

  let recommendedLifecycleStage = 'opportunity';
  if (dealstage === 'closedwon') {
    recommendedLifecycleStage = 'customer';
  }

  let commercialSignal = 'pipeline';
  if (dealstage === 'closedwon') {
    commercialSignal = 'revenue';
  }
  if (dealstage === 'closedlost') {
    commercialSignal = 'lost_deal';
  }

  return {
    source_stage: sourceStage || null,
    dealstage,
    recommended_contact_lifecycle_stage: recommendedLifecycleStage,
    commercial_signal: commercialSignal
  };
}

function validateOpportunity(record) {
  const errors = [];

  if (!String(record.deal_name || '').trim()) {
    errors.push('Missing required field: deal_name');
  }

  if (toNumber(record.amount) === null) {
    errors.push('Missing or invalid required field: amount');
  }

  if (!normaliseEmail(record.contact_email)) {
    errors.push('Missing required field: contact_email');
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

function buildDealDedupeKey(record) {
  const externalId = String(record.external_opportunity_id || '').trim().toLowerCase();
  if (externalId) {
    return `external_id:${externalId}`;
  }

  const domain = normaliseDomain(record.company_domain);
  const dealName = normaliseDealName(record.deal_name);
  return `fallback:${domain}|${dealName}`;
}

function createDealPayload(record, stageRules) {
  return {
    properties: {
      dealname: String(record.deal_name || '').trim(),
      amount: toNumber(record.amount),
      dealstage: stageRules.dealstage,
      pipeline: record.pipeline || 'default',
      closedate: record.close_date || '',
      deal_currency_code: record.currency || 'GBP',
      ve_external_opportunity_id: record.external_opportunity_id || '',
      ve_source_system: record.source_system || 'day16_mock_source',
      ve_deal_dedupe_key: buildDealDedupeKey(record)
    }
  };
}

function buildContactCompanyAssociation(record) {
  return {
    object: 'association',
    association_type: 'contact_to_company',
    from_object: 'contact',
    from_lookup_property: 'email',
    from_lookup_value: normaliseEmail(record.contact_email),
    to_object: 'company',
    to_lookup_property: 'domain',
    to_lookup_value: normaliseDomain(record.company_domain),
    action: 'associate_contact_to_company_after_ids_are_known'
  };
}

function buildDealAssociations(record) {
  return [
    {
      object: 'association',
      association_type: 'deal_to_company',
      from_object: 'deal',
      from_lookup_property: 've_deal_dedupe_key',
      from_lookup_value: buildDealDedupeKey(record),
      to_object: 'company',
      to_lookup_property: 'domain',
      to_lookup_value: normaliseDomain(record.company_domain),
      action: 'associate_deal_to_company_after_ids_are_known'
    },
    {
      object: 'association',
      association_type: 'deal_to_contact',
      from_object: 'deal',
      from_lookup_property: 've_deal_dedupe_key',
      from_lookup_value: buildDealDedupeKey(record),
      to_object: 'contact',
      to_lookup_property: 'email',
      to_lookup_value: normaliseEmail(record.contact_email),
      action: 'associate_deal_to_contact_after_ids_are_known'
    }
  ];
}

function buildOpportunityPlan(records) {
  const seenDealKeys = new Map();
  const seenContactCompanyPairs = new Set();
  const results = [];

  records.forEach((record, index) => {
    const validation = validateOpportunity(record);
    const email = normaliseEmail(record.contact_email);
    const domain = normaliseDomain(record.company_domain);
    const dealKey = buildDealDedupeKey(record);
    const contactCompanyKey = `${email}|${domain}`;
    const stageRules = mapStage(record);

    if (!validation.isValid) {
      results.push({
        index,
        external_opportunity_id: record.external_opportunity_id || null,
        status: 'failed_validation',
        errors: validation.errors,
        deal_key: dealKey,
        contact_key: email || null,
        company_key: domain || null,
        stage_rules: stageRules,
        action_plan: []
      });
      return;
    }

    const duplicateDealInBatch = seenDealKeys.has(dealKey);
    const duplicateContactCompanyAssociationInBatch = seenContactCompanyPairs.has(contactCompanyKey);

    seenDealKeys.set(dealKey, index);
    seenContactCompanyPairs.add(contactCompanyKey);

    const dealAction = duplicateDealInBatch ? 'update_deal' : 'create_or_update_deal_by_dedupe_key';

    results.push({
      index,
      external_opportunity_id: record.external_opportunity_id || null,
      status: 'ready_for_deal_upsert',
      errors: [],
      duplicate_flags: {
        duplicate_deal_in_batch: duplicateDealInBatch,
        duplicate_contact_company_association_in_batch: duplicateContactCompanyAssociationInBatch
      },
      deal_key: dealKey,
      contact_key: email,
      company_key: domain,
      stage_rules: stageRules,
      action_plan: [
        {
          step: 1,
          object: 'deal',
          lookup_property: 've_deal_dedupe_key',
          lookup_value: dealKey,
          action: dealAction,
          payload: createDealPayload(record, stageRules)
        },
        {
          step: 2,
          ...buildContactCompanyAssociation(record)
        },
        {
          step: 3,
          ...buildDealAssociations(record)[0]
        },
        {
          step: 4,
          ...buildDealAssociations(record)[1]
        },
        {
          step: 5,
          object: 'contact',
          lookup_property: 'email',
          lookup_value: email,
          action: 'apply_lifecycle_stage_rule_if_allowed',
          payload: {
            properties: {
              lifecyclestage: stageRules.recommended_contact_lifecycle_stage
            }
          },
          guardrail: 'Only move lifecycle stage forward. Do not downgrade customer/opportunity stages without business approval.'
        }
      ]
    });
  });

  return {
    run_name: 'Day 16 - API Deal and Association Logic Demo',
    generated_at: new Date().toISOString(),
    input_file: inputPath,
    summary: {
      total_records: records.length,
      ready_for_deal_upsert: results.filter((r) => r.status === 'ready_for_deal_upsert').length,
      failed_validation: results.filter((r) => r.status === 'failed_validation').length,
      duplicate_deal_records: results.filter(
        (r) => r.duplicate_flags?.duplicate_deal_in_batch
      ).length,
      duplicate_contact_company_associations: results.filter(
        (r) => r.duplicate_flags?.duplicate_contact_company_association_in_batch
      ).length,
      closed_won_revenue_records: results.filter(
        (r) => r.stage_rules?.commercial_signal === 'revenue'
      ).length
    },
    results
  };
}

function main() {
  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    console.error('Expected file: data/day16-opportunity-input.json');
    process.exit(1);
  }

  const records = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const output = buildOpportunityPlan(records);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log(JSON.stringify(output.summary, null, 2));
  console.log(`\nWrote log: ${outputPath}`);
}

main();
