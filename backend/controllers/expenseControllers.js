const User = require("../models/User");
const Expense = require("../models/Expense");
const xlsx = require("xlsx");

exports.addExpense = async (req, res) => {
  const userId = req.user.id;
  try {
    const { amount, category, icon, date } = req.body;

    const user = await User.findById(req.user.id);

    if (!amount || !category || !date) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const newExpense = new Expense({
      userId,
      amount,
      category,
      icon,
      date: new Date(date),
    });

    await newExpense.save();

    await user.save();
    res.status(201).json({ message: "Expense added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding expense", error: error.message });
  }
};

exports.getExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const expense = await Expense.find({ userId }).sort({
      date: -1,
    });
    res.status(200).json({ expense });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting expense", error: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting expense", error: error.message });
  }
};

// exports.updateexpense = async (req, res) => {
//   try {
//     const { index } = req.params;
//     const { amount, description } = req.body;
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     user.expense[index] = { amount, description };
//     await user.save();
//     res.status(200).json({ message: "expense updated successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error updating expense", error: error.message });
//   }
// };

exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.params.id;
  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });

    //preapare data for excel

    const data = expense.map((item) => ({
      amount: item.amount,
      category: item.category,
      icon: item.icon,
      date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expense");
    xlsx.writeFile(wb, "expense_details.xlsx");
    res.download("expense_details.xlsx");
    res.status(200).json({ message: "expense downloaded successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error downloading expense", error: error.message });
  }
};
