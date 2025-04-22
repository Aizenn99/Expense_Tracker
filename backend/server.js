require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

// Route imports
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Connect to MongoDB
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Expense Tracker API is up and running!");
});

<<<<<<< HEAD
// Routes
=======


>>>>>>> 6aaf06b3ef214c8ef82f0bb58a253e376202b0ae
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/incomes", incomeRoutes);
app.use("/api/v1/expenses", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// Static files (uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

<<<<<<< HEAD
// Port
const PORT = process.env.PORT || 8000;

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server is running on port ${PORT}`);
=======
const PORT = process.env.PORT ;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
>>>>>>> 6aaf06b3ef214c8ef82f0bb58a253e376202b0ae
});
