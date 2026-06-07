#!/usr/bin/env node
/**
 * Day 17 - API Error Handling and Reconciliation Demo
 *
 * Purpose:
 * - Demonstrate error taxonomy, try/catch handling, failed record logging,
 *   retry/review queue output and rate-limit handling notes.
 * - This is mock-first and safe for portfolio evidence. It does not call HubSpot.
 * - In production, HubSpot writes should use n8n credentials or secure server-side
 *   environment variables, never committed tokens.
 */

const fs = require('fs');
const path = require('path');

const inputPath =
  process.argv[2] || path.join(__dirname, '..', 'data', 'day17-error-test-input.json');

const errorLogPath =
  process.argv[3] || path.join(__dirname, '..', 'logs', 'day17-generated-error-log.json');

const retryQueuePath =
  process.argv[4] || path.join(__dirname, '..', 'logs', 'day17-generated-reconciliation-queue.json');

const summaryPath =
  process.argv[5] || path.join(__dirname, '..', 'logs', 'day17-generated-run-summary.json');

const ERROR_CATEGORIES = {
  VALIDATION_ERROR: 'validation_error',
  AUTH_ERROR: 'auth_error',
  RATE_LIMIT_ERROR: 'rate_limit_error',
  TRANSIENT_API_ERROR: 'transient_api_error',
  DUPLICATE_CONFLICT: 'duplicate_conflict',
  ASSOCIATION_ERROR: 'association_error',
  UNEXPECTED_EXCEPTION: 'unexpected_exception'
};

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

function normaliseStage(stage) {
  return String(stage || '').trim().toLowerCase();
}

