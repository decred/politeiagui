import React from "react";
import Message from "../Message";

const SuccessPage = () => (
  <div className="page reset-password-next-step-page content">
    <Message
      type="success"
      className="account-page-message"
      header="Invite new contractor completed!"
      body={
        <div>
          <p>You have successfully invited a user!</p>
        </div>
      }
    />
  </div>
);

export default SuccessPage;
