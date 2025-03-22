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
  const userId = req.params.id;
  try {
    const income = await Income.find({ userId }).sort({ date: -1 });

    //preapare data for excel

    const data = income.map((item) => ({
      amount: item.amount,
      source: item.source,
      icon: item.icon,
      date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");
    xlsx.writeFile(wb, "income_details.xlsx");
    res.download("income_details.xlsx");
    res.status(200).json({ message: "Income downloaded successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error downloading income", error: error.message });
  }
};
