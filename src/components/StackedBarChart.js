import React from "react";

const barStyle = {
  display: "flex",
  height: "100%",
  fontWeight: "bold",
  textTransform: "uppercase",
  alignItems: "center"
};

const labelStyle = {
  position: "relative",
  height: 0,
  width: 0,
  top: "3px",
  left: "10px",
  fontWeight: "bold",
  textTransform: "uppercase",
  whiteSpace: "nowrap"
};

const wrapperStyle = {
  display: "flex",
  width: "100%",
  height: "24px",
  color: "grey",
  border: "1px solid #D6D6D6",
  borderRadius: "8px",
  overflow: "hidden"
};
const StackedBarChart = ({ data, style, displayValuesForLabel }) => {
  const dataToDisplay = displayValuesForLabel &&
    data.filter(d => d.label === displayValuesForLabel)[0];
  const labelToDisplay = dataToDisplay && `${dataToDisplay.label}: ${dataToDisplay.value}%`;

  return (
    <div
      style={{
        ...wrapperStyle,
        ...style
      }}
    >
      {labelToDisplay &&
        <span style={labelStyle} >
          {labelToDisplay}
        </span>
      }
      {
        data.map((dr, idx) => (
          <span
            key={`data-${idx}`}
            style={{
              ...barStyle,
              background: dr.color,
              width: `${dr.value}%`
            }}
          >
          </span>
        ))
      }
    </div>
  );
};

export default StackedBarChart;
