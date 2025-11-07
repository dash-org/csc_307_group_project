import kitchenModel from '../schemas/kitchen.js';
import inventoryModel from '../schemas/inventory.js';
import memberModel from '../schemas/member.js';

function getKitchen(name, owner, createdAt) {
  let promise = kitchenModel.find().select('-inventories');

  if (name) {
    promise = promise.find({ name });
  }
  if (owner) {
    promise = promise.find({ owner });
  }
  if (createdAt) {
    promise = promise.find({ createdAt });
  }

  return promise;
}

function findKitchenById(id) {
  return kitchenModel
    .findById(id)
    .populate({
      path: 'inventories',
      select: '-items', // exclude the 'items' field
    })
    .populate('owner');
}

function addKitchen(kitchen) {
  const kitchenToAdd = new kitchenModel(kitchen);
  let savedKitchen;
  
  return kitchenToAdd.save()
    .then((kitchen) => {
      savedKitchen = kitchen;
      
      const adminMembership = new memberModel({
        userId: kitchen.owner,
        kitchenId: kitchen._id,
        role: 'admin',
        permissions: []
      });
      
      return adminMembership.save();
    })
    .then((membership) => {
      return kitchenModel.findByIdAndUpdate(
        savedKitchen._id,
        { $push: { memberships: membership._id } },
        { new: true }
      );
    });
}

function deleteKitchenById(id) {
  return kitchenModel.findById(id)
    .then((kitchen) => {
      if (!kitchen) {
        throw new Error('Kitchen not found');
      }
      
      const inventoryIds = kitchen.inventories;
      const membershipIds = kitchen.memberships;
      
      return inventoryModel.deleteMany({ _id: { $in: inventoryIds } })
        .then(() => memberModel.deleteMany({ _id: { $in: membershipIds } }))
        .then(() => kitchenModel.deleteOne({ _id: id }));
    });
}

function addInventoryToKitchen(kitchenId, inventoryId) {
  return kitchenModel.findByIdAndUpdate(
    kitchenId,
    { $push: { inventories: inventoryId } },
    { new: true }
  );
}

function removeInventoryFromKitchen(kitchenId, inventoryId) {
  return kitchenModel.findByIdAndUpdate(
    kitchenId,
    { $pull: { inventories: inventoryId } },
    { new: true }
  );
}

export default {
  getKitchen,
  findKitchenById,
  addKitchen,
  deleteKitchenById,
  addInventoryToKitchen,
  removeInventoryFromKitchen,
};
