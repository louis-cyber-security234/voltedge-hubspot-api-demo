#!/usr/bin/env bash
set -euo pipefail

echo "Running Day 17 API Error Handling and Reconciliation test..."
node scripts/day17-error-reconciliation-logic.js

echo ""
echo "Summary:"
cat logs/day17-generated-run-summary.json

echo ""
echo "Reconciliation queue:"
cat logs/day17-generated-reconciliation-queue.json
