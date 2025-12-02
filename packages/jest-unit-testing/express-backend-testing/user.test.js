// packages/jest-unit-testing/express-backend-testing/user.test.js
import User from '../../express-backend/schemas/user.js';

import { describe, expect, it } from '@jest/globals';

describe('User model', () => {
  it('is valid with required fields', () => {
    const user = new User({
      name: 'Isaac',
      hashpassword: 'somehashedpassword123',
    });

    const error = user.validateSync();
    expect(error).toBeUndefined();
  });

  it('requires a name', () => {
    const user = new User({
      hashpassword: 'somehashedpassword123',
    });

    const error = user.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
    expect(error.errors.name.kind).toBe('required');
  });

  it('requires a hashpassword', () => {
    const user = new User({
      name: 'Isaac',
    });

    const error = user.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.hashpassword).toBeDefined();
    expect(error.errors.hashpassword.kind).toBe('required');
  });

  it('sets default createdAt', () => {
    const user = new User({
      name: 'Isaac',
      hashpassword: 'somehashedpassword123',
    });

    // createdAt default
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it('has expected schema configuration', () => {
    // name is required string
    const namePath = User.schema.path('name');
    expect(namePath.instance).toBe('String');
    expect(namePath.isRequired).toBeTruthy();

    // hashpassword is required string
    const hashPath = User.schema.path('hashpassword');
    expect(hashPath.instance).toBe('String');
    expect(hashPath.isRequired).toBeTruthy();

    // createdAt is a Date with a default
    const createdAtPath = User.schema.path('createdAt');
    expect(createdAtPath.instance).toBe('Date');
    expect(typeof createdAtPath.defaultValue).toBe('function'); // Date.now
  });

  it('uses the correct model name', () => {
    expect(User.modelName).toBe('User');
  });
});
