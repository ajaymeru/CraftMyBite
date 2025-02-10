const express = require("express");
const router = express.Router();
const multer = require("multer");
const { getAllMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, getCart, updateCartItem } = require("../controllers/menuController");
const { verifyToken, authorizeRoles } = require("../middleware/auth");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", verifyToken, getAllMenuItems);
router.get("/cart", verifyToken, getCart);
router.patch("/cart", verifyToken, updateCartItem);

router.post("/", verifyToken, authorizeRoles("admin"), upload.single("imageUrl"), createMenuItem);

router.patch("/:id", verifyToken, authorizeRoles("admin", "manager"), upload.single("imageUrl"), updateMenuItem);

router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteMenuItem);



module.exports = router;
