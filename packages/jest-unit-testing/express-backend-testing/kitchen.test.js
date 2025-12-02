// packages/jest-unit-testing/express-backend-testing/kitchen.test.js
import mongoose from 'mongoose';
import Kitchen from '../../express-backend/schemas/kitchen.js';

import { describe, expect, it } from '@jest/globals';

describe('Kitchen model', () => {
  const ownerId = new mongoose.Types.ObjectId();

  it('is valid with required fields', () => {
    const kitchen = new Kitchen({
      name: "Isaac's Kitchen",
      owner: ownerId,
    });

    const error = kitchen.validateSync();
    expect(error).toBeUndefined();
  });

  it('requires a name', () => {
    const kitchen = new Kitchen({
      owner: ownerId,
    });

    const error = kitchen.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
    expect(error.errors.name.kind).toBe('required');
  });

  it('requires an owner', () => {
    const kitchen = new Kitchen({
      name: "Isaac's Kitchen",
    });

    const error = kitchen.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.owner).toBeDefined();
    expect(error.errors.owner.kind).toBe('required');
  });

  it('sets default createdAt and inventories', () => {
    const kitchen = new Kitchen({
      name: "Isaac's Kitchen",
      owner: ownerId,
    });

    // createdAt default
    expect(kitchen.createdAt).toBeInstanceOf(Date);

    // inventories should be an array (Mongoose gives arrays a default [])
    expect(Array.isArray(kitchen.inventories)).toBe(true);
    expect(kitchen.inventories).toHaveLength(0);
  });

  it('has expected schema configuration', () => {
    // owner is an ObjectId ref to User and required
    const ownerPath = Kitchen.schema.path('owner');
    expect(ownerPath.instance).toBe('ObjectId');
    expect(ownerPath.options.ref).toBe('User');
    expect(ownerPath.isRequired).toBeTruthy();

    // name is required string
    const namePath = Kitchen.schema.path('name');
    expect(namePath.instance).toBe('String');
    expect(namePath.isRequired).toBeTruthy();

    // inventories is an array of ObjectIds ref Inventory
    const inventoriesPath = Kitchen.schema.path('inventories');
    expect(inventoriesPath).toBeDefined();
    expect(inventoriesPath.instance).toBe('Array');
    expect(inventoriesPath.$embeddedSchemaType.instance).toBe('ObjectId');
    expect(inventoriesPath.$embeddedSchemaType.options.ref).toBe('Inventory');
  });

  it('uses the correct model name', () => {
    expect(Kitchen.modelName).toBe('Kitchen');
  });
});
