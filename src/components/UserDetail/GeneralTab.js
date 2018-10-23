import React from "react";
import userConnector from "../../connectors/user";
import ButtonWithLoadingIcon from "../snew/ButtonWithLoadingIcon";
import {
  EDIT_USER_CLEAR_USER_PAYWALL,
  EDIT_USER_EXPIRE_NEW_USER_VERIFICATION,
  EDIT_USER_EXPIRE_UPDATE_KEY_VERIFICATION,
  EDIT_USER_EXPIRE_RESET_PASSWORD_VERIFICATION,
  EDIT_USER_UNLOCK,
  PUB_KEY_STATUS_LOADED,
  EDIT_USER_DEACTIVATE,
  EDIT_USER_REACTIVATE
} from "../../constants";
import { CHANGE_PASSWORD_MODAL, CONFIRM_ACTION } from "../Modal/modalTypes";
import PrivateKeyIdentityManager from "../PrivateKeyIdentityManager";
import Message from "../Message";
import { myPubKeyHex } from "../../lib/pki";
import { verifyUserPubkey } from "../../helpers";

const Field = ({
  label,
  children
}) => (
  <div className="field">
    <label className="field-label">{label + ":"}</label>
    <div className="field-value">{children}</div>
    <div className="clear"></div>
  </div>
);

const UTCDate = ({
  time
}) => (
  <span>{new Date(time * 1000).toUTCString()}</span>
);

const FieldSeparator = () => (
  <div className="field-separator"></div>
);

const TokenFields = ({
  tokenLabel,
  token,
  expiry,
  userId,
  action,
  isRequesting,
  onEditUser
}) => (
  <div>
    <Field label={tokenLabel}>{token}</Field>
    {(new Date().getTime() > (expiry * 1000)) ? (
      <Field label="Expired">Yes</Field>
    ) : (
      <Field label="Expires">
        <UTCDate time={expiry} />
        <ButtonWithLoadingIcon
          className="c-btn c-btn-primary button-small"
          text="Mark as expired"
          disabled={isRequesting}
          isLoading={isRequesting}
          onClick={() => onEditUser(userId, action)} />
      </Field>
    )}
  </div>
);
const UpdatedKeyMessage = ({ email }) => (
  <span>
    Your new identity has been requested, please check your email at{" "}
    <b>{email}</b> to verify and activate it.
    <br />
    The verification link needs to be open with the same browser
    that you used to generate this new identity.
  </span>
);

const IdentityField = ({ identities, children }) => (
  identities && identities.length ? (
    <React.Fragment>
      {identities.map(id => {
        if (id.isactive) {
          return (
            <Field key={id.pubkey} label="Active identity">
              <div key={id.pubkey}>{" " + id.pubkey + " "}</div>
              {children}
            </Field>
          );
        }
        return null;
      })}
    </React.Fragment>
  ) : null
);

