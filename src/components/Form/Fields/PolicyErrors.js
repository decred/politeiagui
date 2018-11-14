import React from "react";
import Message from "../../Message";

const PolicyErrors = ({ errors }) => (
  <div>
    {errors.map((error, idx) => (
      <Message key={idx} body={error} type="error" />
    ))}
  </div>
);

export default PolicyErrors;
