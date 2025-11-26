# Job Nest Backend

Node.js + Express + MongoDB backend for the Job Nest application.

## Prerequisites

- Node.js (v14 or later)
- MongoDB Community Server (running locally on default port 27017)
- npm (comes with Node.js)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - The `.env` file is already configured with default values
   - Update any values if needed (e.g., change JWT_SECRET in production)

3. Start the server:
   ```bash
   npm start
   ```

4. Initialize the database (in a new terminal):
   ```bash
   curl -X POST http://localhost:5000/api/setupDb
   ```
   Or use Postman to send a POST request to `http://localhost:5000/api/setupDb`

## Environment Variables

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | Port to run the API | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/job-nest` |
| `MONGO_DB_NAME` | Database name | `job-nest` |
| `JWT_SECRET` | Secret string for signing JWTs | `change-me` |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |
| `CLIENT_URL` | Allowed origin for CORS | `http://localhost:3000` |
| `NODE_ENV` | Environment mode | `development` |

## Project Structure

```
backend/
├── config/           # Database configuration and setup
├── controllers/      # Route controllers
├── middleware/       # Auth & error middleware
├── models/           # Mongoose schemas and models
├── routes/           # Express route definitions
├── utils/            # Utility functions and helpers
├── uploads/          # Local file upload storage
└── server.js         # Application entry point
```

## Database Initialization

The database is not automatically initialized when the server starts. You must call the `/api/setupDb` endpoint to initialize the database before using the application.

### Setup Endpoint

- **Endpoint**: `POST /api/setupDb`
- **Description**: Initializes the database and creates necessary collections
- **Response**:
  ```json
  {
    "success": true,
    "message": "Database setup completed successfully"
  }
  ```

## Available Routes

All routes are prefixed with `/api`.

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/auth/register` | Create a new user/company |
| `POST` | `/auth/login` | Email/password login |
| `POST` | `/auth/forgot-password` | Start reset flow (stub) |
| `GET` | `/users/me` | Fetch current user profile |
| `PATCH` | `/users/me` | Update profile details |
| `GET` | `/users/companies` | List verified companies |
| `GET` | `/jobs` | List/search/filter jobs |
| `POST` | `/jobs` | Create a job (company only) |
| `GET` | `/jobs/mine` | Current company's jobs |
| `GET` | `/jobs/:id` | Job detail |
| `POST` | `/messages` | Send chat message |
| `GET` | `/messages?participantEmail=` | Conversation |
| `POST` | `/reviews` | Create a review |
| `GET` | `/reviews?email=` | Reviews for company |
| `DELETE` | `/reviews/:id` | Delete own review |
| `POST` | `/uploads` | Upload file (multer) |

Refer to the controllers for full request/response examples.

