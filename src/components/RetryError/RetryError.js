import React from "react";
import PropTypes from "prop-types";

const RetryError = ({ errorTitle, errorMessage, onRetry }) => (
  <div className="retry-error">
    <div className="retry-error_content">
      <span className="retry-error_title">{errorTitle}</span>
      <span className="retry-error_message">{errorMessage}</span>
    </div>
    <button className="c-btn c-btn-primary button-small" onClick={onRetry}>
      {" "}
      Retry
    </button>
  </div>
);

RetryError.propTypes = {
  errorTitle: PropTypes.string,
  errorMessage: PropTypes.string,
  onRetry: PropTypes.func.isRequired
};

export default RetryError;
