import memberModel from '../schemas/membership.js';

function getMembers(userId, role, permissions, addedAt) {
  let promise = memberModel.find();

  if (userId) {
    promise = promise.find({ userId: userId });
  }
  if (role) {
    promise = promise.find({ role: role });
  }
  if (permissions) {
    promise = promise.find({ permissions: { $all: permissions } });
  }
  if (addedAt) {
    promise = promise.find({ addedAt: addedAt });
  }

  return promise;
}

function findMemberById(id) {
  return memberModel.findById(id);
}

function addMember(member) {
  const memberToAdd = new memberModel(member);
  const promise = memberToAdd.save();
  return promise;
}

function deleteMemberById(id) {
  return memberModel.deleteOne({ _id: id });
}

export default {
  addMember,
  getMembers,
  findMemberById,
  deleteMemberById,
};
