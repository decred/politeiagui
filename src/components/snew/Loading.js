import React from "react";

const Loading = ({ hidden, className }) => (
  <div
    className={"loading" + (className ? (" " + className) : "")}
    style={{ display: hidden ? "none" : "flex" }}>
    <div className="logo spin" />
  </div>
);

export default Loading;