class GeneralTab extends React.Component {
  constructor(props) {
    super(props);
    this.identityHelpPrompt = "Manage Identity";
    this.state = {
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
    this.isMessageShown();
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

  isMessageShown() {
    const { updateUserKey, keyMismatch, identityImportSuccess, updateUserKeyError, identityImportError } = this.props;
    if ((updateUserKey && updateUserKey.success) || (keyMismatch && !identityImportSuccess) || (updateUserKeyError)
      || (identityImportError) || (identityImportSuccess)) {
      this.setState({ showIdentityHelpText: true });
    }
  }
  render() {
    const {
      user,
      dcrdataTxUrl,
      isApiRequestingMarkAsPaid,
      isApiRequestingMarkNewUserAsExpired,
      isApiRequestingMarkUpdateKeyAsExpired,
      isApiRequestingMarkResetPasswordAsExpired,
      isApiRequestingUnlockUser,
      onEditUser,
      isAdmin,
      openModal,
      loggedInAsEmail,
      onUpdateUserKey,
      updateUserKey,
      updateUserKeyError,
      onIdentityImported,
      identityImportError,
      identityImportSuccess,
      userPubkey,
      keyMismatch,
      isApiRequestingDeactivateUser,
      isApiRequestingReactivateUser,
      loggedInAsUserId,
      isLoadingRescan,
      onRescan,
      errorRescan,
      amountOfCreditsAddedOnRescan,
      onResetRescan,
      rescanUserId
    } = this.props;
    const { showIdentityHelpText } = this.state;
    const userHasActivePaywall = user && user.newuserpaywalladdress && user.newuserpaywallamount;
    const isUserPageOwner = loggedInAsUserId === user.id;
    const hasTheRescanResult = amountOfCreditsAddedOnRescan !== undefined && rescanUserId === user.id;
    return (
      <div className="detail-form">
        <div>
          <Field label="Proposal credits">
            {user.proposalcredits}
            {isAdmin ?
              <ButtonWithLoadingIcon
                className="c-btn c-btn-primary button-small"
                isLoading={isLoadingRescan}
                onClick={() => onRescan(user.id)}
                text="rescan"
              /> : null}
          </Field>
          {hasTheRescanResult ?
            <Message
              type="success"
              body={<div>
                {amountOfCreditsAddedOnRescan === 0 ?
                  <span>User credits are up to date.</span> :
                  <span><b>{amountOfCreditsAddedOnRescan} proposal credits </b>were found by the rescan.</span>
                }
              </div>}
              onDismissClick={onResetRescan}
            /> : null}
          {errorRescan ?
            <Message
              type="error"
              body={errorRescan}
            /> : null}
          <FieldSeparator />
        </div>
        <IdentityField identities={user.identities}>
          {(isUserPageOwner) ?
            <p>
              {showIdentityHelpText && isUserPageOwner ? (
                <div>
                  <span style={{ fontWeight: "bold", maxWidth: "7em" }}>{this.identityHelpPrompt}</span>{" "}
                  <a className="linkish" onClick={() => this.setState({ showIdentityHelpText: false })}>
                (hide)
                  </a>
                </div>
              ) : (
                <a className="linkish" style={{ maxWidth: "7em" }} onClick={() => this.setState({ showIdentityHelpText: true })}>
                  {this.identityHelpPrompt}
                </a>
              )}
            </p> : null }
          {showIdentityHelpText && isUserPageOwner ? (
            <div className="identity-help">
              <p>
                <br />
                <b>What is an Identity:</b> Each user has a unique <i>identity</i> which is necessary
              for proving who the author of a proposal is. An identity was generated automatically for you when you created an
              account. Every identity is made up of a pair of keys: one public &amp; one private.
              </p>
              <br />
              <ul>
                <li><b>Private key:</b> A key only you have access to that is used for creating a "signature" whenever you submit a proposal.</li>
                <br />
                <li><b>Public key:</b> A key that you share with others (and Politeia) which proves your proposal was signed with your private key.</li>
              </ul>
              <br />
              <p>
                <b>Note:</b> If you've lost your identity (because you've switched browsers
              or cleared your cookies, for example), you can create a new one. This
              new identity will replace your existing one, but note that Politeia keeps
              a record of all your past public keys. You can also download your current
              identity for future use or import an existing one.
              </p>
              <br />
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
              <div style={{ display: "flex", flexDirection: "row" }}>
                <button
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
              </div>
              <FieldSeparator />
            </div>
          ) : null}
        </IdentityField>
        <FieldSeparator />
        {!user.newuserverificationtoken ? (
          <Field label="Verified email">Yes</Field>
        ) : (
          <div>
            <Field label="Verified email">No</Field>
            <TokenFields
              tokenLabel="Registration token"
              token={" " + user.newuserverificationtoken + " "}
              expiry={user.newuserverificationexpiry}
              userId={user.id}
              action={EDIT_USER_EXPIRE_NEW_USER_VERIFICATION}
              isRequesting={isApiRequestingMarkNewUserAsExpired}
              onEditUser={onEditUser} />
          </div>
        )}
        {(loggedInAsUserId === user.id) ?
          <Field label="Password"><a className="linkish" onClick={() => openModal(CHANGE_PASSWORD_MODAL)}>Change Password</a></Field> : null}
        <FieldSeparator />
        <Field label="Has paid">
          {user.newuserpaywalltx ? "Yes" : ([
            <span>No</span>,
            isAdmin && <ButtonWithLoadingIcon
              className="c-btn c-btn-primary button-small"
              text="Mark as paid"
              disabled={isApiRequestingMarkAsPaid}
              isLoading={isApiRequestingMarkAsPaid}
              onClick={() => onEditUser(user.id, EDIT_USER_CLEAR_USER_PAYWALL)} />
          ])}
        </Field>
        {userHasActivePaywall ? (
          <div>
            <Field label="Address">{" " + user.newuserpaywalladdress + " "}</Field>
            <Field label="Amount">{user.newuserpaywallamount / 100000000} DCR</Field>
            {!user.newuserpaywalltx && ([
              <Field label="Pay after"><UTCDate time={user.newuserpaywalltxnotbefore} /></Field>,
              <FieldSeparator />
            ])}
          </div>
        ) : null}
        {user.newuserpaywalltx && ([
          <Field label="Transaction" key={0}>
            {user.newuserpaywalltx === "cleared_by_admin" ?
              <span>Cleared by admin</span> :
              <a href={dcrdataTxUrl + user.newuserpaywalltx} target="_blank" rel="noopener noreferrer">{user.newuserpaywalltx}</a>
            }
          </Field>,
          <FieldSeparator key={2} />
        ])}
        <Field label="Failed login attempts">{user.failedloginattempts}</Field>
        <Field label="Locked">
          {!user.islocked ? "No" : ([
            <span>Yes</span>,
            <ButtonWithLoadingIcon
              className="c-btn c-btn-primary button-small"
              text="Unlock user"
              disabled={isApiRequestingUnlockUser}
              isLoading={isApiRequestingUnlockUser}
              onClick={() => onEditUser(user.id, EDIT_USER_UNLOCK)} />
          ])}
        </Field>
        {isAdmin &&
          <React.Fragment>
            <FieldSeparator />
            <Field label="Deactivated">
              {user.isdeactivated ?
                <React.Fragment>
                  <span style={{ fontWeight: "bold", color: "red" }}>Yes</span>
                  <ButtonWithLoadingIcon
                    className="c-btn c-btn-primary button-small"
                    text="Re-activate account"
                    disabled={isApiRequestingReactivateUser}
                    isLoading={isApiRequestingReactivateUser}
                    onClick={() => onEditUser(user.id, EDIT_USER_REACTIVATE)} />
                </React.Fragment>
                :
                <React.Fragment>
                  <span>No</span>
                  <ButtonWithLoadingIcon
                    className="c-btn c-btn-primary button-small"
                    text="Deactivate account"
                    disabled={isApiRequestingDeactivateUser}
                    isLoading={isApiRequestingDeactivateUser}
                    onClick={() => onEditUser(user.id, EDIT_USER_DEACTIVATE)} />
                </React.Fragment>}
            </Field>
          </React.Fragment>}
        <FieldSeparator />
        {user.updatekeyverificationtoken && ([
          <TokenFields
            tokenLabel="Update key token"
            token={" " + user.updatekeyverificationtoken + " "}
            expiry={user.updatekeyverificationexpiry}
            userId={user.id}
            action={EDIT_USER_EXPIRE_UPDATE_KEY_VERIFICATION}
            isRequesting={isApiRequestingMarkUpdateKeyAsExpired}
            onEditUser={onEditUser} />,
          <FieldSeparator />
        ])}
        {user.resetpasswordverificationtoken && ([
          <TokenFields
            tokenLabel="Reset password token"
            token={" " + user.resetpasswordverificationtoken + " "}
            expiry={user.resetpasswordverificationexpiry}
            userId={user.id}
            action={EDIT_USER_EXPIRE_RESET_PASSWORD_VERIFICATION}
            isRequesting={isApiRequestingMarkResetPasswordAsExpired}
            onEditUser={onEditUser} />,
          <FieldSeparator />
        ])}
      </div>
    );
  }
}

export default userConnector(GeneralTab);
