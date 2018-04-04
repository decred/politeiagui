import React from "react";
import PrivateKeyIdentityManager from "./PrivateKeyIdentityManager";
import PasswordChange from "./PasswordChange";
import Message from "./Message";
import Paywall from "./Paywall";
import accountConnector from "../connectors/account";

const UpdatedKeyMessage = ({ email }) => (
  <span>
    Successfully updated your key! Please check your email at
    <b>{email}</b> to activate your new key.
  </span>
);

const KeyPage = ({
  loggedInAs,
  hasPaid,
  keyMismatch,
  onUpdateUserKey,
  updateUserKey,
  updateUserKeyError
}) => (
  <div className="content" role="main">
    <div className="page user-profile-page">
      {!hasPaid ? (
        <div>
          <h1>Payment Required</h1>
          <Paywall />
        </div>
      ) : null}
      <h1>Private Key</h1>
      {updateUserKey &&
        updateUserKey.success && (
          <Message
            type="success"
            header="Key Updated"
            body={<UpdatedKeyMessage email={loggedInAs} />}
          />
        )}
      {updateUserKeyError && (
        <Message
          type="error"
          header="Error"
          body={updateUserKeyError.message}
        />
      )}
      {keyMismatch === true ? (
        <div>TODO: enter user-friendly explanation for key mismatch here</div>
      ) : null}
      <button onClick={() => onUpdateUserKey(loggedInAs)}>
        Update Key Pair
      </button>
      <PrivateKeyIdentityManager
        loggedInAs={loggedInAs}
        onUpdateUserKey={onUpdateUserKey}
      />
      <h1>Change Password</h1>
      <PasswordChange />
    </div>
  </div>
);

export default accountConnector(KeyPage);
