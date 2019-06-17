import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "pi-ui";
import InfoSection from "./InfoSection.jsx";
import { getUserActivePublicKey, isUserEmailVerified, hasUserPaid, isUserLocked, isExpired, isUserDeactivated, isUserAdmin } from "./helpers";
import { convertAtomsToDcr, formatUnixTimestamp } from "src/utilsv2";
import ModalChangePassword from "src/componentsv2/ModalChangePassword";
import ModalConfirmWithReason from "src/componentsv2/ModalConfirmWithReason";
import { useChangePassword, useManageUser } from "./hooks";
import {
  MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION
  // MANAGE_USER_CLEAR_USER_PAYWALL,
  // MANAGE_USER_EXPIRE_NEW_USER_VERIFICATION,
  // MANAGE_USER_EXPIRE_UPDATE_KEY_VERIFICATION,
  // MANAGE_USER_UNLOCK,
  // MANAGE_USER_DEACTIVATE,
  // MANAGE_USER_REACTIVATE,
  // PUB_KEY_STATUS_LOADED,
  // PUB_KEY_STATUS_LOADING
} from "src/constants";

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
  const { onManageUser } = useManageUser();
  const markResetPasswordTokenAsExpired = (reason) => onManageUser(id, MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION, reason);


  // Confirm Action Modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const openConfirmModal = () => setShowConfirmModal(true);
  const closeConfirmModal = () => setShowConfirmModal(false);

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
              {hasUserPaid(newuserpaywalltx)}
              {isAdmin && hasUserPaid(newuserpaywalltx) === "No" && <Link style={{ marginLeft: "5px" }} href="#">Mark as paid</Link>}
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
              {isAdmin && isUserDeactivated(isdeactivated) === "No" && <Link style={{ marginLeft: "5px" }} href="#">Deactivate</Link>}
            </>} />
          {resetpasswordverificationtoken &&
            <>
              <InfoSection label="Reset password token:" info={resetpasswordverificationtoken} />
              <InfoSection label="Expires:" info={
                isExpired(resetpasswordverificationexpiry) ? <span>Expired</span>
                  :
                  <>
                    {formatUnixTimestamp(resetpasswordverificationexpiry)}
                    <Link style={{ marginLeft: "5px" }} href="#" onClick={openConfirmModal}>Mark as expired</Link>
                  </>
              } />
            </>
          }
        </>
      )}
      <ModalChangePassword onChangePassword={onChangePassword} validationSchema={validationSchema} show={showPasswordModal} onClose={closePasswordModal} />
      <ModalConfirmWithReason onSubmit={markResetPasswordTokenAsExpired} validationSchema={validationSchema} show={showConfirmModal} onClose={closeConfirmModal} />
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
