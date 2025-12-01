import userModel from '../schemas/user.js';
import memberModel from '../schemas/membership.js';
import kitchenServices from '../schemas/kitchen.js';

function getUsers(name, createdAt) {
  let promise = userModel.find();

  if (name) {
    promise = promise.find({ name: name });
  }
  if (createdAt) {
    promise = promise.find({ createdAt: createdAt });
  }

  return promise;
}

function findUserById(id) {
  return userModel.findById(id);
}

function addUser(user) {
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
}

// Deleting a user will also delete any kitchens they own and all of their memberships
function deleteUserById(id) {
  return memberModel
    .find({ userId: id, role: 'owner' })
    .then((ownerMemberships) => {
      // Delete all kitchens where user is owner
      const kitchenDeletePromises = ownerMemberships.map((membership) =>
        kitchenServices.deleteKitchenById(membership.kitchenId)
      );
      return Promise.all(kitchenDeletePromises);
    })
    .then(() => {
      // Delete all remaining memberships for this user
      return memberModel.deleteMany({ userId: id });
    })
    .then(() => {
      // Finally delete the user
      return userModel.deleteOne({ _id: id });
    });
}

export default {
  addUser,
  getUsers,
  findUserById,
  deleteUserById,
};
