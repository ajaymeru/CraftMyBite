const Order = require("../models/Order");
const Menu = require("../models/Menu");
const Cart = require("../models/Cart");

exports.placeOrder = async (req, res) => {
    try {
      const userId = req.user.id;
      let cart = await Cart.findOne({ user: userId });
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }
  
      let totalAmount = 0;
      for (const cartItem of cart.items) {
        const menuItem = await Menu.findById(cartItem.menuItem);
        if (!menuItem) {
          return res.status(404).json({ error: `Menu item not found: ${cartItem.menuItem}` });
        }
        totalAmount += menuItem.price * cartItem.quantity;
      }
  
      const order = new Order({
        user: userId,
        items: cart.items,
        totalAmount,
        status: "Pending",
      });
      await order.save();
  
      cart.items = [];
      await cart.save();
  
      res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

exports.getUserOrders = async (req, res) => {
    try {
        let orders;
        if (req.user.role === "admin" || req.user.role === "manager") {
            orders = await Order.find()
                .populate("user", "username")
                .populate("items.menuItem");
        } else {
            orders = await Order.find({ user: req.user.id }).populate("items.menuItem");
        }
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["Pending", "Completed"].includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.status(200).json({ message: "Order status updated successfully", order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
