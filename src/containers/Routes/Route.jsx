import React from "react";
import { useDocumentTitle } from "src/hooks/utils/useDocumentTitle";
import { Route as ReactRoute } from "react-router-dom";
import { useSelector } from "src/redux";

const useTitleFromState = selector => {
  const title = useSelector(selector);
  return title;
};

const Route = ({ title, titleSelector, ...props }) => {
  const titleFromState = useTitleFromState(titleSelector);
  useDocumentTitle(titleFromState || title);
  return <ReactRoute {...props} />;
};

export default Route;
