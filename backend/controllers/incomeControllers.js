const User = require("../models/User");
const Income = require("../models/Income");
const xlsx = require("xlsx");

exports.addIncome = async (req, res) => {
  const userId = req.user.id;
  try {
    const { amount, source, icon, date } = req.body;
   

    const user = await User.findById(req.user.id);

    if (!amount || !source || !icon || !date) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const newIncome = new Income({
      userId,
      amount,
      source,
      icon,
      date: new Date(date),
    });

    await newIncome.save();

    await user.save();
    res.status(201).json({ message: "Income added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding income", error: error.message });
  }
};

exports.getIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const income = await Income.find({ userId }).sort({
      date: -1,
    });
    res.status(200).json({ income });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting income", error: error.message });
  }
};

exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting income", error: error.message });
  }
};

// exports.updateIncome = async (req, res) => {
//   try {
//     const { index } = req.params;
//     const { amount, description } = req.body;
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     user.income[index] = { amount, description };
//     await user.save();
//     res.status(200).json({ message: "Income updated successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error updating income", error: error.message });
//   }
// };

exports.downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id; // Use req.user.id instead of req.params.id for authentication
  try {
    const income = await Income.find({ userId }).sort({ date: -1 });

    if (!income || income.length === 0) {
      return res.status(404).json({ message: "No income records found" });
    }

    // Prepare data for the Excel file
    const data = income.map((item) => ({
      Amount: item.amount,
      Source: item.source,
      Icon: item.icon,
      Date: item.date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
    }));

    // Create a new workbook and worksheet
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);

    // Append worksheet to the workbook
    xlsx.utils.book_append_sheet(wb, ws, "Income");

    // Generate Excel buffer
    const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    // Set headers for file download
    res.setHeader("Content-Disposition", 'attachment; filename="IncomeDetails.xlsx"');
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    // Send the Excel file as a response
    res.status(200).send(buffer);
  } catch (error) {
    res.status(500).json({ message: "Error downloading income", error: error.message });
  }
};
