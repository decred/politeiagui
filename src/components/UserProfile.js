import React from "react";
import userProfileConnector from "../connectors/userProfile";
import PasswordChange from "./PasswordChange";
import PrivateKeyIdentityManager from "./PrivateKeyIdentityManager";
import Message from "./Message";

const UpdatedKeyMessage = ({ email }) => (
  <span>
    Your new key pair has been requested, please check your email at{" "}
    <b>{email}</b> to verify and activate it.
  </span>
);

const UserProfile = ({
  loggedInAsEmail,
  onUpdateUserKey,
  updateUserKey,
  updateUserKeyError
}) => (
  <div className="content" role="main">
    <div className="page user-profile-page">
      <h1>User Profile</h1>
      {updateUserKey && updateUserKey.success && (
        <Message type="success" header="Email verification required">
          <UpdatedKeyMessage email={loggedInAsEmail} />
        </Message>
      )}
      {updateUserKeyError && (
        <Message
          type="error"
          header="Error"
          body={updateUserKeyError.message}
        />
      )}
      <button onClick={() => onUpdateUserKey(loggedInAsEmail)}>
        Update Key Pair
      </button>
      <PrivateKeyIdentityManager
        loggedInAsEmail={loggedInAsEmail}
        onUpdateUserKey={onUpdateUserKey}
      />
      <PasswordChange />
    </div>
  </div>
);

export default userProfileConnector(UserProfile);
