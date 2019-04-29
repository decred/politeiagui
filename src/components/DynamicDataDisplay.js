import React, { useEffect } from "react";
import PropTypes from "prop-types";
import ErrorBoundary from "./ErrorBoundary";

const DynamicDataDisplay = ({
  children,
  isLoading,
  loadingMessage,
  error,
  refreshTriggers,
  onFetch,
  style = {}
}) => {
  useEffect(() => {
    onFetch();
  }, refreshTriggers);

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

const DynamicDataDisplayWrapper = props => (
  <ErrorBoundary title="Error">
    <DynamicDataDisplay {...props} />
  </ErrorBoundary>
);

DynamicDataDisplay.propTypes = {
  isLoading: PropTypes.bool,
  children: PropTypes.node.isRequired,
  error: PropTypes.node,
  refreshTriggers: PropTypes.array.isRequired,
  onFetch: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default DynamicDataDisplayWrapper;
