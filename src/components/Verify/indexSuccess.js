import React from "react";
import Message from "../Message";

const VerifySuccess = () => (
  <div className="content" role="main">
    <div className="page verification-page">
      <Message
        type="success"
        header="Verification successful"
        body="You have successfully verified your email and may now log in." />
    </div>
  </div>
);

export default VerifySuccess;
