
const mongoose = require("mongoose");

const priceHistorySchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    recordedAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("PriceHistory", priceHistorySchema);
