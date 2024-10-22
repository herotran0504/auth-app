# Constants for deployment configuration
STACK_NAME=auth-service-fe-dev
AWS_REGION=us-east-1
AWS_PROFILE=user1

# S3 bucket and GitHub configuration
FRONTEND_S3_BUCKET_NAME=hs-auth-app-frontend
GITHUB_REPOSITORY_NAME=auth-app
GITHUB_BRANCH_NAME=main
GITHUB_ACCOUNT_OWNER=herotran0504
GITHUB_ACCESS_TOKEN=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

# Deploy the CloudFormation stack using the specified template and parameters
echo -e "\n\n=========== Starting Frontend Deployment =========="
aws cloudformation deploy \
  --region $AWS_REGION \
  --profile $AWS_PROFILE \
  --stack-name $STACK_NAME \
  --template-file frontend/frontend.yml \
  --no-fail-on-empty-changeset \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides FrontendS3BucketName=$FRONTEND_S3_BUCKET_NAME \
    GitHubRepoName=$GITHUB_REPOSITORY_NAME \
    GitHubBranchName=$GITHUB_BRANCH_NAME \
    GitHubOwner=$GITHUB_ACCOUNT_OWNER \
    GitHubOAuthToken=$GITHUB_ACCESS_TOKEN \
  --debug

# Check if the deployment was successful
if [ $? -eq 0 ]; then
  echo -e "\n\n=========== Deployment Successful! Retrieving CloudFront URL =========="
  # Retrieve and display the CloudFront URL from the CloudFormation stack outputs
  aws cloudformation list-exports \
    --profile $AWS_PROFILE \
    --query "Exports[?Name=='CloudFrontURL'].Value"
else
  echo "Error: CloudFormation deployment failed!"
fi
