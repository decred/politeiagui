import React from "react";
import connector from "../connectors/userProfile";
import PasswordChange from "./PasswordChange";
import PrivateKeyIdentityManager from "./PrivateKeyIdentityManager";
import Message from './Message';

const UpdatedKeyMessage = ({email}) => (
  <span>
    Successfully updated your key! Please check your email at
    <b>{email}</b> to activate your new key.
  </span>
);

const UserProfile = ({
  loggedInAs,
  onUpdateUserKey,
  updateUserKey,
  updateUserKeyError
}) => (
  <div className="content" role="main">
    <div className="page user-profile-page">
      <h1>User Profile</h1>
      {updateUserKey && updateUserKey.success && 
        <Message 
          type="success"
          header="Key Updated" 
          body={<UpdatedKeyMessage email={loggedInAs} />} 
        />
      }
      {updateUserKeyError && 
        <Message 
          type="error"
          header="Error" 
          body={updateUserKeyError.message} 
        />
      }
      <button onClick={() => onUpdateUserKey(loggedInAs)}>Update Key Pair</button>
      <PrivateKeyIdentityManager loggedInAs={loggedInAs} onUpdateUserKey={onUpdateUserKey} />
      <PasswordChange />
    </div>
  </div>
);

export default connector(UserProfile);

