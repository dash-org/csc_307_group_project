// packages/jest-unit-testing/express-backend-testing/user-services.test.js

import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import User from '../../express-backend/schemas/user.js';
import Membership from '../../express-backend/schemas/membership.js';
import Kitchen from '../../express-backend/schemas/kitchen.js';
import userServices from '../../express-backend/services/user-services.js';

const { addUser, getUsers, findUserById, deleteUserById } = userServices;

describe('user-services', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    delete Kitchen.deleteKitchenById;
  });

  describe('getUsers', () => {
    it('returns all users when no filters are provided', () => {
      const mockQuery = { find: jest.fn().mockReturnThis() };

      const findSpy = jest.spyOn(User, 'find').mockReturnValue(mockQuery);

      const result = getUsers();

      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith();
      expect(mockQuery.find).not.toHaveBeenCalled();
      expect(result).toBe(mockQuery);
    });

    it('applies filters when provided', () => {
      const mockQuery = { find: jest.fn().mockReturnThis() };

      const findSpy = jest.spyOn(User, 'find').mockReturnValue(mockQuery);

      const name = 'Alice';
      const createdAt = new Date('2024-01-01');

      const result = getUsers(name, createdAt);

      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith();

      expect(mockQuery.find).toHaveBeenNthCalledWith(1, { name });
      expect(mockQuery.find).toHaveBeenNthCalledWith(2, { createdAt });

      expect(result).toBe(mockQuery);
    });
  });

  describe('findUserById', () => {
    it('finds user by id', () => {
      const id = 'user-id';
      const mockQuery = { some: 'query' };

      const findByIdSpy = jest
        .spyOn(User, 'findById')
        .mockReturnValue(mockQuery);

      const result = findUserById(id);

      expect(findByIdSpy).toHaveBeenCalledWith(id);
      expect(result).toBe(mockQuery);
    });
  });

  describe('addUser', () => {
    it('creates a new user and calls save', async () => {
      const userData = {
        name: 'Alice',
        email: 'alice@example.com',
      };

      const savedUser = { _id: '123', ...userData };

      const saveSpy = jest
        .spyOn(User.prototype, 'save')
        .mockResolvedValue(savedUser);

      const result = await addUser(userData);

      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(result).toBe(savedUser);
    });
  });

  describe('deleteUserById', () => {
    it('deletes owned kitchens, memberships, and then the user', async () => {
      const userId = 'user-id';

      const ownerMemberships = [{ kitchenId: 'k1' }, { kitchenId: 'k2' }];

      // 1) find owner memberships
      const findSpy = jest
        .spyOn(Membership, 'find')
        .mockResolvedValue(ownerMemberships);

      // 2) delete kitchens where user is owner
      const deleteKitchenSpy = jest.fn().mockResolvedValue({ deletedCount: 1 });
      // monkey-patch the model to behave like your "kitchenServices"
      Kitchen.deleteKitchenById = deleteKitchenSpy;

      // 3) delete remaining memberships for this user
      const deleteManySpy = jest
        .spyOn(Membership, 'deleteMany')
        .mockResolvedValue({ deletedCount: 3 });

      // 4) finally delete the user
      const deleteUserSpy = jest
        .spyOn(User, 'deleteOne')
        .mockResolvedValue({ deletedCount: 1 });

      const result = await deleteUserById(userId);

      // owner memberships looked up correctly
      expect(findSpy).toHaveBeenCalledWith({ userId, role: 'owner' });

      // kitchens deleted for each owner membership
      expect(deleteKitchenSpy).toHaveBeenCalledTimes(2);
      expect(deleteKitchenSpy).toHaveBeenNthCalledWith(1, 'k1');
      expect(deleteKitchenSpy).toHaveBeenNthCalledWith(2, 'k2');

      // memberships deleted
      expect(deleteManySpy).toHaveBeenCalledWith({ userId });

      // user deleted
      expect(deleteUserSpy).toHaveBeenCalledWith({ _id: userId });

      // result of deleteUserById is whatever deleteOne resolves to
      expect(result).toEqual({ deletedCount: 1 });
    });

    it('handles case where user owns no kitchens', async () => {
      const userId = 'user-id';

      // No owner memberships
      const findSpy = jest.spyOn(Membership, 'find').mockResolvedValue([]);

      const deleteKitchenSpy = jest.fn().mockResolvedValue({ deletedCount: 0 });
      Kitchen.deleteKitchenById = deleteKitchenSpy;

      const deleteManySpy = jest
        .spyOn(Membership, 'deleteMany')
        .mockResolvedValue({ deletedCount: 2 });

      const deleteUserSpy = jest
        .spyOn(User, 'deleteOne')
        .mockResolvedValue({ deletedCount: 1 });

      const result = await deleteUserById(userId);

      expect(findSpy).toHaveBeenCalledWith({ userId, role: 'owner' });

      // No kitchens should be deleted
      expect(deleteKitchenSpy).not.toHaveBeenCalled();

      // Memberships and user still deleted
      expect(deleteManySpy).toHaveBeenCalledWith({ userId });
      expect(deleteUserSpy).toHaveBeenCalledWith({ _id: userId });

      expect(result).toEqual({ deletedCount: 1 });
    });
  });
});
