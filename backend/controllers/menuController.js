const Menu = require("../models/Menu");
const Cart = require("../models/Cart");
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFromBuffer = (buffer, publicId) => {
  return new Promise((resolve, reject) => {
    const options = { folder: "CraftMyBite/menuitems", overwrite: true };
    if (publicId) {
      options.public_id = publicId;
    }
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    stream.end(buffer);
  });
};

exports.getAllMenuItems = async (req, res) => {
  try {
    const items = await Menu.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const { name, category, price, availability } = req.body;
    const newId = new mongoose.Types.ObjectId();
    let imageUrl = "https://via.placeholder.com/150";

    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer, newId.toString());
      imageUrl = result.secure_url;
    }

    const menuItem = new Menu({
      _id: newId,
      name,
      category,
      price,
      availability,
      imageUrl
    });
    await menuItem.save();
    res.status(201).json({ message: "Menu item created successfully", menuItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    if (req.file) {
      const result = await uploadFromBuffer(req.file.buffer, menuItem._id.toString());
      menuItem.imageUrl = result.secure_url;
    }

    menuItem.name = req.body.name || menuItem.name;
    menuItem.category = req.body.category || menuItem.category;
    menuItem.price = req.body.price || menuItem.price;
    if (req.body.availability !== undefined) {
      menuItem.availability = req.body.availability;
    }
    await menuItem.save();
    res.status(200).json({ message: "Menu item updated successfully", menuItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await Menu.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    await cloudinary.uploader.destroy(`CraftMyBite/menuitems/${menuItem._id}`);
    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ user: userId }).populate("items.menuItem");
    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ message: "Cart is empty", items: [] });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    let { menuItem, quantity } = req.body;

    if (!menuItem) {
      return res.status(400).json({ error: "Menu item id is required" });
    }

    menuItem = menuItem.toString();
    const menu = await Menu.findById(menuItem);
    if (!menu) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      item => item.menuItem.toString() === menuItem
    );

    if (existingIndex > -1) {
      if (quantity > 0) {
        cart.items[existingIndex].quantity = quantity;
      } else {
        cart.items.splice(existingIndex, 1);
      }
    } else {
      if (quantity > 0) {
        cart.items.push({ menuItem, quantity });
      }
    }

    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate("items.menuItem");
    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
