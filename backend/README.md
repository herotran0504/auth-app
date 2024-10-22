## Auth App Backend

## Overview
The Auth App Backend provides user authentication and profile management services. It is built using [Node.js](https://nodejs.org/) and [AWS Serverless](https://aws.amazon.com/serverless/).

## Features
- User Signup
- User Login
- Profile Management
- Image Uploads

## Technologies
- Node.js: JavaScript runtime environment.
- Express: Web framework for building the API.
- bcrypt: Secure password hashing and verification.
- jsonwebtoken (JWT): Handles user authentication using JSON Web Tokens (JWT).
- AWS Lambda: Serverless computing for executing backend functions.
- DynamoDB: NoSQL database for storing user data.
- S3: AWS service for storing user-uploaded files (e.g., profile images).
- API Gateway: Manages API endpoints.
- Serverless Framework: Used to deploy AWS Lambda functions for serverless architecture.

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