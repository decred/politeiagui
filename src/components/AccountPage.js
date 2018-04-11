import React from "react";
import PrivateKeyIdentityManager from "./PrivateKeyIdentityManager";
import PasswordChange from "./PasswordChange";
import Message from "./Message";
import connector from "../connectors/updateKey";
import { myPubKeyHex  } from "../lib/pki";

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
    const { loggedInAs } = this.props;
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
      updateUserKeyError
    } = this.props;
    const { pubkey } = this.state;
    return (
      <div className="content" role="main">
        <div
          style={{ display: "flex", flexDirection: "column" }}
          className="page user-profile-page">
          <h1>Key management</h1>
          { pubkey && <span>Current Public key: {pubkey}</span>}
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

export default connector(KeyPage);
