import React from "react";

const barStyle = {
  display: "flex",
  height: "100%",
  padding: "10px",
  fontWeight: "bold",
  textTransform: "uppercase",
  alignItems: "center"
};

const StackedBarChart = ({ data, style }) => (
  <div
    style={{
      display: "flex",
      width: "100%",
      height: "24px",
      color: "#fff",
      borderRadius: "8px",
      overflow: "hidden",
      ...style
    }}
  >
    {
      data.map(dr => (
        <span
          style={{
            ...barStyle,
            background: dr.color,
            width: `${dr.value}%`,
            display: dr.value > 0 ? "flex" : "none"
          }}
        >
          {dr.label && `${dr.label}: `}
          {`${dr.value}%`}
        </span>
      ))
    }
  </div>
);

export default StackedBarChart;
