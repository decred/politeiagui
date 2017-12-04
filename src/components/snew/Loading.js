import React from "react";

const Loading = ({ hidden, className, style }) => (
  <div
    className={"loading" + (className ? (" " + className) : "")}
    style={Object.assign({ display: hidden ? "none" : "flex"}, style)}>
    <div className="logo spin" />
  </div>
);

export default Loading;

