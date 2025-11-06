/**
 * Kitchen Schema
 * --------------
 * Represents a kitchen that groups multiple inventories and manages
 * access via memberships.
 *
 * Fields:
 * - name: required string, name of the kitchen
 * - owner: ObjectId referencing the User who owns the kitchen (required)
 * - inventories: array of ObjectIds referencing Inventory documents
 * - memberships: array of ObjectIds referencing Membership documents
 * - createdAt: date, auto-filled on creation
 *
 * Notes:
 * - A Kitchen acts as a container for multiple inventories.
 * - Ownership defines who can manage inventories and memberships.
 * - Memberships control user access and permissions per inventory.
 */

import mongoose from 'mongoose';

const kitchenSchema = new mongoose.Schema({
  name: { type: String, required: true },

  owner: { // equivalent to createdBy
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  inventories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory',
    },
  ],

  memberships: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Membership',
    },
  ],

  createdAt: { type: Date, default: Date.now },
});

const Kitchen = mongoose.model('Kitchen', kitchenSchema);
export default Kitchen;
