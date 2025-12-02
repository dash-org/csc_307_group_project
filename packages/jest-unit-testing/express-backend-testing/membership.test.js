// packages/jest-unit-testing/express-backend-testing/membership.test.js
import mongoose from 'mongoose';
import Membership from '../../express-backend/schemas/membership.js';

import { describe, expect, it } from '@jest/globals';

describe('Membership model', () => {
  const kitchenId = new mongoose.Types.ObjectId();
  const userId = new mongoose.Types.ObjectId();
  const createdBy = new mongoose.Types.ObjectId();

  const makeMembership = (overrides = {}) =>
    new Membership({
      kitchenId,
      userId,
      role: 'viewer',
      createdBy,
      ...overrides,
    });

  it('is valid with required fields', () => {
    const membership = makeMembership();

    const error = membership.validateSync();
    expect(error).toBeUndefined();
  });

  it('requires a kitchenId', () => {
    const membership = makeMembership({ kitchenId: undefined });

    const error = membership.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.kitchenId).toBeDefined();
    expect(error.errors.kitchenId.kind).toBe('required');
  });

  it('requires a userId', () => {
    const membership = makeMembership({ userId: undefined });

    const error = membership.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.userId).toBeDefined();
    expect(error.errors.userId.kind).toBe('required');
  });

  it('requires a role', () => {
    const membership = makeMembership({ role: undefined });

    const error = membership.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.role).toBeDefined();
    expect(error.errors.role.kind).toBe('required');
  });

  it('requires createdBy', () => {
    const membership = makeMembership({ createdBy: undefined });

    const error = membership.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.createdBy).toBeDefined();
    expect(error.errors.createdBy.kind).toBe('required');
  });

  it('sets default addedAt and permissions', () => {
    const membership = makeMembership();

    // addedAt default
    expect(membership.addedAt).toBeInstanceOf(Date);

    // permissions should default to an empty array
    expect(Array.isArray(membership.permissions)).toBe(true);
    expect(membership.permissions).toHaveLength(0);
  });

  it('rejects invalid permissions for a given role', () => {
    const membership = makeMembership({
      role: 'viewer',
      permissions: ['items:read', 'items:write'], // viewer should NOT have write
    });

    const error = membership.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.permissions).toBeDefined();
  });

  it('accepts valid permissions for a given role', () => {
    const membership = makeMembership({
      role: 'editor',
      permissions: ['items:read', 'items:write'], // valid for editor
    });

    const error = membership.validateSync();
    expect(error).toBeUndefined();
  });

  it('has expected schema configuration', () => {
    // kitchenId is an ObjectId ref to Kitchen and required
    const kitchenPath = Membership.schema.path('kitchenId');
    expect(kitchenPath.instance).toBe('ObjectId');
    expect(kitchenPath.options.ref).toBe('Kitchen');
    expect(kitchenPath.isRequired).toBeTruthy();

    // userId is an ObjectId ref to User and required
    const userPath = Membership.schema.path('userId');
    expect(userPath.instance).toBe('ObjectId');
    expect(userPath.options.ref).toBe('User');
    expect(userPath.isRequired).toBeTruthy();

    // createdBy is an ObjectId ref to User and required
    const createdByPath = Membership.schema.path('createdBy');
    expect(createdByPath.instance).toBe('ObjectId');
    expect(createdByPath.options.ref).toBe('User');
    expect(createdByPath.isRequired).toBeTruthy();

    // role is a required string with enum values
    const rolePath = Membership.schema.path('role');
    expect(rolePath.instance).toBe('String');
    expect(rolePath.isRequired).toBeTruthy();
    expect(rolePath.enumValues).toEqual(['owner', 'admin', 'editor', 'viewer']);

    // permissions is an array of strings
    const permissionsPath = Membership.schema.path('permissions');
    expect(permissionsPath).toBeDefined();
    expect(permissionsPath.instance).toBe('Array');
    expect(permissionsPath.$embeddedSchemaType.instance).toBe('String');
  });

  it('uses the correct model name', () => {
    expect(Membership.modelName).toBe('Membership');
  });
});
