import React from "react";

export const Tabs = ({ children }) => (
  <div className={"tabs"}>
    {children}
    <div className="clear" />
    <div className="tab-border" />
  </div>
);

export const Tab = ({ title, count, tabId, selected, onTabChange }) => {
  let countIcon;
  if (typeof count !== "undefined") {
    countIcon = <div className="tab-count">{count}</div>;
  }
  if (count === "") {
    countIcon = null;
  }
  return (
    <span
      className={"tab" + (selected ? " tab-selected" : "")}
      onClick={() => onTabChange(tabId)}
    >
      {title} {countIcon}
    </span>
  );
};
