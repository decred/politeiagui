import React from "react";
import Message from "./Message";

const ErrorPage = ({ error }) => (
  <div className="page error-page">
    <Message
      type="error"
      header="Server error"
      error={error} />
  </div>
);

export default ErrorPage;
