import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import toast from "react-hot-toast";
import axiosInstance from "../../Utils/axiosinstance";
import { API_PATH } from "../../Utils/apipath";
import ExpenseOverView from "../../components/Expense/ExpenseOverView";
import Modal from "../../components/Modal";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import ExpenseList from "../../components/Expense/ExpenseList";
import DelteAlert from "../../DelteAlert";

const Expense = () => {
  useUserAuth();
  const [OpenAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [ExpenseData, setExpenseData] = useState([]);
  const [OpenDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  // Get all Expense Details
  const fetchExpenseDetails = async () => {
    if (Loading) return;
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        API_PATH.EXPENSE.GET_ALL_EXPENSE
      );

      if (response.data && Array.isArray(response.data.expense)) {
        setExpenseData(response.data.expense);
      } else {
        setExpenseData([]);
      }
    } catch (error) {
      console.log("Some error occurred", error);
      setExpenseData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenseDetails();
  }, []);

  // Handle Add Expense
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;

    if (!category.trim()) {
      toast.error("Category is required");
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
      await axiosInstance.post(API_PATH.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });
      setOpenAddExpenseModal(false);
      toast.success("Expense added successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.log("Some error occurred", error);
      if (error.response && error.response.status === 401) {
        console.warn("Unauthorized! Redirecting to login...");
        // Handle unauthorized case
      }
    }
  };

  // Delete Expense
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATH.EXPENSE.DELETE_EXPENSE(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense deleted successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.log("Some error occurred", error);
    }
  };

  // Handle Download Income
  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.EXPENSE.DOWNLOAD_EXPENSE, {
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
  };
  

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto  ">
        <div className="grid grid-cols-1  gap-6">
          <div className="">
            <ExpenseOverView
              transactions={ExpenseData}
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
            />
          </div>
          <ExpenseList
            transactions={ExpenseData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={handleDownloadExpenseDetails}
          />
        </div>
        <Modal
          isOpen={OpenAddExpenseModal}
          isClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>
        <Modal
          isOpen={OpenDeleteAlert.show}
          isClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DelteAlert
            content="Are you sure you want to delete this expense?"
            onDelete={() => deleteExpense(OpenDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
