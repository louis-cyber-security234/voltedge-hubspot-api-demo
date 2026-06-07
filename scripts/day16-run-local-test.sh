#!/usr/bin/env bash
set -euo pipefail

echo "Running Day 16 deal and association logic demo..."
node scripts/day16-deal-association-logic.js
echo ""
echo "Generated log preview:"
cat logs/day16-generated-association-log.json
