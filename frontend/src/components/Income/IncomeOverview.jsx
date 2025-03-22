import React, { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import CustomBarChart from "../Charts/CustomBarChart";
import { prepareIncomeBarChartData } from "../../Utils/helper";


const IncomeOverview = ({ transactions, onAddIncome }) => {
  const [ChartData, setChartData] = useState([]);
  useEffect(() => {
    const result = prepareIncomeBarChartData(transactions);
    setChartData(result);
  }, [transactions]);
  
  return (
    <div className="card">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h5 className="text-lg">Income Overview</h5>
          <p className="text-xs text-gray-400 mt-0.5">
            Track Your Earnings Over Time And Analyze Your Income Trends.
          </p>
        </div>
        <button className="add-btn" onClick={onAddIncome}>
          <LuPlus className="text-lg" />
          Add Income
        </button>
      </div>
      <div className="mt-10">
        <CustomBarChart data={ChartData} />
      </div>
    </div> 
  );
};

export default IncomeOverview;
