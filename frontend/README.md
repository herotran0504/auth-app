## Auth App Frontend

## Overview
The Auth App Frontend is a web application that provides a user interface for authentication and profile management. It is built using [React](https://reactjs.org/) and deployed on AWS S3 with CloudFront.

## Features
- User Signup
- User Login
- Profile Display
- Responsive Design

## Technologies
- React
- Redux (for state management)
- Axios (for API calls)
- AWS S3 for static hosting
- AWS CloudFront for content delivery

## Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/herotran0504/auth-app.git
   cd auth-app/frontend
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Running the Application Locally
   ```bash
   npm start
   ```
4. Building for Production
   ```bash
   npm run build
   ```
5. Deploy
   Manual deployment refer to [frontend_manual_deployment.sh](../frontend_manual_deployment.sh)
   Integration deployment refer to [auto-deploy.sh](../auto-deploy.sh)