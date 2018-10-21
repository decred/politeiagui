import React from "react";
import userConnector from "../../connectors/user";
import ButtonWithLoadingIcon from "../snew/ButtonWithLoadingIcon";
import {
  EDIT_USER_CLEAR_USER_PAYWALL,
  EDIT_USER_EXPIRE_NEW_USER_VERIFICATION,
  EDIT_USER_EXPIRE_UPDATE_KEY_VERIFICATION,
  EDIT_USER_EXPIRE_RESET_PASSWORD_VERIFICATION,
  EDIT_USER_UNLOCK,
  EDIT_USER_DEACTIVATE,
  EDIT_USER_REACTIVATE
} from "../../constants";


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

const IdentityField = ({ identities }) => (
  identities && identities.length ? (
    <React.Fragment>
      {identities.map(id => {
        if (id.isactive) {
          return (
            <Field key={id.pubkey} label="Active identity">{" " + id.pubkey + " "}</Field>
          );
        }
        return null;
      })}
      <FieldSeparator />
    </React.Fragment>
  ) : null
);

const GeneralTab = ({
  user,
  dcrdataTxUrl,
  isApiRequestingMarkAsPaid,
  isApiRequestingMarkNewUserAsExpired,
  isApiRequestingMarkUpdateKeyAsExpired,
  isApiRequestingMarkResetPasswordAsExpired,
  isApiRequestingUnlockUser,
  isApiRequestingDeactivateUser,
  isApiRequestingReactivateUser,
  onEditUser,
  isAdmin
}) => {
  const userHasActivePaywall = user && user.newuserpaywalladdress && user.newuserpaywallamount;
  return (
    <div className="detail-form">
      <IdentityField identities={user.identities} />
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
      {isAdmin && ([
        <FieldSeparator />,
        <Field label="Deactivated">
          {user.isdeactivated ? ([
            <span style={{ fontWeight: "bold", color: "red" }}>Yes</span>,
            <ButtonWithLoadingIcon
              className="c-btn c-btn-primary button-small"
              text="Re-activate account"
              disabled={isApiRequestingReactivateUser}
              isLoading={isApiRequestingReactivateUser}
              onClick={() => onEditUser(user.id, EDIT_USER_REACTIVATE)} />
          ]) : ([
            <span>No</span>,
            <ButtonWithLoadingIcon
              className="c-btn c-btn-primary button-small"
              text="Deactivate account"
              disabled={isApiRequestingDeactivateUser}
              isLoading={isApiRequestingDeactivateUser}
              onClick={() => onEditUser(user.id, EDIT_USER_DEACTIVATE)} />
          ])}
        </Field>
      ])}
      <FieldSeparator />
      <Field label="Proposal credits">{user.proposalcredits}</Field>
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
};

export default userConnector(GeneralTab);
