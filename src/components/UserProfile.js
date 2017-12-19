import React from "react";
import connector from "../connectors/submitProposal";
import PasswordChange from "./PasswordChange";
import PrivateKeyIdentityManager from "./PrivateKeyIdentityManager";

const UserProfile = ({
  email
}) => (
  <div className="content" role="main">
    <div className="page user-profile-page">
      <h1>User Profile</h1>
      <PrivateKeyIdentityManager email={email} />
      <PasswordChange />
    </div>
  </div>
);

export default connector(UserProfile);

