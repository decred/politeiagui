import React from "react";
import Message from "../Message";

const PrivacyPolicy = ({ onHidePrivacyPolicy }) => (
  <div>
    <Message type="info" header="Privacy Policy">
      <p>
        The Politeia database stores your account email address, user-name,
        cryptographic identity public key(s) [and IP] and associates this with
        all of your proposals, comments and up/down votes. Your email address
        will be kept private and will not be shared with any third parties. Data
        associating your user-name with content contributions will be published
        openly, in the interests of transparency.
      </p>
      <a
        onClick={onHidePrivacyPolicy}
        tabIndex={6}
        style={{ cursor: "pointer" }}
      >
        Hide
      </a>
    </Message>
  </div>
);

export default PrivacyPolicy;
