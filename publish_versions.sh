#!/bin/bash

set -euo pipefail

PROJECT_NAME="$BITBUCKET_REPO_SLUG"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

rm -f latest.json

for pkg in $(jq -r '.dependencies | keys[]' package.json)
do
  VERSION=$(jq -r \
    --arg pkg "$pkg" \
    '.packages["node_modules/" + $pkg].version' \
    package-lock.json)

  jq -nc \
    --arg project "$PROJECT_NAME" \
    --arg package "$pkg" \
    --arg version "$VERSION" \
    --arg timestamp "$TIMESTAMP" \
    '{
      project_name:$project,
      package_name:$package,
      package_version:$version,
      timestamp:$timestamp
    }' >> latest.json
done

echo "Generated latest.json"

aws s3 cp \
  latest.json \
  s3://${APP_VERSION_S3_BUCKET}/${PROJECT_NAME}/latest.json

echo "Upload completed"