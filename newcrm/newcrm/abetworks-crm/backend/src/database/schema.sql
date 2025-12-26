-- ABETWORKS CRM Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Accounts table
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    industry VARCHAR(100),
    website VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    "zipCode" VARCHAR(20),
    country VARCHAR(100),
    size VARCHAR(50),
    "annualRevenue" DECIMAL(15, 2),
    "ownerId" UUID NOT NULL,
    "assignedTo" UUID,
    status VARCHAR(50) DEFAULT 'active',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP WITH TIME ZONE
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    "jobTitle" VARCHAR(100),
    department VARCHAR(100),
    "accountId" UUID,
    "ownerId" UUID NOT NULL,
    "assignedTo" UUID,
    status VARCHAR(50) DEFAULT 'active',
    "leadSource" VARCHAR(100),
    description TEXT,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    "zipCode" VARCHAR(20),
    country VARCHAR(100),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP WITH TIME ZONE
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    company VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    "jobTitle" VARCHAR(100),
    "leadSource" VARCHAR(100) DEFAULT 'web',
    status VARCHAR(50) DEFAULT 'new',
    "leadScore" INTEGER DEFAULT 0,
    "ownerId" UUID NOT NULL,
    "assignedTo" UUID,
    description TEXT,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    "zipCode" VARCHAR(20),
    country VARCHAR(100),
    "convertedToContact" BOOLEAN DEFAULT false,
    "convertedToContactId" UUID,
    "convertedToAccount" BOOLEAN DEFAULT false,
    "convertedToAccountId" UUID,
    "convertedDate" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP WITH TIME ZONE
);

-- Opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    "accountId" UUID,
    "contactId" UUID,
    stage VARCHAR(100) NOT NULL,
    probability INTEGER DEFAULT 10,
    amount DECIMAL(15, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    "closeDate" DATE,
    "ownerId" UUID NOT NULL,
    "assignedTo" UUID,
    "leadSource" VARCHAR(100),
    type VARCHAR(100) DEFAULT 'New Business',
    priority VARCHAR(50) DEFAULT 'Medium',
    "forecastCategory" VARCHAR(50) DEFAULT 'Pipeline',
    "nextStep" VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP WITH TIME ZONE
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Planned',
    priority VARCHAR(50) DEFAULT 'Medium',
    "startDate" TIMESTAMP WITH TIME ZONE,
    "endDate" TIMESTAMP WITH TIME ZONE,
    duration INTEGER, -- in minutes
    "ownerId" UUID NOT NULL,
    "assignedTo" UUID,
    "accountId" UUID,
    "contactId" UUID,
    "opportunityId" UUID,
    "relatedToType" VARCHAR(50), -- 'Account', 'Contact', 'Opportunity', etc.
    "relatedToId" UUID, -- ID of the related entity
    "isAllDay" BOOLEAN DEFAULT false,
    location VARCHAR(255),
    reminder TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP WITH TIME ZONE
);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '[]',
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "assignedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY ("roleId") REFERENCES roles(id) ON DELETE CASCADE,
    UNIQUE ("userId", "roleId")
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_accounts_owner ON accounts("ownerId");
CREATE INDEX IF NOT EXISTS idx_accounts_assigned ON accounts("assignedTo");
CREATE INDEX IF NOT EXISTS idx_contacts_owner ON contacts("ownerId");
CREATE INDEX IF NOT EXISTS idx_contacts_assigned ON contacts("assignedTo");
CREATE INDEX IF NOT EXISTS idx_contacts_account ON contacts("accountId");
CREATE INDEX IF NOT EXISTS idx_leads_owner ON leads("ownerId");
CREATE INDEX IF NOT EXISTS idx_leads_assigned ON leads("assignedTo");
CREATE INDEX IF NOT EXISTS idx_opportunities_owner ON opportunities("ownerId");
CREATE INDEX IF NOT EXISTS idx_opportunities_assigned ON opportunities("assignedTo");
CREATE INDEX IF NOT EXISTS idx_opportunities_account ON opportunities("accountId");
CREATE INDEX IF NOT EXISTS idx_activities_owner ON activities("ownerId");
CREATE INDEX IF NOT EXISTS idx_activities_assigned ON activities("assignedTo");
CREATE INDEX IF NOT EXISTS idx_activities_account ON activities("accountId");
CREATE INDEX IF NOT EXISTS idx_activities_contact ON activities("contactId");
CREATE INDEX IF NOT EXISTS idx_activities_opportunity ON activities("opportunityId");
CREATE INDEX IF NOT EXISTS idx_activities_date_range ON activities("startDate", "endDate");

-- Update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for update timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (for testing)
INSERT INTO users (email, password, "firstName", "lastName", role, "isActive") 
VALUES ('admin@abetworks-crm.com', '$2b$10$LzttxbsuQ8L3J8sdTdfRyeH06x1F.q4YUyQFk1r7z7Lz7Lz7Lz7L.', 'Admin', 'User', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- Insert default roles
INSERT INTO roles (name, description, permissions, "isActive") 
VALUES 
  ('admin', 'Administrator with full access', '["read", "write", "delete", "manage_users"]', true),
  ('user', 'Regular user with standard access', '["read", "write"]', true),
  ('manager', 'Manager with team access', '["read", "write", "team_access"]', true)
ON CONFLICT (name) DO NOTHING;