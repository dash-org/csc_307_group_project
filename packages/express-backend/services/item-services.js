import itemModel from '../schemas/item.js';

function getItems(name, quantity, description, tags, createdAt, createdBy) {
  let promise = itemModel.find();

  if (name) {
    promise = promise.find({ name: name });
  }
  if (quantity) {
    promise = promise.find({ quantity: quantity });
  }
  if (description) {
    promise = promise.find({ description: description });
  }
  if (tags) {
    promise = promise.find({ tags: { $all: tags } });
  }
  if (createdAt) {
    promise = promise.find({ createdAt: createdAt });
  }
  if (createdBy) {
    promise = promise.find({ createdBy: createdBy });
  }

  return promise;
}

function findItemById(id) {
  return itemModel.findById(id);
}

function addItem(item) {
  const itemToAdd = new itemModel(item);
  const promise = itemToAdd.save();
  return promise;
}

function deleteItemById(id) {
  return itemModel.deleteOne({ _id: id });
}

export default {
  addItem: addItem,
  getItems: getItems,
  findItemById: findItemById,
  deleteItemById: deleteItemById,
};
