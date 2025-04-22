require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//middleware to handel cors
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
 
connectDB();

app.get("/", (req, res) => {
  res.send("API is working ✅");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/incomes", incomeRoutes);
app.use("/api/v1/expenses", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("server is running on port " + PORT));
