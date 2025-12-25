# ABETWORKS CRM API Documentation

## Overview

ABETWORKS CRM is an enterprise-grade Customer Relationship Management system with a robust API for managing customer data, sales processes, and business operations. This documentation provides comprehensive information about the API endpoints, authentication, and integration guidelines.

## Base URL

```
https://your-domain.com/api/v1
```

For local development:
```
http://localhost:5000/api/v1
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. All endpoints except `/auth` require a valid JWT token in the Authorization header.

### Authentication Endpoints

#### Register a New User
```
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "createdAt": "2023-01-01T00:00:00.000Z"
  },
  "token": "jwt-token-string",
  "refreshToken": "refresh-token-string"
}
```

#### Login
```
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "createdAt": "2023-01-01T00:00:00.000Z"
  },
  "token": "jwt-token-string",
  "refreshToken": "refresh-token-string"
}
```

#### Refresh Token
```
POST /api/v1/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "refresh-token-string"
}
```

**Response:**
```json
{
  "token": "new-jwt-token-string",
  "refreshToken": "new-refresh-token-string"
}
```

## Authorization Headers

All authenticated requests must include the Authorization header:

```
Authorization: Bearer <jwt-token>
```

## User Roles and Permissions

The system implements Role-Based Access Control (RBAC) with the following roles:

### User Role
- Can access and manage their own data
- Can view assigned accounts, contacts, leads, opportunities, and activities
- Cannot access other users' data (unless explicitly shared)

### Manager Role
- Can access their own data
- Can access data of team members
- Can manage team assignments
- Cannot modify system settings

### Admin Role
- Full access to all data and functionality
- Can create, update, and delete users
- Can manage system settings
- Can access all audit logs

## API Endpoints

### User Management

#### Get Current User Profile
```
GET /api/v1/users/profile
```

**Response:**
```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Get All Users (Admin Only)
```
GET /api/v1/users
```

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10, max: 100)

#### Get User by ID
```
GET /api/v1/users/:id
```

#### Update User
```
PUT /api/v1/users/:id
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "admin" // Only admins can change roles
}
```

#### Delete User (Admin Only)
```
DELETE /api/v1/users/:id
```

### Account Management

#### Create Account
```
POST /api/v1/accounts
```

**Request Body:**
```json
{
  "name": "Acme Corporation",
  "description": "Manufacturing company",
  "industry": "Manufacturing",
  "website": "https://acme.com",
  "phone": "+1-555-0101",
  "email": "contact@acme.com",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "size": "Large",
  "annualRevenue": 10000000,
  "customFields": {
    "primaryContact": "John Doe",
    "contractValue": 500000
  }
}
```

#### Get All Accounts
```
GET /api/v1/accounts
```

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10, max: 100)
- `search` (optional, for full-text search)

#### Get Account by ID
```
GET /api/v1/accounts/:id
```

#### Update Account
```
PUT /api/v1/accounts/:id
```

**Request Body:**
```json
{
  "name": "Updated Acme Corporation",
  "customFields": {
    "primaryContact": "Jane Smith",
    "contractValue": 750000
  }
}
```

#### Delete Account
```
DELETE /api/v1/accounts/:id
```

### Contact Management

#### Create Contact
```
POST /api/v1/contacts
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-0102",
  "jobTitle": "CEO",
  "department": "Executive",
  "accountId": "account-uuid",
  "status": "active",
  "leadSource": "Web",
  "customFields": {
    "preferredContactMethod": "Email",
    "linkedInProfile": "https://linkedin.com/in/johndoe"
  }
}
```

#### Get All Contacts
```
GET /api/v1/contacts
```

#### Get Contact by ID
```
GET /api/v1/contacts/:id
```

#### Update Contact
```
PUT /api/v1/contacts/:id
```

#### Delete Contact
```
DELETE /api/v1/contacts/:id
```

### Lead Management

#### Create Lead
```
POST /api/v1/leads
```

**Request Body:**
```json
{
  "firstName": "Michael",
  "lastName": "Brown",
  "company": "Initech",
  "email": "michael.brown@initech.com",
  "phone": "+1-555-0103",
  "jobTitle": "VP Sales",
  "leadSource": "Web",
  "status": "new",
  "leadScore": 85,
  "customFields": {
    "referralSource": "Trade Show",
    "budget": 100000
  }
}
```

#### Get All Leads
```
GET /api/v1/leads
```

#### Get Lead by ID
```
GET /api/v1/leads/:id
```

#### Update Lead
```
PUT /api/v1/leads/:id
```

#### Delete Lead
```
DELETE /api/v1/leads/:id
```

#### Convert Lead to Contact and Account
```
POST /api/v1/leads/:id/convert
```

### Opportunity Management

#### Create Opportunity
```
POST /api/v1/opportunities
```

**Request Body:**
```json
{
  "name": "Acme Manufacturing Contract",
  "description": "Large manufacturing contract",
  "accountId": "account-uuid",
  "contactId": "contact-uuid",
  "stage": "Proposal",
  "probability": 25,
  "amount": 500000,
  "currency": "USD",
  "closeDate": "2023-12-31",
  "type": "New Business",
  "customFields": {
    "decisionMaker": "John Smith",
    "decisionDate": "2023-11-15"
  }
}
```

#### Get All Opportunities
```
GET /api/v1/opportunities
```

#### Get Opportunity by ID
```
GET /api/v1/opportunities/:id
```

#### Update Opportunity
```
PUT /api/v1/opportunities/:id
```

#### Delete Opportunity
```
DELETE /api/v1/opportunities/:id
```

#### Get Pipeline Statistics
```
GET /api/v1/opportunities/pipeline-stats
```

#### Get Forecast
```
GET /api/v1/opportunities/forecast
```

### Activity Management

