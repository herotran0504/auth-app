# Step 0
# install serverless for
# install npm

# Step 1
# Clone source code both BE and FE

## Step 2
# build with npm
# deploy be code and get api url

# Step 3
# attach url from backend to .env
# build with npm
# sync all step to S3
# get cloudfront url

GITHUB_REPO_URL=https://github.com/herotran0504/auth-app.git
#****************************************************************#
STACK_NAME=auth-service-fe
REGION=us-east-1
CLI_PROFILE=user1
S3_BUCKET_NAME=hs-frontend-final-bucket
#****************************************************************#

LOCAL_DIR=./auth-app
#API_URL=http://localhost:5050/dev
API_URL=https://9g0a72d0q9.execute-api.us-east-1.amazonaws.com/dev

#echo -e "\n\n=========== Deploying frontend ==========="
#aws cloudformation deploy \
#  --region $REGION \
#  --profile $CLI_PROFILE \
#  --stack-name $STACK_NAME \
#  --template-file frontend/frontend.yml \
#  --no-fail-on-empty-changeset \
#  --capabilities CAPABILITY_NAMED_IAM \
#  --parameter-overrides S3BucketName=$S3_BUCKET_NAME \
#  --debug

# If the deploy succeeded, clone the repository and upload build folder to the S3 bucket
if [ $? -eq 0 ]; then
  echo -e "\n\n=========== Creating local directory if not exists ==========="
  if [ ! -d "$LOCAL_DIR" ]; then
    mkdir -p $LOCAL_DIR
    echo "Created directory $LOCAL_DIR."
  fi

echo -e "\n\n=========== Cloning repository ==========="
git clone $GITHUB_REPO_URL $LOCAL_DIR

# Navigate to the frontend directory
cd $LOCAL_DIR/frontend || exit

# Create or update the .env file with the REACT_APP_API_URL variable
echo "REACT_APP_API_URL=$API_URL" > .env

# Install dependencies and build the frontend project
echo -e "\n\n=========== Installing dependencies and building the frontend project ==========="
npm install
npm run build

# Return to the previous directory
cd - || exit

echo -e "\n\n=========== Uploading build output to S3 bucket ==========="
# Adjust the path to the build output folder as needed (e.g., `build` or `dist`)
aws s3 cp $LOCAL_DIR/frontend/build/ s3://$S3_BUCKET_NAME/ --recursive --profile $CLI_PROFILE

  # Show the CloudFront URL
  aws cloudformation list-exports \
    --profile $CLI_PROFILE \
    --query "Exports[?Name=='CloudFrontURL'].Value"
  
  # Clean up the local directory after upload
  rm -rf $LOCAL_DIR
else
  echo "CloudFormation deployment failed!"
fi
