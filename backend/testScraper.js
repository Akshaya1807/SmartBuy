
// const axios = require("axios");
// const cheerio = require("cheerio");

// async function scrapeProduct(url) {
//     try {
//         const response = await axios.get(url, {
//             headers: {
//                 "User-Agent": "Mozilla/5.0"
//             },
//             timeout: 15000
//         });

//         const $ = cheerio.load(response.data);
//         const html = response.data;

//         console.log("HTML length:", html.length);
//         console.log("Page title:", $("title").text());

//         console.log("Contains ₹:", html.includes("₹"));
//         console.log("Contains price:", html.toLowerCase().includes("price"));
//         console.log("Contains product ID:", html.includes("24155878"));

//         // Check for common Myntra price fields
//         const keywords = [
//             "discountedPrice",
//             "mrp",
//             "price",
//             "offers"
//         ];

//         for (const keyword of keywords) {
//             const index = html.indexOf(keyword);

//             console.log(`\n${keyword}:`);

//             if (index !== -1) {
//                 console.log(html.substring(index - 150, index + 400));
//             } else {
//                 console.log("Not found");
//             }
//         }

//     } catch (error) {
//         console.log("Scraping failed:", error.message);
//     }
// }

// scrapeProduct(
//     "https://www.myntra.com/tshirts/mufti/mufti-floral-printed-polo-collar-slim-fit-pure-cotton-t-shirt/24155878/buy"
// );

// const { fetchPrice: fetchAmazonPrice } =
//     require("./src/services/providers/amazonProvider");

// const { fetchPrice: fetchFlipkartPrice } =
//     require("./src/services/providers/flipkartProvider");

// const { fetchPrice: fetchMyntraPrice } =
//     require("./src/services/providers/myntraProvider");

// const products = [
//     {
//         platform: "Amazon",
//         url: "https://www.amazon.in/gp/aw/d/B0HHJMGJJH?pd_rd_plhdr=t&hsa_cr_id=0&qid=1793533901&sr=1-3-9fd4e6c6-0f32-411b-9abc-dfd97dd0cadd&i=aps&aref=tWlkzOvMCn&_encoding=UTF8&ref_=sbx__sbtcd2_asin_2_img&pd_rd_w=82F24&content-id=amzn1.sym.1183c3aa-8812-4b69-b5a0-47d783e4595d%3Aamzn1.sym.1183c3aa-8812-4b69-b5a0-47d783e4595d&pf_rd_p=1183c3aa-8812-4b69-b5a0-47d783e4595d&pf_rd_r=XZKYZ6KCZ2YYCAKNKKA2&pd_rd_wg=gQ5xn&pd_rd_r=678a1f47-90f1-45e5-b868-adc6626a8cf0",
//         fetchPrice: fetchAmazonPrice
//     },
//     {
//         platform: "Flipkart",
//         url: "https://www.flipkart.com/kajaru-striped-self-design-men-polo-neck-black-brown-beige-t-shirt/p/itmcd059650bee15?pid=TSHHHMZVT6BJWUUP&lid=LSTTSHHHMZVT6BJWUUPO5TZR5&marketplace=FLIPKART&store=clo%2Fash%2Fank%2Fedy&srno=b_1_1&otracker=browse&fm=organic&iid=en_1e580B_5zrUdvpesJioKxP9Fqh4g1Wwsq6F6urQi2BuHyPS6gVIwcN-TDXHV4y432KaPpyTO1WZqlWaFYd0c0P8iF1bIWT7sz-oKFTWZkHmu1FtuE6QWO6MB1pzF654A&ppt=browse&ppn=browse&ssid=62jhtxxl000000001793534037640&ov_redirect=true",
//         fetchPrice: fetchFlipkartPrice
//     },
//     {
//         platform: "Myntra",
//         url: "https://www.myntra.com/heels/stylestry/stylestry-women-pointed-toe-block-heeled-mules/36582152/buy",
//         fetchPrice: fetchMyntraPrice
//     }
// ];

