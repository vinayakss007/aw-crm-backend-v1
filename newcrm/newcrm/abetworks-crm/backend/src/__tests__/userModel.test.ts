import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import UserModel, { User } from '../models/UserModel';

// Mock the database pool
jest.mock('../config/database', () => {
  const mPool = {
    query: jest.fn(),
  };
  return mPool;
});

import pool from '../config/database';

describe('UserModel', () => {
  let mockPool: jest.Mocked<any>;

  beforeEach(() => {
    mockPool = pool as jest.Mocked<any>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user'
      };

      const mockResult = {
        rows: [{
          id: 'test-id',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }]
      };

      mockPool.query.mockResolvedValue(mockResult);

      const createdUser = await UserModel.create(userData);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        expect.arrayContaining([expect.any(String), 'test@example.com', expect.any(String), 'John', 'Doe', 'user', true, expect.any(Date), expect.any(Date)])
      );
      expect(createdUser).toEqual(mockResult.rows[0]);
    });

    it('should hash the password before storing', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user'
      };

      const mockResult = {
        rows: [{
          id: 'test-id',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }]
      };

      mockPool.query.mockResolvedValue(mockResult);

      await UserModel.create(userData);

      const callArgs = mockPool.query.mock.calls[0];
      const hashedPassword = callArgs[1][2]; // Password is the 3rd parameter (index 2)

      expect(bcrypt.compareSync('password123', hashedPassword)).toBe(true);
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const mockResult = {
        rows: [{
          id: 'test-id',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }]
      };

      mockPool.query.mockResolvedValue(mockResult);

      const user = await UserModel.findByEmail('test@example.com');

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM users WHERE email = $1'),
        ['test@example.com']
      );
      expect(user).toEqual(mockResult.rows[0]);
    });

    it('should return null if user not found', async () => {
      const mockResult = { rows: [] };
      mockPool.query.mockResolvedValue(mockResult);

      const user = await UserModel.findByEmail('nonexistent@example.com');

      expect(user).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find a user by ID', async () => {
      const mockResult = {
        rows: [{
          id: 'test-id',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }]
      };

      mockPool.query.mockResolvedValue(mockResult);

      const user = await UserModel.findById('test-id');

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM users WHERE id = $1'),
        ['test-id']
      );
      expect(user).toEqual(mockResult.rows[0]);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateData = {
        firstName: 'Jane',
        lastName: 'Smith'
      };

      const mockResult = {
        rows: [{
          id: 'test-id',
          email: 'test@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          role: 'user',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }]
      };

      mockPool.query.mockResolvedValue(mockResult);

      const updatedUser = await UserModel.update('test-id', updateData);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users SET'),
        expect.arrayContaining(['Jane', 'Smith', expect.any(Date), 'test-id'])
      );
      expect(updatedUser).toEqual(mockResult.rows[0]);
    });

    it('should return null if no updates provided', async () => {
      const updatedUser = await UserModel.update('test-id', {});
      expect(updatedUser).toBeNull();
    });
  });

  describe('delete', () => {
    it('should soft delete a user', async () => {
      const mockResult = { rowCount: 1 };
      mockPool.query.mockResolvedValue(mockResult);

      const result = await UserModel.delete('test-id');

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users SET isActive = false'),
        [expect.any(Date), 'test-id']
      );
      expect(result).toBe(true);
    });

    it('should return false if user not found', async () => {
      const mockResult = { rowCount: 0 };
      mockPool.query.mockResolvedValue(mockResult);

      const result = await UserModel.delete('test-id');

      expect(result).toBe(false);
    });
  });

  describe('getAll', () => {
    it('should get all users with pagination', async () => {
      const mockCountResult = { rows: [{ count: '2' }] };
      const mockUsersResult = {
        rows: [
          {
            id: 'user1',
            email: 'user1@example.com',
            firstName: 'User',
            lastName: 'One',
            role: 'user',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'user2',
            email: 'user2@example.com',
            firstName: 'User',
            lastName: 'Two',
            role: 'user',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      };

      // Mock first call (count) then second call (users)
      mockPool.query
        .mockResolvedValueOnce(mockCountResult) // First call for count
        .mockResolvedValueOnce(mockUsersResult); // Second call for users

      const result = await UserModel.getAll(1, 10);

      expect(mockPool.query).toHaveBeenNthCalledWith(1,
        expect.stringContaining('SELECT COUNT(*) FROM users WHERE isActive = true'),
        []
      );
      expect(mockPool.query).toHaveBeenNthCalledWith(2,
        expect.stringContaining('SELECT id, email, "firstName", "lastName", role, "isActive", "createdAt", "updatedAt" FROM users'),
        [10, 0]
      );
      expect(result).toEqual({
        users: mockUsersResult.rows,
        total: 2
      });
    });
  });
});