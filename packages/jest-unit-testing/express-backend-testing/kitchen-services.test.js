// packages/jest-unit-testing/express-backend-testing/kitchen-services.test.js

import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import Kitchen from '../../express-backend/schemas/kitchen.js';
import Inventory from '../../express-backend/schemas/inventory.js';
import Membership from '../../express-backend/schemas/membership.js';
import memberServices from '../../express-backend/services/member-services.js';
import kitchenServices from '../../express-backend/services/kitchen-services.js';

const {
  getKitchen,
  findKitchenById,
  addKitchen,
  deleteKitchenById,
  addInventoryToKitchen,
  removeInventoryFromKitchen,
} = kitchenServices;

describe('kitchen-services', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('getKitchen', () => {
    it('does not apply optional filters when params are not provided', async () => {
      const viewingUserId = 'user-123';

      const mockKitchenQuery = {
        select: jest.fn().mockReturnThis(),
        find: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
      };

      jest.spyOn(Kitchen, 'find').mockReturnValue(mockKitchenQuery);

      const memberships = [{ kitchenId: 'k1' }];
      const membershipSelect = jest.fn().mockReturnValue(memberships);

      jest
        .spyOn(memberServices, 'getMembersByUserId')
        .mockReturnValue({ select: membershipSelect });

      const result = await getKitchen(
        undefined,
        undefined,
        undefined,
        viewingUserId
      );

      expect(Kitchen.find).toHaveBeenCalledTimes(1);
      expect(mockKitchenQuery.select).toHaveBeenCalledWith('-inventories');

      expect(mockKitchenQuery.find).toHaveBeenCalledTimes(1);
      expect(mockKitchenQuery.find).toHaveBeenCalledWith({
        _id: { $in: ['k1'] },
      });

      expect(mockKitchenQuery.populate).toHaveBeenCalledWith('owner');

      expect(result).toBe(mockKitchenQuery);
    });

    it('applies filters and restricts to kitchens accessible by the viewing user', async () => {
      const viewingUserId = 'user-123';
      const name = 'My Kitchen';
      const owner = 'owner-456';
      const createdAt = new Date('2024-01-01');

      const mockKitchenQuery = {
        select: jest.fn().mockReturnThis(),
        find: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
      };

      const kitchenFindSpy = jest
        .spyOn(Kitchen, 'find')
        .mockReturnValue(mockKitchenQuery);

      const memberships = [{ kitchenId: 'k1' }, { kitchenId: 'k2' }];
      const membershipSelect = jest.fn().mockReturnValue(memberships);

      const getMembersByUserIdSpy = jest
        .spyOn(memberServices, 'getMembersByUserId')
        .mockReturnValue({ select: membershipSelect });

      const result = await getKitchen(name, owner, createdAt, viewingUserId);

      // Initial base query
      expect(kitchenFindSpy).toHaveBeenCalledTimes(1);
      expect(mockKitchenQuery.select).toHaveBeenCalledWith('-inventories');

      // Filters on name/owner/createdAt
      expect(mockKitchenQuery.find).toHaveBeenNthCalledWith(1, { name });
      expect(mockKitchenQuery.find).toHaveBeenNthCalledWith(2, { owner });
      expect(mockKitchenQuery.find).toHaveBeenNthCalledWith(3, { createdAt });

      // Membership filtering
      expect(getMembersByUserIdSpy).toHaveBeenCalledWith(viewingUserId);
      expect(membershipSelect).toHaveBeenCalledWith('kitchenId');
      expect(mockKitchenQuery.find).toHaveBeenNthCalledWith(4, {
        _id: { $in: ['k1', 'k2'] },
      });

      // populate owner in the final query
      expect(mockKitchenQuery.populate).toHaveBeenCalledWith('owner');

      // getKitchen returns the final query
      expect(result).toBe(mockKitchenQuery);
    });
  });

  describe('findKitchenById', () => {
    it('finds kitchen by id and populates inventories and owner', () => {
      const kitchenId = 'kitchen-id';
      const populate = jest.fn().mockReturnThis();
      const mockQuery = { populate };

      const findByIdSpy = jest
        .spyOn(Kitchen, 'findById')
        .mockReturnValue(mockQuery);

      const result = findKitchenById(kitchenId);

      expect(findByIdSpy).toHaveBeenCalledWith(kitchenId);
      // first populate: inventories (without items)
      expect(populate).toHaveBeenNthCalledWith(1, {
        path: 'inventories',
        select: '-items',
      });
      // second populate: owner
      expect(populate).toHaveBeenNthCalledWith(2, 'owner');

      expect(result).toBe(mockQuery);
    });
  });

  describe('addKitchen', () => {
    it('creates a kitchen, creates an admin membership, and updates kitchen memberships', async () => {
      const kitchenData = {
        name: 'My Kitchen',
        owner: 'owner-id',
      };

      const savedKitchen = {
        _id: 'kitchen-id',
        ...kitchenData,
      };

      const savedMembership = {
        _id: 'membership-id',
        userId: kitchenData.owner,
        kitchenId: savedKitchen._id,
        role: 'owner',
        permissions: [],
        createdBy: kitchenData.owner,
      };

      // Save on kitchen model instance
      const kitchenSaveSpy = jest
        .spyOn(Kitchen.prototype, 'save')
        .mockResolvedValue(savedKitchen);

      // Save on membership model instance
      const membershipSaveSpy = jest
        .spyOn(Membership.prototype, 'save')
        .mockResolvedValue(savedMembership);

      // Final update of kitchen with membership id
      const updatedKitchen = {
        ...savedKitchen,
        memberships: [savedMembership._id],
      };
      const findByIdAndUpdateSpy = jest
        .spyOn(Kitchen, 'findByIdAndUpdate')
        .mockResolvedValue(updatedKitchen);

      const result = await addKitchen(kitchenData);

      expect(kitchenSaveSpy).toHaveBeenCalledTimes(1);
      expect(membershipSaveSpy).toHaveBeenCalledTimes(1);
      expect(membershipSaveSpy.mock.calls[0][0]).toBeUndefined(); // called as method on instance

      expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(
        savedKitchen._id,
        { $push: { memberships: savedMembership._id } },
        { new: true }
      );

      expect(result).toBe(updatedKitchen);
    });
  });

  describe('deleteKitchenById', () => {
    it('deletes related inventories, memberships, and the kitchen', async () => {
      const kitchenId = 'kitchen-id';

      const kitchenDoc = {
        _id: kitchenId,
        inventories: ['inv1', 'inv2'],
        memberships: ['mem1', 'mem2'],
      };

      const findByIdSpy = jest
        .spyOn(Kitchen, 'findById')
        .mockResolvedValue(kitchenDoc);

      const inventoryDeleteSpy = jest
        .spyOn(Inventory, 'deleteMany')
        .mockResolvedValue({ deletedCount: 2 });

      const membershipDeleteSpy = jest
        .spyOn(Membership, 'deleteMany')
        .mockResolvedValue({ deletedCount: 2 });

      const kitchenDeleteSpy = jest
        .spyOn(Kitchen, 'deleteOne')
        .mockResolvedValue({ deletedCount: 1 });

      const result = await deleteKitchenById(kitchenId);

      expect(findByIdSpy).toHaveBeenCalledWith(kitchenId);
      expect(inventoryDeleteSpy).toHaveBeenCalledWith({
        _id: { $in: ['inv1', 'inv2'] },
      });
      expect(membershipDeleteSpy).toHaveBeenCalledWith({
        _id: { $in: ['mem1', 'mem2'] },
      });
      expect(kitchenDeleteSpy).toHaveBeenCalledWith({ _id: kitchenId });

      expect(result).toEqual({ deletedCount: 1 });
    });

    it('throws an error if kitchen is not found', async () => {
      const kitchenId = 'missing-kitchen';

      jest.spyOn(Kitchen, 'findById').mockResolvedValue(null);

      const inventoryDeleteSpy = jest.spyOn(Inventory, 'deleteMany');
      const membershipDeleteSpy = jest.spyOn(Membership, 'deleteMany');
      const kitchenDeleteSpy = jest.spyOn(Kitchen, 'deleteOne');

      await expect(deleteKitchenById(kitchenId)).rejects.toThrow(
        'Kitchen not found'
      );

      expect(inventoryDeleteSpy).not.toHaveBeenCalled();
      expect(membershipDeleteSpy).not.toHaveBeenCalled();
      expect(kitchenDeleteSpy).not.toHaveBeenCalled();
    });
  });

  describe('addInventoryToKitchen', () => {
    it('pushes an inventory into the kitchen inventories array', async () => {
      const kitchenId = 'kitchen-id';
      const inventoryId = 'inventory-id';

      const updatedKitchen = {
        _id: kitchenId,
        inventories: [inventoryId],
      };

      const updateSpy = jest
        .spyOn(Kitchen, 'findByIdAndUpdate')
        .mockResolvedValue(updatedKitchen);

      const result = await addInventoryToKitchen(kitchenId, inventoryId);

      expect(updateSpy).toHaveBeenCalledWith(
        kitchenId,
        { $push: { inventories: inventoryId } },
        { new: true }
      );
      expect(result).toBe(updatedKitchen);
    });
  });

  describe('removeInventoryFromKitchen', () => {
    it('pulls an inventory from the kitchen inventories array', async () => {
      const kitchenId = 'kitchen-id';
      const inventoryId = 'inventory-id';

      const updatedKitchen = {
        _id: kitchenId,
        inventories: [],
      };

      const updateSpy = jest
        .spyOn(Kitchen, 'findByIdAndUpdate')
        .mockResolvedValue(updatedKitchen);

      const result = await removeInventoryFromKitchen(kitchenId, inventoryId);

      expect(updateSpy).toHaveBeenCalledWith(
        kitchenId,
        { $pull: { inventories: inventoryId } },
        { new: true }
      );
      expect(result).toBe(updatedKitchen);
    });
  });
});
