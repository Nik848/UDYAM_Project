# Udyam Registration Backend

This is the backend implementation for the Udyam Registration assignment (Task 3). It provides a RESTful API to handle step 1 registration, OTP verification, and step 2 registration, integrated seamlessly with a PostgreSQL database via Prisma ORM.

## Tech Stack
- **Node.js** with **Express**
- **TypeScript**
- **PostgreSQL**
- **Prisma ORM**
- **Zod** (Validation)
- **Helmet, CORS, Morgan** (Security & Logging)

## Folder Structure (Clean Architecture)

```
backend/
├── prisma/               # Prisma schema and migrations
├── src/
│   ├── config/           # Environment configuration
│   ├── controllers/      # Route handlers
│   ├── middleware/       # Express middlewares (error handler, validation)
│   ├── parsers/          # Scraper validation JSON parsing
│   ├── repositories/     # Database logic using Prisma
│   ├── routes/           # API routes definition
│   ├── schemas/          # Zod validation schemas
│   ├── services/         # Business logic layer
│   ├── types/            # TypeScript interfaces
│   ├── utils/            # Utility classes (ApiResponse, ApiError)
│   ├── app.ts            # Express application setup
│   └── server.ts         # Entry point
└── docker-compose.yml    # PostgreSQL container setup
```

## Prerequisites

- Node.js (v18+)
- Docker (optional, for running PostgreSQL)
- NPM

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup Environment Variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Update the `DATABASE_URL` in `.env` if you are using an external database. If you use the provided docker setup, the default values will work.

## Running the Database

If you don't have a local PostgreSQL instance running, you can use Docker:
```bash
docker-compose up -d
```

## Database Migrations

Generate the Prisma client and push the schema to the database:
```bash
npx prisma generate
npx prisma db push
```
*Note: For production, use `npx prisma migrate dev` instead.*

## Running the Server

Start the server in development mode:
```bash
npm run dev
```

The server will be running on `http://localhost:5000`.

## API Documentation

### 1. Health Check
- **GET** `/health`
- **Response**:
  ```json
  {
    "status": "ok"
  }
  ```

### 2. Register Step 1
- **POST** `/api/register/step1`
- **Payload**:
  ```json
  {
    "aadhaarNumber": "123456789012",
    "entrepreneurName": "John Doe"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Step 1 completed successfully",
    "data": {
      "registrationId": "uuid-string"
    }
  }
  ```

### 3. Verify OTP
- **POST** `/api/register/verify-otp`
- **Payload**:
  ```json
  {
    "registrationId": "uuid-string",
    "otp": "123456"
  }
  ```
  *(Note: The current mock implementation only accepts `123456`)*
- **Response**:
  ```json
  {
    "success": true,
    "message": "OTP verified successfully"
  }
  ```

### 4. Register Step 2
- **POST** `/api/register/step2`
- **Payload**:
  ```json
  {
    "registrationId": "uuid-string",
    "panNumber": "ABCDE1234F",
    "panType": "Company"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Step 2 completed successfully",
    "data": {
      "registration": {
        "id": "uuid-string",
        "aadhaarNumber": "...",
        "entrepreneurName": "...",
        "otpVerified": true,
        "panNumber": "ABCDE1234F",
        "panType": "Company",
        "createdAt": "...",
        "updatedAt": "..."
      }
    }
  }
  ```

### 5. Get Registration
- **GET** `/api/register/:id`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Registration retrieved",
    "data": { ... }
  }
  ```
