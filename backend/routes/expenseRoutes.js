const express = require("express");
const { protect } = require("../middleware/authMiddleWare");
const {
  addExpense,
  getExpense,
  deleteExpense,
  downloadExpenseExcel,
} = require("../controllers/expenseControllers");
const router = express.Router();

router.post("/add", protect, addExpense);
router.get("/get", protect, getExpense);
router.delete("/delete-expense/:id", protect, deleteExpense);
// router.put("/update-income/:id", protect, updateIncome);
router.get("/downloadexcel", protect, downloadExpenseExcel);

module.exports = router;
