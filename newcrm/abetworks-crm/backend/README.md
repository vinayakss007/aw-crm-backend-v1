# ABETWORKS CRM Backend

## Overview
ABETWORKS CRM is an enterprise-grade Customer Relationship Management system built with Node.js, TypeScript, and PostgreSQL. This backend provides all the core CRM functionality including user management, account management, contact management, lead tracking, opportunity management, and activity tracking.

## Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- User registration and login
- Password hashing with bcrypt
- Refresh token support

### CRM Modules
- **Accounts**: Manage business accounts and organizations
- **Contacts**: Manage individual contacts within accounts
- **Leads**: Track and convert leads to opportunities
- **Opportunities**: Manage sales opportunities with pipeline tracking
- **Activities**: Track all customer interactions (calls, emails, meetings)

### Dynamic Custom Fields
- **Unlimited Custom Fields**: Add unlimited custom fields to any entity (leads, contacts, accounts, etc.)
- **Multiple Field Types**: Support for text, number, date, boolean, select, and multiselect fields
- **Field Validation**: Built-in validation for custom fields
- **Management Interface**: Admin interface for creating and managing custom fields

### File Management
- **MinIO Integration**: Scalable object storage for file attachments
- **File Upload**: Secure file upload with type validation
- **File Storage**: Organized file storage by entity type
- **File Access**: Secure file access with presigned URLs

### Data Management
- **Import/Export**: Bulk import and export functionality
- **Bulk Operations**: Bulk update and delete operations
- **Data Validation**: Comprehensive data validation and sanitization

### Monitoring & Health
- **Health Check Endpoints**: `/health` and `/ready` endpoints for system monitoring
- **Structured Logging**: Comprehensive logging with Winston
- **Audit Logging**: Complete audit trail for all user actions
- **Performance Metrics**: Response time and resource utilization tracking

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

#### Custom Fields
- `POST /api/custom-fields` - Create custom field (admin only)
- `GET /api/custom-fields/:entity` - Get custom fields for entity
- `GET /api/custom-fields/field/:id` - Get custom field by ID
- `PUT /api/custom-fields/:id` - Update custom field (admin only)
- `DELETE /api/custom-fields/:id` - Delete custom field (admin only)

#### Data Management
- `POST /api/data/import` - Import data (admin only)
- `GET /api/data/export/:entity` - Export data (admin only)
- `DELETE /api/data/bulk-delete` - Bulk delete records (admin only)
- `PUT /api/data/bulk-update` - Bulk update records (admin only)

#### Monitoring
- `GET /health` - Health check endpoint
- `GET /ready` - Readiness check endpoint
- `GET /api/audit-logs` - Get audit logs (admin only)

## Tech Stack
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with connection pooling
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcrypt
- **Validation**: Custom validation utilities
- **Logging**: Winston with structured logging
- **Testing**: Jest with comprehensive test coverage
- **Caching**: In-memory caching system

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env` file
4. Set up PostgreSQL database
5. Run database migrations: `npm run migrate`
6. Run custom fields migration: `npm run migrate:custom-fields`
7. Run audit logs migration: `npm run migrate:audit-logs`
8. Start the server: `npm run dev`

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

# Logging Configuration
LOG_LEVEL=info
```

## Database Schema
The database schema includes tables for users, accounts, contacts, leads, opportunities, activities, custom_fields, and audit_logs with appropriate relationships and indexes. The system uses PostgreSQL's JSONB for flexible custom field storage.

## Security Features
- Passwords are hashed using bcrypt
- JWT tokens with expiration and refresh tokens
- Input validation and sanitization
- Rate limiting to prevent abuse (100 requests per 15 minutes)
- CORS configured for security
- Helmet for HTTP headers security
- Structured logging for security auditing
- Role-based access control with fine-grained permissions

## Performance Optimizations
- **Connection Pooling**: Optimized PostgreSQL connection pooling (20 max connections)
- **Caching**: In-memory caching for frequently accessed data
- **Indexing**: Proper database indexing for performance
- **Pagination**: Efficient pagination for large datasets
- **Query Optimization**: Optimized SQL queries with proper parameterization

## Error Handling
The application includes comprehensive error handling with specific error types:
- ValidationError, AuthenticationError, AuthorizationError, NotFoundError, ConflictError, InternalServerError
- Structured logging for all errors
- Appropriate HTTP status codes for all error conditions

## API Documentation
Complete API documentation available at `API_DOCUMENTATION.md` for detailed endpoint specifications, request/response examples, and integration guidelines.

## Monitoring & Health
- Health check endpoint at `/health` for system monitoring
- Readiness endpoint at `/ready` for deployment orchestration
- Structured logging with Winston for operational insights
- Audit logging for security and compliance

## Support
For support and documentation, visit the API documentation or contact the development team.