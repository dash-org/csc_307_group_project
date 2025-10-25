/**
 * Inventory Schema
 * ----------------
 * Represents an inventory container that holds multiple items.
 * Each inventory is created by a user and embeds an array of Item documents.
 *
 * Fields:
 * - name: required string, inventory name
 * - createdBy: ObjectId referencing a User, required
 * - createdAt: date, auto-filled on creation
 * - items: array of embedded Item subdocuments, defaults to empty
 *
 * Notes:
 * - Embedding items allows for fast retrieval of inventory and its contents.
 * - If item lists grow large or require frequent updates, a referenced design
 *   may be preferred (linking items by ID instead of embedding).
 */

import mongoose from 'mongoose';
import { itemSchema } from './item.js';

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  items: { type: [itemSchema], default: [] },
});

const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory;
