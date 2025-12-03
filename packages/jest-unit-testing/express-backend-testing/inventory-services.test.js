// packages/jest-unit-testing/express-backend-testing/inventory-services.test.js

import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import Inventory from '../../express-backend/schemas/inventory.js';
import inventoryServices from '../../express-backend/services/inventory-services.js';

const {
  addInventory,
  getInventory,
  findInventoryById,
  deleteInventoryById,
  addItemToInventory,
  removeItemFromInventory,
} = inventoryServices;

describe('inventory-services', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('getInventory', () => {
    it('returns all inventories when no filters are provided', () => {
      const mockQuery = { find: jest.fn().mockReturnThis() };

      // 👇 spy on Inventory.find instead of treating it as a mock object
      const findSpy = jest.spyOn(Inventory, 'find').mockReturnValue(mockQuery);

      const result = getInventory();

      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith(); // no args
      expect(mockQuery.find).not.toHaveBeenCalled(); // no chained filters
      expect(result).toBe(mockQuery);
    });

    it('applies filters when provided', () => {
      const mockQuery = { find: jest.fn().mockReturnThis() };
      const findSpy = jest.spyOn(Inventory, 'find').mockReturnValue(mockQuery);

      const name = 'Pantry';
      const createdBy = 'user-id';
      const createdAt = new Date('2024-01-01');
      const items = ['item1-id', 'item2-id'];

      const result = getInventory(name, createdBy, createdAt, items);

      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith();

      expect(mockQuery.find).toHaveBeenNthCalledWith(1, { name });
      expect(mockQuery.find).toHaveBeenNthCalledWith(2, { createdBy });
      expect(mockQuery.find).toHaveBeenNthCalledWith(3, { createdAt });
      expect(mockQuery.find).toHaveBeenNthCalledWith(4, {
        items: { $all: items },
      });

      expect(result).toBe(mockQuery);
    });
  });

  describe('findInventoryById', () => {
    it('finds inventory by id and populates items and createdBy', () => {
      const populate = jest.fn().mockReturnThis();
      const mockQuery = { populate };

      const findByIdSpy = jest
        .spyOn(Inventory, 'findById')
        .mockReturnValue(mockQuery);

      const id = 'inventory-id';
      const result = findInventoryById(id);

      expect(findByIdSpy).toHaveBeenCalledWith(id);
      expect(populate).toHaveBeenNthCalledWith(1, 'items');
      expect(populate).toHaveBeenNthCalledWith(2, 'createdBy');
      expect(result).toBe(mockQuery);
    });
  });

  describe('addInventory', () => {
    it('creates a new inventory and calls save', async () => {
      const inventoryData = { name: 'Pantry', createdBy: 'user-id' };
      const savedInventory = { _id: '123', ...inventoryData };

      // 👇 stub the instance method on the model prototype
      const saveSpy = jest
        .spyOn(Inventory.prototype, 'save')
        .mockResolvedValue(savedInventory);

      const result = await addInventory(inventoryData);

      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(result).toBe(savedInventory);
    });
  });

  describe('deleteInventoryById', () => {
    it('deletes inventory by id', async () => {
      const id = 'inventory-id';
      const deleteResult = { deletedCount: 1 };

      const deleteSpy = jest
        .spyOn(Inventory, 'deleteOne')
        .mockResolvedValue(deleteResult);

      const result = await deleteInventoryById(id);

      expect(deleteSpy).toHaveBeenCalledWith({ _id: id });
      expect(result).toBe(deleteResult);
    });
  });

  describe('addItemToInventory', () => {
    it('pushes an item into the inventory items array', async () => {
      const inventoryId = 'inventory-id';
      const item = 'item-id';
      const updatedInventory = { _id: inventoryId, items: [item] };

      const updateSpy = jest
        .spyOn(Inventory, 'findByIdAndUpdate')
        .mockResolvedValue(updatedInventory);

      const result = await addItemToInventory(inventoryId, item);

      expect(updateSpy).toHaveBeenCalledWith(
        inventoryId,
        { $push: { items: item } },
        { new: true }
      );
      expect(result).toBe(updatedInventory);
    });
  });

  describe('removeItemFromInventory', () => {
    it('pulls an item from the inventory items array', async () => {
      const inventoryId = 'inventory-id';
      const itemId = 'item-id';
      const updatedInventory = { _id: inventoryId, items: [] };

      const updateSpy = jest
        .spyOn(Inventory, 'findByIdAndUpdate')
        .mockResolvedValue(updatedInventory);

      const result = await removeItemFromInventory(inventoryId, itemId);

      expect(updateSpy).toHaveBeenCalledWith(
        inventoryId,
        { $pull: { items: { _id: itemId } } },
        { new: true }
      );
      expect(result).toBe(updatedInventory);
    });
  });
});
