const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    name: {
        type: String,
        required: true
    },

    productUrl: {
        type: String,
        required: true
    },
platform: {
    type: String,
    enum: ["amazon", "flipkart", "myntra"],
    required: true
},
    currentPrice: {
        type: Number,
        required: true
    },

    targetPrice: {
        type: Number,
        required: true
    },

    imageUrl: {
        type: String
    },

    isActive: {
        type: Boolean,
        default: true
    },
alertSentAt: {
    type: Date,
    default: null
},
lastCheckedAt: {
    type: Date,
    default: null
}
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);