// packages/jest-unit-testing/express-backend-testing/item-services.test.js

import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import Item from '../../express-backend/schemas/item.js';
import itemServices from '../../express-backend/services/item-services.js';

const { addItem, getItems, findItemById, deleteItemById } = itemServices;

describe('item-services', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('getItems', () => {
    it('returns all items when no filters are provided', () => {
      const mockQuery = { find: jest.fn().mockReturnThis() };

      const findSpy = jest.spyOn(Item, 'find').mockReturnValue(mockQuery);

      const result = getItems(); // no filters

      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith(); // called with no args
      expect(mockQuery.find).not.toHaveBeenCalled(); // no chained filters
      expect(result).toBe(mockQuery);
    });

    it('applies filters when provided', () => {
      const mockQuery = { find: jest.fn().mockReturnThis() };

      const findSpy = jest.spyOn(Item, 'find').mockReturnValue(mockQuery);

      const name = 'Pasta';
      const quantity = 5;
      const description = 'Dry pasta in a box';
      const tags = ['dry', 'pasta', 'pantry'];
      const createdAt = new Date('2024-01-01');
      const createdBy = 'user-id';

      const result = getItems(
        name,
        quantity,
        description,
        tags,
        createdAt,
        createdBy
      );

      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(findSpy).toHaveBeenCalledWith();

      // chained .find calls on query
      expect(mockQuery.find).toHaveBeenNthCalledWith(1, { name });
      expect(mockQuery.find).toHaveBeenNthCalledWith(2, { quantity });
      expect(mockQuery.find).toHaveBeenNthCalledWith(3, { description });
      expect(mockQuery.find).toHaveBeenNthCalledWith(4, {
        tags: { $all: tags },
      });
      expect(mockQuery.find).toHaveBeenNthCalledWith(5, { createdAt });
      expect(mockQuery.find).toHaveBeenNthCalledWith(6, { createdBy });

      expect(result).toBe(mockQuery);
    });
  });

  describe('findItemById', () => {
    it('finds item by id', () => {
      const id = 'item-id';
      const mockQuery = { some: 'query' };

      const findByIdSpy = jest
        .spyOn(Item, 'findById')
        .mockReturnValue(mockQuery);

      const result = findItemById(id);

      expect(findByIdSpy).toHaveBeenCalledWith(id);
      expect(result).toBe(mockQuery);
    });
  });

  describe('addItem', () => {
    it('creates a new item and calls save', async () => {
      const itemData = {
        name: 'Pasta',
        quantity: 5,
        description: 'Dry pasta',
        tags: ['pantry'],
        createdBy: 'user-id',
      };

      const savedItem = { _id: '123', ...itemData };

      const saveSpy = jest
        .spyOn(Item.prototype, 'save')
        .mockResolvedValue(savedItem);

      const result = await addItem(itemData);

      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(result).toBe(savedItem);
    });
  });

  describe('deleteItemById', () => {
    it('deletes item by id', async () => {
      const id = 'item-id';
      const deleteResult = { deletedCount: 1 };

      const deleteSpy = jest
        .spyOn(Item, 'deleteOne')
        .mockResolvedValue(deleteResult);

      const result = await deleteItemById(id);

      expect(deleteSpy).toHaveBeenCalledWith({ _id: id });
      expect(result).toBe(deleteResult);
    });
  });
});
