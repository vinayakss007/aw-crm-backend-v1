import { Request } from 'express';
import { ValidationError } from './errors';

// Validation utility functions
export class ValidationUtil {
  // Validate email format
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate required fields
  static validateRequiredFields(data: Record<string, any>, requiredFields: string[]): void {
    const missingFields: string[] = [];
    
    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
    }
  }

  // Validate string length
  static validateStringLength(value: string, min: number, max: number, fieldName: string): void {
    if (value.length < min || value.length > max) {
      throw new ValidationError(`${fieldName} must be between ${min} and ${max} characters`);
    }
  }

  // Validate number range
  static validateNumberRange(value: number, min: number, max: number, fieldName: string): void {
    if (value < min || value > max) {
      throw new ValidationError(`${fieldName} must be between ${min} and ${max}`);
    }
  }

  // Validate phone number format
  static validatePhone(phone: string): boolean {
    // Simple phone validation - can be expanded based on requirements
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  // Validate UUID format
  static validateUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  // Validate common fields for CRM entities
  static validateCommonFields(
    firstName?: string,
    lastName?: string,
    email?: string,
    phone?: string
  ): void {
    if (firstName && firstName.length > 100) {
      throw new ValidationError('First name must be less than 100 characters');
    }

    if (lastName && lastName.length > 100) {
      throw new ValidationError('Last name must be less than 100 characters');
    }

    if (email && !this.validateEmail(email)) {
      throw new ValidationError('Invalid email format');
    }

    if (phone && !this.validatePhone(phone)) {
      throw new ValidationError('Invalid phone number format');
    }
  }

  // Validate request body against schema
  static validateSchema<T>(data: any, schema: { [key: string]: (value: any) => boolean | void }): T {
    const errors: string[] = [];

    for (const [field, validator] of Object.entries(schema)) {
      try {
        const result = validator(data[field]);
        if (result === false) {
          errors.push(`${field} is invalid`);
        }
      } catch (error) {
        errors.push(`${field} validation failed: ${error instanceof Error ? error.message : 'unknown error'}`);
      }
    }

    if (errors.length > 0) {
      throw new ValidationError(errors.join('; '));
    }

    return data as T;
  }

  // Sanitize input to prevent injection attacks
  static sanitizeInput(input: string): string {
    if (typeof input !== 'string') {
      return input;
    }

    // Remove potentially dangerous characters
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
}

// Validation middleware
export const validateBody = (schema: { [key: string]: (value: any) => boolean | void }) => {
  return (req: Request, _res: any, next: any) => {
    try {
      ValidationUtil.validateSchema(req.body, schema);
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateQuery = (schema: { [key: string]: (value: any) => boolean | void }) => {
  return (req: Request, _res: any, next: any) => {
    try {
      ValidationUtil.validateSchema(req.query, schema);
      next();
    } catch (error) {
      next(error);
    }
  };
};