## Auth App Backend

## Overview
The Auth App Backend provides user authentication and profile management services. It is built using [Node.js](https://nodejs.org/) and [AWS Serverless](https://aws.amazon.com/serverless/).

## Features
- User Signup
- User Login
- Profile Management
- Image Uploads

## Technologies
- Node.js
- AWS Lambda
- AWS DynamoDB
- AWS S3 for file storage
- AWS API Gateway

## Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- AWS CLI
- Serverless Framework

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/herotran0504/auth-app.git
   cd auth-app/backend
   ```
2. Install dependencies:
   ```bash
   npm install -g serverless
   npm install
   ```
3. Deploy with serverless
   ```bash
   npm install
   ```
   See [backend-deploy.sh](../backend-deploy.sh)