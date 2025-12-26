import request from 'supertest';
import app from '../server';
import pool from '../config/database';

describe('Health Check API', () => {
  beforeAll(async () => {
    // Clean up any existing test data
    await pool.query('DELETE FROM activities WHERE subject LIKE \'%TEST%\'');
    await pool.query('DELETE FROM opportunities WHERE name LIKE \'%TEST%\'');
    await pool.query('DELETE FROM leads WHERE company = \'Test Company\'');
    await pool.query('DELETE FROM contacts WHERE "firstName" = \'Test\'');
    await pool.query('DELETE FROM accounts WHERE name = \'Test Account\'');
    await pool.query('DELETE FROM users WHERE email LIKE \'test%\'');
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body.status).toBe('healthy');
      expect(response.body).toHaveProperty('checks');
      expect(response.body.checks).toHaveProperty('database');
    });
  });

  describe('GET /ready', () => {
    it('should return ready status', async () => {
      const response = await request(app)
        .get('/ready')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('ready');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});