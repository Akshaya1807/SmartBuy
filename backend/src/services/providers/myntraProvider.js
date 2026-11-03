
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

        // Extract price from structured product data
        const offerData = $('script[type="application/ld+json"]')
            .toArray()
            .map(element => {
                try {
                    return JSON.parse($(element).html());
                } catch {
                    return null;
                }
            })
            .filter(Boolean);

        const product = offerData.find(item =>
            item.offers && item.offers.price
        );

        if (!product) {
            throw new Error("Myntra product price not found");
        }

        const price = Number(product.offers.price);

        if (!Number.isFinite(price) || price <= 0) {
            throw new Error("Invalid Myntra price");
        }

        return price;

    } catch (error) {
        console.error("Myntra price extraction failed:", error.message);
        throw error;
    }
}

module.exports = { fetchPrice };
