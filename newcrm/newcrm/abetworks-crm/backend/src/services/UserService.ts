import UserModel, { User } from '../models/UserModel';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export interface UserRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface UserWithToken {
  user: User;
  token: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class UserService {
  /**
   * Register a new user
   */
  static async register(userData: UserRegistrationData): Promise<User> {
    // Check if user already exists
    const existingUser = await UserModel.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Create the user
    return await UserModel.create({
      ...userData,
      password: hashedPassword,
      role: userData.role || 'user'
    });
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<User | null> {
    return await UserModel.findByEmail(email);
  }

  /**
   * Find user by ID
   */
  static async findById(id: string): Promise<User | null> {
    return await UserModel.findById(id);
  }

  /**
   * Update user
   */
  static async update(id: string, updateData: UserUpdateData): Promise<User | null> {
    // Don't allow updating password through this method
    const updatePayload: Partial<User> = { ...updateData };
    
    return await UserModel.update(id, updatePayload);
  }

  /**
   * Delete user (soft delete)
   */
  static async delete(id: string): Promise<boolean> {
    return await UserModel.delete(id);
  }

  /**
   * Get all users with pagination
   */
  static async getAll(page: number = 1, limit: number = 10): Promise<PaginatedResult<User>> {
    const result = await UserModel.getAll(page, limit);
    
    return {
      items: result.users,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit)
    };
  }

  /**
   * Validate user credentials
   */
  static async validateCredentials(email: string, password: string): Promise<User | null> {
    const user = await UserModel.findByEmail(email);
    
    if (!user || !user.isActive) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    return isMatch ? user : null;
  }

  /**
   * Change user password
   */
  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = await UserModel.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update the password
    const updatedUser = await UserModel.update(userId, { password: hashedNewPassword });
    
    return !!updatedUser;
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, profileData: Partial<User>): Promise<User | null> {
    // Only allow updating specific profile fields
    const allowedUpdates: (keyof User)[] = [
      'firstName', 'lastName', 'email'
    ];

    const updatePayload: Partial<User> = {};

    for (const key of allowedUpdates) {
      if (profileData[key] !== undefined) {
        (updatePayload as any)[key] = profileData[key];
      }
    }

    return await UserModel.update(userId, updatePayload);
  }
}

export default UserService;