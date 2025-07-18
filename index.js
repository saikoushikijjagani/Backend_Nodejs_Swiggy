const express = require("express");
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const vendorRoutes = require('./routes/vendorRoutes');
const bodyParser = require('body-parser');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors');
const path = require('path');

const app = express();
dotEnv.config();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://react-swiggy-backend-dashboard-6plsmdrbs.vercel.app'
  ],
  credentials: true // if you're using cookies or auth headers
}));
app.options('*', cors()); // Preflight

// ✅ DB Connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected successfully!"))
    .catch((error) => console.log(error));

// ✅ Middleware
app.use(bodyParser.json());
app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);
app.use('/uploads', express.static('uploads'));

// ✅ Default Route
app.get('/', (req, res) => {
    res.send("<h1>Welcome to Swiggy</h1>");
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`Server started and running at ${PORT}`);
});
