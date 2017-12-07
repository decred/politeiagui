import React from "react";
import PasswordChange from "./PasswordChange";
import PrivateKeyIdentityManager from "./PrivateKeyIdentityManager";

const UserProfile = () => (
  <div className="content" role="main">
    <div className="page user-profile-page">
      <h1>User Profile</h1>
      <PrivateKeyIdentityManager />
      <PasswordChange />
    </div>
  </div>
);

export default UserProfile;

