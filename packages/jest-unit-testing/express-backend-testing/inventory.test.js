// packages/jest-unit-testing/express-backend-testing/inventory.test.js
import mongoose from 'mongoose';
import Inventory from '../../express-backend/schemas/inventory.js';

import { describe, expect, it } from '@jest/globals';
describe('Inventory model', () => {
  const userId = new mongoose.Types.ObjectId();

  it('is valid with required fields', () => {
    const inv = new Inventory({
      name: 'Pantry',
      createdBy: userId,
    });

    const error = inv.validateSync();
    expect(error).toBeUndefined();
  });

  it('requires a name', () => {
    const inv = new Inventory({
      createdBy: userId,
    });

    const error = inv.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
    expect(error.errors.name.kind).toBe('required');
  });

  it('requires createdBy', () => {
    const inv = new Inventory({
      name: 'Pantry',
    });

    const error = inv.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.createdBy).toBeDefined();
    expect(error.errors.createdBy.kind).toBe('required');
  });

  it('sets default createdAt and items', () => {
    const inv = new Inventory({
      name: 'Pantry',
      createdBy: userId,
    });

    expect(inv.createdAt).toBeInstanceOf(Date);
    expect(Array.isArray(inv.items)).toBe(true);
    expect(inv.items).toHaveLength(0);
  });

  it('has expected schema configuration', () => {
    // createdBy is an ObjectId ref to User
    const createdByPath = Inventory.schema.path('createdBy');
    expect(createdByPath.instance).toBe('ObjectId');
    expect(createdByPath.options.ref).toBe('User');
    expect(createdByPath.isRequired).toBeTruthy();

    // name is required string
    const namePath = Inventory.schema.path('name');
    expect(namePath.instance).toBe('String');
    expect(namePath.isRequired).toBeTruthy();

    // items is an array path
    const itemsPath = Inventory.schema.path('items');
    expect(itemsPath).toBeDefined();
    expect(itemsPath.instance).toBe('Array');
  });

  it('uses the correct model name', () => {
    expect(Inventory.modelName).toBe('Inventory');
  });
});
