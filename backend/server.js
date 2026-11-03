const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./src/routes/authRoutes");
const productRoutes = require("./src/routes/productRoutes");
const priceHistoryRoutes = require("./src/routes/priceHistoryRoutes");
const startPriceTracking = require("./src/services/priceTrackingService");

const app = express();

// Middleware must come before routes
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/price-history", priceHistoryRoutes);
app.get("/", (req, res) => {
    res.send("SmartBuy backend is running!");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    startPriceTracking();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});