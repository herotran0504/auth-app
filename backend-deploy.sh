#!/bin/bash

# Configuration variables
REPO_URL="https://github.com/herotran0504/auth-app.git"
LOCAL_REPO_DIR="./auth-app"

# Step 1: Clone the GitHub repository
echo -e "\n\n=========== Cloning GitHub repository ==========="
if [ ! -d "$LOCAL_REPO_DIR" ]; then
    git clone $REPO_URL $LOCAL_REPO_DIR
else
    echo "Directory $LOCAL_REPO_DIR already exists. Pulling the latest changes."
    cd $LOCAL_REPO_DIR || exit
    git pull
fi

# Step 2: Deploy the backend with Serverless
echo -e "\n\n=========== Deploying Backend with Serverless ==========="
cd backend || { echo "Backend directory not found!"; exit 1; }

# Build the backend application
echo -e "\n\n=========== Building the backend application ==========="
npm install

echo "Current directory: $(pwd)"
# Install Serverless if it's not already installed
if ! [ -x "$(command -v serverless)" ]; then
    echo 'Error: Serverless is not installed. Installing now...'
    npm install -g serverless
fi

# Deploy the backend
sls deploy --config backend.yml --stage dev | grep "Service endpoint:" | awk '{print $3}'

if [ $? -eq 0 ]; then
    echo "Backend deployment succeeded."
else
    echo "Backend deployment failed!"
fi

cd ..
# Clean up the local directory after upload
rm -rf $LOCAL_REPO_DIR
