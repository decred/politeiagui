import React from "react";
import PrivateKeyIdentityManager from "./PrivateKeyIdentityManager";
import PasswordChange from "./PasswordChange";
import UsernameChange from "./UsernameChange";
import Message from "./Message";
import { myPubKeyHex } from "../lib/pki";
import accountConnector from "../connectors/account";
import { CONFIRM_ACTION } from "../components/Modal/modalTypes";
import { PUB_KEY_STATUS_LOADED, PUB_KEY_STATUS_LOADING } from "../constants";
import { verifyUserPubkey } from "../helpers";

const UpdatedKeyMessage = ({ email }) => (
  <span>
    Your new identity has been requested, please check your email at{" "}
    <b>{email}</b> to verify and activate it.
    <br />
    The verification link needs to be open with the same browser
    that you used to generate this new identity.
  </span>
);

class KeyPage extends React.Component {

  constructor(props) {
    super(props);

    this.identityHelpPrompt = "What is an identity?";
    this.state = {
      pubkey: "",
      pubkeyStatus: PUB_KEY_STATUS_LOADING,
      showIdentityHelpText: false,
      openedVerification: false
    };
  }

  resolvePubkey = () => {
    if(!this.state.pubkey && this.props.loggedInAsEmail) {
      this.refreshPubKey();
    }
  }

  updatePubkey = (shouldAutoVerifyKey, prevUpdateUserKey, updateUserKey) => {
    if (shouldAutoVerifyKey && updateUserKey) {
      const { verificationtoken } = updateUserKey;
      if ((prevUpdateUserKey && (verificationtoken !== prevUpdateUserKey.verificationtoken))
        || (!prevUpdateUserKey && verificationtoken)) {
        this.setState({ openedVerification: true });
        this.props.history.push(`/user/key/verify/?verificationtoken=${verificationtoken}`);
        return;
      }
    }
  }

  refreshPubKey = () => {
    myPubKeyHex(this.props.loggedInAsEmail).then(pubkey => {
      if(!this.unmounting) {
        this.setState({ pubkey, pubkeyStatus: PUB_KEY_STATUS_LOADED });
      }
    });
  }

  componentDidMount() {
    if (this.props.loggedInAsEmail) {
      verifyUserPubkey(this.props.loggedInAsEmail, this.props.userPubkey, this.props.keyMismatchAction);
    }
    this.resolvePubkey();
  }

  componentWillUnmount() {
    this.unmounting = true;
    this.props.onIdentityImported(null);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.loggedInAsEmail && this.props.loggedInAsEmail) {
      verifyUserPubkey(this.props.loggedInAsEmail, this.props.userPubkey, this.props.keyMismatchAction);
    }
    this.resolvePubkey();
    if (this.state.openedVerification)
      return;
    this.updatePubkey(this.props.shouldAutoVerifyKey, prevProps.updateUserKey, this.props.updateUserKey);

    // update displayed public key when the identity is successfully imported
    if (!prevProps.identityImportSuccess && this.props.identityImportSuccess) {
      this.refreshPubKey();
    }
  }

  onGenerateNewIdentity = () => {
    const { onUpdateUserKey, loggedInAsEmail, confirmWithModal } = this.props;
    confirmWithModal(CONFIRM_ACTION, {
      message: "Are you sure you want to generate a new identity?"
    }).then(
      (confirm) => confirm && onUpdateUserKey(loggedInAsEmail)
    );
  }

  render() {
    const {
      loggedInAsEmail,
      onUpdateUserKey,
      updateUserKey,
      updateUserKeyError,
      keyMismatch,
      onIdentityImported,
      identityImportError,
      identityImportSuccess,
      userPubkey,
      userID
    } = this.props;
    const { pubkey, pubkeyStatus, showIdentityHelpText } = this.state;
    return (
      <div className="content" role="main" >
        {keyMismatch && !identityImportSuccess ? (
          <Message
            type="error"
            className="account-page-message"
            header="Action needed"
            body={(
              <div>
                <p>
                  The public key on the Politeia server differs from the key
                  on your browser.  This is usually caused from the local data
                  on your browser being cleared or by using a different browser.
                </p>
                <p>
                  You can fix this by importing your old identity, logging in
                  with the proper browser, or by creating a new identity
                  (destroying your old identity).
                </p>
              </div>
            )} />
        ) : null}
        <div
          style={{ display: "flex", flexDirection: "column" }}
          className="page user-profile-page">
          <h1>Manage Your Identity</h1>
          <p>
            {showIdentityHelpText ? (
              <div>
                <span style={{ fontWeight: "bold" }}>{this.identityHelpPrompt}</span>{" "}
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
                because it's integral to Politeia's censorship-resistant features.
              </p>
              <p>
                <b>Note:</b> Your identity is stored in the browser, so it will be lost when you
                log in using a different browser or device. Although Politeia stores
                your public key, it cannot store your private key because only you
                should ever have access to it.
              </p>
            </div>
          ) : null}
          <div className="account-info"><b>Your public key:</b> {pubkeyStatus === PUB_KEY_STATUS_LOADED ? (pubkey || "none") : "Loading public key..." }</div>
          <div className="account-info"><b>Your user ID:</b> {userID}</div>
          {updateUserKey &&
            updateUserKey.success && (
            <Message
              type="info"
              header="Verification required"
              body={<UpdatedKeyMessage email={loggedInAsEmail} />}
            />
          )}
          {updateUserKeyError && (
            <Message
              type="error"
              header="Error generating new identity"
              body={updateUserKeyError.message}
            />
          )}
          {identityImportError && (
            <Message
              type="error"
              header="Error importing identity"
              body={identityImportError}
            />
          )}
          {identityImportSuccess && (
            <Message
              type="success"
              header={identityImportSuccess}
            />
          )}
          <p>
            If you've lost your identity (because you've switched browsers
            or cleared your cookies, for example), you can generate a new one. This
            new identity will replace your existing one, but note that Politeia keeps
            a record of all your past public keys.
          </p>
          <button
            style={{ maxWidth: "184px" }}
            className="c-btn c-btn-primary"
            onClick={this.onGenerateNewIdentity}
            disabled={(updateUserKey && updateUserKey.success) || this.state.openedVerification}>
            Create New Identity
          </button>
          <PrivateKeyIdentityManager
            loggedInAsEmail={loggedInAsEmail}
            onUpdateUserKey={onUpdateUserKey}
            onIdentityImported={onIdentityImported}
            userPubkey={userPubkey}
          />
          <h1>Change Username</h1>
          <UsernameChange />
          <h1>Change Password</h1>
          <PasswordChange />
        </div>
      </div>
    );
  }
}

export default accountConnector(KeyPage);
