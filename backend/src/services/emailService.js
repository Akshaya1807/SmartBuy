const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendPriceAlert = async (to, product, currentPrice) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: to,
        subject: `Price Drop Alert: ${product.name}`,
        text: `
Good news!

The price of ${product.name} has reached your target price.

Current Price: ₹${currentPrice}
Target Price: ₹${product.targetPrice}

Check the product here:
${product.productUrl}
        `
    });

    console.log(`Price alert email sent to ${to}`);
};

module.exports = sendPriceAlert;