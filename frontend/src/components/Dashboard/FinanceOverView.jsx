import React from "react";
import CustomPiechart from "../Charts/CustomPiechart";
const COLOR = ["#875CF5","#FF6900", "#FA2C37", ];

const FinanceOverView = ({ totalBalance, totalIncome, totalExpense }) => {
  const BalanceData = [
    {
      name: "Total Balance",
      amount: totalBalance,
    },
    {
      name: "Total Income",
      amount: totalIncome,
    },
    {
      name: "Total Expense",
      amount: totalExpense,
    },
  ];
  return (
    <div className="card">
      <div className="flex items-center justify-between ">
        <h5 className="text-lg">Finance OverView</h5>
      </div>
      <CustomPiechart
        data={BalanceData}
        label="Total Balance"
        totalAmount={`Rs ${totalBalance}`}
        showTextAnchor
        color={COLOR}
      />
    </div>
  );
};

export default FinanceOverView;
