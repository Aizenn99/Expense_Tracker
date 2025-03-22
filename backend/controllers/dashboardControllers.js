const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { isValidObjectId, Types } = require("mongoose");

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjId = new Types.ObjectId(String(userId));

    //fetch total income and expense
    const totalIncome = await Income.aggregate([
      { $match: { userId: userObjId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalExpense = await Expense.aggregate([
      { $match: { userId: userObjId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const last60DaysIncomeTransations = await Income.find({
      userId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    //get totalincome for last 60 days
    const incomeLast60Days = last60DaysIncomeTransations.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    //get expense transactions for last 60 days
    const last30DaysExpenseTransations = await Expense.find({
      userId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    //get total expense for last 60 days
    const expenseLast30Days = last30DaysExpenseTransations.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    //fetch last 5 transactions
    const last5Transactions = [
      ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(
        (txn) => ({
          ...txn.toObject(),
          type: "income",
        })
      ),
      ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(
        (txn) => ({
          ...txn.toObject(),
          type: "expense",
        })
      ),
    ].sort((a, b) => b.date - a.date); // sort latest first

    //Final response
    res.json({
      totalBalance:
        (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),

      totalIncome: totalIncome[0]?.total || 0,
      totalExpense: totalExpense[0]?.total || 0,
      incomeLast60Days: {
        total: incomeLast60Days,
        transactions: last60DaysIncomeTransations,
      },
      expenseLast30Days: {
        total: expenseLast30Days,
        transactions: last30DaysExpenseTransations,
      },
      recentTransations: last5Transactions,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting dashboard data", error: error.message });
  }
};
