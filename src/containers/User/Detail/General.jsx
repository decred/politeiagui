import { Link, Spinner } from "pi-ui";
import PropTypes from "prop-types";
import React, { useState } from "react";
import ModalChangePassword from "src/componentsv2/ModalChangePassword";
import ModalConfirmWithReason from "src/componentsv2/ModalConfirmWithReason";
import { MANAGE_USER_CLEAR_USER_PAYWALL, MANAGE_USER_DEACTIVATE, MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION, MANAGE_USER_REACTIVATE } from "src/constants";
import { convertAtomsToDcr, formatUnixTimestamp } from "src/utilsv2";
import { getUserActivePublicKey, hasUserPaid, isExpired, isUserAdmin, isUserDeactivated, isUserEmailVerified, isUserLocked } from "./helpers";
import { useActivationModal, useChangePassword, useManageUser, useMarkAsExpiredConfirmModal, useMarkAsPaidModal } from "./hooks";
import InfoSection from "./InfoSection.jsx";

const General = ({
  proposalcredits,
  identities,
  id,
  newuserverificationtoken,
  newuserpaywalltx,
  newuserpaywalladdress,
  newuserpaywallamount,
  newuserpaywalltxnotbefore,
  failedloginattempts,
  resetpasswordverificationtoken,
  resetpasswordverificationexpiry,
  islocked,
  isdeactivated,
  isUserPageOwner,
  isadmin, // from the user API return
  isAdmin // from the logged in user
}) => {

  // Manage User
  const { onManageUser, isApiRequestingDeactivateUser, isApiRequestingReactivateUser, isApiRequestingMarkAsPaid } = useManageUser();

  const isActivationLoading = isApiRequestingDeactivateUser || isApiRequestingReactivateUser;

  const markResetPasswordTokenAsExpired = (reason) => onManageUser(id, MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION, reason);
  const deactivateUser = (reason) => onManageUser(id, MANAGE_USER_DEACTIVATE, reason);
  const reactivateUser = (reason) => onManageUser(id, MANAGE_USER_REACTIVATE, reason);
  const markAsPaid = (reason) => onManageUser(id, MANAGE_USER_CLEAR_USER_PAYWALL, reason);

  const { showMarkAsExpiredConfirmModal, openMarkAsExpiredConfirmModal, closeMarkAsExpiredConfirmModal } = useMarkAsExpiredConfirmModal();
  const { showActivationConfirmModal, openActivationModal, closeActivationModal } = useActivationModal();
  const { showMarkAsPaidConfirmModal, openMarkAsPaidModal, closeMarkAsPaidModal } = useMarkAsPaidModal();

  // Change Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const openPasswordModal = () => setShowPasswordModal(true);
  const closePasswordModal = () => setShowPasswordModal(false);
  const { onChangePassword, validationSchema } = useChangePassword();

  const showDetailedLabels = isUserPageOwner
    || isAdmin;
  return (
    <>
      <InfoSection label="Admin:" info={isUserAdmin(isadmin)} />
      <InfoSection label="User public key:" info={getUserActivePublicKey(identities)} />
      {showDetailedLabels && (
        <>
          <InfoSection label="Proposal credits:" info={
            <>
              {proposalcredits}
              {isAdmin && <Link href="#" style={{ marginLeft: "5px" }}>Rescan</Link>}
            </>}
          />
          <InfoSection label="Verified email:" info={isUserEmailVerified(newuserverificationtoken)} />
          {
            isUserPageOwner &&
            <InfoSection label="Password:" info={<Link href="#" onClick={openPasswordModal}>Change Password</Link>} />
          }
          <InfoSection label="Has paid:" info={
            <>
              {hasUserPaid(newuserpaywalltx, newuserpaywallamount)}
              {isAdmin && hasUserPaid(newuserpaywalltx, newuserpaywallamount) === "No" ? isApiRequestingMarkAsPaid ?
                <span style={{ marginLeft: "5px" }}>
                  <Spinner invert />
                </span> : <Link style={{ marginLeft: "5px" }} href="#" onClick={openMarkAsPaidModal}>Mark as paid</Link> : null}
            </>
          } />
          <InfoSection label="Address:" info={newuserpaywalladdress} />
          <InfoSection label="Amount:" info={`${convertAtomsToDcr(newuserpaywallamount)} DCR`} />
          <InfoSection label="Pay after:" info={formatUnixTimestamp(newuserpaywalltxnotbefore)} />
          <InfoSection label="Failed login attempts:" info={failedloginattempts} />
          <InfoSection label="Locked:" info={isUserLocked(islocked)} />
          <InfoSection label="Deactivated:" info={
            <>
              {isUserDeactivated(isdeactivated)}
              {isAdmin && (isActivationLoading ?
                <span style={{ marginLeft: "5px" }}>
                  <Spinner invert />
                </span>
                :
                isUserDeactivated(isdeactivated) === "No" ?
                  <Link style={{ marginLeft: "5px" }} href="#" onClick={openActivationModal}>Deactivate</Link> :
                  <Link style={{ marginLeft: "5px" }} href="#" onClick={openActivationModal}>Reactivate</Link>)}
            </>
          } />
          {resetpasswordverificationtoken &&
            <>
              <InfoSection label="Reset password token:" info={resetpasswordverificationtoken} />
              <InfoSection label="Expires:" info={
                isExpired(resetpasswordverificationexpiry) ? <span>Expired</span>
                  :
                  <>
                    {formatUnixTimestamp(resetpasswordverificationexpiry)}
                    <Link style={{ marginLeft: "5px" }} href="#" onClick={openMarkAsExpiredConfirmModal}>Mark as expired</Link>
                  </>
              } />
            </>
          }
        </>
      )}
      <ModalChangePassword onChangePassword={onChangePassword} validationSchema={validationSchema} show={showPasswordModal} onClose={closePasswordModal} />
      <ModalConfirmWithReason onSubmit={markResetPasswordTokenAsExpired} validationSchema={validationSchema} show={showMarkAsExpiredConfirmModal} onClose={closeMarkAsExpiredConfirmModal} />
      <ModalConfirmWithReason onSubmit={isdeactivated ? reactivateUser : deactivateUser} validationSchema={validationSchema} show={showActivationConfirmModal} onClose={closeActivationModal} />
      <ModalConfirmWithReason onSubmit={markAsPaid} validationSchema={validationSchema} show={showMarkAsPaidConfirmModal} onClose={closeMarkAsPaidModal} />
    </>
  );
};

General.propTypes = {
  proposalcredits: PropTypes.string,
  identities: PropTypes.array,
  newuserverificationtoken: PropTypes.any,
  newuserpaywalltx: PropTypes.string,
  newuserpaywalladdress: PropTypes.string,
  newuserpaywallamount: PropTypes.number,
  newuserpaywalltxnotbefore: PropTypes.number,
  failedloginattempts: PropTypes.number,
  resetpasswordverificationexpiry: PropTypes.number,
  resetpasswordverificationtoken: PropTypes.any,
  islocked: PropTypes.bool,
  id: PropTypes.string,
  isadmin: PropTypes.bool,
  isdeactivated: PropTypes.bool
};

export default General;
