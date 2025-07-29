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
    origin: "https://expense-tracker-6wo6.onrender.com",
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

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/incomes", incomeRoutes);
app.use("/api/v1/expenses", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// Static files (uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Port
const PORT = process.env.PORT || 8000;

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
