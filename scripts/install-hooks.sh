#!/bin/sh
# Point this clone at .githooks (run once after clone).
set -e
root="$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)"
cd "$root"
git config core.hooksPath .githooks
chmod +x .githooks/pre-push
echo "hooksPath set to .githooks"
