import React, { useState } from "react";
import Input from "../inputs/Input";
import EmojiPickerPopup from "../../EmojiPickerPopup";

const AddIncomeForm = ({ onAddIncome }) => {
  const [income, setIncome] = useState({
    source: "",
    amount: "",
    date: "",
    icon: "",
  });

  const handlechange = (key, value) => setIncome({ ...income, [key]: value });
  return (
    <div>
      <EmojiPickerPopup
        icon={income.icon}
        onSelect={(selectedIcon) => handlechange("icon", selectedIcon)}
      />
      <Input
        value={income.source}
        onChange={({ target }) => handlechange("source", target.value)}
        label="Income Source"
        placeholder="Freelance,Salary,etc"
        type="text"
      />

      <Input
        value={income.amount}
        onChange={({ target }) => handlechange("amount", target.value)}
        label="Amount"
        placeholder="Amount"
        type="number"
      />

      <Input
        value={income.date}
        onChange={({ target }) => handlechange("date", target.value)}
        label="Date"
        placeholder="Date"
        type="date"
      />

      <div className="flex justify-end mt-6 ">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={() => onAddIncome(income)}
        >
          Add Income
        </button>
      </div>
    </div>
  );
};

export default AddIncomeForm;
