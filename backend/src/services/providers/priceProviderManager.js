const amazonProvider = require("./amazonProvider");
const flipkartProvider = require("./flipkartProvider");
const myntraProvider = require("./myntraProvider");

const getPriceProvider = (platform) => {
    switch (platform) {
        case "amazon":
            return amazonProvider;

        case "flipkart":
            return flipkartProvider;

        case "myntra":
            return myntraProvider;

        default:
            throw new Error(`Unsupported platform: ${platform}`);
    }
};

module.exports = getPriceProvider;