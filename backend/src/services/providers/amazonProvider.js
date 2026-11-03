
const axios = require("axios");
const cheerio = require("cheerio");

async function fetchPrice(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            },
            timeout: 15000
        });

        const $ = cheerio.load(response.data);

        // Extract Amazon's product price
        const priceText = $("#tp_price_block_total_price_ww .a-offscreen")
    .first()
    .text()
    .trim();
        if (!priceText) {
            throw new Error("Amazon price not found");
        }

        // Remove currency symbol and commas
        const price = Number(priceText.replace(/[₹,\s]/g, ""));

        if (!Number.isFinite(price) || price <= 0) {
            throw new Error("Invalid Amazon price");
        }

        return price;

    } catch (error) {
        console.error("Amazon price extraction failed:", error.message);
        throw error;
    }
}

module.exports = { fetchPrice };
