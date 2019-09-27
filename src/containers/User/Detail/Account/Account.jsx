import { Button, Card, Text, classNames } from "pi-ui";
import PropTypes from "prop-types";
import React, { useState } from "react";
import ModalChangePassword from "src/componentsv2/ModalChangePassword";
import ModalConfirmWithReason from "src/componentsv2/ModalConfirmWithReason";
import { MANAGE_USER_DEACTIVATE, MANAGE_USER_EXPIRE_NEW_USER_VERIFICATION, MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION, MANAGE_USER_EXPIRE_UPDATE_KEY_VERIFICATION, MANAGE_USER_REACTIVATE } from "src/constants";
import useBooleanState from "src/hooks/utils/useBooleanState";
import { convertAtomsToDcr, formatUnixTimestamp } from "src/utilsv2";
import { isExpired, isUserAdmin, isUserDeactivated, isUserEmailVerified, isUserLocked } from "../helpers";
import { useChangePassword, useManageUser } from "../hooks";
import InfoSection from "../InfoSection.jsx";
import styles from "./Account.module.css";

const Account = ({
  id,
  newuserverificationtoken,
  newuserverificationexpiry,
  newuserpaywalladdress,
  newuserpaywallamount,
  newuserpaywalltxnotbefore,
  failedloginattempts,
  resetpasswordverificationtoken,
  resetpasswordverificationexpiry,
  updatekeyverificationtoken,
  updatekeyverificationexpiry,
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
    isApiRequestingReactivateUser,
    isApiRequestingMarkNewUserAsExpired,
    isApiRequestingMarkUpdateKeyAsExpired,
    isApiRequestingMarkResetPasswordAsExpired
  } = useManageUser();

  const isActivationLoading =
    isApiRequestingDeactivateUser || isApiRequestingReactivateUser;

  const markResetPasswordTokenAsExpired = reason =>
    onManageUser(id, MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION, reason);
  const markVerificationTokenAsExpired = reason =>
    onManageUser(id, MANAGE_USER_EXPIRE_NEW_USER_VERIFICATION, reason);
  const markUpdateKeyAsExpired = reason =>
    onManageUser(id, MANAGE_USER_EXPIRE_UPDATE_KEY_VERIFICATION, reason);
  const deactivateUser = reason =>
    onManageUser(id, MANAGE_USER_DEACTIVATE, reason);
  const reactivateUser = reason =>
    onManageUser(id, MANAGE_USER_REACTIVATE, reason);

  const [
    showMarkPasswordAsExpiredConfirmModal,
    openMarkPasswordAsExpiredConfirmModal,
    closeMarkPasswordAsExpiredConfirmModal
  ] = useBooleanState(false);
  const [
    showMarkVerificationTokenAsExpiredConfirmModal,
    openMarkVerificationTokenAsExpiredConfirmModal,
    closeMarkVerificationTokenAsExpiredConfirmModal
  ] = useBooleanState(false);
  const [
    showMarkUpdateKeyAsExpiredConfirmModal,
    openMarkUpdateKeyAsExpiredConfirmModal,
    closeMarkUpdateKeyAsExpiredConfirmModal
  ] = useBooleanState(false);
  const [
    showActivationConfirmModal,
    openActivationModal,
    closeActivationModal
  ] = useBooleanState(false);

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
    <Card className={classNames("container", "margin-bottom-m")}>
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
          {isAdmin && (
            <>
              <Text color="grayDark" weight="semibold" className={styles.subtitle}>Security</Text>
              <InfoSection
                label="Failed login attempts:"
                info={failedloginattempts}
              />
              <InfoSection
                noMargin
                label="Locked:"
                info={isUserLocked(islocked) ? "Yes" : "No"}
              />
              {(!isUserDeactivated(isdeactivated) ? (
                <Button
                  className="margin-top-s"
                  loading={isActivationLoading}
                  size="sm"
                  onClick={openActivationModal}
                >
                  Deactivate
                </Button>
              ) : (
                  <Button
                    className="margin-top-s"
                    loading={isActivationLoading}
                    size="sm"
                    onClick={openActivationModal}
                  >
                    Reactivate
                  </Button>
                ))}
              {resetpasswordverificationtoken && (
                <>
                  <Text color="grayDark" weight="semibold" className={styles.subtitle}>Password</Text>
                  <InfoSection
                    label="Reset password token:"
                    info={resetpasswordverificationtoken}
                  />
                  <InfoSection
                    noMargin
                    label="Expires:"
                    info={
                      isExpired(resetpasswordverificationexpiry) ? (
                        <span>Expired</span>
                      ) : (
                          formatUnixTimestamp(resetpasswordverificationexpiry)
                        )
                    }
                  />
                  {!isExpired(resetpasswordverificationexpiry) && (
                    <Button
                      loading={isApiRequestingMarkResetPasswordAsExpired}
                      size="sm"
                      className="margin-top-s"
                      onClick={openMarkPasswordAsExpiredConfirmModal}
                    >
                      Mark as expired
                    </Button>
                  )}
                </>
              )}
              {newuserverificationtoken && (
                <>
                  <Text color="grayDark" weight="semibold" className={styles.subtitle}>Verification token</Text>
                  <InfoSection
                    label="Verification token:"
                    info={newuserverificationtoken}
                  />
                  <InfoSection
                    noMargin
                    label="Expires:"
                    info={
                      isExpired(newuserverificationexpiry) ? (
                        <span>Expired</span>
                      ) : (
                          formatUnixTimestamp(newuserverificationexpiry)
                        )
                    }
                  />
                  {!isExpired(newuserverificationexpiry) && (
                    <Button
                      loading={isApiRequestingMarkNewUserAsExpired}
                      className="margin-top-s"
                      size="sm"
                      onClick={openMarkVerificationTokenAsExpiredConfirmModal}
                    >
                      Mark as expired
                    </Button>
                  )}
                </>
              )}
              {updatekeyverificationtoken && (
                <>
                  <Text color="grayDark" weight="semibold" className={styles.subtitle}>Update key</Text>
                  <InfoSection
                    label="Update key token:"
                    info={updatekeyverificationtoken}
                  />
                  <InfoSection
                    noMargin
                    label="Expires:"
                    info={
                      isExpired(updatekeyverificationexpiry) ? (
                        <span>Expired</span>
                      ) : (
                          formatUnixTimestamp(updatekeyverificationexpiry)
                        )
                    }
                  />
                  {!isExpired(updatekeyverificationexpiry) && (
                    <Button
                      loading={isApiRequestingMarkUpdateKeyAsExpired}
                      className="margin-top-s"
                      size="sm"
                      onClick={openMarkUpdateKeyAsExpiredConfirmModal}
                    >
                      Mark as expired
                    </Button>
                  )}
                </>
              )}
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
        show={showMarkPasswordAsExpiredConfirmModal}
        onClose={closeMarkPasswordAsExpiredConfirmModal}
        successTitle="Reset password token marked as expired"
        successMessage={
          <Text>The reset password token has been successfully marked as expired.</Text>
        }
      />
      <ModalConfirmWithReason
        subject="expireVerificationToken"
        onSubmit={markVerificationTokenAsExpired}
        validationSchema={validationSchema}
        show={showMarkVerificationTokenAsExpiredConfirmModal}
        onClose={closeMarkVerificationTokenAsExpiredConfirmModal}
        successTitle="Verification token marked as expired"
        successMessage={
          <Text>The verification token has been successfully marked as expired.</Text>
        }
      />
      <ModalConfirmWithReason
        subject="expireUpdateKey"
        onSubmit={markUpdateKeyAsExpired}
        validationSchema={validationSchema}
        show={showMarkUpdateKeyAsExpiredConfirmModal}
        onClose={closeMarkUpdateKeyAsExpiredConfirmModal}
        successTitle="Update key token marked as expired"
        successMessage={
          <Text>The update key token has been successfully marked as expired.</Text>
        }
      />
      <ModalConfirmWithReason
        subject="deactivateOrReactivateUser"
        onSubmit={isdeactivated ? reactivateUser : deactivateUser}
        validationSchema={validationSchema}
        show={showActivationConfirmModal}
        onClose={closeActivationModal}
        successTitle={isdeactivated ? "User deactivated" : "User activated"}
        successMessage={
          <Text>The user has been successfully {isdeactivated ? "deactivated" : "activated"}.</Text>
        }
      />
    </Card>
  );
};

Account.propTypes = {
  newuserpaywalladdress: PropTypes.string,
  newuserpaywallamount: PropTypes.number,
  newuserpaywalltxnotbefore: PropTypes.number,
  failedloginattempts: PropTypes.number,
  newuserverificationtoken: PropTypes.any,
  newuserverificationexpiry: PropTypes.number,
  updatekeyverificationtoken: PropTypes.any,
  updatekeyverificationexpiry: PropTypes.number,
  resetpasswordverificationexpiry: PropTypes.number,
  resetpasswordverificationtoken: PropTypes.any,
  islocked: PropTypes.bool,
  id: PropTypes.string,
  isadmin: PropTypes.bool,
  isdeactivated: PropTypes.bool
};

export default Account;
