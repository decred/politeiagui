import React from "react";
import PrivateKeyIdentityManager from "./PrivateKeyIdentityManager";
import PasswordChange from "./PasswordChange";
import Message from "./Message";
import { myPubKeyHex } from "../lib/pki";
import Paywall from "./Paywall";
import accountConnector from "../connectors/account";

const UpdatedKeyMessage = ({ email }) => (
  <span>
    Successfully updated your key! Please check your email at
    <b>{email}</b> to activate your new key.
  </span>
);

class KeyPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pubkey: ""
    };
  }
  componentDidMount() {
    const { loggedInAs, history } = this.props;
    if (!loggedInAs) history.push("/login");
    myPubKeyHex(loggedInAs).then(
      (pubkey) => {
        this.setState({
          pubkey
        });
      }
    );
  }
  render() {
    const {
      loggedInAs,
      onUpdateUserKey,
      updateUserKey,
      updateUserKeyError,
      keyMismatch,
      hasPaid
    } = this.props;
    const { pubkey } = this.state;
    return (
      <div className="content" role="main">
        <div
          style={{ display: "flex", flexDirection: "column" }}
          className="page user-profile-page">
          {!hasPaid ? (
            <div>
              <h1>Payment Required</h1>
              <Paywall />
            </div>
          ) : null}
          <h1>Key management</h1>
          {pubkey && <span>Current Public key: {pubkey}</span>}
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
            <div>Your local key and the server key don't match. Please, update your key pair and check your email to confirm the change.</div>
          ) : null}
          <button
            style={{ maxWidth: "144px" }}
            onClick={() => onUpdateUserKey(loggedInAs)}>
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
  }
}

export default accountConnector(KeyPage);
