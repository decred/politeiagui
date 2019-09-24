import React from "react";
import { useDocumentTitle } from "src/hooks/utils/useDocumentTitle";
import { Route as Router } from "react-router-dom";

const Route = ({ title, ...props }) => {
  useDocumentTitle(title);
  return <Router {...props} />;
}

export default Route;