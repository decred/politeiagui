import React from "react";
import DefaultPager from "./Pager";
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";

const PaginatedContainer = ({
  Pager = DefaultPager,
  LoadingComponent = LoadingPage,
  ErrorComponent = ErrorPage,
  PageComponent,
  className,
  location,
  style,
  isLoading,
  error,
  items,
  nextPageParams,
  previousPageParams,
}) => (
  isLoading
    ? <LoadingComponent />
    : error
      ? <ErrorComponent {...{ error }} />
      : (
        <div {...{ className, style }}>
          <PageComponent {...{ items }} />
          <Pager {...{ location, isLoading, error, items, nextPageParams, previousPageParams }} />
        </div>
      )
);

export default PaginatedContainer;
