import kitchenModel from '../schemas/kitchen.js';

function getKitchen(name, owner, createdAt, inventories, memberships) {
  let promise = kitchenModel.find();

  if (name) {
    promise = promise.find({ name });
  }
  if (owner) {
    promise = promise.find({ owner });
  }
  if (createdAt) {
    promise = promise.find({ createdAt });
  }
  if (inventories && inventories.length > 0) {
    promise = promise.find({ inventories: { $all: inventories } });
  }
  if (memberships && memberships.length > 0) {
    promise = promise.find({ memberships: { $all: memberships } });
  }

  return promise;
}

function findKitchenById(id) {
  return kitchenModel
    .findById(id)
    .populate('inventories')
    .populate('memberships')
    .populate('owner');
}

function addKitchen(kitchen) {
  const kitchenToAdd = new kitchenModel(kitchen);
  return kitchenToAdd.save();
}

function deleteKitchenById(id) {
  return kitchenModel.deleteOne({ _id: id });
}

export default {
  getKitchen,
  findKitchenById,
  addKitchen,
  deleteKitchenById,
};
