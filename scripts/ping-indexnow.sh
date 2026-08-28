#!/bin/sh
# Ping IndexNow with every <loc> in sitemap.xml after the site deploys.
# Usage (from repo root): sh scripts/ping-indexnow.sh
# Requires: curl and python3. No build step.
#
# IndexNow key file: /38f226c4663843c977b2a99d591412c5.txt
# keyLocation: https://vacationmath.co/38f226c4663843c977b2a99d591412c5.txt

set -eu
KEY="38f226c4663843c977b2a99d591412c5"
HOST="vacationmath.co"
KEY_LOCATION="https://${HOST}/${KEY}.txt"
SITEMAP="${1:-sitemap.xml}"

if [ ! -f "$SITEMAP" ]; then
  echo "sitemap not found: $SITEMAP" >&2
  exit 1
fi

PAYLOAD=$(python3 - "$SITEMAP" "$HOST" "$KEY" "$KEY_LOCATION" <<'PY'
import json, re, sys
sitemap, host, key, key_location = sys.argv[1:5]
text = open(sitemap, encoding="utf-8").read()
urls = re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", text)
print(json.dumps({
    "host": host,
    "key": key,
    "keyLocation": key_location,
    "urlList": urls,
}))
PY
)

COUNT=$(printf '%s' "$PAYLOAD" | python3 -c 'import json,sys; print(len(json.load(sys.stdin)["urlList"]))')
echo "Posting ${COUNT} URLs to IndexNow..."
curl -sS -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  --data "$PAYLOAD"
echo
