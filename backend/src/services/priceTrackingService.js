const cron = require("node-cron");

const Product = require("../models/Product");
const PriceHistory = require("../models/PriceHistory");
const getPriceProvider = require("./providers/priceProviderManager");
const User = require("../models/User");
const sendPriceAlert = require("./emailService");

const checkProductPrices = async () => {
    console.log("Starting automatic price tracking...");

    const products = await Product.find({ isActive: true });

    for (const product of products) {
        try {
            // Select the correct provider
            const provider = getPriceProvider(product.platform);

            // Fetch the latest price
           const newPrice = await provider.fetchPrice(product.productUrl);
            if (!Number.isFinite(newPrice) || newPrice <= 0) {
                throw new Error("Provider returned an invalid price");
            }

            // Save history only when the price changes
            if (newPrice !== product.currentPrice) {
                await PriceHistory.create({
                    productId: product._id,
                    userId: product.userId,
                    price: newPrice
                });
            }

         product.currentPrice = newPrice;
product.lastCheckedAt = new Date();

await product.save();

// Check whether the target price has been reached
if (newPrice <= product.targetPrice && !product.alertSentAt) {
    try {
        const user = await User.findById(product.userId);

        if (user) {
            await sendPriceAlert(user.email, product, newPrice);

            product.alertSentAt = new Date();
            await product.save();

            console.log(`Price alert sent for ${product.name}`);
        }
    } catch (emailError) {
        console.error(
            `Failed to send price alert for ${product.name}:`,
            emailError.message
        );
    }
}

            console.log(`Updated price for ${product.name}: ₹${newPrice}`);

        } catch (error) {
            console.error(
                `Failed to check ${product.name}:`,
                error.message
            );
        }
    }
};

const startPriceTracking = () => {
    console.log("Price tracking cron job started!");

   cron.schedule("0 */6 * * *", () => {
    console.log("Cron triggered at:", new Date().toLocaleString());
    checkProductPrices();
});
};

module.exports = startPriceTracking;
module.exports.checkProductPrices = checkProductPrices;