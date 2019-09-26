import React, { useMemo } from "react";
import { useDocumentTitle } from "src/hooks/utils/useDocumentTitle";
import { Route as ReactRoute } from "react-router-dom";
import { useRedux } from "src/redux";

const useTitleFromState = selector => {
  const mapStateToProps = useMemo(() => (selector ? { title: selector } : {}), [
    selector
  ]);
  const { title } = useRedux({}, mapStateToProps, {});
  return title;
};

const Route = ({ title, titleSelector, ...props }) => {
  const titleFromState = useTitleFromState(titleSelector);
  useDocumentTitle(titleFromState || title);
  return <ReactRoute {...props} />;
};

export default Route;
