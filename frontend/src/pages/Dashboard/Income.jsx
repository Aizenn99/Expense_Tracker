import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import { API_PATH } from "../../Utils/apipath";
import axiosInstance from "../../Utils/axiosinstance";
import Modal from "../../components/Modal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import toast from "react-hot-toast";
import IncomeList from "../../components/Income/IncomeList";
import DelteAlert from "../../DelteAlert";
import { useUserAuth } from "../../hooks/useUserAuth";

const Income = () => {
  useUserAuth();
  const [OpenAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [incomeData, setIncomeData] = useState([]);
  const [OpenDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  // Get all Income Details
  const fetchIncomeDetails = async () => {
    if (Loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATH.INCOME.GET_ALL_INCOME);

      if (response.data && Array.isArray(response.data.income)) {
        setIncomeData(response.data.income);
      } else {
        setIncomeData([]);
      }
    } catch (error) {
      console.log("Some error occurred", error);
      setIncomeData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomeDetails();
  }, []);

  // Handle Add Income
  const handleAddIncome = async (income) => {
    const { source, amount, date, icon } = income;

    if (!source.trim()) {
      toast.error("Source is required");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount must be greater than zero");
      return;
    }

    if (!date) {
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
      if (error.response && error.response.status === 401) {
        console.warn("Unauthorized! Redirecting to login...");
        // Handle unauthorized case
      }
    }
  };

  // Delete Income
  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATH.INCOME.DELETE_INCOME(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Income deleted successfully");
      fetchIncomeDetails();
    } catch (error) {
      console.log("Some error occurred", error);
    }
  };

  // Handle Download Income
  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.INCOME.DOWNLOAD_INCOME, {
        responseType: "blob",
      });
  
      // Create a URL for the blob response
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "ExpenseDetails.xlsx");
      document.body.appendChild(link);
      link.click();
  
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file.");
    }
    // Add your download logic here
  };

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <IncomeOverview
            transactions={incomeData}
            onAddIncome={() => setOpenAddIncomeModal(true)}
          />
          <IncomeList
            transactions={incomeData}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onDownload={handleDownloadIncomeDetails} // Fixed: Passed correctly as a prop
          />
        </div>

        {/* Add Income Modal */}
        <Modal
          isOpen={OpenAddIncomeModal}
          isClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={OpenDeleteAlert.show}
          isClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <DelteAlert
            content="Are you sure you want to delete this income?"
            onDelete={() => deleteIncome(OpenDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
