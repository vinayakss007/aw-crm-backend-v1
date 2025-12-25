import pool from './src/config/database';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

async function seedTestData() {
  try {
    console.log('Seeding test data...');

    // Create an admin user
    const adminPassword = await bcrypt.hash('AdminPass123!', 12);
    const adminId = uuidv4();
    const adminQuery = `
      INSERT INTO users (id, email, password, "firstName", "lastName", role, "isActive", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (email) DO UPDATE SET
        password = EXCLUDED.password,
        "firstName" = EXCLUDED."firstName",
        "lastName" = EXCLUDED."lastName",
        role = EXCLUDED.role
      RETURNING id;
    `;
    const adminResult = await pool.query(adminQuery, [
      adminId,
      'admin@test-crm.com',
      adminPassword,
      'Test',
      'Admin',
      'admin',
      true,
      new Date(),
      new Date()
    ]);
    const actualAdminId = adminResult.rows[0].id;
    console.log(`Admin user created/updated with ID: ${actualAdminId}`);

    // Create a regular user
    const userPassword = await bcrypt.hash('UserPass123!', 12);
    const userId = uuidv4();
    const userQuery = `
      INSERT INTO users (id, email, password, "firstName", "lastName", role, "isActive", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (email) DO UPDATE SET
        password = EXCLUDED.password,
        "firstName" = EXCLUDED."firstName",
        "lastName" = EXCLUDED."lastName",
        role = EXCLUDED.role
      RETURNING id;
    `;
    const userResult = await pool.query(userQuery, [
      userId,
      'user@test-crm.com',
      userPassword,
      'Test',
      'User',
      'user',
      true,
      new Date(),
      new Date()
    ]);
    const actualUserId = userResult.rows[0].id;
    console.log(`Regular user created/updated with ID: ${actualUserId}`);

    // Create test accounts
    const accountQuery = `
      INSERT INTO accounts (id, name, description, industry, website, phone, email, address, city, state, "zipCode", country, size, "annualRevenue", "ownerId", "assignedTo", status, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      ON CONFLICT (name) DO UPDATE SET
        description = EXCLUDED.description,
        industry = EXCLUDED.industry,
        website = EXCLUDED.website
      RETURNING id;
    `;
    const accountResult = await pool.query(accountQuery, [
      uuidv4(),
      'Test Corporation',
      'A test company for CRM testing',
      'Technology',
      'https://testcorp.com',
      '+1-555-0101',
      'contact@testcorp.com',
      '123 Test Street',
      'Test City',
      'TC',
      '12345',
      'Testland',
      'Medium',
      5000000,
      actualAdminId,
      actualAdminId,
      'active',
      new Date(),
      new Date()
    ]);
    console.log(`Test account created with ID: ${accountResult.rows[0].id}`);

    // Create test contacts
    const contactQuery = `
      INSERT INTO contacts (id, "firstName", "lastName", email, phone, "jobTitle", department, "accountId", "ownerId", "assignedTo", status, "leadSource", description, address, city, state, "zipCode", country, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      ON CONFLICT (email) DO UPDATE SET
        "firstName" = EXCLUDED."firstName",
        "lastName" = EXCLUDED."lastName",
        "jobTitle" = EXCLUDED."jobTitle"
      RETURNING id;
    `;
    const contactResult = await pool.query(contactQuery, [
      uuidv4(),
      'John',
      'Doe',
      'john.doe@testcorp.com',
      '+1-555-0102',
      'CTO',
      'Technology',
      accountResult.rows[0].id,
      actualAdminId,
      actualAdminId,
      'active',
      'Web',
      'Test contact for CRM testing',
      '123 Test Street',
      'Test City',
      'TC',
      '12345',
      'Testland',
      new Date(),
      new Date()
    ]);
    console.log(`Test contact created with ID: ${contactResult.rows[0].id}`);

    // Create test leads
    const leadQuery = `
      INSERT INTO leads (id, "firstName", "lastName", company, email, phone, "jobTitle", "leadSource", status, "leadScore", "ownerId", "assignedTo", description, address, city, state, "zipCode", country, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      ON CONFLICT (email) DO UPDATE SET
        "firstName" = EXCLUDED."firstName",
        "lastName" = EXCLUDED."lastName",
        company = EXCLUDED.company
      RETURNING id;
    `;
    const leadResult = await pool.query(leadQuery, [
      uuidv4(),
      'Jane',
      'Smith',
      'Prospect Inc',
      'jane.smith@prospect.com',
      '+1-555-0103',
      'Sales Director',
      'Referral',
      'qualified',
      85,
      actualAdminId,
      actualAdminId,
      'High-value prospect',
      '456 Prospect Ave',
      'Prospect City',
      'PC',
      '67890',
      'Prospectland',
      new Date(),
      new Date()
    ]);
    console.log(`Test lead created with ID: ${leadResult.rows[0].id}`);

    // Create test opportunities
    const opportunityQuery = `
      INSERT INTO opportunities (id, name, description, "accountId", "contactId", stage, probability, amount, currency, "closeDate", "ownerId", "assignedTo", "leadSource", type, priority, "forecastCategory", "nextStep", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      ON CONFLICT (name) DO UPDATE SET
        description = EXCLUDED.description,
        stage = EXCLUDED.stage
      RETURNING id;
    `;
    const opportunityResult = await pool.query(opportunityQuery, [
      uuidv4(),
      'Test Opportunity',
      'A test opportunity for CRM testing',
      accountResult.rows[0].id,
      contactResult.rows[0].id,
      'Proposal',
      50,
      100000,
      'USD',
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      actualAdminId,
      actualAdminId,
      'Referral',
      'New Business',
      'High',
      'Pipeline',
      'Send proposal',
      new Date(),
      new Date()
    ]);
    console.log(`Test opportunity created with ID: ${opportunityResult.rows[0].id}`);

    // Create test activities
    const activityQuery = `
      INSERT INTO activities (id, subject, type, description, status, priority, "startDate", "endDate", duration, "ownerId", "assignedTo", "accountId", "contactId", "opportunityId", "relatedToType", "relatedToId", "isAllDay", location, reminder, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      ON CONFLICT (subject) DO UPDATE SET
        description = EXCLUDED.description,
        status = EXCLUDED.status
      RETURNING id;
    `;
    const activityResult = await pool.query(activityQuery, [
      uuidv4(),
      'Test Activity',
      'Meeting',
      'A test activity for CRM testing',
      'Planned',
      'Medium',
      new Date(),
      new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      120,
      actualAdminId,
      actualAdminId,
      accountResult.rows[0].id,
      contactResult.rows[0].id,
      opportunityResult.rows[0].id,
      'opportunity',
      opportunityResult.rows[0].id,
      false,
      'Conference Room A',
      new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
      new Date(),
      new Date()
    ]);
    console.log(`Test activity created with ID: ${activityResult.rows[0].id}`);

    // Create custom fields
    const customFieldQuery = `
      INSERT INTO custom_fields (id, entity, field_name, field_type, display_name, required, default_value, options, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (entity, field_name) DO UPDATE SET
        field_type = EXCLUDED.field_type,
        display_name = EXCLUDED.display_name
      RETURNING id;
    `;
    const customFieldResult = await pool.query(customFieldQuery, [
      uuidv4(),
      'lead',
      'referralSource',
      'select',
      'Referral Source',
      false,
      'Web',
      JSON.stringify(['Web', 'Referral', 'Trade Show', 'Cold Call']),
      new Date(),
      new Date()
    ]);
    console.log(`Custom field created with ID: ${customFieldResult.rows[0].id}`);

    console.log('Test data seeding completed successfully!');
    
    // Close the connection pool
    await pool.end();
  } catch (error) {
    console.error('Error seeding test data:', error);
    process.exit(1);
  }
}

seedTestData();