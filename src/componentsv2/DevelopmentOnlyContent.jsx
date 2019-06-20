import React from "react";

const DevelopmentOnlyContent = ({ children, show }) =>
  (process.env.NODE_ENV !== "production" || process.env.REACT_APP_V2) &&
  show ? (
    <div
      style={{
        position: "relative",
        padding: "4px",
        border: "1px solid #e47a0d"
      }}
    >
      <span
        style={{
          position: "absolute",
          right: "1px",
          top: "-2px",
          fontSize: "1rem"
        }}
      >
        [dev]
      </span>
      {children}
    </div>
  ) : null;

export default DevelopmentOnlyContent;
