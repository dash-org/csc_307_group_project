/**
 * Item Schema
 * ------------
 * Represents an individual item embedded within an inventory.
 *
 * Fields:
 * - name: required string, item name
 * - quantity: number, defaults to 1
 * - description: optional string
 * - tags: array of strings, defaults to empty
 * - createdAt: date, auto-filled on creation
 * - createdBy: ObjectId referencing a User
 *
 * Notes:
 * - This schema is designed to be an embedded subdocument within an Inventory.
 */

import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  description: { type: String },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export const Item = mongoose.model('Item', itemSchema);
