// packages/jest-unit-testing/express-backend-testing/inventory-services.test.js

import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import Inventory from '../../express-backend/schemas/inventory.js';
import inventoryServices from '../../express-backend/services/inventory-services.js';

// pull the service functions off the default export
const {
  addInventory,
  getInventory,
  findInventoryById,
  deleteInventoryById,
  addItemToInventory,
  removeItemFromInventory,
} = inventoryServices;

// Mock the Inventory model
jest.mock('../../express-backend/schemas/inventory.js');

describe('inventory-services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getInventory', () => {
    it('returns all inventories when no filters are provided', () => {
      const mockQuery = { find: jest.fn().mockReturnThis() };
      // Inventory.find() is called first in getInventory
      Inventory.find.mockReturnValue(mockQuery);

      const result = getInventory();

      expect(Inventory.find).toHaveBeenCalledTimes(1);
      // called with no arguments
      expect(Inventory.find).toHaveBeenCalledWith();
      // no chained filters when no args are passed
      expect(mockQuery.find).not.toHaveBeenCalled();
      expect(result).toBe(mockQuery);
    });

    it('applies filters when provided', () => {
      const mockQuery = { find: jest.fn().mockReturnThis() };
      Inventory.find.mockReturnValue(mockQuery);

      const name = 'Pantry';
      const createdBy = 'user-id';
      const createdAt = new Date('2024-01-01');
      const items = ['item1-id', 'item2-id'];

      const result = getInventory(name, createdBy, createdAt, items);

      expect(Inventory.find).toHaveBeenCalledTimes(1);
      expect(Inventory.find).toHaveBeenCalledWith();

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
      const id = 'inventory-id';

      Inventory.findById.mockReturnValue(mockQuery);

      const result = findInventoryById(id);

      expect(Inventory.findById).toHaveBeenCalledWith(id);
      expect(populate).toHaveBeenNthCalledWith(1, 'items');
      expect(populate).toHaveBeenNthCalledWith(2, 'createdBy');
      expect(result).toBe(mockQuery);
    });
  });

  describe('addInventory', () => {
    it('creates a new inventory and calls save', async () => {
      const inventoryData = { name: 'Pantry', createdBy: 'user-id' };
      const savedInventory = { _id: '123', ...inventoryData };

      const saveMock = jest.fn().mockResolvedValue(savedInventory);

      // Inventory is a mocked constructor because of jest.mock above
      Inventory.mockImplementation((doc) => ({
        ...doc,
        save: saveMock,
      }));

      const result = await addInventory(inventoryData);

      expect(Inventory).toHaveBeenCalledTimes(1);
      expect(Inventory).toHaveBeenCalledWith(inventoryData);
      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(result).toBe(savedInventory);
    });
  });

  describe('deleteInventoryById', () => {
    it('deletes inventory by id', async () => {
      const id = 'inventory-id';
      const deleteResult = { deletedCount: 1 };
      Inventory.deleteOne.mockResolvedValue(deleteResult);

      const result = await deleteInventoryById(id);

      expect(Inventory.deleteOne).toHaveBeenCalledWith({ _id: id });
      expect(result).toBe(deleteResult);
    });
  });

  describe('addItemToInventory', () => {
    it('pushes an item into the inventory items array', async () => {
      const inventoryId = 'inventory-id';
      const item = 'item-id';
      const updatedInventory = { _id: inventoryId, items: [item] };

      Inventory.findByIdAndUpdate.mockResolvedValue(updatedInventory);

      const result = await addItemToInventory(inventoryId, item);

      expect(Inventory.findByIdAndUpdate).toHaveBeenCalledWith(
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

      Inventory.findByIdAndUpdate.mockResolvedValue(updatedInventory);

      const result = await removeItemFromInventory(inventoryId, itemId);

      expect(Inventory.findByIdAndUpdate).toHaveBeenCalledWith(
        inventoryId,
        { $pull: { items: { _id: itemId } } },
        { new: true }
      );
      expect(result).toBe(updatedInventory);
    });
  });
});
