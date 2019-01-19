import React from "react";
import userConnector from "../../connectors/user";
import ButtonWithLoadingIcon from "../snew/ButtonWithLoadingIcon";
import {
  MANAGE_USER_CLEAR_USER_PAYWALL,
  MANAGE_USER_EXPIRE_NEW_USER_VERIFICATION,
  MANAGE_USER_EXPIRE_UPDATE_KEY_VERIFICATION,
  MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION,
  MANAGE_USER_UNLOCK,
  MANAGE_USER_DEACTIVATE,
  MANAGE_USER_REACTIVATE,
  PUB_KEY_STATUS_LOADED,
  PUB_KEY_STATUS_LOADING,
  PAYWALL_STATUS_PAID
} from "../../constants";
import { CHANGE_PASSWORD_MODAL, CONFIRM_ACTION } from "../Modal/modalTypes";
import PrivateKeyDownloadManager from "../PrivateKeyDownloadManager";
import Message from "../Message";
import { myPubKeyHex } from "../../lib/pki";
import { verifyUserPubkey } from "../../helpers";

const Field = ({ label, children }) => (
  <div className="field">
    <label className="field-label">{label && label + ":"}</label>
    <div className="field-value">{children}</div>
    <div className="clear" />
  </div>
);

const UTCDate = ({ time }) => (
  <span>{new Date(time * 1000).toUTCString()}</span>
);

const FieldSeparator = () => <div className="field-separator" />;

const TokenFields = ({
  tokenLabel,
  token,
  expiry,
  userId,
  action,
  isRequesting,
  onManageUser
}) => (
  <div>
    <Field label={tokenLabel}>{token}</Field>
    {new Date().getTime() > expiry * 1000 ? (
      <Field label="Expired">Yes</Field>
    ) : (
      <Field label="Expires">
        <UTCDate time={expiry} />
        <ButtonWithLoadingIcon
          className="c-btn c-btn-primary button-small"
          text="Mark as expired"
          disabled={isRequesting}
          isLoading={isRequesting}
          onClick={() => onManageUser(userId, action)}
        />
      </Field>
    )}
  </div>
);
const UpdatedKeyMessage = ({ email }) => (
  <span>
    Your new identity has been requested, please check your email at{" "}
    <b>{email}</b> to verify and activate it.
    <br />
    The verification link needs to be open with the same browser that you used
    to generate this new identity.
  </span>
);

class GeneralTab extends React.Component {
  constructor(props) {
    super(props);
    this.identityHelpPrompt = "Manage Identity";
    this.state = {
      showIdentityHelpText: false,
      openedVerification: false,
      pubkey: "",
      pubkeyStatus: PUB_KEY_STATUS_LOADING,
      showPastUserIdentities: false
    };
  }

  resolvePubkey = () => {
    if (!this.state.pubkey && this.props.loggedInAsEmail) {
      this.refreshPubKey();
    }
  };

  updatePubkey = (shouldAutoVerifyKey, prevUpdateUserKey, updateUserKey) => {
    if (shouldAutoVerifyKey && updateUserKey) {
      const { verificationtoken } = updateUserKey;
      if (
        (prevUpdateUserKey &&
          verificationtoken !== prevUpdateUserKey.verificationtoken) ||
        (!prevUpdateUserKey && verificationtoken)
      ) {
        this.setState({ openedVerification: true });
        this.props.history.push(
          `/user/key/verify/?verificationtoken=${verificationtoken}`
        );
        return;
      }
    }
  };

  refreshPubKey = () => {
    myPubKeyHex(this.props.loggedInAsEmail).then(pubkey => {
      if (!this.unmounting) {
        this.setState({ pubkey, pubkeyStatus: PUB_KEY_STATUS_LOADED });
      }
    });
  };

  componentDidMount() {
    if (this.props.loggedInAsEmail) {
      verifyUserPubkey(
        this.props.loggedInAsEmail,
        this.props.userPubkey,
        this.props.keyMismatchAction
      );
    }
    this.resolvePubkey();
  }

  componentWillUnmount() {
    verifyUserPubkey(
      this.props.loggedInAsEmail,
      this.props.userPubkey,
      this.props.keyMismatchAction
    );
    this.unmounting = true;
    this.props.onIdentityImported(null);
    this.props.onResetRescan();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.loggedInAsEmail && this.props.loggedInAsEmail) {
      verifyUserPubkey(
        this.props.loggedInAsEmail,
        this.props.userPubkey,
        this.props.keyMismatchAction
      );
    }
    this.resolvePubkey();
    if (this.state.openedVerification) return;
    this.updatePubkey(
      this.props.shouldAutoVerifyKey,
      prevProps.updateUserKey,
      this.props.updateUserKey
    );

