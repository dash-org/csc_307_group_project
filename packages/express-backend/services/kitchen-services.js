import kitchenModel from '../schemas/kitchen.js';
import inventoryModel from '../schemas/inventory.js';
import memberModel from '../schemas/membership.js';
import memberServices from './member-services.js';

function getKitchen(name, owner, createdAt, viewingUser) {
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

  promise = filterAccecibleKitchens(promise, viewingUser);

  return promise;
}

async function filterAccecibleKitchens(promise, viewingUser) {
  const validMemberships = await memberServices
    .getMembersByUserId(viewingUser)
    .select('kitchenId');
  const kitchenIds = validMemberships.map((m) => m.kitchenId);

  return promise.find({ _id: { $in: kitchenIds } }).populate('owner');
}

function findKitchenById(id) {
  return kitchenModel
    .findById(id)
    .populate({
      path: 'inventories',
      select: '-items',
    })
    .populate('owner');
}

// Set the creater (from the token) to be the kitchen owner, both in kitchen schema and membership
function addKitchen(kitchen) {
  const kitchenToAdd = new kitchenModel(kitchen);
  let savedKitchen;

  return kitchenToAdd
    .save()
    .then((kitchen) => {
      savedKitchen = kitchen;

      const adminMembership = new memberModel({
        userId: kitchen.owner,
        kitchenId: kitchen._id,
        role: 'owner',
        permissions: [],
        createdBy: kitchen.owner,
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

// When deleting a kitchen also delete relevant inventories and memberships
function deleteKitchenById(id) {
  return kitchenModel.findById(id).then((kitchen) => {
    if (!kitchen) {
      throw new Error('Kitchen not found');
    }

    const inventoryIds = kitchen.inventories;
    const membershipIds = kitchen.memberships;

    return inventoryModel
      .deleteMany({ _id: { $in: inventoryIds } })
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
