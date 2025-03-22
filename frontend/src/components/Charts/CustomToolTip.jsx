import React from "react";

const CustomToolTip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 shadow-md border border-gray-300 rounded-md">
        <p className="text-xs font-semibold text-purple-800 mb-2 ">
          {payload[0].name}
        </p>
        <p className="text-sm text-gray-600 ">
          Amount:<span className="text-sm font-medium text-gray-800 ">{`${payload[0].value}`}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default CustomToolTip;