    // update displayed public key when the identity is successfully imported
    if (!prevProps.identityImportSuccess && this.props.identityImportSuccess) {
      this.refreshPubKey();
    }
  }

  onGenerateNewIdentity = () => {
    const { onUpdateUserKey, loggedInAsEmail, confirmWithModal } = this.props;
    confirmWithModal(CONFIRM_ACTION, {
      message: "Are you sure you want to generate a new identity?"
    }).then(confirm => confirm && onUpdateUserKey(loggedInAsEmail));
  };

  render() {
    const {
      user,
      dcrdataTxUrl,
      userPaywallStatus,
      isApiRequestingMarkAsPaid,
      isApiRequestingMarkNewUserAsExpired,
      isApiRequestingMarkUpdateKeyAsExpired,
      isApiRequestingMarkResetPasswordAsExpired,
      isApiRequestingUnlockUser,
      onManageUser,
      isAdmin,
      openModal,
      loggedInAsEmail,
      onUpdateUserKey,
      updateUserKey,
      updateUserKeyError,
      onIdentityImported,
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
    const {
      showIdentityHelpText,
      pubkey,
      pubkeyStatus,
      showPastUserIdentities
    } = this.state;
    const userHasActivePaywall =
      user && user.newuserpaywalladdress && user.newuserpaywallamount;
    const isUserPageOwner = loggedInAsUserId === user.id;
    const hasTheRescanResult =
      amountOfCreditsAddedOnRescan !== undefined && rescanUserId === user.id;
    const isAdminOrTheUser = user && (isAdmin || loggedInAsUserId === user.id);
    return (
      <div className="detail-form">
        <div>
          {isAdminOrTheUser && (
            <Field label="Proposal credits">
              {user.proposalcredits}
              {isAdmin && (
                <ButtonWithLoadingIcon
                  className="c-btn c-btn-primary button-small"
                  isLoading={isLoadingRescan}
                  onClick={() => onRescan(user.id)}
                  text="rescan"
                />
              )}
            </Field>
          )}
          {hasTheRescanResult && (
            <Message
              type="success"
              body={
                <div>
                  {amountOfCreditsAddedOnRescan === 0 ? (
                    <span>User credits are up to date.</span>
                  ) : (
                    <span>
                      <b>{amountOfCreditsAddedOnRescan} proposal credits </b>
                      were found by the rescan and added to the user account.
                    </span>
                  )}
                </div>
              }
              onDismissClick={onResetRescan}
            />
          )}
          {errorRescan && <Message type="error" body={errorRescan} />}
          <FieldSeparator />
        </div>
        {keyMismatch && !identityImportSuccess && isUserPageOwner ? (
          <Field label="Active Key">
            <div
              style={{ color: "red" }}
              className="monospace"
            >{`${pubkey} is invalid. Please see 'Manage Identity'`}</div>
          </Field>
        ) : (
          <Field className="account-info" label="Active Public Key">
            {isUserPageOwner ? (
              <div className="monospace">
                {pubkeyStatus === PUB_KEY_STATUS_LOADED
                  ? pubkey
                  : "Loading public key..."}
              </div>
            ) : (
              <div className="monospace">
                {pubkeyStatus !== PUB_KEY_STATUS_LOADED ||
                user.identities[user.identities.length - 1].pubkey !== pubkey
                  ? user.identities[user.identities.length - 1].pubkey
                  : "Loading public key..."}
              </div>
            )}
          </Field>
        )}
        {isUserPageOwner && (
          <div style={{ marginLeft: "164px" }}>
            {showIdentityHelpText ? (
              <div>
                <span
                  style={{ fontWeight: "bold", maxWidth: "7em" }}
                  className="ident-value"
                >
                  {this.identityHelpPrompt}
                </span>{" "}
                <span
                  className="linkish"
                  onClick={() => this.setState({ showIdentityHelpText: false })}
                >
                  (hide)
                </span>
              </div>
            ) : (
              <span
                className="linkish ident-value"
                style={{ maxWidth: "7em" }}
                onClick={() => this.setState({ showIdentityHelpText: true })}
              >
                {this.identityHelpPrompt}
              </span>
            )}
          </div>
        )}

        {showIdentityHelpText && isUserPageOwner && (
          <div className="identity-help">
            <p>
              <br />
              <b>What is an Identity:</b> Each user has a unique <i>identity</i>{" "}
              which is necessary for proving who the author of a proposal is. An
              identity was generated automatically for you when you created an
              account. Every identity is made up of a pair of keys: one public
              &amp; one private.
            </p>
            <br />
            <ul>
              <li>
                <b>Private key:</b> A key only you have access to that is used
                for creating a "signature" whenever you submit a proposal.
              </li>
              <br />
              <li>
                <b>Public key:</b> A key that you share with others (and
                Politeia) which proves your proposal was signed with your
                private key.
              </li>
            </ul>
            <br />
            <p>
              <b>Note:</b> If you've lost your identity (because you've switched
              browsers or cleared your cookies, for example), you can create a
              new one. This new identity will replace your existing one, but
              note that Politeia keeps a record of all your past public keys.
              You can also download your current identity for future use or
              import an existing one.
            </p>
            <br />
            {keyMismatch && !identityImportSuccess && (
              <Message
                type="error"
                className="account-page-message"
                header="Action needed"
                body={
                  <div>
                    <p>
                      The public key on the Politeia server differs from the key
                      on your browser. This is usually caused from the local
                      data on your browser being cleared or by using a different
                      browser.
                    </p>
                    <p>
                      You can fix this by importing your old identity, logging
                      in with the proper browser, or by creating a new identity
                      (destroying your old identity).
                    </p>
                  </div>
                }
              />
            )}
            {updateUserKey && updateUserKey.success && (
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
            {identityImportSuccess && (
              <Message type="success" header={identityImportSuccess} />
            )}
            <div style={{ display: "flex", flexDirection: "row" }}>
              <button
                className="c-btn c-btn-primary"
                onClick={this.onGenerateNewIdentity}
                disabled={
                  (updateUserKey && updateUserKey.success) ||
                  this.state.openedVerification
                }
              >
                Create New Identity
              </button>
              <PrivateKeyDownloadManager
                loggedInAsEmail={loggedInAsEmail}
                onUpdateUserKey={onUpdateUserKey}
                onIdentityImported={onIdentityImported}
                userPubkey={userPubkey}
              />
            </div>
            <FieldSeparator />
          </div>
        )}
        <FieldSeparator />
        <Field label="Past Public Keys" style={{ float: "left" }}>
          {showPastUserIdentities ? (
            <span>
              <span style={{ fontWeight: "bold" }}>Expanded</span>
              <span
                className="linkish"
                style={{ paddingLeft: "1em" }}
                onClick={() => this.setState({ showPastUserIdentities: false })}
              >
                (hide)
              </span>
            </span>
          ) : (
            <span
              className="linkish"
              onClick={() => this.setState({ showPastUserIdentities: true })}
            >
              Expand
            </span>
          )}
          {showPastUserIdentities && (
            <ul>
              {user.identities.map((identity, i) => (
                <ul key={identity.pubkey} style={{ lineHeight: "2em" }}>
                  <li
                    style={{
                      float: "left",
                      fontWeight: "bold",
                      marginRight: ".75em",
                      lineHeight: "1.5em"
                    }}
                  >
                    {i + 1})
                  </li>
                  <li className="monospace">{identity.pubkey}</li>
                </ul>
              ))}
            </ul>
          )}
        </Field>
        <FieldSeparator />
        {isAdminOrTheUser && (
          <div>
            <Field label="Verified email">No</Field>
            <TokenFields
              tokenLabel="Registration token"
              token={" " + user.newuserverificationtoken + " "}
              expiry={user.newuserverificationexpiry}
              userId={user.id}
              action={MANAGE_USER_EXPIRE_NEW_USER_VERIFICATION}
              isRequesting={isApiRequestingMarkNewUserAsExpired}
              onManageUser={onManageUser}
            />
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
                  action={MANAGE_USER_EXPIRE_NEW_USER_VERIFICATION}
                  isRequesting={isApiRequestingMarkNewUserAsExpired}
                  onManageUser={onManageUser}
                />
              </div>
            )}
          </div>
        )}
        {loggedInAsUserId === user.id && (
          <Field label="Password">
            <span
              className="linkish"
              onClick={() => openModal(CHANGE_PASSWORD_MODAL)}
            >
              Change Password
            </span>
          </Field>
        )}
        {isAdminOrTheUser && (
          <React.Fragment>
            <FieldSeparator />
            <Field label="Has paid">
              {userPaywallStatus === PAYWALL_STATUS_PAID
                ? "Yes"
                : [
                    <span>No</span>,
                    isAdmin && (
                      <ButtonWithLoadingIcon
                        className="c-btn c-btn-primary button-small"
                        text="Mark as paid"
                        disabled={isApiRequestingMarkAsPaid}
                        isLoading={isApiRequestingMarkAsPaid}
                        onClick={() =>
                          onManageUser(user.id, MANAGE_USER_CLEAR_USER_PAYWALL)
                        }
                      />
                    )
                  ]}
            </Field>
          </React.Fragment>
        )}
        {userHasActivePaywall ? (
          <div>
            <Field label="Address">
              <div className="monospace">
                {" " + user.newuserpaywalladdress + " "}
              </div>
            </Field>
            <Field label="Amount">
              {user.newuserpaywallamount / 100000000} DCR
            </Field>
            {!user.newuserpaywalltx && [
              <Field label="Pay after">
                <UTCDate time={user.newuserpaywalltxnotbefore} />
              </Field>,
              <FieldSeparator />
            ]}
          </div>
        ) : null}
        {user.newuserpaywalltx && [
          <Field label="Transaction" key={0}>
            {user.newuserpaywalltx === "cleared_by_admin" ? (
              <span>Cleared by admin</span>
            ) : (
              <a
                href={dcrdataTxUrl + user.newuserpaywalltx}
                target="_blank"
                className="monospace"
                rel="noopener noreferrer"
              >
                {user.newuserpaywalltx}
              </a>
            )}
          </Field>,
          <FieldSeparator key={2} />
        ]}
        {isAdminOrTheUser && (
            <Field label="Failed login attempts">
              {user.failedloginattempts}
            </Field>
          ) && (
            <Field label="Locked">
              {!user.islocked
                ? "No"
                : [
                    <span>Yes</span>,
                    <ButtonWithLoadingIcon
                      className="c-btn c-btn-primary button-small"
                      text="Unlock user"
                      disabled={isApiRequestingUnlockUser}
                      isLoading={isApiRequestingUnlockUser}
                      onClick={() => onManageUser(user.id, MANAGE_USER_UNLOCK)}
                    />
                  ]}
            </Field>
          )}
        {isAdminOrTheUser && (
          <div>
            <Field label="Failed login attempts">
              {user.failedloginattempts}
            </Field>
            <Field label="Locked">
              {!user.islocked
                ? "No"
                : [
                    <span>Yes</span>,
                    <ButtonWithLoadingIcon
                      className="c-btn c-btn-primary button-small"
                      text="Unlock user"
                      disabled={isApiRequestingUnlockUser}
                      isLoading={isApiRequestingUnlockUser}
                      onClick={() => onManageUser(user.id, MANAGE_USER_UNLOCK)}
                    />
                  ]}
            </Field>
          </div>
        )}
        {isAdmin && (
          <React.Fragment>
            <FieldSeparator />
            <Field label="Deactivated">
              {user.isdeactivated ? (
                <React.Fragment>
                  <span style={{ fontWeight: "bold", color: "red" }}>Yes</span>
                  <ButtonWithLoadingIcon
                    className="c-btn c-btn-primary button-small"
                    text="Re-activate account"
                    disabled={isApiRequestingReactivateUser}
                    isLoading={isApiRequestingReactivateUser}
                    onClick={() =>
                      onManageUser(user.id, MANAGE_USER_REACTIVATE)
                    }
                  />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <span>No</span>
                  <ButtonWithLoadingIcon
                    className="c-btn c-btn-primary button-small"
                    text="Deactivate account"
                    disabled={isApiRequestingDeactivateUser}
                    isLoading={isApiRequestingDeactivateUser}
                    onClick={() =>
                      onManageUser(user.id, MANAGE_USER_DEACTIVATE)
                    }
                  />
                </React.Fragment>
              )}
            </Field>
          </React.Fragment>
        )}
        {!isUserPageOwner && (
          <React.Fragment>
            <Field label="Admin (Y/N)">
              {user && user.isadmin ? <div>Yes</div> : <div>No</div>}
            </Field>
          </React.Fragment>
        )}
        <FieldSeparator />
        <Field label="User ID">
          <div className="monospace">{user.id}</div>
        </Field>
        {user.updatekeyverificationtoken && [
          <TokenFields
            tokenLabel="Update key token"
            token={" " + user.updatekeyverificationtoken + " "}
            expiry={user.updatekeyverificationexpiry}
            userId={user.id}
            action={MANAGE_USER_EXPIRE_UPDATE_KEY_VERIFICATION}
            isRequesting={isApiRequestingMarkUpdateKeyAsExpired}
            onManageUser={onManageUser}
          />,
          <FieldSeparator />
        ]}
        {user.resetpasswordverificationtoken && [
          <TokenFields
            tokenLabel="Reset password token"
            token={" " + user.resetpasswordverificationtoken + " "}
            expiry={user.resetpasswordverificationexpiry}
            userId={user.id}
            action={MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION}
            isRequesting={isApiRequestingMarkResetPasswordAsExpired}
            onManageUser={onManageUser}
          />,
          <FieldSeparator />
        ]}
      </div>
    );
  }
}

export default userConnector(GeneralTab);
