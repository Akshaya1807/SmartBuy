
import { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
const formatLastChecked = (date) => {
  if (!date) return "Not checked yet";

  const diff = Date.now() - new Date(date).getTime();

  if (diff < 60000) return "Just now";

  const minutes = Math.floor(diff / 60000);

  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);

  return `${days} days ago`;
};
function Dashboard() {
  const [products, setProducts] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const [name, setName] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [newTargetPrices, setNewTargetPrices] = useState({});

  const [success, setSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/products",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSuccess("");
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/products",
        {
          name,
          productUrl,
          targetPrice: Number(targetPrice)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setProducts([...products, response.data.product]);

      setName("");
      setProductUrl("");
      setTargetPrice("");

      setSuccess("Product added successfully!");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to add product"
      );
    }
  };

  const handleDeleteProduct = async (id) => {
    setSuccess("");
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/products/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setProducts(products.filter((product) => product._id !== id));

      if (selectedHistory?.productId === id) {
        setSelectedHistory(null);
      }

      setSuccess("Product deleted successfully!");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  };

  const handleUpdateTarget = async (id) => {
    const price = newTargetPrices[id];

    setSuccess("");
    setErrorMessage("");

    if (price === undefined || price.trim() === "") {
      setErrorMessage("Please enter a target price");
      return;
    }

    if (Number(price) <= 0 || !Number.isFinite(Number(price))) {
      setErrorMessage("Target price must be greater than zero");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `http://localhost:5000/api/products/${id}`,
        {
          targetPrice: Number(price)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setProducts((previousProducts) =>
        previousProducts.map((product) =>
          product._id === id ? response.data.product : product
        )
      );

      setNewTargetPrices((previousPrices) => ({
        ...previousPrices,
        [id]: ""
      }));

      setSuccess("Target price updated successfully!");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to update target price"
      );
    }
  };

  const handleViewHistory = async (productId) => {
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:5000/api/price-history/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSelectedHistory({
        productId,
        history: response.data.history
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to fetch price history"
      );
    }
  };

  const chartData =
    selectedHistory?.history.map((record) => ({
      date: new Date(record.recordedAt).toLocaleDateString("en-IN"),
      price: record.price
    })) || [];

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h2>My Watchlist</h2>
          <p>Track prices and never miss a great deal.</p>
        </div>

        <div className="product-count">
          {products.length} Products
        </div>
      </div>

      <section className="add-product-section">
        <h3>Add a Product</h3>
        <p>Track products from Amazon, Flipkart and Myntra.</p>

        {success && (
          <p className="success-message">{success}</p>
        )}

        {errorMessage && (
          <p className="error-message">{errorMessage}</p>
        )}

        <form className="product-form" onSubmit={handleAddProduct}>
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="url"
            placeholder="Amazon, Flipkart or Myntra Product URL"
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Target Price (₹)"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            min="0.01"
            step="0.01"
            required
          />

          <button type="submit" className="add-button">
            + Add Product
          </button>
        </form>
      </section>

      <section className="products-section">
        <h3>Your Tracked Products</h3>

        {products.length === 0 ? (
          <div className="empty-state">
            <h3>Your watchlist is empty</h3>
            <p>Add your first product above to start tracking prices.</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <div className="product-card" key={product._id}>
                <h3>{product.name}</h3>
<div className="product-status">
  {product.currentPrice <= product.targetPrice ? (
    <span className="target-reached">
      Target Price Reached
    </span>
  ) : (
    <span className="target-pending">
      Target Not Reached
    </span>
  )}
</div>

<p className="last-checked">
  Last checked: {formatLastChecked(product.lastCheckedAt)}
</p>
                <div className="price-details">
                  <div>
                    <span>Current Price</span>
                    <strong>
                      ₹{product.currentPrice.toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div>
                    <span>Target Price</span>
                    <strong>
                      ₹{product.targetPrice.toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>

                <div className="update-section">
                  <input
                    type="number"
                    placeholder="New target price"
                    min="0.01"
                    step="0.01"
                    value={newTargetPrices[product._id] || ""}
                    onChange={(e) =>
                      setNewTargetPrices({
                        ...newTargetPrices,
                        [product._id]: e.target.value
                      })
                    }
                  />

                  <button
                    className="update-button"
                    onClick={() => handleUpdateTarget(product._id)}
                    disabled={!newTargetPrices[product._id]}
                  >
                    Update
                  </button>
                </div>

                <button
                  className="delete-button"
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  Delete Product
                </button>

                <button
                  className="history-button"
                  onClick={() => handleViewHistory(product._id)}
                >
                  View Price History
                </button>

                {selectedHistory?.productId === product._id && (
                  <div className="history-panel">
                    <h3>Price History</h3>

                    {selectedHistory.history.length > 0 ? (
                      <>
                        <div className="price-chart">
                          <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip
                                formatter={(value) => [`₹${value}`, "Price"]}
                              />
                              <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#4f46e5"
                                strokeWidth={2}
                                activeDot={{ r: 7 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>

                        {selectedHistory.history.map((record) => (
                          <div className="history-item" key={record._id}>
                            <span>
                              ₹{record.price.toLocaleString("en-IN")}
                            </span>
                            <span>
                              {new Date(record.recordedAt).toLocaleString("en-IN")}
                            </span>
                          </div>
                        ))}
                      </>
                    ) : (
                      <p>No price history available yet.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
