import request from 'supertest';
import app from '../server';
import pool from '../config/database';

describe('ABETWORKS CRM API Tests', () => {
  let authToken: string;
  let userId: string;
  let accountId: string;
  let contactId: string;
  let leadId: string;
  let opportunityId: string;
  let activityId: string;

  beforeAll(async () => {
    // Clean up any existing test data
    await pool.query('DELETE FROM activities WHERE subject LIKE \'%TEST%\'');
    await pool.query('DELETE FROM opportunities WHERE name LIKE \'%TEST%\'');
    await pool.query('DELETE FROM leads WHERE company = \'Test Company\'');
    await pool.query('DELETE FROM contacts WHERE "firstName" = \'Test\'');
    await pool.query('DELETE FROM accounts WHERE name = \'Test Account\'');
    await pool.query('DELETE FROM users WHERE email = \'test@example.com\'');
  });

  afterAll(async () => {
    // Clean up test data after tests
    if (activityId) {
      await pool.query('DELETE FROM activities WHERE id = $1', [activityId]);
    }
    if (opportunityId) {
      await pool.query('DELETE FROM opportunities WHERE id = $1', [opportunityId]);
    }
    if (leadId) {
      await pool.query('DELETE FROM leads WHERE id = $1', [leadId]);
    }
    if (contactId) {
      await pool.query('DELETE FROM contacts WHERE id = $1', [contactId]);
    }
    if (accountId) {
      await pool.query('DELETE FROM accounts WHERE id = $1', [accountId]);
    }
    if (userId) {
      await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    }
    
    await pool.end();
  });

  describe('Authentication API', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'TestPass123!',
          firstName: 'Test',
          lastName: 'User'
        })
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email');
      expect(response.body.user.email).toBe('test@example.com');
      
      userId = response.body.user.id;
    });

    it('should login user and return tokens', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'TestPass123!'
        })
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Login successful');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.token).toBeDefined();
      
      authToken = response.body.token;
    });
  });

  describe('User API', () => {
    it('should get user profile', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
    });
  });

  describe('Account API', () => {
    it('should create a new account', async () => {
      const response = await request(app)
        .post('/api/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Account',
          description: 'Test account for API testing',
          industry: 'Technology',
          website: 'https://testaccount.com',
          phone: '+1-555-0199',
          email: 'contact@testaccount.com',
          address: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          country: 'Test Country',
          size: 'Medium',
          annualRevenue: 1000000
        })
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Account created successfully');
      expect(response.body).toHaveProperty('account');
      expect(response.body.account.name).toBe('Test Account');
      
      accountId = response.body.account.id;
    });

    it('should get all accounts', async () => {
      const response = await request(app)
        .get('/api/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('accounts');
      expect(Array.isArray(response.body.accounts)).toBeTruthy();
      expect(response.body.accounts.length).toBeGreaterThan(0);
    });

    it('should get account by ID', async () => {
      const response = await request(app)
        .get(`/api/accounts/${accountId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('account');
      expect(response.body.account.id).toBe(accountId);
      expect(response.body.account.name).toBe('Test Account');
    });

    it('should update account', async () => {
      const response = await request(app)
        .put(`/api/accounts/${accountId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Test Account',
          description: 'Updated test account for API testing'
        })
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Account updated successfully');
      expect(response.body).toHaveProperty('account');
      expect(response.body.account.name).toBe('Updated Test Account');
    });
  });

  describe('Contact API', () => {
    it('should create a new contact', async () => {
      const response = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          firstName: 'Test',
          lastName: 'Contact',
          email: 'test.contact@example.com',
          phone: '+1-555-0198',
          jobTitle: 'Tester',
          department: 'QA',
          accountId: accountId,
          status: 'active'
        })
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Contact created successfully');
      expect(response.body).toHaveProperty('contact');
      expect(response.body.contact.firstName).toBe('Test');
      expect(response.body.contact.lastName).toBe('Contact');
      
      contactId = response.body.contact.id;
    });

    it('should get all contacts', async () => {
      const response = await request(app)
        .get('/api/contacts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('contacts');
      expect(Array.isArray(response.body.contacts)).toBeTruthy();
      expect(response.body.contacts.length).toBeGreaterThan(0);
    });

    it('should get contact by ID', async () => {
      const response = await request(app)
        .get(`/api/contacts/${contactId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('contact');
      expect(response.body.contact.id).toBe(contactId);
      expect(response.body.contact.firstName).toBe('Test');
    });
  });

  describe('Lead API', () => {
    it('should create a new lead', async () => {
      const response = await request(app)
        .post('/api/leads')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          firstName: 'Test',
          lastName: 'Lead',
          company: 'Test Company',
          email: 'test.lead@example.com',
          phone: '+1-555-0197',
          jobTitle: 'Prospect',
          leadSource: 'Web',
          status: 'new'
        })
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Lead created successfully');
      expect(response.body).toHaveProperty('lead');
      expect(response.body.lead.firstName).toBe('Test');
      expect(response.body.lead.lastName).toBe('Lead');
      
      leadId = response.body.lead.id;
    });

    it('should get all leads', async () => {
      const response = await request(app)
        .get('/api/leads')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('leads');
      expect(Array.isArray(response.body.leads)).toBeTruthy();
      expect(response.body.leads.length).toBeGreaterThan(0);
    });

    it('should get lead by ID', async () => {
      const response = await request(app)
        .get(`/api/leads/${leadId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('lead');
      expect(response.body.lead.id).toBe(leadId);
      expect(response.body.lead.firstName).toBe('Test');
    });
  });

  describe('Opportunity API', () => {
    it('should create a new opportunity', async () => {
      const response = await request(app)
        .post('/api/opportunities')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Opportunity',
          description: 'Test opportunity for API testing',
          accountId: accountId,
          stage: 'Qualification',
          probability: 25,
          amount: 50000,
          currency: 'USD',
          type: 'New Business'
        })
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Opportunity created successfully');
      expect(response.body).toHaveProperty('opportunity');
      expect(response.body.opportunity.name).toBe('Test Opportunity');
      
      opportunityId = response.body.opportunity.id;
    });

    it('should get all opportunities', async () => {
      const response = await request(app)
        .get('/api/opportunities')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('opportunities');
      expect(Array.isArray(response.body.opportunities)).toBeTruthy();
      expect(response.body.opportunities.length).toBeGreaterThan(0);
    });

    it('should get opportunity by ID', async () => {
      const response = await request(app)
        .get(`/api/opportunities/${opportunityId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('opportunity');
      expect(response.body.opportunity.id).toBe(opportunityId);
      expect(response.body.opportunity.name).toBe('Test Opportunity');
    });
  });

  describe('Activity API', () => {
    it('should create a new activity', async () => {
      const response = await request(app)
        .post('/api/activities')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          subject: 'TEST - Follow up meeting',
          type: 'Meeting',
          description: 'Follow up meeting for testing',
          status: 'Planned',
          priority: 'High',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
          accountId: accountId,
          contactId: contactId
        })
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Activity created successfully');
      expect(response.body).toHaveProperty('activity');
      expect(response.body.activity.subject).toContain('TEST');
      
      activityId = response.body.activity.id;
    });

    it('should get all activities', async () => {
      const response = await request(app)
        .get('/api/activities')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('activities');
      expect(Array.isArray(response.body.activities)).toBeTruthy();
      expect(response.body.activities.length).toBeGreaterThan(0);
    });

    it('should get activity by ID', async () => {
      const response = await request(app)
        .get(`/api/activities/${activityId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('activity');
      expect(response.body.activity.id).toBe(activityId);
      expect(response.body.activity.subject).toContain('TEST');
    });
  });
});