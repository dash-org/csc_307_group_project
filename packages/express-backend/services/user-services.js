import userModel from '../schemas/user.js';
import memberModel from '../schemas/member.js';

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

function deleteUserById(id) {
  return memberModel
    .deleteMany({ userId: id })
    .then(() => userModel.deleteOne({ _id: id }));
}

export default {
  addUser,
  getUsers,
  findUserById,
  deleteUserById,
};
