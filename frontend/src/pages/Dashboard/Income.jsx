import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import { API_PATH } from "../../Utils/apipath";
import axiosInstance from "../../Utils/axiosinstance";
import Modal from "../../components/Modal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import toast from "react-hot-toast";

const Income = () => {
  const [OpenAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [incomeData, setincomeData] = useState([]);
  const [OpenDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  //Get all Income Details
  const fetchIncomeDetails = async () => {
    if (Loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATH.INCOME.GET_ALL_INCOME}`
      );

      if (response.data && Array.isArray(response.data.income)) {
        setincomeData(response.data.income); // Extracting the 'income' array
      } else {
        setincomeData([]); // Default to an empty array if data is missing or not an array
      }
    } catch (error) {
      console.log("Some error occurred", error);
      setincomeData([]); // Ensure no crash by setting an empty array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomeDetails();
  }, []);

  //Handle Add Incomes
  const handleAddIncome = async (income) => {
    const { source, amount, date, icon } = income;
    
    if(!source.trim()) {
      toast.error("Source is required");
      return;
    } 

    if(!amount || isNaN(amount) || Number(amount) <= 0   )  {
      toast.error("Amount is required or It should be greater than zero"); 
      return;
    }
    
    if(!date) {
      toast.error("Date is required");
      return;
    }

    try {
    
      await axiosInstance.post(API_PATH.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon,
      });
      setOpenAddIncomeModal(false);
      toast.success("Income added successfully"); 
      fetchIncomeDetails();

    } catch (error) {
      console.log("Some error occurred", error);
      if (error.response) {
        const statusCode = error.response.status;
        if (statusCode === 401) {
          console.warn("Unauthorized! Redirecting to login...");
          // Handle unauthorized case
        }
      }
    }
  };

  //Delete income
  const delteIncome = async (id) => {};

  //handle Download Income
  const handleDownloadIncomeDetails = async () => {};

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div className="">
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>
        </div>
        <Modal
          isOpen={OpenAddIncomeModal}
          isClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
