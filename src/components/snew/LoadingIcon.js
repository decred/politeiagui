import React from "react";

const LoadingIcon = ({
  hidden,
  width,
  className,
  style
}) => (
  <div
    className={"loading" + (className ? (" " + className) : "")}
    style={Object.assign({
      display: hidden ? "none" : "flex",
      width: width + "px",
      height: (width * 0.75) + "px"
    }, style)}>
    <div
      className="logo spin"
      style={{
        width: width + "px",
        height: (width * 0.75) + "px"
      }} />
  </div>
);

export default LoadingIcon;
