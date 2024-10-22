STACK_NAME=auth-service-fe-dev
REGION=us-east-1
CLI_PROFILE=user1

S3_BUCKET_NAME=hs-auth-app-frontend
GITHUB_REPO_NAME=auth-app
GITHUB_BRANCH_NAME=main
GITHUB_OWNER=herotran0504
GITHUB_OAUTH_TOKEN=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

echo -e "\n\n=========== Deploying FrontEnd =========="
aws cloudformation deploy \
  --region $REGION \
  --profile $CLI_PROFILE \
  --stack-name $STACK_NAME \
  --template-file frontend/frontend.yml \
  --no-fail-on-empty-changeset \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides S3BucketName=$S3_BUCKET_NAME GitHubRepoName=$GITHUB_REPO_NAME GitHubBranchName=$GITHUB_BRANCH_NAME GitHubOwner=$GITHUB_OWNER GitHubOAuthToken=$GITHUB_OAUTH_TOKEN

if [ $? -eq 0 ]; then
  aws cloudformation list-exports \
    --profile $CLI_PROFILE \
    --query "Exports[?Name=='CloudFrontURL'].Value"
  
else
  echo "CloudFormation deployment failed!"
fi