
const PriceHistory = require("../models/PriceHistory");
const Product = require("../models/Product");

// Save a price record
const addPriceHistory = async (req, res) => {
    try {
        const { price } = req.body;
        const { productId } = req.params;

        if (
            price === undefined ||
            price === null ||
            price === "" ||
            !Number.isFinite(Number(price)) ||
            Number(price) <= 0
        ) {
            return res.status(400).json({
                message: "Please provide a valid price greater than zero"
            });
        }

        // Check that the product belongs to the logged-in user
        const product = await Product.findOne({
            _id: productId,
            userId: req.user.userId
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Check the most recent recorded price
const lastRecord = await PriceHistory.findOne({
    productId,
    userId: req.user.userId
}).sort({ recordedAt: -1 });

// Save history only if the price has changed
let history = null;

if (!lastRecord || lastRecord.price !== Number(price)) {
    history = await PriceHistory.create({
        productId,
        userId: req.user.userId,
        price: Number(price)
    });
}

// Always update the product's current price
product.currentPrice = Number(price);
await product.save();

       res.status(history ? 201 : 200).json({
    message: history
        ? "Price history recorded successfully"
        : "Price unchanged. No new history record created.",
    history
});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get price history for a product
const getPriceHistory = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findOne({
            _id: productId,
            userId: req.user.userId
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const history = await PriceHistory.find({
            productId,
            userId: req.user.userId
        }).sort({ recordedAt: 1 });

        res.status(200).json({
            count: history.length,
            history
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addPriceHistory,
    getPriceHistory
};
