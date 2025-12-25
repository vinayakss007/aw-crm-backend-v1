# ABETWORKS CRM Backend

## Overview
ABETWORKS CRM is an enterprise-grade Customer Relationship Management system built with Node.js, TypeScript, and PostgreSQL. This backend provides all the core CRM functionality including user management, account management, contact management, lead tracking, opportunity management, and activity tracking.

## Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
- User registration and login
- Password hashing with bcrypt

### CRM Modules
- **Accounts**: Manage business accounts and organizations
- **Contacts**: Manage individual contacts within accounts
- **Leads**: Track and convert leads to opportunities
- **Opportunities**: Manage sales opportunities with pipeline tracking
- **Activities**: Track all customer interactions (calls, emails, meetings)

### File Management
- **MinIO Integration**: Scalable object storage for file attachments
- **File Upload**: Secure file upload with type validation
- **File Storage**: Organized file storage by entity type
- **File Access**: Secure file access with presigned URLs

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh authentication token

#### Users
- `GET /api/users/profile` - Get current user profile
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

#### Accounts
- `POST /api/accounts` - Create new account
- `GET /api/accounts` - Get all accounts
- `GET /api/accounts/:id` - Get account by ID
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account

#### Contacts
- `POST /api/contacts` - Create new contact
- `GET /api/contacts` - Get all contacts
- `GET /api/contacts/:id` - Get contact by ID
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

#### Leads
- `POST /api/leads` - Create new lead
- `GET /api/leads` - Get all leads
- `GET /api/leads/:id` - Get lead by ID
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead
- `POST /api/leads/:id/convert` - Convert lead to contact and account

#### Opportunities
- `POST /api/opportunities` - Create new opportunity
- `GET /api/opportunities` - Get all opportunities
- `GET /api/opportunities/:id` - Get opportunity by ID
- `PUT /api/opportunities/:id` - Update opportunity
- `DELETE /api/opportunities/:id` - Delete opportunity
- `GET /api/opportunities/pipeline-stats` - Get pipeline statistics
- `GET /api/opportunities/forecast` - Get forecast

#### Activities
- `POST /api/activities` - Create new activity
- `GET /api/activities` - Get all activities
- `GET /api/activities/:id` - Get activity by ID
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity

#### Files
- `POST /api/files` - Upload a file (requires file, entityType, entityId)
- `GET /api/files/:fileName` - Get file content
- `GET /api/files/url/:fileName` - Get presigned URL for file
- `DELETE /api/files/:fileName` - Delete file

## Tech Stack
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcrypt
- **Validation**: Express-validator
- **Logging**: Winston
- **Testing**: Jest

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env` file
4. Set up PostgreSQL database
5. Run database migrations
6. Start the server: `npm run dev`

## Environment Variables
Create a `.env` file in the root directory with the following variables:

```
# Database Configuration
DATABASE_URL=postgresql://neondb_owner:npg_FZ5LUErbQly4@ep-blue-unit-adddwvsg-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRE=30d

# Server Configuration
PORT=5000
NODE_ENV=development
```

## Database Schema
The database schema is defined in `src/database/migrations/001_initial_schema.sql`. It includes tables for users, accounts, contacts, leads, opportunities, activities, and roles with appropriate relationships and indexes.

## Security Features
- Passwords are hashed using bcrypt
- JWT tokens with expiration
- Input validation and sanitization
- Rate limiting to prevent abuse
- CORS configured for security
- Helmet for HTTP headers security

## Error Handling
The application includes comprehensive error handling with appropriate HTTP status codes and error messages.

## API Documentation
API documentation follows REST principles with consistent response formats. All endpoints require authentication unless specified otherwise.