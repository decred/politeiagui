import {
  Button,
  Card,
  classNames,
  Link,
  P,
  Spinner,
  Table,
  Text,
  Message
} from "pi-ui";
import React from "react";
import ExportToCsv from "src/componentsv2/ExportToCsv.jsx";
import useBooleanState from "src/hooks/useBooleanState";
import ModalBuyProposalCredits from "src/componentsv2/ModalBuyProposalCredits";
import ModalConfirmWithReason from "src/componentsv2/ModalConfirmWithReason";
import ModalPayPaywall from "src/componentsv2/ModalPayPaywall";
import { MANAGE_USER_CLEAR_USER_PAYWALL } from "src/constants";
import { useManageUser } from "../hooks.js";
import styles from "./Credits.module.css";
import { useCredits, useRescanUserCredits } from "./hooks.js";
import {
  getTableContentFromPurchases,
  tableHeaders,
  getCsvData,
  getProposalCreditsPaymentStatus
} from "./helpers.js";
import { hasUserPaid } from "../helpers";

const Credits = () => {
  const {
    proposalCreditPrice,
    isAdmin,
    user,
    isApiRequestingUserProposalCredits,
    proposalCreditPurchases,
    loggedInAsUserId,
    proposalPaywallAddress,
    proposalPaywallPaymentConfirmations,
    proposalPaywallPaymentTxid,
    proposalPaywallPaymentAmount,
    toggleCreditsPaymentPolling
  } = useCredits();

  const {
    onRescanUserCredits,
    errorRescan,
    isLoadingRescan,
    amountOfCreditsAddedOnRescan
  } = useRescanUserCredits(user.id);

  const [
    showMarkAsPaidConfirmModal,
    openMarkAsPaidModal,
    closeMarkAsPaidModal
  ] = useBooleanState(false);
  const [
    showPaywallModal,
    openPaywallModal,
    closePaywallModal
  ] = useBooleanState(false);
  const [
    showProposalCreditsModal,
    openProposalCreditsModal,
    closeProposalCreditsModal
  ] = useBooleanState(false);

  function onStartPollingPayment() {
    toggleCreditsPaymentPolling(true);
  }

  const isUserPageOwner = user && loggedInAsUserId === user.id;

  const { onManageUser, isApiRequestingMarkAsPaid } = useManageUser();

  const paywallIsPaid = hasUserPaid(
    user.newuserpaywalltx,
    user.newuserpaywallamount
  );

  const markAsPaid = reason =>
    onManageUser(user.id, MANAGE_USER_CLEAR_USER_PAYWALL, reason);

  const data = getTableContentFromPurchases(
    proposalCreditPurchases,
    {
      confirmations: proposalPaywallPaymentConfirmations,
      txID: proposalPaywallPaymentTxid,
      amount: proposalPaywallPaymentAmount
    },
    proposalCreditPrice
  );

  return isApiRequestingUserProposalCredits &&
    !proposalCreditPurchases.length ? (
    <div className={styles.spinnerWrapper}>
      <Spinner invert />
    </div>
  ) : (
    <Card className="container">
      <div className={styles.block}>
        <div className={styles.blockDetails}>
          <Text className={styles.title}>Registration fee</Text>
          <Text
            size="large"
            className={classNames(
              styles.status,
              "margin-top-xs margin-bottom-xs"
            )}
          >
            {paywallIsPaid ? "Paid" : "Not paid"}
          </Text>
          {!paywallIsPaid && isUserPageOwner && (
            <Button
              className="margin-top-s"
              size="sm"
              onClick={openPaywallModal}
            >
              Pay registration fee
            </Button>
          )}
          {!paywallIsPaid && isAdmin && (
            <Button
              className="margin-top-s"
              loading={isApiRequestingMarkAsPaid}
              size="sm"
              onClick={openMarkAsPaidModal}
            >
              Mark as paid
            </Button>
          )}
        </div>
        <div className={styles.description}>
          <P className={styles.descriptionParagraph}>
            <b>Registration Fee:</b> In order to participate on proposals and to
            submit your own, Politeia requires a small registration fee{" "}
            <b>of exactly 0.4 DCR.</b>
          </P>
        </div>
      </div>
      <div className={classNames(styles.block, "margin-top-l")}>
        <div className={styles.blockDetails}>
          <Text className={styles.title}>Proposal Credits</Text>
          <Text
            size="large"
            className={classNames(
              styles.status,
              "margin-top-xs margin-bottom-xs"
            )}
          >
            {user.proposalcredits}
          </Text>
          <div className={styles.buttonsWrapper}>
            {isUserPageOwner && paywallIsPaid && (
              <Button
                className="margin-top-s"
                size="sm"
                onClick={openProposalCreditsModal}
              >
                Purchase more
              </Button>
            )}
            {isAdmin && (
              <Button
                onClick={onRescanUserCredits}
                loading={isLoadingRescan}
                className="margin-top-s"
                size="sm"
              >
                Rescan
              </Button>
            )}
          </div>
        </div>
        <div className={styles.description}>
          <P className={styles.descriptionParagraph}>
            <b>Proposal credits:</b> each proposal submission requires{" "}
            <b>1 proposal</b> credit which costs <b>exactly 0.1 DCR</b>.
          </P>
        </div>
      </div>
      {amountOfCreditsAddedOnRescan !== undefined && (
        <Message className="margin-top-s" kind="success">
          User credits are up to date. {amountOfCreditsAddedOnRescan} proposal
          credits were found by the rescan and added to the user account.
        </Message>
      )}
      {errorRescan && (
        <Message className="margin-top-s" kind="error">
          {errorRescan.toString()}
        </Message>
      )}
      {isUserPageOwner && data && !!data.length && (
        <div className="margin-top-l" style={{ overflowX: "scroll" }}>
          <Text className="margin-right-xs">Credit History</Text>
          <ExportToCsv
            data={getCsvData(proposalCreditPurchases)}
            fields={[
              "numberPurchased",
              "price",
              "txId",
              "datePurchased",
              "type"
            ]}
            filename="payment_history"
          >
            <Link style={{ cursor: "pointer" }}>Export to csv</Link>
          </ExportToCsv>
          <div className="margin-top-s">
            <Table data={data} headers={tableHeaders} />
          </div>
        </div>
      )}
      <ModalConfirmWithReason
        subject="markUserPaywallAsPaid"
        onSubmit={markAsPaid}
        show={showMarkAsPaidConfirmModal}
        onClose={closeMarkAsPaidModal}
      />
      <ModalPayPaywall
        show={showPaywallModal}
        title="Complete your registration"
        onClose={closePaywallModal}
      />
      <ModalBuyProposalCredits
        show={showProposalCreditsModal}
        title="Purchase Proposal Credits"
        price={proposalCreditPrice}
        address={proposalPaywallAddress}
        startPollingPayment={onStartPollingPayment}
        status={getProposalCreditsPaymentStatus(
          proposalPaywallPaymentConfirmations,
          proposalPaywallPaymentTxid
        )}
        initialStep={proposalPaywallPaymentTxid ? 1 : 0}
        onClose={closeProposalCreditsModal}
      />
    </Card>
  );
};

export default Credits;
