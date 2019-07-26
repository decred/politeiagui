import { Button, Card } from "pi-ui";
import PropTypes from "prop-types";
import React, { useState } from "react";
import ModalChangePassword from "src/componentsv2/ModalChangePassword";
import ModalConfirmWithReason from "src/componentsv2/ModalConfirmWithReason";
import ModalPayPaywall from "src/componentsv2/ModalPayPaywall";
import { MANAGE_USER_CLEAR_USER_PAYWALL, MANAGE_USER_DEACTIVATE, MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION, MANAGE_USER_REACTIVATE, PAYWALL_STATUS_PAID } from "src/constants";
import usePaywall from "src/hooks/usePaywall";
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
  const {
    onManageUser,
    isApiRequestingDeactivateUser,
    isApiRequestingReactivateUser,
    isApiRequestingMarkAsPaid
  } = useManageUser();

  const isActivationLoading =
    isApiRequestingDeactivateUser || isApiRequestingReactivateUser;

  const markResetPasswordTokenAsExpired = reason =>
    onManageUser(id, MANAGE_USER_EXPIRE_RESET_PASSWORD_VERIFICATION, reason);
  const deactivateUser = reason =>
    onManageUser(id, MANAGE_USER_DEACTIVATE, reason);
  const reactivateUser = reason =>
    onManageUser(id, MANAGE_USER_REACTIVATE, reason);
  const markAsPaid = reason =>
    onManageUser(id, MANAGE_USER_CLEAR_USER_PAYWALL, reason);

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
  const {
    showMarkAsPaidConfirmModal,
    openMarkAsPaidModal,
    closeMarkAsPaidModal
  } = useMarkAsPaidModal();

  // Change Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const openPasswordModal = e => {
    e.preventDefault();
    setShowPasswordModal(true);
  };
  const closePasswordModal = () => setShowPasswordModal(false);
  const { onChangePassword, validationSchema } = useChangePassword();

  // Paywall
  const { userPaywallStatus, paywallAmount, paywallAddress } = usePaywall();
  // Pay Paywall Modal
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const openPaywallModal = e => {
    e.preventDefault();
    setShowPaywallModal(true);
  };
  const closePaywallModal = () => setShowPaywallModal(false);

  const showDetailedLabels = isUserPageOwner || isAdmin;
  return (
    <Card paddingSize="small">
      <InfoSection
        className="no-margin-top"
        label="Admin:"
        info={isUserAdmin(isadmin) ? "Yes" : "No"}
      />
      <InfoSection
        label="User public key:"
        info={
          <>
            <span style={{ wordBreak: "break-word" }}>
              {getUserActivePublicKey(identities)}
            </span>
            {isUserPageOwner && (
              <Button className="margin-top-s" size="sm">
                Manage Identity
              </Button>
            )}
          </>
        }
      />
      {showDetailedLabels && (
        <>
          <InfoSection
            label="Proposal credits:"
            info={
              <>
                {proposalcredits}
                {isAdmin && (
                  <Button className="margin-top-s" size="sm">
                    Rescan
                  </Button>
                )}
              </>
            }
          />
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
            label="Registration fee:"
            info={
              <>
                {hasUserPaid(newuserpaywalltx, newuserpaywallamount, isUserPageOwner && userPaywallStatus === PAYWALL_STATUS_PAID)
                  ? "Paid"
                  : "Not paid"}
                {!hasUserPaid(newuserpaywalltx, newuserpaywallamount, isUserPageOwner && userPaywallStatus === PAYWALL_STATUS_PAID) &&
                  isAdmin ? (
                    <Button
                      className="margin-top-s"
                      loading={isApiRequestingMarkAsPaid}
                      size="sm"
                      onClick={openMarkAsPaidModal}
                    >
                      Mark as paid
                  </Button>
                  ) : (
                    !hasUserPaid(newuserpaywalltx, newuserpaywallamount, isUserPageOwner && userPaywallStatus === PAYWALL_STATUS_PAID) && (
                      <Button className="margin-top-s" size="sm" onClick={openPaywallModal}>
                        Pay registration fee
                    </Button>
                    )
                  )}
              </>
            }
          />
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
      <ModalConfirmWithReason
        subject="markUserPaywallAsPaid"
        onSubmit={markAsPaid}
        validationSchema={validationSchema}
        show={showMarkAsPaidConfirmModal}
        onClose={closeMarkAsPaidModal}
      />
      <ModalPayPaywall show={showPaywallModal} title="Complete your registration" address={paywallAddress} amount={paywallAmount} onClose={closePaywallModal} status={userPaywallStatus} />
    </Card>
  );
};

General.propTypes = {
  proposalcredits: PropTypes.number,
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
