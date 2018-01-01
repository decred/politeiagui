import React from "react";
import connector from "../connectors/userProfile";
import PasswordChange from "./PasswordChange";
import PrivateKeyIdentityManager from "./PrivateKeyIdentityManager";

const UserProfile = ({
  loggedInAs
}) => (
  <div className="content" role="main">
    <div className="page user-profile-page">
      <h1>User Profile</h1>
      <PrivateKeyIdentityManager loggedInAs={loggedInAs} />
      <PasswordChange />
    </div>
  </div>
);

export default connector(UserProfile);

