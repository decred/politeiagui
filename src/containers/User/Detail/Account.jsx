import { Button, Card } from "pi-ui";
import PropTypes from "prop-types";
import React, { useState } from "react";
import ModalChangePassword from "src/componentsv2/ModalChangePassword";
import ModalConfirmWithReason from "src/componentsv2/ModalConfirmWithReason";
import { MANAGE_USER_DEACTIVATE, MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION, MANAGE_USER_REACTIVATE } from "src/constants";
import { convertAtomsToDcr, formatUnixTimestamp } from "src/utilsv2";
import { isExpired, isUserAdmin, isUserDeactivated, isUserEmailVerified, isUserLocked } from "./helpers";
import { useActivationModal, useChangePassword, useManageUser, useMarkAsExpiredConfirmModal } from "./hooks";
import InfoSection from "./InfoSection.jsx";

const Account = ({
  id,
  newuserverificationtoken,
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
  const {
    onManageUser,
    isApiRequestingDeactivateUser,
    isApiRequestingReactivateUser
  } = useManageUser();

  const isActivationLoading =
    isApiRequestingDeactivateUser || isApiRequestingReactivateUser;

  const markResetPasswordTokenAsExpired = reason =>
    onManageUser(id, MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION, reason);
  const deactivateUser = reason =>
    onManageUser(id, MANAGE_USER_DEACTIVATE, reason);
  const reactivateUser = reason =>
    onManageUser(id, MANAGE_USER_REACTIVATE, reason);

  const {
    showMarkAsExpiredConfirmModal,
    openMarkAsExpiredConfirmModal,
    closeMarkAsExpiredConfirmModal
  } = useMarkAsExpiredConfirmModal();
  const {
    showActivationConfirmModal,
    openActivationModal,
    closeActivationModal
  } = useActivationModal();

  // Change Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const openPasswordModal = e => {
    e.preventDefault();
    setShowPasswordModal(true);
  };
  const closePasswordModal = () => setShowPasswordModal(false);
  const { onChangePassword, validationSchema } = useChangePassword();

  const showDetailedLabels = isUserPageOwner || isAdmin;
  return (
    <Card className="container">
      <InfoSection
        className="no-margin-top"
        label="Admin:"
        info={isUserAdmin(isadmin) ? "Yes" : "No"}
      />
      {showDetailedLabels && (
        <>
          <InfoSection
            label="Verified email:"
            info={isUserEmailVerified(newuserverificationtoken) ? "Yes" : "No"}
          />
          {isUserPageOwner && (
            <InfoSection
              label="Password:"
              alignLabelCenter
              info={
                <Button size="sm" onClick={openPasswordModal}>
                  Change Password
                </Button>
              }
            />
          )}
          <InfoSection
            label="Address:"
            info={
              <span style={{ wordBreak: "break-word" }}>
                {newuserpaywalladdress}
              </span>
            }
          />
          <InfoSection
            label="Amount:"
            info={`${convertAtomsToDcr(newuserpaywallamount)} DCR`}
          />
          <InfoSection
            label="Pay after:"
            info={formatUnixTimestamp(newuserpaywalltxnotbefore)}
          />
          <InfoSection
            label="Failed login attempts:"
            info={failedloginattempts}
          />
          <InfoSection
            label="Locked:"
            info={isUserLocked(islocked) ? "Yes" : "No"}
          />
          <InfoSection
            label="Deactivated:"
            info={
              <>
                {isUserDeactivated(isdeactivated) ? "Yes" : "No"}
                {isAdmin &&
                  (!isUserDeactivated(isdeactivated) ? (
                    <Button
                      className="margin-top-s"
                      loading={isActivationLoading}
                      size="sm"
                      onClick={openActivationModal}
                    >
                      Deactivate
                    </Button>
                  ) : (
                      isAdmin && (
                        <Button
                          className="margin-top-s"
                          loading={isActivationLoading}
                          size="sm"
                          onClick={openActivationModal}
                        >
                          Reactivate
                      </Button>
                      )
                    ))}
              </>
            }
          />
          {resetpasswordverificationtoken && (
            <>
              <InfoSection
                label="Reset password token:"
                info={resetpasswordverificationtoken}
              />
              <InfoSection
                label="Expires:"
                info={
                  isExpired(resetpasswordverificationexpiry) ? (
                    <span>Expired</span>
                  ) : (
                      <>
                        {formatUnixTimestamp(resetpasswordverificationexpiry)}
                        <Button
                          loading={isActivationLoading}
                          size="sm"
                          onClick={openMarkAsExpiredConfirmModal}
                        >
                          Mark as expired
                      </Button>
                      </>
                    )
                }
              />
            </>
          )}
        </>
      )}
      <ModalChangePassword
        onChangePassword={onChangePassword}
        validationSchema={validationSchema}
        show={showPasswordModal}
        onClose={closePasswordModal}
      />
      <ModalConfirmWithReason
        subject="expireResetPasswordToken"
        onSubmit={markResetPasswordTokenAsExpired}
        validationSchema={validationSchema}
        show={showMarkAsExpiredConfirmModal}
        onClose={closeMarkAsExpiredConfirmModal}
      />
      <ModalConfirmWithReason
        subject="deactivateOrReactivateUser"
        onSubmit={isdeactivated ? reactivateUser : deactivateUser}
        validationSchema={validationSchema}
        show={showActivationConfirmModal}
        onClose={closeActivationModal}
      />
    </Card>
  );
};

Account.propTypes = {
  newuserverificationtoken: PropTypes.any,
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

export default Account;
