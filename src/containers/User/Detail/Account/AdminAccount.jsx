import { Button, Card, Text, classNames } from "pi-ui";
import React from "react";
import ModalConfirmWithReason from "src/components/ModalConfirmWithReason";
import ModalChangePassword from "src/components/ModalChangePassword";
import { reasonValidationSchema } from "../validation";
import {
  MANAGE_USER_DEACTIVATE,
  MANAGE_USER_EXPIRE_NEW_USER_VERIFICATION,
  MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION,
  MANAGE_USER_EXPIRE_UPDATE_KEY_VERIFICATION,
  MANAGE_USER_REACTIVATE
} from "src/constants";
import { formatUnixTimestamp } from "src/utils";
import { isExpired, isUserDeactivated, isUserLocked } from "../helpers";
import useManageUser from "../hooks/useManageUser";
import useChangePassword from "../hooks/useChangePassword";
import InfoSection from "../InfoSection.jsx";
import styles from "./Account.module.css";
import AdminSection from "./components/AdminSection";
import AddressSection from "./components/AddressSection";
import EmailSection from "./components/EmailSection";
import PasswordSection from "./components/PasswordSection";
import PaywallSection from "./components/PaywallSection";
import UserDataSection from "./components/UserDataSection";
import { useConfig } from "src/containers/Config";
import useModalContext from "src/hooks/utils/useModalContext";

const AdminAccount = ({
  userid,
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
  isadmin, // from the user API return
  isUserPageOwner
}) => {
  const { enablePaywall } = useConfig();
  const [deactivateUser, isApiRequestingDeactivateUser] = useManageUser(
    MANAGE_USER_DEACTIVATE,
    userid
  );
  const [reactivateUser, isApiRequestingReactivateUser] = useManageUser(
    MANAGE_USER_REACTIVATE,
    userid
  );
  const [markVerificationTokenAsExpired, isApiRequestingMarkNewUserAsExpired] =
    useManageUser(MANAGE_USER_EXPIRE_NEW_USER_VERIFICATION, userid);
  const [
    markResetPasswordTokenAsExpired,
    isApiRequestingMarkResetPasswordAsExpired
  ] = useManageUser(MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION, userid);
  const [markUpdateKeyAsExpired, isApiRequestingMarkUpdateKeyAsExpired] =
    useManageUser(MANAGE_USER_EXPIRE_UPDATE_KEY_VERIFICATION, userid);

  const isActivationLoading =
    isApiRequestingDeactivateUser || isApiRequestingReactivateUser;

  const { onChangePassword, validationSchema: changePasswordValidationSchema } =
    useChangePassword();

  const [handleOpenModal, handleCloseModal] = useModalContext();

  const handleOpenPasswordExpireModal = () => {
    handleOpenModal(ModalConfirmWithReason, {
      subject: "expireResetPasswordToken",
      onSubmit: markResetPasswordTokenAsExpired,
      validationSchema: reasonValidationSchema,
      onClose: handleCloseModal,
      successTitle: "Reset password token marked as expired",
      successMessage: (
        <Text>
          The reset password token has been successfully marked as expired.
        </Text>
      )
    });
  };

  const handleOpenVerificationTokenExpireModal = () => {
    handleOpenModal(ModalConfirmWithReason, {
      subject: "expireVerificationToken",
      onSubmit: markVerificationTokenAsExpired,
      validationSchema: reasonValidationSchema,
      onClose: handleCloseModal,
      successTitle: "Verification token marked as expired",
      successMessage: (
        <Text>
          The verification token has been successfully marked as expired.
        </Text>
      )
    });
  };

  const handleOpenUpdateKeyExpireModal = () => {
    handleOpenModal(ModalConfirmWithReason, {
      subject: "expireUpdateKey",
      onSubmit: markUpdateKeyAsExpired,
      validationSchema: reasonValidationSchema,
      onClose: handleCloseModal,
      successTitle: "Update key token marked as expired",
      successMessage: (
        <Text>
          The update key token has been successfully marked as expired.
        </Text>
      )
    });
  };

  const handleOpenDeactivateReactivateUserModal = () => {
    handleOpenModal(ModalConfirmWithReason, {
      subject: "deactivateOrReactivateUser",
      onSubmit: isdeactivated ? reactivateUser : deactivateUser,
      validationSchema: reasonValidationSchema,
      onClose: handleCloseModal,
      successTitle: isdeactivated ? "User activated" : "User deactivated",
      successMessage: (
        <Text>
          The user has been successfully{" "}
          {isdeactivated ? "activated" : "deactivated"}.
        </Text>
      )
    });
  };

  const handleOpenChangePasswordModal = () => {
    handleOpenModal(ModalChangePassword, {
      onChangePassword: onChangePassword,
      validationSchema: changePasswordValidationSchema,
      onClose: handleCloseModal
    });
  };

  return (
    <Card className={classNames("container", "margin-bottom-m")}>
      <AdminSection isadmin={isadmin} />
      <EmailSection token={newuserverificationtoken} />
      {isUserPageOwner && (
        <>
          <PasswordSection onClick={handleOpenChangePasswordModal} />
          <UserDataSection />
        </>
      )}
      {enablePaywall && (
        <>
          <AddressSection address={newuserpaywalladdress} />
          <PaywallSection
            amount={newuserpaywallamount}
            timestamp={newuserpaywalltxnotbefore}
          />
        </>
      )}
      <Text weight="semibold" className={styles.subtitle}>
        Security
      </Text>
      <InfoSection label="Failed login attempts" info={failedloginattempts} />
      <InfoSection
        noMargin
        label="Locked"
        info={isUserLocked(islocked) ? "Yes" : "No"}
      />
      {!isUserDeactivated(isdeactivated) ? (
        <Button
          data-testid="user-deactivate"
          className="margin-top-s"
          loading={isActivationLoading}
          size="sm"
          onClick={handleOpenDeactivateReactivateUserModal}>
          Deactivate
        </Button>
      ) : (
        <Button
          data-testid="user-activate"
          className="margin-top-s"
          loading={isActivationLoading}
          size="sm"
          onClick={handleOpenDeactivateReactivateUserModal}>
          Reactivate
        </Button>
      )}
      {resetpasswordverificationtoken && (
        <>
          <Text color="grayDark" weight="semibold" className={styles.subtitle}>
            Password
          </Text>
          <InfoSection
            label="Reset password token"
            info={resetpasswordverificationtoken}
          />
          <InfoSection
            noMargin
            label="Expires"
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
              onClick={handleOpenPasswordExpireModal}>
              Mark as expired
            </Button>
          )}
        </>
      )}
      {newuserverificationtoken && (
        <>
          <Text color="grayDark" weight="semibold" className={styles.subtitle}>
            Verification token
          </Text>
          <InfoSection
            label="Verification token"
            info={newuserverificationtoken}
          />
          <InfoSection
            noMargin
            label="Expires"
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
              onClick={handleOpenVerificationTokenExpireModal}>
              Mark as expired
            </Button>
          )}
        </>
      )}
      {updatekeyverificationtoken && (
        <>
          <Text color="grayDark" weight="semibold" className={styles.subtitle}>
            Update key
          </Text>
          <InfoSection
            label="Update key token"
            info={updatekeyverificationtoken}
          />
          <InfoSection
            noMargin
            label="Expires"
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
              onClick={handleOpenUpdateKeyExpireModal}>
              Mark as expired
            </Button>
          )}
        </>
      )}
    </Card>
  );
};

export default AdminAccount;
