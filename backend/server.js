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

/* -------------------- MIDDLEWARE -------------------- */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -------------------- CORS CONFIG -------------------- */

// ✅ CHANGE THIS TO YOUR ACTUAL FRONTEND URL
const allowedOrigins = [
  "http://localhost:5173", // local frontend
  "https://expense-tracker-1-1hwb.onrender.com", // deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, mobile apps, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for this origin"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ IMPORTANT: Handle preflight requests
app.options("*", cors());

/* -------------------- DATABASE -------------------- */

connectDB();

/* -------------------- TEST ROUTE -------------------- */

app.get("/", (req, res) => {
  res.send("🚀 Expense Tracker API is up and running!");
});

/* -------------------- API ROUTES -------------------- */

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/incomes", incomeRoutes);
app.use("/api/v1/expenses", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

/* -------------------- STATIC FILES -------------------- */

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* -------------------- SERVER -------------------- */

const PORT = process.env.PORT || 8000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
