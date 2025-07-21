const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// Import routes
const vendorRoutes = require("./routes/vendorRoutes");
const firmRoutes = require("./routes/firmRoutes");
const productRoutes = require("./routes/productRoutes");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://react-swiggy-backend-dashboard-6plsmdrbs.vercel.app",
  "https://swiggy-user-react-2ic314sfy-sai-koushiks-projects-c8fc2e28.vercel.app" 
  "https://swiggy-user-react-5cx85k8lk-sai-koushiks-projects-c8fc2e28.vercel.app/"
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin, like mobile apps or curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = "CORS policy: This origin is not allowed.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.options('*', cors()); // Pre-flight for all routes

// Middleware
app.use(bodyParser.json());

// Serve static files (e.g., uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/vendor", vendorRoutes);
app.use("/firm", firmRoutes);
app.use("/product", productRoutes);

// API health/test route
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Swiggy</h1>");
});

// Global error handling middleware (optional, for robust error responses)
app.use((err, req, res, next) => {
  // Handle CORS errors
  if (err instanceof Error && err.message.includes("CORS")) {
    return res.status(403).json({ message: err.message });
  }
  // Other server errors
  res.status(err.status || 500).json({ message: err.message || "Server Error" });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
