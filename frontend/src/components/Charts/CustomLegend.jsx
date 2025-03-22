import React from "react";

const CustomLegend = ({ payload = [] }) => {
  
  if (!payload || payload.length === 0) {
    return <p className="text-gray-500 text-sm text-center">No legend data</p>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center space-x-2">
          {/* Color Indicator */}
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          ></div>
          {/* Legend Text */}
          <span className="text-xs text-gray-700 font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default CustomLegend;
