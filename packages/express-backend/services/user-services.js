import userModel from '../schemas/user.js';

function getUsers(name, email, createdAt) {
  let promise = userModel.find();

  if (name) {
    promise = promise.find({ name: name });
  }
  if (email) {
    promise = promise.find({ email: email });
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
  return userModel.deleteOne({ _id: id });
}

export default {
  addUser,
  getUsers,
  findUserById,
  deleteUserById,
};
