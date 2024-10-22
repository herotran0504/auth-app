#!/bin/bash

# Configuration variables
STACK_NAME="auth-service-fe-dev"  # Name of the CloudFormation stack
AWS_REGION="us-east-1"                            # AWS region for the deployment
AWS_CLI_PROFILE="user1"                           # AWS CLI profile to use for commands

S3_BUCKET_NAME="hs-auth-app-frontend"             # S3 bucket name for the frontend assets
GITHUB_REPOSITORY_URL="https://github.com/herotran0504/auth-app.git"  # URL of the GitHub repository
LOCAL_BUILD_DIRECTORY="./app"            # Local directory for storing cloned project files
BUILD_FOLDER_PATH="frontend/build"                 # Path to the build output folder within the cloned repo

# Deploy the CloudFormation stack
echo -e "\n\n=========== Deploying FrontEnd Template ==========="
aws cloudformation deploy \
  --region $AWS_REGION \
  --profile $AWS_CLI_PROFILE \
  --stack-name $STACK_NAME \
  --template-file frontend/frontend_manual.yml \
  --no-fail-on-empty-changeset \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides S3BucketName=$S3_BUCKET_NAME

# Check if the deployment was successful
if [ $? -eq 0 ]; then
  # Create local directory for cloning if it does not exist
  echo -e "\n\n=========== Creating Local Directory if Not Exists ==========="
  if [ ! -d "$LOCAL_BUILD_DIRECTORY" ]; then
    mkdir -p "$LOCAL_BUILD_DIRECTORY"  # Create the directory
    echo "Created directory: $LOCAL_BUILD_DIRECTORY."
  fi

  # Clone the GitHub repository into the local directory
  echo -e "\n\n=========== Cloning GitHub Repository ==========="
  git clone "$GITHUB_REPOSITORY_URL" "$LOCAL_BUILD_DIRECTORY"

  # Upload the build output folder to the specified S3 bucket
  echo -e "\n\n=========== Uploading Build Output to S3 Bucket ==========="
  aws s3 cp "$BUILD_FOLDER_PATH/" "s3://$S3_BUCKET_NAME/" --recursive --profile $AWS_CLI_PROFILE

  # Retrieve and display the CloudFront distribution URL
  aws cloudformation list-exports \
    --profile $AWS_CLI_PROFILE \
    --query "Exports[?Name=='CloudFrontURL'].Value"

  # Clean up the local directory after the upload
  rm -rf "$LOCAL_BUILD_DIRECTORY"
else
  echo "CloudFormation deployment failed!"  # Error message if deployment fails
fi
