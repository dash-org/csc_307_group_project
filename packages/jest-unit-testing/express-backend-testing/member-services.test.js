// packages/jest-unit-testing/express-backend-testing/member-services.test.js
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import Membership from '../../express-backend/schemas/membership.js';

// ✅ Import the default export object from member-services
import memberServices from '../../express-backend/services/member-services.js';

// ✅ Destructure the functions from that default object
const {
  addMember,
  getMembers,
  findMemberById,
  getMembersByKitchenId,
  getMembersByUserId,
  deleteMemberById,
} = memberServices;

describe('member-services', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('getMembers', () => {
    it('returns all members when no filters are provided', () => {
      const mockQuery = { find: jest.fn().mockReturnThis() };

      const findSpy = jest.spyOn(Membership, 'find').mockReturnValue(mockQuery);

      const result = getMembers(); // no filters

      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith(); // called with no args
      expect(mockQuery.find).not.toHaveBeenCalled(); // no chained filters
      expect(result).toBe(mockQuery);
    });

    it('applies filters when provided', () => {
      const mockQuery = { find: jest.fn().mockReturnThis() };

      const findSpy = jest.spyOn(Membership, 'find').mockReturnValue(mockQuery);

      const userId = 'user-id';
      const role = 'admin';
      const permissions = ['READ', 'WRITE'];
      const addedAt = new Date('2024-01-01');

      const result = getMembers(userId, role, permissions, addedAt);

      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith();

      expect(mockQuery.find).toHaveBeenNthCalledWith(1, { userId });
      expect(mockQuery.find).toHaveBeenNthCalledWith(2, { role });
      expect(mockQuery.find).toHaveBeenNthCalledWith(3, {
        permissions: { $all: permissions },
      });
      expect(mockQuery.find).toHaveBeenNthCalledWith(4, { addedAt });

      expect(result).toBe(mockQuery);
    });
  });

  describe('findMemberById', () => {
    it('finds member by id', () => {
      const id = 'member-id';
      const mockQuery = { some: 'query' };

      const findByIdSpy = jest
        .spyOn(Membership, 'findById')
        .mockReturnValue(mockQuery);

      const result = findMemberById(id);

      expect(findByIdSpy).toHaveBeenCalledWith(id);
      expect(result).toBe(mockQuery);
    });
  });

  describe('getMembersByUserId', () => {
    it('finds members by userId', () => {
      const userId = 'user-id';
      const mockResult = [{ _id: 'm1' }, { _id: 'm2' }];

      const findSpy = jest
        .spyOn(Membership, 'find')
        .mockReturnValue(mockResult);

      const result = getMembersByUserId(userId);

      expect(findSpy).toHaveBeenCalledWith({ userId });
      expect(result).toBe(mockResult);
    });
  });

  describe('getMembersByKitchenId', () => {
    it('finds members by kitchenId and populates userId and createdBy', () => {
      const kitchenId = 'kitchen-id';
      const populate = jest.fn().mockReturnThis();
      const mockQuery = { populate };

      const findSpy = jest.spyOn(Membership, 'find').mockReturnValue(mockQuery);

      const result = getMembersByKitchenId(kitchenId);

      expect(findSpy).toHaveBeenCalledWith({ kitchenId });
      expect(populate).toHaveBeenNthCalledWith(1, 'userId');
      expect(populate).toHaveBeenNthCalledWith(2, 'createdBy');
      expect(result).toBe(mockQuery);
    });
  });

  describe('addMember', () => {
    it('creates a new member and calls save', async () => {
      const memberData = {
        userId: 'user-id',
        kitchenId: 'kitchen-id',
        role: 'member',
        permissions: ['READ'],
      };

      const savedMember = { _id: '123', ...memberData };

      const saveSpy = jest
        .spyOn(Membership.prototype, 'save')
        .mockResolvedValue(savedMember);

      const result = await addMember(memberData);

      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(result).toBe(savedMember);
    });
  });

  describe('deleteMemberById', () => {
    it('deletes member by id', async () => {
      const id = 'member-id';
      const deleteResult = { deletedCount: 1 };

      const deleteSpy = jest
        .spyOn(Membership, 'deleteOne')
        .mockResolvedValue(deleteResult);

      const result = await deleteMemberById(id);

      expect(deleteSpy).toHaveBeenCalledWith({ _id: id });
      expect(result).toBe(deleteResult);
    });
  });
});
