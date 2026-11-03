
const axios = require("axios");

async function fetchPrice(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            },
            timeout: 15000
        });

        const html = response.data;

        // Find Flipkart's pricing data
        const index = html.indexOf('"ppd":');

        if (index === -1) {
            throw new Error("Flipkart price data not found");
        }

        const start = html.indexOf("{", index);
        const end = html.indexOf("}", start);

        if (start === -1 || end === -1) {
            throw new Error("Invalid Flipkart price data");
        }

        const ppd = JSON.parse(html.substring(start, end + 1));

        const price = Number(ppd.finalPrice);

        if (!Number.isFinite(price) || price <= 0) {
            throw new Error("Invalid Flipkart final price");
        }

        return price;

    } catch (error) {
        console.error("Flipkart price extraction failed:", error.message);
        throw error;
    }
}

module.exports = { fetchPrice };
