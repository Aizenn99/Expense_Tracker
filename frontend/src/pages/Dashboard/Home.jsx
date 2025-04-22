import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../../Utils/axios";
import { useNavigate } from "react-router-dom";
import { API_PATH } from "../../Utils/apipath";
import InfoCard from "../../components/Cards/InfoCard";
import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { IoMdCard } from "react-icons/io";
import { addThousandsSeparator } from "../../Utils/helper";
import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import FinanceOverView from "../../components/Dashboard/FinanceOverView";
import ExpenseTransactions from "../../components/Dashboard/ExpenseTransactions";
import Last30DaysExpenseTransactions from "../../components/Dashboard/Last30DaysExpenseTransactions";
import RecentIncomeWithChart from "../../components/Dashboard/RecentIncomeWithChart";
import RecentIncome from "../../components/Dashboard/RecentIncome";

const Home = () => {
  useUserAuth();
  const navigate = useNavigate();
  const [dashboardData, setdashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATH.DASHBOARD.GET_DATA}`
      );

      if (response.data) {
        setdashboardData(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.log("Some error occurred", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
            color="bg-primary"
          />

          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={addThousandsSeparator(dashboardData?.totalIncome || 0)}
            color="bg-orange-500"
          />

          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expenses"
            value={addThousandsSeparator(dashboardData?.totalExpense || 0)}
            color="bg-red-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 ">
          <RecentTransactions
            last5Transactions={dashboardData?.recentTransations}
            onSeeMore={() => navigate("/expense")}
          />
          <FinanceOverView
            totalBalance={dashboardData?.totalBalance || 0}
            totalIncome={dashboardData?.totalIncome || 0}
            totalExpense={dashboardData?.totalExpense || 0}
          />

          <Last30DaysExpenseTransactions
            data={dashboardData?.expenseLast30Days?.transactions || []}
          />
          <ExpenseTransactions
            transactions={dashboardData?.expenseLast30Days?.transactions}
            onSeeMore={() => navigate("/expense")}
          />

          <RecentIncome
            transactions={dashboardData?.incomeLast60Days?.transactions || []}
            onSeeMore={() => navigate("/income")}
          />

          <RecentIncomeWithChart
            data={
              dashboardData?.incomeLast60Days?.transactions?.slice(0, 5) || []
            }
            totalIncome={dashboardData?.totalIncome || 0}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
