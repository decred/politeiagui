import React from "react";
import { useConfig } from "src/Config";
import { Route as Router } from "react-router-dom";

const Route = ({ title, ...props }) => {
  const { title: defaultTitle } = useConfig();
  document.title = title || defaultTitle;
  return <Router {...props} />;
}

export default Route;