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

    this.identityHelpPrompt = "What is an identity?";
    this.state = {
      pubkey: "",
      showIdentityHelpText: false
    };
  }

  componentDidMount() {
    const { loggedInAs, history } = this.props;
    if (!loggedInAs) history.push("/login");
    myPubKeyHex(loggedInAs).then(pubkey => {
      if(!this.unmounting) {
        this.setState({ pubkey });
      }
    });
  }

  componentWillUnmount() {
    this.unmounting = true;
  }

  render() {
    const {
      loggedInAs,
      onUpdateUserKey,
      updateUserKey,
      updateUserKeyError,
      keyMismatch,
      userAlreadyPaid,
    } = this.props;
    const { pubkey, showIdentityHelpText } = this.state;
    return (
      <div className="content" role="main">
        <div
          style={{ display: "flex", flexDirection: "column" }}
          className="page user-profile-page">
          {!userAlreadyPaid ? (
            <div>
              <h1>Payment Required</h1>
              <Paywall />
            </div>
          ) : null}
          <h1>Manage Your Identity</h1>
          <p>
            {showIdentityHelpText ? (
              <div>
                <span style={{fontWeight: "bold"}}>{this.identityHelpPrompt}</span>{" "}
                <a onClick={() => this.setState({ showIdentityHelpText: false })}>
                  (hide)
                </a>
              </div>
            ) : (
              <a onClick={() => this.setState({ showIdentityHelpText: true })}>
                {this.identityHelpPrompt}
              </a>
            )}
          </p>
          {showIdentityHelpText ? (
            <div className="identity-help">
              <p>
                Each user has a unique <i>identity</i> which is necessary
                for proving who the author of a proposal is. Every identity
                is made up of 2 long strings of characters (letters and numbers)
                called keys:
              </p>
              <ul>
                <li><b>Private key:</b> A key only you have that you use for creating a "signature" when you submit a proposal.</li>
                <li><b>Public key:</b> A key that you share with others (and Politeia) that proves your proposal was signed with your private key.</li>
              </ul>
              <p>
                An identity was generated automatically for you when you created an
                account, and signatures are created automatically when you submit
                new proposals. Still, it's important to understand how it works,
                because it's integral to Politeia's anti-censorship features.
              </p>
              <p>
                <b>Note:</b> Your identity is stored in the browser, so it will be lost when you
                log in using a different browser or device. Although Politeia stores
                your public key, it cannot store your private key because only you
                should ever have access to it.
              </p>
            </div>
          ) : null}
          <div className="public-key">Your public key: {pubkey || "none"}</div>
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
            <p>
              The Politeia server has a different public key for your account
              than the one you have on this browser. This usually means you're
              using a different browser than the one you registered your account
              with. You can either create a new identity (which discards the old identity),
              or log in with your original browser to download your original identity
              and import it here.
            </p>
          ) : null}
          <button
            style={{ maxWidth: "250px" }}
            onClick={() => onUpdateUserKey(loggedInAs)}>
            Generate New Identity
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
