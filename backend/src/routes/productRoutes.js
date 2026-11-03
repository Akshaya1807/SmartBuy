const express = require("express");
const router = express.Router();

const {
    addProduct,
    getProducts,
    updateTargetPrice,
    deleteProduct
} = require("../controllers/productController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, addProduct);
router.get("/", protect, getProducts);
router.patch("/:id", protect, updateTargetPrice);
router.delete("/:id", protect, deleteProduct);
module.exports = router;