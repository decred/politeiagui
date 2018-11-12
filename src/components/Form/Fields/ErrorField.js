import React from "react";
import Message from "../../Message";

const ErrorField = ({ title, meta: { error } }) => {
  if (!error) {
    return null;
  }

  return <Message type="error" header={title} body={error} />;
};

export default ErrorField;
