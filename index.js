const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const vendorRoutes = require("./routes/vendorRoutes");
const firmRoutes = require("./routes/firmRoutes");
const productRoutes = require("./routes/productRoutes");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
dotEnv.config();
const PORT = process.env.PORT || 4000;

// ✅ Proper CORS setup
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://react-swiggy-backend-dashboard-6plsmdrbs.vercel.app",
    "https://swiggy-user-react-bstl4wtov-sai-koushiks-projects-c8fc2e28.vercel.app",
    "https://swiggy-user-react-nq9m321gl-sai-koushiks-projects-c8fc2e28.vercel.app"
  ],
  credentials: true,
}));
app.options('*', cors());

// ✅ Middleware
app.use(bodyParser.json());

// ✅ Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ API routes
app.use("/vendor", vendorRoutes);
app.use("/firm", firmRoutes);
app.use("/product", productRoutes);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Swiggy</h1>");
});

// ✅ DB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.log(err));

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
