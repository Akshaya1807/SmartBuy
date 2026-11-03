const Product = require("../models/Product");
const PriceHistory = require("../models/PriceHistory");
const getPriceProvider = require("../services/providers/priceProviderManager");
// Add a new product
const addProduct = async (req, res) => {
    try {
        const { name, productUrl, targetPrice, imageUrl } = req.body;

        // Validate required fields
        if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof productUrl !== "string" ||
            !productUrl.trim()
        ) {
            return res.status(400).json({
                message: "Product name and URL are required"
            });
        }

        // Validate product URL
        let parsedUrl;

        try {
            parsedUrl = new URL(productUrl);
        } catch {
            return res.status(400).json({
                message: "Please enter a valid product URL"
            });
        }
const hostname = parsedUrl.hostname.toLowerCase();

let platform;

if (
    hostname === "amazon.in" ||
    hostname === "www.amazon.in"
) {
    platform = "amazon";
} else if (
    hostname === "flipkart.com" ||
    hostname === "www.flipkart.com"
) {
    platform = "flipkart";
} else if (
    hostname === "myntra.com" ||
    hostname === "www.myntra.com"
) {
    platform = "myntra";
} else {
    return res.status(400).json({
        message: "Currently, only Amazon, Flipkart and Myntra URLs are supported"
    });
}
      if (parsedUrl.protocol !== "https:") {
    return res.status(400).json({
        message: "Please use a secure HTTPS product URL"
    });
} 
const existingProduct = await Product.findOne({
    userId: req.user.userId,
    productUrl: parsedUrl.toString()
});

if (existingProduct) {
    return res.status(409).json({
        message: "This product is already in your watchlist"
    });
}
// Fetch current price from the product URL
const provider = getPriceProvider(platform);
const currentPrice = await provider.fetchPrice(parsedUrl.toString());

if (!Number.isFinite(currentPrice) || currentPrice <= 0) {
    return res.status(400).json({
        message: "Unable to fetch a valid price from this product URL"
    });
}
        // Validate target price
        if (
            targetPrice === undefined ||
            targetPrice === null ||
            targetPrice === "" ||
            !Number.isFinite(Number(targetPrice)) ||
            Number(targetPrice) <= 0
        ) {
            return res.status(400).json({
                message: "Target price must be greater than zero"
            });
        }

        const product = await Product.create({
            userId: req.user.userId,
            name: name.trim(),
            productUrl: parsedUrl.toString(),
            platform,
            currentPrice: Number(currentPrice),
            targetPrice: Number(targetPrice),
            imageUrl
        });
// Record the initial price in price history
await PriceHistory.create({
    productId: product._id,
    userId: req.user.userId,
    price: Number(currentPrice)
});
        res.status(201).json({
            message: "Product added successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Get all products belonging to the logged-in user
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({
            userId: req.user.userId
        });

        res.status(200).json({
            count: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Update target price
const updateTargetPrice = async (req, res) => {
    try {
        const { targetPrice } = req.body;

        // Validate target price
        if (
            targetPrice === undefined ||
            targetPrice === null ||
            targetPrice === "" ||
            !Number.isFinite(Number(targetPrice)) ||
            Number(targetPrice) <= 0
        ) {
            return res.status(400).json({
                message: "Target price must be a valid number greater than zero"
            });
        }

        const product = await Product.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.userId
            },
            {
    targetPrice: Number(targetPrice),
    alertSentAt: null
},
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Target price updated successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Delete associated price history
        await PriceHistory.deleteMany({
            productId: product._id,
            userId: req.user.userId
        });

        // Delete the product
        await Product.findByIdAndDelete(product._id);

        res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    addProduct,
    getProducts,
    updateTargetPrice,
    deleteProduct
};