function dealDedupeKey(record) {
  return [
    normaliseDomain(record.company_domain),
    String(record.deal_name || '').trim().toLowerCase(),
    Number(record.amount || 0),
    String(record.currency || '').trim().toUpperCase()
  ].join('|');
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

  if (!String(record.deal_name || '').trim()) {
    errors.push('Missing required field: deal_name');
  }

  if (!Number(record.amount || 0)) {
    errors.push('Missing or invalid required field: amount');
  }

  if (!normaliseStage(record.deal_stage)) {
    errors.push('Missing required field: deal_stage');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

function classifyApiStatus(status) {
  const code = Number(status || 200);

  if (code === 200 || code === 201 || code === 204) {
    return null;
  }

  if (code === 400) {
    return {
      error_category: ERROR_CATEGORIES.VALIDATION_ERROR,
      queue_action: 'review_payload',
      retryable: false,
      message: 'Bad request style error. Review payload, property names and internal values.'
    };
  }

  if (code === 401 || code === 403) {
    return {
      error_category: ERROR_CATEGORIES.AUTH_ERROR,
      queue_action: 'security_review',
      retryable: false,
      message: 'Auth/scope failure. Review private app token, scopes and credential access.'
    };
  }

  if (code === 409) {
    return {
      error_category: ERROR_CATEGORIES.DUPLICATE_CONFLICT,
      queue_action: 'dedupe_review',
      retryable: false,
      message: 'Conflict/duplicate style error. Review dedupe key and existing CRM records.'
    };
  }

  if (code === 429) {
    return {
      error_category: ERROR_CATEGORIES.RATE_LIMIT_ERROR,
      queue_action: 'retry_after_backoff',
      retryable: true,
      message: 'Rate limit response. Wait before retrying and reduce request burst size.'
    };
  }

  if (code >= 500) {
    return {
      error_category: ERROR_CATEGORIES.TRANSIENT_API_ERROR,
      queue_action: 'retry_later',
      retryable: true,
      message: 'Transient server-style error. Retry with backoff and max attempt controls.'
    };
  }

  return {
    error_category: ERROR_CATEGORIES.UNEXPECTED_EXCEPTION,
    queue_action: 'manual_review',
    retryable: false,
    message: `Unexpected API status: ${code}`
  };
}

function createRetryPlan(record, classification, attempt = 1) {
  const retryAfter = Number(record.retry_after_seconds || 0);
  const exponentialBackoffSeconds = Math.min(900, Math.pow(2, attempt) * 30);
  const waitSeconds = retryAfter || exponentialBackoffSeconds;

  return {
    retryable: classification.retryable,
    attempt,
    max_attempts: classification.retryable ? 3 : 0,
    wait_seconds_before_next_attempt: classification.retryable ? waitSeconds : null,
    strategy: classification.retryable
      ? 'retry_with_exponential_backoff_and_max_attempts'
      : 'do_not_retry_until_reviewed'
  };
}

function buildSuccessPlan(record) {
  const email = normaliseEmail(record.email);
  const domain = normaliseDomain(record.company_domain);
  const dealKey = dealDedupeKey(record);
  const stage = normaliseStage(record.deal_stage);

  const lifecycleRecommendation =
    stage === 'closedwon'
      ? 'customer'
      : ['contractsent', 'presentationscheduled', 'qualifiedtobuy'].includes(stage)
        ? 'opportunity'
        : 'lead';

  return {
    status: 'success_prepared',
    error_category: null,
    reconciliation_required: false,
    deal_dedupe_key: dealKey,
    lifecycle_recommendation: lifecycleRecommendation,
    planned_operations: [
      {
        step: 1,
        object: 'contact',
        lookup_property: 'email',
        lookup_value: email,
        action: 'search_or_upsert_contact'
      },
      {
        step: 2,
        object: 'company',
        lookup_property: 'domain',
        lookup_value: domain,
        action: 'search_or_upsert_company'
      },
      {
        step: 3,
        object: 'deal',
        lookup_property: 've_deal_dedupe_key',
        lookup_value: dealKey,
        action: 'search_or_upsert_deal'
      },
      {
        step: 4,
        object: 'association',
        action: 'associate_contact_to_company'
      },
      {
        step: 5,
        object: 'association',
        action: 'associate_deal_to_company'
      },
      {
        step: 6,
        object: 'association',
        action: 'associate_deal_to_contact'
      }
    ]
  };
}

function buildFailureOutput(record, errorCategory, errors, queueAction, retryPlan) {
  return {
    status: 'failed_or_queued',
    error_category: errorCategory,
    reconciliation_required: true,
    queue_action: queueAction,
    retry_plan: retryPlan,
    errors,
    raw_record: record
  };
}

function processRecord(record, index, seenDealKeys) {
  try {
    if (record.force_unexpected_exception) {
      throw new Error('Forced unexpected exception for testing');
    }

    const validation = validateRecord(record);

    if (!validation.isValid) {
      return {
        index,
        external_record_id: record.external_record_id || null,
        ...buildFailureOutput(
          record,
          ERROR_CATEGORIES.VALIDATION_ERROR,
          validation.errors,
          'manual_review',
          { retryable: false, attempt: 0, max_attempts: 0, strategy: 'fix_record_then_retry' }
        )
      };
    }

    const key = dealDedupeKey(record);
    const duplicateInBatch = seenDealKeys.has(key);
    seenDealKeys.add(key);

    if (duplicateInBatch) {
      return {
        index,
        external_record_id: record.external_record_id || null,
        duplicate_deal_in_batch: true,
        ...buildFailureOutput(
          record,
          ERROR_CATEGORIES.DUPLICATE_CONFLICT,
          ['Duplicate deal dedupe key detected inside input batch'],
          'dedupe_review',
          { retryable: false, attempt: 0, max_attempts: 0, strategy: 'review_duplicate_before_retry' }
        )
      };
    }

    const classification = classifyApiStatus(record.simulate_api_status);

    if (classification) {
      return {
        index,
        external_record_id: record.external_record_id || null,
        simulated_status: Number(record.simulate_api_status),
        ...buildFailureOutput(
          record,
          classification.error_category,
          [classification.message],
          classification.queue_action,
          createRetryPlan(record, classification, 1)
        )
      };
    }

    if (record.simulate_association_error === true) {
      return {
        index,
        external_record_id: record.external_record_id || null,
        ...buildFailureOutput(
          record,
          ERROR_CATEGORIES.ASSOCIATION_ERROR,
          ['Association failed because one or more required object IDs were not available'],
          'association_review',
          { retryable: false, attempt: 0, max_attempts: 0, strategy: 'resolve_object_ids_then_retry_association' }
        )
      };
    }

    return {
      index,
      external_record_id: record.external_record_id || null,
      ...buildSuccessPlan(record)
    };
  } catch (error) {
    return {
      index,
      external_record_id: record.external_record_id || null,
      ...buildFailureOutput(
        record,
        ERROR_CATEGORIES.UNEXPECTED_EXCEPTION,
        [error.message],
        'developer_review',
        { retryable: false, attempt: 0, max_attempts: 0, strategy: 'inspect_stack_trace_and_patch_code' }
      )
    };
  }
}

function buildRunOutput(records) {
  const seenDealKeys = new Set();
  const results = records.map((record, index) => processRecord(record, index, seenDealKeys));

  const failures = results.filter((result) => result.reconciliation_required);
  const success = results.filter((result) => result.status === 'success_prepared');
  const retryQueue = failures.map((result) => ({
    external_record_id: result.external_record_id,
    error_category: result.error_category,
    queue_action: result.queue_action,
    retry_plan: result.retry_plan,
    errors: result.errors,
    raw_record: result.raw_record
  }));

  const summary = {
    total_records: records.length,
    success_prepared: success.length,
    failed_or_queued: failures.length,
    retryable_records: failures.filter((r) => r.retry_plan?.retryable).length,
    manual_review_records: failures.filter((r) => !r.retry_plan?.retryable).length,
    validation_errors: failures.filter((r) => r.error_category === ERROR_CATEGORIES.VALIDATION_ERROR).length,
    auth_errors: failures.filter((r) => r.error_category === ERROR_CATEGORIES.AUTH_ERROR).length,
    rate_limit_errors: failures.filter((r) => r.error_category === ERROR_CATEGORIES.RATE_LIMIT_ERROR).length,
    transient_api_errors: failures.filter((r) => r.error_category === ERROR_CATEGORIES.TRANSIENT_API_ERROR).length,
    duplicate_conflicts: failures.filter((r) => r.error_category === ERROR_CATEGORIES.DUPLICATE_CONFLICT).length,
    association_errors: failures.filter((r) => r.error_category === ERROR_CATEGORIES.ASSOCIATION_ERROR).length
  };

  return {
    run_name: 'Day 17 - API Error Handling and Reconciliation Demo',
    generated_at: new Date().toISOString(),
    input_file: inputPath,
    error_taxonomy: ERROR_CATEGORIES,
    summary,
    results,
    retry_queue: retryQueue
  };
}

function main() {
  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    console.error('Expected file: data/day17-error-test-input.json');
    process.exit(1);
  }

  const records = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const output = buildRunOutput(records);

  fs.mkdirSync(path.dirname(errorLogPath), { recursive: true });
  fs.mkdirSync(path.dirname(retryQueuePath), { recursive: true });
  fs.mkdirSync(path.dirname(summaryPath), { recursive: true });

  fs.writeFileSync(errorLogPath, JSON.stringify(output, null, 2));
  fs.writeFileSync(retryQueuePath, JSON.stringify(output.retry_queue, null, 2));
  fs.writeFileSync(summaryPath, JSON.stringify(output.summary, null, 2));

  console.log(JSON.stringify(output.summary, null, 2));
  console.log(`\nWrote error log: ${errorLogPath}`);
  console.log(`Wrote reconciliation queue: ${retryQueuePath}`);
  console.log(`Wrote summary: ${summaryPath}`);
}

main();
