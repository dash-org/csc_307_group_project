/**
 * Membership Schema
 * -----------------
 * Represents a user's membership in an inventory, including their role and permissions.
 * Establishes a many-to-many relationship between Users and Inventories.
 *
 * Fields:
 * - inventoryId: ObjectId referencing an Inventory, required
 * - userId: ObjectId referencing a User, required
 * - role: string, required, one of ['owner', 'editor', 'viewer']
 * - permissions: array of strings, defaults to empty; validated per role
 * - addedAt: date, auto-filled on creation
 *
 * Constraints:
 * - Compound unique index on (inventoryId, userId) ensures one membership per user per inventory.
 * - Role-based permission validation ensures only allowed permissions per role.
 */

import mongoose from 'mongoose';

const allowedPermissions = {
  admin: ['items:read', 'items:write', 'inventories:manage', 'members:manage'],
  editor: ['items:read', 'items:write'],
  viewer: ['items:read'],
};

const membershipSchema = new mongoose.Schema({
  inventoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Kitchen',
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['admin', 'editor', 'viewer'], required: true },
  permissions: {
    type: [String],
    default: [],
    validate: {
      validator: function (permissions) {
        const allowed = allowedPermissions[this.role] || [];
        return permissions.every((p) => allowed.includes(p));
      },
      message: (props) =>
        `Invalid permissions for role '${props.value}'. Check allowed permissions.`,
    },
  },
  addedAt: { type: Date, default: Date.now },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

membershipSchema.index({ inventoryId: 1, userId: 1 }, { unique: true });

const Membership = mongoose.model('Membership', membershipSchema);
export default Membership;
