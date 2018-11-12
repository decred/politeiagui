import React from "react";

const Tooltip = ({
  position = "bottom",
  tipStyle = {},
  wrapperStyle = {},
  text = "tip",
  children
}) => (
  <div className="tooltip-wrapper" style={wrapperStyle}>
    <div
      className={`tip tip-${position}`}
      style={{ ...tipStyle, zIndex: "999" }}
    >
      {text}
    </div>
    {children}
  </div>
);

export default Tooltip;
