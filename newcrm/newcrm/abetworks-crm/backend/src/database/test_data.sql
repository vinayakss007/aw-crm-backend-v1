-- ABETWORKS CRM API Test Data

-- Insert sample data for testing

-- Insert sample users
INSERT INTO users (email, password, "firstName", "lastName", role, "isActive") 
VALUES 
  ('john.doe@example.com', '$2b$10$LzttxbsuQ8L3J8sdTdfRyeH06x1F.q4YUyQFk1r7z7Lz7Lz7Lz7L.', 'John', 'Doe', 'user', true),
  ('jane.smith@example.com', '$2b$10$LzttxbsuQ8L3J8sdTdfRyeH06x1F.q4YUyQFk1r7z7Lz7Lz7Lz7L.', 'Jane', 'Smith', 'user', true),
  ('manager@example.com', '$2b$10$LzttxbsuQ8L3J8sdTdfRyeH06x1F.q4YUyQFk1r7z7Lz7Lz7Lz7L.', 'Manager', 'User', 'manager', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample accounts
INSERT INTO accounts (name, description, industry, website, phone, email, "ownerId", status) 
SELECT 
  'Acme Corporation', 'Manufacturing company', 'Manufacturing', 'https://acme.com', '+1-555-0101', 'contact@acme.com', id, 'active'
FROM users WHERE email = 'john.doe@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO accounts (name, description, industry, website, phone, email, "ownerId", status) 
SELECT 
  'Globex Inc', 'Technology services', 'Technology', 'https://globex.com', '+1-555-0102', 'info@globex.com', id, 'active'
FROM users WHERE email = 'jane.smith@example.com'
ON CONFLICT DO NOTHING;

-- Insert sample contacts
INSERT INTO contacts ("firstName", "lastName", email, phone, "jobTitle", department, "accountId", "ownerId", status) 
SELECT 
  'Robert', 'Johnson', 'robert.johnson@acme.com', '+1-555-0103', 'CEO', 'Executive', a.id, u.id, 'active'
FROM accounts a, users u 
WHERE a.name = 'Acme Corporation' AND u.email = 'john.doe@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO contacts ("firstName", "lastName", email, phone, "jobTitle", department, "accountId", "ownerId", status) 
SELECT 
  'Sarah', 'Williams', 'sarah.williams@globex.com', '+1-555-0104', 'CTO', 'Technology', a.id, u.id, 'active'
FROM accounts a, users u 
WHERE a.name = 'Globex Inc' AND u.email = 'jane.smith@example.com'
ON CONFLICT DO NOTHING;

-- Insert sample leads
INSERT INTO leads ("firstName", "lastName", company, email, phone, "jobTitle", "leadSource", status, "ownerId") 
SELECT 
  'Michael', 'Brown', 'Initech', 'michael.brown@initech.com', '+1-555-0105', 'VP Sales', 'Web', 'new', id
FROM users WHERE email = 'john.doe@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO leads ("firstName", "lastName", company, email, phone, "jobTitle", "leadSource", status, "ownerId") 
SELECT 
  'Emily', 'Davis', 'Umbrella Corp', 'emily.davis@umbrella.com', '+1-555-0106', 'Director', 'Referral', 'qualified', id
FROM users WHERE email = 'jane.smith@example.com'
ON CONFLICT DO NOTHING;

-- Insert sample opportunities
INSERT INTO opportunities (name, description, "accountId", stage, amount, currency, "ownerId", type) 
SELECT 
  'Acme Manufacturing Contract', 'Large manufacturing contract', a.id, 'Proposal', 500000.00, 'USD', u.id, 'New Business'
FROM accounts a, users u 
WHERE a.name = 'Acme Corporation' AND u.email = 'john.doe@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO opportunities (name, description, "accountId", stage, amount, currency, "ownerId", type) 
SELECT 
  'Globex Technology Upgrade', 'System upgrade project', a.id, 'Negotiation', 250000.00, 'USD', u.id, 'New Business'
FROM accounts a, users u 
WHERE a.name = 'Globex Inc' AND u.email = 'jane.smith@example.com'
ON CONFLICT DO NOTHING;

-- Insert sample activities
INSERT INTO activities (subject, type, description, status, "startDate", "endDate", "ownerId", "accountId") 
SELECT 
  'Follow up call with Acme', 'Call', 'Follow up on proposal', 'Planned', CURRENT_TIMESTAMP + INTERVAL '1 day', CURRENT_TIMESTAMP + INTERVAL '1 day 1 hour', u.id, a.id
FROM users u, accounts a
WHERE u.email = 'john.doe@example.com' AND a.name = 'Acme Corporation'
ON CONFLICT DO NOTHING;

INSERT INTO activities (subject, type, description, status, "startDate", "endDate", "ownerId", "accountId") 
SELECT 
  'Demo for Globex', 'Meeting', 'Product demonstration', 'Scheduled', CURRENT_TIMESTAMP + INTERVAL '2 days', CURRENT_TIMESTAMP + INTERVAL '2 days 2 hours', u.id, a.id
FROM users u, accounts a
WHERE u.email = 'jane.smith@example.com' AND a.name = 'Globex Inc'
ON CONFLICT DO NOTHING;