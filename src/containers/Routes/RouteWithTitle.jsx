import React from "react";
import { Route } from "react-router-dom";

const RouteWithTitle = ({ title, ...props }) => {
  document.title = title || "Politeia";
  return <Route {...props} />;
}

export default RouteWithTitle;