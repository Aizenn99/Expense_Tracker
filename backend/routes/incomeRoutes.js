const express = require("express");
const { protect } = require("../middleware/authMiddleWare");
const {
    addIncome,
    getIncome,
    deleteIncome,
    
    downloadIncomeExcel,
} = require("../controllers/incomeControllers");
const router = express.Router();

router.post("/add", protect, addIncome);
router.get("/get", protect, getIncome);
router.delete("/delete-income/:id", protect, deleteIncome);
// router.put("/update-income/:id", protect, updateIncome);
router.get("/downloadexcel", protect, downloadIncomeExcel);

module.exports = router;