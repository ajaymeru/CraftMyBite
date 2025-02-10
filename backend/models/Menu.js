const mongoose = require('mongoose');
const { Schema } = mongoose;

const menuSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Menu item name is required']
  },
  category: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  availability: {
    type: Boolean,
    default: true
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);
