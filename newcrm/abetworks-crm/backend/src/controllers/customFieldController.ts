import { Response } from 'express';
import { AuthRequest } from '../types/express';
import CustomFieldService, { CustomField } from '../services/CustomFieldService';

// Create a new custom field for an entity
export const createCustomField = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ message: 'Only admin users can create custom fields' });
      return;
    }

    const { entity, fieldName, fieldType, displayName, required, defaultValue, options } = req.body;

    // Validate required fields
    if (!entity || !fieldName || !fieldType || !displayName) {
      res.status(400).json({ message: 'Entity, fieldName, fieldType, and displayName are required' });
      return;
    }

    // Validate entity type
    const validEntities = ['lead', 'contact', 'account', 'opportunity', 'activity', 'user'];
    if (!validEntities.includes(entity)) {
      res.status(400).json({ message: `Invalid entity type. Valid types are: ${validEntities.join(', ')}` });
      return;
    }

    // Validate field type
    const validFieldTypes = ['text', 'number', 'date', 'boolean', 'select', 'multiselect'];
    if (!validFieldTypes.includes(fieldType)) {
      res.status(400).json({ message: `Invalid field type. Valid types are: ${validFieldTypes.join(', ')}` });
      return;
    }

    // Validate options for select/multiselect fields
    if ((fieldType === 'select' || fieldType === 'multiselect') && (!options || !Array.isArray(options) || options.length === 0)) {
      res.status(400).json({ message: 'Options are required for select and multiselect field types' });
      return;
    }

    const customField = await CustomFieldService.create(entity, fieldName, fieldType, displayName, required, defaultValue, options);

    res.status(201).json({
      message: 'Custom field created successfully',
      customField
    });
  } catch (error) {
    console.error('Create custom field error:', error);
    res.status(500).json({ message: 'Server error while creating custom field' });
  }
};

// Get all custom fields for an entity
export const getCustomFields = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { entity } = req.params;

    if (!entity) {
      res.status(400).json({ message: 'Entity parameter is required' });
      return;
    }

    // Validate entity type
    const validEntities = ['lead', 'contact', 'account', 'opportunity', 'activity', 'user'];
    if (!validEntities.includes(entity)) {
      res.status(400).json({ message: `Invalid entity type. Valid types are: ${validEntities.join(', ')}` });
      return;
    }

    const customFields = await CustomFieldService.getByEntity(entity);

    res.json({
      customFields,
      total: customFields.length
    });
  } catch (error) {
    console.error('Get custom fields error:', error);
    res.status(500).json({ message: 'Server error while fetching custom fields' });
  }
};

// Get a specific custom field by ID
export const getCustomFieldById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: 'Custom field ID is required' });
      return;
    }

    const customField = await CustomFieldService.getById(id);

    if (!customField) {
      res.status(404).json({ message: 'Custom field not found' });
      return;
    }

    res.json({ customField });
  } catch (error) {
    console.error('Get custom field by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching custom field' });
  }
};

// Update a custom field
export const updateCustomField = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ message: 'Only admin users can update custom fields' });
      return;
    }

    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      res.status(400).json({ message: 'Custom field ID is required' });
      return;
    }

    // Don't allow changing the entity or field name
    delete updateData.entity;
    delete updateData.fieldName;

    const updatedCustomField = await CustomFieldService.update(id, updateData);

    if (!updatedCustomField) {
      res.status(404).json({ message: 'Custom field not found' });
      return;
    }

    res.json({
      message: 'Custom field updated successfully',
      customField: updatedCustomField
    });
  } catch (error) {
    console.error('Update custom field error:', error);
    res.status(500).json({ message: 'Server error while updating custom field' });
  }
};

// Delete a custom field
export const deleteCustomField = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ message: 'Only admin users can delete custom fields' });
      return;
    }

    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: 'Custom field ID is required' });
      return;
    }

    const deleted = await CustomFieldService.delete(id);

    if (!deleted) {
      res.status(404).json({ message: 'Custom field not found' });
      return;
    }

    res.json({ message: 'Custom field deleted successfully' });
  } catch (error) {
    console.error('Delete custom field error:', error);
    res.status(500).json({ message: 'Server error while deleting custom field' });
  }
};