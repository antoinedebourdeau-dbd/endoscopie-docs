#!/bin/bash
# Déploie Doc'HGE sur Cloudflare Pages (projet « dochge »).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export CLOUDFLARE_API_TOKEN="$(cat ~/.config/dochge/cf-token)"
export CLOUDFLARE_ACCOUNT_ID="f076971b6b0d58241b8d6a9b706eaf3c"
STAGE="$ROOT/dist/pages"
rm -rf "$STAGE" && mkdir -p "$STAGE"
cp -R "$ROOT/index.html" "$ROOT/css" "$ROOT/js" "$ROOT/img" "$ROOT/vendor" "$ROOT/chu-logo.webp" "$ROOT/favicon.png" "$STAGE/"
cd "$ROOT" && npx --yes wrangler@3 pages deploy "$STAGE" --project-name dochge --branch main --commit-dirty=true
