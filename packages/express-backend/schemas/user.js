/**
 * User Schema
 * ------------
 * Represents an individual user within the system.
 * Each user can create inventories and items, and can be associated
 * with multiple inventories through memberships.
 *
 * Fields:
 * - name: required string, the user's display name
 * - email: required string, unique identifier for login or contact
 * - createdAt: date, auto-filled when the user is created
 *
 * Notes:
 * - The unique constraint on 'email' ensures no duplicate user accounts.
 * - Other schemas (Inventory, Item, Membership) reference users through their _id.
 */

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model('User', userSchema);
export default User;
