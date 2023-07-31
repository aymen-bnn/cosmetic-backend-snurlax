
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cartItemSchema = new Schema({
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  });
  
  const cartSchema = new Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [cartItemSchema],
  });
  
  module.exports = mongoose.model('Cart', cartSchema);