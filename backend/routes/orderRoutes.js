const express = require("express");
const router = express.Router();
const { placeOrder, getUserOrders, updateOrderStatus } = require("../controllers/orderController");
const { verifyToken, authorizeRoles } = require("../middleware/auth");

router.post("/", verifyToken, placeOrder);

router.get("/", verifyToken, getUserOrders);

router.put("/:id/status", verifyToken, authorizeRoles("admin", "manager"), updateOrderStatus);

module.exports = router;