// async function testAllProviders() {
//     for (const product of products) {
//         console.log(`\nTesting ${product.platform}...`);

//         try {
//             const price = await product.fetchPrice(product.url);
//             console.log(`${product.platform} price: ₹${price}`);
//         } catch (error) {
//             console.log(`${product.platform} failed: ${error.message}`);
//         }
//     }
// }

// testAllProviders();
// const getPriceProvider = require(
//     "./src/services/providers/priceProviderManager"
// );

// async function testManager() {
//     const products = [
//         {
//             platform: "amazon",
//        url: "https://www.amazon.in/gp/aw/d/B0HHJMGJJH?pd_rd_plhdr=t&hsa_cr_id=0&qid=1793533901&sr=1-3-9fd4e6c6-0f32-411b-9abc-dfd97dd0cadd&i=aps&aref=tWlkzOvMCn&_encoding=UTF8&ref_=sbx__sbtcd2_asin_2_img&pd_rd_w=82F24&content-id=amzn1.sym.1183c3aa-8812-4b69-b5a0-47d783e4595d%3Aamzn1.sym.1183c3aa-8812-4b69-b5a0-47d783e4595d&pf_rd_p=1183c3aa-8812-4b69-b5a0-47d783e4595d&pf_rd_r=XZKYZ6KCZ2YYCAKNKKA2&pd_rd_wg=gQ5xn&pd_rd_r=678a1f47-90f1-45e5-b868-adc6626a8cf0",
//         },
//         {
//             platform: "flipkart",
//       url: "https://www.flipkart.com/kajaru-striped-self-design-men-polo-neck-black-brown-beige-t-shirt/p/itmcd059650bee15?pid=TSHHHMZVT6BJWUUP&lid=LSTTSHHHMZVT6BJWUUPO5TZR5&marketplace=FLIPKART&store=clo%2Fash%2Fank%2Fedy&srno=b_1_1&otracker=browse&fm=organic&iid=en_1e580B_5zrUdvpesJioKxP9Fqh4g1Wwsq6F6urQi2BuHyPS6gVIwcN-TDXHV4y432KaPpyTO1WZqlWaFYd0c0P8iF1bIWT7sz-oKFTWZkHmu1FtuE6QWO6MB1pzF654A&ppt=browse&ppn=browse&ssid=62jhtxxl000000001793534037640&ov_redirect=true",
//         },
//         {
//             platform: "myntra",
//             url: "https://www.myntra.com/heels/stylestry/stylestry-women-pointed-toe-block-heeled-mules/36582152/buy"
//         }
//     ];

//     for (const product of products) {
//         try {
//             const provider = getPriceProvider(product.platform);
//             const price = await provider.fetchPrice(product.url);

//             console.log(`${product.platform}: ₹${price}`);
//         } catch (error) {
//             console.log(`${product.platform}: ${error.message}`);
//         }
//     }
// }

// testManager();
// require("dotenv").config();

// const connectDB = require("./config/db");
// const { checkProductPrices } = require(
//     "./src/services/priceTrackingService"
// );

// async function testTracking() {
//     try {
//         await connectDB();

//         await checkProductPrices();

//         console.log("Price tracking test completed!");
//         process.exit(0);
//     } catch (error) {
//         console.error("Test failed:", error);
//         process.exit(1);
//     }
// }

// testTracking();

require("dotenv").config();

const sendPriceAlert = require("./src/services/emailService");

const testProduct = {
    name: "Test Product",
    targetPrice: 10000,
    productUrl: "https://example.com/product"
};

const testEmail = async () => {
    try {
        await sendPriceAlert(
            process.env.EMAIL_USER,
            testProduct,
            9500
        );

        console.log("Test email sent successfully!");
    } catch (error) {
        console.error("Email test failed:", error.message);
    }
};

testEmail();