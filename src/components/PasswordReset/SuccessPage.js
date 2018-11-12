import React from "react";
import Message from "../Message";

const SuccessPage = () => (
  <div className="page reset-password-next-step-page content">
    <Message
      type="success"
      className="account-page-message"
      header="Password reset completed"
      body={
        <div>
          <p>
            Your password has been changed. You can now{" "}
            <a href="/user/signup">login</a> with your new password.
          </p>
        </div>
      }
    />
  </div>
);

export default SuccessPage;
