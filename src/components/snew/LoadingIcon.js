import React from "react";

const LoadingIcon = ({ hidden, width, className, style }) => (
  <div
    className={"loading" + (className ? " " + className : "")}
    style={Object.assign(
      {
        display: hidden ? "none" : "flex",
        width: width * 1.4 + "px",
        height: width * 1.25 + "px"
      },
      style
    )}
  >
    <div className="hoverimage" />
    <div
      className="logo"
      style={{
        width: width * 1.4 + "px",
        height: width * 1.25 + "px"
      }}
    />
  </div>
);

export default LoadingIcon;
