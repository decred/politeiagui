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
import useBooleanState from "src/hooks/utils/useBooleanState";
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
import { useConfig } from "src/containers/Config";

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
  const [
    markVerificationTokenAsExpired,
    isApiRequestingMarkNewUserAsExpired
  ] = useManageUser(MANAGE_USER_EXPIRE_NEW_USER_VERIFICATION, userid);
  const [
    markResetPasswordTokenAsExpired,
    isApiRequestingMarkResetPasswordAsExpired
  ] = useManageUser(MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION, userid);
  const [
    markUpdateKeyAsExpired,
    isApiRequestingMarkUpdateKeyAsExpired
  ] = useManageUser(MANAGE_USER_EXPIRE_UPDATE_KEY_VERIFICATION, userid);

  const isActivationLoading =
    isApiRequestingDeactivateUser || isApiRequestingReactivateUser;

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

  const [
    showPasswordModal,
    openPasswordModal,
    closePasswordModal
  ] = useBooleanState(false);

  const {
    onChangePassword,
    validationSchema: changePasswordValidationSchema
  } = useChangePassword();

  return (
    <Card className={classNames("container", "margin-bottom-m")}>
      <AdminSection isadmin={isadmin} />
      <EmailSection token={newuserverificationtoken} />
      {isUserPageOwner && <PasswordSection onClick={openPasswordModal} />}
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
      <InfoSection label="Failed login attempts:" info={failedloginattempts} />
      <InfoSection
        noMargin
        label="Locked:"
        info={isUserLocked(islocked) ? "Yes" : "No"}
      />
      {!isUserDeactivated(isdeactivated) ? (
        <Button
          className="margin-top-s"
          loading={isActivationLoading}
          size="sm"
          onClick={openActivationModal}>
          Deactivate
        </Button>
      ) : (
        <Button
          className="margin-top-s"
          loading={isActivationLoading}
          size="sm"
          onClick={openActivationModal}>
          Reactivate
        </Button>
      )}
      {resetpasswordverificationtoken && (
        <>
          <Text color="grayDark" weight="semibold" className={styles.subtitle}>
            Password
          </Text>
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
              onClick={openMarkPasswordAsExpiredConfirmModal}>
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
              onClick={openMarkVerificationTokenAsExpiredConfirmModal}>
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
              onClick={openMarkUpdateKeyAsExpiredConfirmModal}>
              Mark as expired
            </Button>
          )}
        </>
      )}
      <ModalConfirmWithReason
        subject="expireResetPasswordToken"
        onSubmit={markResetPasswordTokenAsExpired}
        validationSchema={reasonValidationSchema}
        show={showMarkPasswordAsExpiredConfirmModal}
        onClose={closeMarkPasswordAsExpiredConfirmModal}
        successTitle="Reset password token marked as expired"
        successMessage={
          <Text>
            The reset password token has been successfully marked as expired.
          </Text>
        }
      />
      <ModalConfirmWithReason
        subject="expireVerificationToken"
        onSubmit={markVerificationTokenAsExpired}
        validationSchema={reasonValidationSchema}
        show={showMarkVerificationTokenAsExpiredConfirmModal}
        onClose={closeMarkVerificationTokenAsExpiredConfirmModal}
        successTitle="Verification token marked as expired"
        successMessage={
          <Text>
            The verification token has been successfully marked as expired.
          </Text>
        }
      />
      <ModalConfirmWithReason
        subject="expireUpdateKey"
        onSubmit={markUpdateKeyAsExpired}
        validationSchema={reasonValidationSchema}
        show={showMarkUpdateKeyAsExpiredConfirmModal}
        onClose={closeMarkUpdateKeyAsExpiredConfirmModal}
        successTitle="Update key token marked as expired"
        successMessage={
          <Text>
            The update key token has been successfully marked as expired.
          </Text>
        }
      />
      <ModalConfirmWithReason
        subject="deactivateOrReactivateUser"
        onSubmit={isdeactivated ? reactivateUser : deactivateUser}
        validationSchema={reasonValidationSchema}
        show={showActivationConfirmModal}
        onClose={closeActivationModal}
        successTitle={isdeactivated ? "User deactivated" : "User activated"}
        successMessage={
          <Text>
            The user has been successfully{" "}
            {isdeactivated ? "deactivated" : "activated"}.
          </Text>
        }
      />
      <ModalChangePassword
        onChangePassword={onChangePassword}
        validationSchema={changePasswordValidationSchema}
        show={showPasswordModal}
        onClose={closePasswordModal}
      />
    </Card>
  );
};

export default AdminAccount;
