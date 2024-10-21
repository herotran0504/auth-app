STACK_NAME=hs-final-s3-stack
REGION=us-east-1
CLI_PROFILE=hs-final-profile

S3_BUCKET_NAME=hs-frontend-final-bucket
GITHUB_REPO_URL=https://github.com/herotran0504/auth-app.git
LOCAL_DIR=./buildfolder
FOLDER_TO_COPY=frontend/build

echo -e "\n\n=========== Deploying main.yml ==========="
aws cloudformation deploy \
  --region $REGION \
  --profile $CLI_PROFILE \
  --stack-name $STACK_NAME \
  --template-file main.yml \
  --no-fail-on-empty-changeset \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides S3BucketName=$S3_BUCKET_NAME

# If the deploy succeeded, clone the repository and upload build folder to the S3 bucket
if [ $? -eq 0 ]; then
  echo -e "\n\n=========== Creating local directory if not exists ==========="
  if [ ! -d "$LOCAL_DIR" ]; then
    mkdir -p $LOCAL_DIR
    echo "Created directory $LOCAL_DIR."
  fi

  echo -e "\n\n=========== Cloning repository ==========="
  git clone $GITHUB_REPO_URL $LOCAL_DIR


  echo -e "\n\n=========== Uploading $FOLDER_TO_COPY to S3 bucket ==========="
  aws s3 cp $LOCAL_DIR/$FOLDER_TO_COPY/ s3://$S3_BUCKET_NAME/ --recursive --profile $CLI_PROFILE

  # Show the CloudFront URL
  aws cloudformation list-exports \
    --profile $CLI_PROFILE \
    --query "Exports[?Name=='CloudFrontURL'].Value"
  
  # Clean up the local directory after upload
  rm -rf $LOCAL_DIR
else
  echo "CloudFormation deployment failed!"
fi
