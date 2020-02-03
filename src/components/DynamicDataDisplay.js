import React, { useEffect } from "react";
import PropTypes from "prop-types";
import ErrorBoundary from "./ErrorBoundary";
import RetryError from "./RetryError";

const DynamicDataDisplay = ({
  children,
  isLoading,
  loadingMessage,
  error,
  month,
  year,
  onFetch,
  style = {}
}) => {
  useEffect(() => {
    onFetch();
  }, [month, year, onFetch]);

  if (error) throw error;

  return (
    <div style={style}>
      {isLoading ? (
        <>
          {loadingMessage}
          <i
            className="fa fa-circle-o-notch fa-spin left-margin-5"
            style={{ fontSize: "14px" }}
          />
        </>
      ) : (
        children
      )}
    </div>
  );
};

const DynamicDataDisplayWrapper = ({
  onFetch,
  isLoading,
  errorTitle,
  ...props
}) => (
  <ErrorBoundary
    displayError={!isLoading}
    errorRenderer={(error) => (
      <RetryError
        errorTitle={errorTitle}
        errorMessage={typeof error === "object" ? error.toString() : error}
        onRetry={onFetch}
      />
    )}>
    <DynamicDataDisplay {...{ ...props, onFetch, isLoading }} />
  </ErrorBoundary>
);

DynamicDataDisplay.propTypes = {
  isLoading: PropTypes.bool,
  children: PropTypes.node.isRequired,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.object
  ]),
  errorMessage: PropTypes.string,
  month: PropTypes.number,
  year: PropTypes.number,
  onFetch: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default DynamicDataDisplayWrapper;
