import React from "react";

const ErrorPage = ({ error }) => (
  <div className="page error-page">
    <h3>Error</h3>
    <pre>{(error instanceof Error) ? error.message : JSON.stringify(error, null, 2)}</pre>
  </div>
);

export default ErrorPage;
