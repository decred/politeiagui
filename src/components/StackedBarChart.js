import React from "react";
import Tooltip from "./Tooltip";

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
  position: "relative",
  display: "flex",
  width: "100%",
  height: "24px",
  color: "grey",
  border: "1px solid #D6D6D6",
  borderRadius: "8px",
  overflow: "hidden"
};

const threesholdStyle = {
  borderRight: "1px solid",
  position: "absolute",
  display: "flex",
  justifyContent: "flex-end",
  left: "0px",
  fontSize: "11px",
  fontWeight: "normal"
};

const threesholdTextStyle = {
  position: "absolute",
  right: "-30px",
  borderRadius: "8px",
  height: "20px",
  width: "30px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "green",
  fontWeight: "bold",
  fontSize: "12px"
};

const StackedBarChart = ({
  data,
  style,
  displayValuesForLabel,
  threeshold
}) => {
  const dataToDisplay =
    displayValuesForLabel &&
    data.filter(d => d.label === displayValuesForLabel)[0];
  const labelToDisplay =
    dataToDisplay && `${dataToDisplay.label}: ${dataToDisplay.value}%`;

  const gradientInitialColor = "#FFA07A";
  const gradientFinalColor = "#a7f1eb";

  return (
    <div
      style={{
        ...wrapperStyle,
        ...style
      }}
    >
      {labelToDisplay && <span style={labelStyle}>{labelToDisplay}</span>}
      {data
        .filter(dr => dr.label === displayValuesForLabel)
        .map((dr, idx) => (
          <span
            key={`data-${idx}`}
            style={{
              ...barStyle,
              background:
                dr.value < threeshold
                  ? `linear-gradient(90deg, ${gradientInitialColor} 20%, ${gradientFinalColor})`
                  : gradientFinalColor,
              width: `${dr.value}%`
            }}
          />
        ))}
      {threeshold ? (
        <span
          style={{
            ...barStyle,
            ...threesholdStyle,
            width: `${threeshold}%`
          }}
        >
          <span style={threesholdTextStyle}>
            <Tooltip
              tipStyle={{
                left: "24px",
                maxWidth: "105px",
                padding: "1px",
                fontWeight: "normal"
              }}
              text="pass percentage"
              position="right"
            >
              {threeshold}%
            </Tooltip>
          </span>
        </span>
      ) : null}
    </div>
  );
};

export default StackedBarChart;
