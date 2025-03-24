import React from "react";

const DelteAlert = ({ content, onDelete }) => {
  return (
    <div>
      <p className="text-sm">{content}</p>
      <div className="flex justify-end mt-6 ">
        <button className="add-btn " type="button" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default DelteAlert;