#### Create Activity
```
POST /api/v1/activities
```

**Request Body:**
```json
{
  "subject": "Follow up call with Acme",
  "type": "Call",
  "description": "Follow up on proposal",
  "status": "Planned",
  "priority": "High",
  "startDate": "2023-01-02T10:00:00.000Z",
  "endDate": "2023-01-02T11:00:00.000Z",
  "accountId": "account-uuid",
  "contactId": "contact-uuid",
  "opportunityId": "opportunity-uuid",
  "customFields": {
    "meetingNotes": "Discussed budget constraints",
    "followUpRequired": true
  }
}
```

#### Get All Activities
```
GET /api/v1/activities
```

#### Get Activity by ID
```
GET /api/v1/activities/:id
```

#### Update Activity
```
PUT /api/v1/activities/:id
```

#### Delete Activity
```
DELETE /api/v1/activities/:id
```

### File Management

#### Upload File
```
POST /api/v1/files
```

**Form Data:**
- `file`: The file to upload
- `entityType`: The type of entity (account, contact, lead, opportunity, activity)
- `entityId`: The ID of the entity to attach the file to

#### Get File
```
GET /api/v1/files/:fileName
```

#### Get File URL
```
GET /api/v1/files/url/:fileName
```

#### Delete File
```
DELETE /api/v1/files/:fileName
```

### Custom Field Management (Admin Only)

#### Create Custom Field
```
POST /api/v1/custom-fields
```

**Request Body:**
```json
{
  "entity": "lead", // lead, contact, account, opportunity, activity, user
  "fieldName": "referralSource",
  "fieldType": "select", // text, number, date, boolean, select, multiselect
  "displayName": "Referral Source",
  "required": false,
  "options": ["Trade Show", "Web", "Referral", "Cold Call"]
}
```

#### Get Custom Fields for Entity
```
GET /api/v1/custom-fields/:entity
```

#### Get Custom Field by ID
```
GET /api/v1/custom-fields/field/:id
```

#### Update Custom Field
```
PUT /api/v1/custom-fields/:id
```

#### Delete Custom Field
```
DELETE /api/v1/custom-fields/:id
```

### Data Import/Export (Admin Only)

#### Import Data
```
POST /api/v1/data/import
```

**Request Body:**
```json
{
  "entity": "contact", // account, contact, lead, opportunity, activity, user
  "data": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    }
  ]
}
```

#### Export Data
```
GET /api/v1/data/export/:entity
```

**Query Parameters:**
- `format`: json or csv (default: json)
- `fields`: comma-separated field names to export
- `limit`: number of records to export

#### Bulk Delete
```
DELETE /api/v1/data/bulk-delete
```

**Request Body:**
```json
{
  "entity": "contact",
  "ids": ["id1", "id2", "id3"]
}
```

#### Bulk Update
```
PUT /api/v1/data/bulk-update
```

**Request Body:**
```json
{
  "entity": "contact",
  "updates": [
    {
      "id": "contact-id-1",
      "data": {
        "status": "active"
      }
    }
  ]
}
```

### Audit Logs (Admin Only)

#### Get All Audit Logs
```
GET /api/v1/audit-logs
```

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10, max: 100)

#### Get Audit Logs by User
```
GET /api/v1/audit-logs/user/:userId
```

#### Get Audit Logs by Entity
```
GET /api/v1/audit-logs/entity/:entity/:entityId
```

#### Get Audit Logs by Action
```
GET /api/v1/audit-logs/action/:action
```

## Integration Guidelines

### For Admin Users

Admin users have full system access and can perform all operations including:
- Managing all users and their roles
- Creating and managing custom fields
- Importing and exporting data
- Accessing all audit logs
- Managing system settings

**Example Admin Workflow:**
1. Create custom fields for leads
2. Import lead data in bulk
3. Assign leads to sales team members
4. Monitor system activity through audit logs

### For Regular Users

Regular users can:
- Manage their own profile
- Access assigned accounts, contacts, leads, opportunities, and activities
- Create and update their own records
- Upload and manage files related to their entities

**Example User Workflow:**
1. Log in and access their dashboard
2. Create new leads and opportunities
3. Update contact information
4. Schedule and track activities
5. Upload relevant documents

### For Integration Agents (API Keys)

For system integrations, the API supports API key authentication as an alternative to JWT tokens.

#### API Key Authentication
```
X-API-Key: your-api-key-here
```

API keys can be created by admin users and have specific permissions based on the integration requirements.

**Integration Best Practices:**
1. Use API keys for server-to-server integrations
2. Implement proper error handling and retry logic
3. Use bulk operations when processing large datasets
4. Implement rate limiting to avoid overwhelming the system
5. Use webhooks for real-time notifications (if available)

### Error Handling

The API returns appropriate HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid or missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error

**Error Response Format:**
```json
{
  "message": "Error description",
  "errors": ["Error details if applicable"]
}
```

## Rate Limiting

The API implements rate limiting:
- 100 requests per 15 minutes per IP address
- Excessive requests will return a 429 status code

## Security Best Practices

1. Always use HTTPS in production
2. Store JWT tokens securely and implement proper expiration
3. Use refresh tokens for extended sessions
4. Implement proper input validation
5. Sanitize all user inputs
6. Use API keys for server-to-server integrations
7. Monitor and log all API access for security auditing

## SDK and Client Libraries

While not included in this documentation, consider creating client libraries for common programming languages to simplify integration:

- JavaScript/Node.js SDK
- Python SDK
- Java SDK
- .NET SDK

These libraries should handle authentication, error handling, and common operations.

## Support and Contact

For API support or questions:
- Email: api-support@abetworks-crm.com
- Documentation: https://docs.abetworks-crm.com
- Issue Tracker: https://github.com/abetworks-crm/issues