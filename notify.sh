#!/bin/bash
set -e

# Determine build status
BUILD_STATUS="successful"
if [[ $BITBUCKET_EXIT_CODE -ne 0 ]]; then
  BUILD_STATUS="failed"
fi
echo "Step ${BUILD_STATUS}"

# Gather commit info
Commit_ID=$(git log -n1 --format="%h")
Commit_Message=$(git show -s --format="%s" | tr -d '\n')  
Approver=$(git log -1 --pretty=%B | grep Approved-by | tr -d '\n')  

# Capture arguments for step name and environment
pipelinestep="$1"
environment="$2"

# Prepare the notification message
Message=$(cat <<EOF
Message : ${pipelinestep} pipeline in ${environment} is ${BUILD_STATUS}.
Project : firesafex-web-prod
Environment : ${environment}
Build Number : ${BITBUCKET_BUILD_NUMBER}
Commit ID : ${Commit_ID}
Commit Message : ${Commit_Message}
Approver : ${Approver}
EOF
)

# Output the message to be used in Slack notification
echo "$Message"