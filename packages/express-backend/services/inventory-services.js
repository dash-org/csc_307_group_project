import inventoryModel from '../schemas/inventory.js';

function getInventory(name, createdBy, createdAt, items) {
  let promise = inventoryModel.find();

  if (name) {
    promise = promise.find({ name: name });
  }
  if (createdBy) {
    promise = promise.find({ createdBy: createdBy });
  }
  if (createdAt) {
    promise = promise.find({ createdAt: createdAt });
  }
  if (items) {
    promise = promise.find({ items: { $all: items } });
  }

  return promise;
}

function findInventoryById(id) {
  return inventoryModel.findById(id).populate('items').populate('createdBy');
}

function addInventory(inventory) {
  const inventoryToAdd = new inventoryModel(inventory);
  const promise = inventoryToAdd.save();
  return promise;
}

function deleteInventoryById(id) {
  return inventoryModel.deleteOne({ _id: id });
}

function addItemToInventory(inventoryId, item) {
  return inventoryModel.findByIdAndUpdate(
    inventoryId,
    { $push: { items: item } },
    { new: true }
  );
}

function removeItemFromInventory(inventoryId, itemId) {
  return inventoryModel.findByIdAndUpdate(
    inventoryId,
    { $pull: { items: { _id: itemId } } },
    { new: true }
  );
}

export default {
  addInventory,
  getInventory,
  findInventoryById,
  deleteInventoryById,
  addItemToInventory,
  removeItemFromInventory,
};
