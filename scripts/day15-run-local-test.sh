#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

node "$REPO_ROOT/scripts/day15-upsert-logic.js" \
  "$REPO_ROOT/data/day15-sample-input.json" \
  "$REPO_ROOT/logs/day15-generated-run-log.json"
