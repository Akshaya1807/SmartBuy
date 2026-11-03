const express = require("express");
const router = express.Router();

const {
    addPriceHistory,
    getPriceHistory
} = require("../controllers/PriceHistoryController");

const protect = require("../middleware/authMiddleware");

// Record a new price
router.post("/:productId", protect, addPriceHistory);

// Get price history
router.get("/:productId", protect, getPriceHistory);

module.exports = router;