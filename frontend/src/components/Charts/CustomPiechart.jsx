import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import CustomLegend from "./CustomLegend";
import CustomToolTip from "./CustomToolTip";

const CustomPiechart = ({
  data = [], // Ensuring data is always an array
  label,
  totalAmount,
  color = [], // Default empty array to prevent errors
  showTextAnchor,
}) => {
  return (
    <ResponsiveContainer width="100%" height={380}>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={130}
          innerRadius={100}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={color[index % color.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomToolTip />} />
        <Legend />

        {showTextAnchor && (
          <>
            <text
              x="50%"
              y="50%"
              dy={-25}
              textAnchor="middle"
              fill="#666"
              fontSize="14px"
            >
              {label}
            </text>
            <text
              x="50%"
              y="50%"
              dy={8}
              textAnchor="middle"
              fill="#333"
              fontSize="24px"
              fontWeight="semi-bold"
            >
              Rs {totalAmount}
            </text>
          </>
        )}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPiechart;
