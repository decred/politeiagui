import React from "react";
import Message from "../Message";

const VerifyFailure = () => (
  <div className="content" role="main">
    <div className="page verification-page">
      <Message
        type="error"
        header="Verification failed"
        body="This verification token is not valid for this email." />
    </div>
  </div>
);

export default VerifyFailure;
