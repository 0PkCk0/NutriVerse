# Nutriverse

Nutriverse is a web application designed to provide users with personalized nutrition plans and health insights. This guide will walk you through the steps to deploy Nutriverse.

## Prerequisites

Before deploying Nutriverse, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download/)
- [npm](https://www.npmjs.com/get-npm)
- [MongoDB](https://docs.mongodb.com/manual/installation/)

## Deployment Instructions

### Step 1: Clone the Repository

Clone the Nutriverse repository to your local machine:

```bash
git clone https://github.com/0PkCk0/NutriVerse.git
cd NutriVerse
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure .env variables

DB_CONNECT 
TOKEN_SECRET 
EMAIL_HOST 
EMAIL_PORT 
EMAIL_USERNAME 
EMAIL_PASSWORD 
PAYPAL_CLIENT_ID 
PAYPAL_CLIENT_SECRET 
PORT

Modify those variables according to your environment

### Step 4: Run in local host

```bash
npm start
```
The Port is  https://localhost:3000
