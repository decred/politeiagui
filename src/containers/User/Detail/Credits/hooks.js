import { useEffect, useRef, useCallback } from "react";
import * as act from "src/actions";
import { useRedux } from "src/redux";
import * as sel from "src/selectors";
import usePaywall from "src/hooks/usePaywall";
import useInterval from "src/hooks/useInterval";

const mapStateToProps = {
  proposalPaywallAddress: sel.proposalPaywallAddress,
  proposalCreditPrice: sel.proposalCreditPrice,
  proposalPaywallError: sel.proposalPaywallError,
  isApiRequestingProposalPaywall: sel.isApiRequestingProposalPaywall,
  proposalCreditsResponse: sel.apiUserProposalCreditsResponse,
  proposalCredits: sel.proposalCredits,
  proposalCreditPurchases: sel.proposalCreditPurchases,
  isApiRequestingUserProposalCredits: sel.isApiRequestingUserProposalCredits,
  userCanExecuteActions: sel.userCanExecuteActions,
  isTestnet: sel.isTestNet,
  proposalPaywallPaymentTxid: sel.apiProposalPaywallPaymentTxid,
  proposalPaywallPaymentAmount: sel.apiProposalPaywallPaymentAmount,
  proposalPaywallPaymentConfirmations:
    sel.apiProposalPaywallPaymentConfirmations,
  pollingCreditsPayment: sel.pollingCreditsPayment,
  proposalPaymentReceived: sel.proposalPaymentReceived,
  paywallTxid: sel.paywallTxid,
  isAdmin: sel.isAdmin,
  user: sel.user,
  loggedInAsUserId: sel.userid
};

const mapDispatchToProps = {
  onUserProposalCredits: act.onUserProposalCredits,
  onPurchaseProposalCredits: act.onFetchProposalPaywallDetails,
  onFetchProposalPaywallPayment: act.onFetchProposalPaywallPayment,
  toggleCreditsPaymentPolling: act.toggleCreditsPaymentPolling,
  toggleProposalPaymentReceived: act.toggleProposalPaymentReceived
};

export function useCredits(ownProps) {
  const fromRedux = useRedux(ownProps, mapStateToProps, mapDispatchToProps);
  const {
    onPurchaseProposalCredits,
    onUserProposalCredits,
    loggedInAsUserId,
    proposalCreditPrice,
    toggleCreditsPaymentPolling,
    pollingCreditsPayment,
    onFetchProposalPaywallPayment,
    proposalPaywallPaymentTxid,
    isApiRequestingProposalPaywall,
    isApiRequestingUserProposalCredits,
    proposalCreditsResponse,
    user
  } = fromRedux;

  const { isPaid } = usePaywall();
  const proposalCreditsFetched = !!proposalCreditsResponse;
  const isUserPageOwner = user && loggedInAsUserId === user.id;
  const shouldFetchPurchaseProposalCredits =
    isPaid &&
    isUserPageOwner &&
    !proposalCreditPrice &&
    !isApiRequestingProposalPaywall;
  const shouldFetchPaywallPayment =
    isPaid && isUserPageOwner && !pollingCreditsPayment;
  const shouldFetchProposalCredits =
    isPaid &&
    isUserPageOwner &&
    !isApiRequestingUserProposalCredits &&
    !proposalCreditsFetched;

  useEffect(() => {
    if (shouldFetchPurchaseProposalCredits) {
      onPurchaseProposalCredits();
    }
  }, [shouldFetchPurchaseProposalCredits, onPurchaseProposalCredits]);

  useEffect(() => {
    if (shouldFetchPaywallPayment) {
      onFetchProposalPaywallPayment();
    }
  }, [shouldFetchPaywallPayment, onFetchProposalPaywallPayment]);

  useEffect(() => {
    if (shouldFetchProposalCredits) {
      onUserProposalCredits();
    }
  }, [shouldFetchProposalCredits, onUserProposalCredits]);

  useEffect(() => {
    if (!pollingCreditsPayment && proposalPaywallPaymentTxid) {
      toggleCreditsPaymentPolling(true);
    }
  }, [
    pollingCreditsPayment,
    toggleCreditsPaymentPolling,
    proposalPaywallPaymentTxid
  ]);

  return fromRedux;
}

export function usePollProposalCreditsPayment(ownProps) {
  const {
    pollingCreditsPayment,
    toggleProposalPaymentReceived,
    toggleCreditsPaymentPolling,
    onFetchProposalPaywallPayment,
    proposalPaywallPaymentTxid,
    onUserProposalCredits
  } = useRedux(ownProps, mapStateToProps, mapDispatchToProps);
  const prevProposalPaywallPaymentTxid = useRef(null);

  const pollingInterval = 10 * 1000; // 10 seconds

  useInterval(
    pollingInterval,
    pollingCreditsPayment,
    onFetchProposalPaywallPayment
  );

  useEffect(() => {
    if (
      pollingCreditsPayment &&
      prevProposalPaywallPaymentTxid.current &&
      !proposalPaywallPaymentTxid
    ) {
      toggleProposalPaymentReceived(true);
      toggleCreditsPaymentPolling(false);
      onUserProposalCredits();
    }
    prevProposalPaywallPaymentTxid.current = proposalPaywallPaymentTxid;
  }, [
    proposalPaywallPaymentTxid,
    pollingCreditsPayment,
    onUserProposalCredits,
    toggleProposalPaymentReceived,
    toggleCreditsPaymentPolling
  ]);

  return {};
}

export function useRescanUserCredits(userID) {
  const fromRedux = useRedux(
    {},
    {
      errorRescan: sel.apiRescanUserPaymentsError,
      isLoadingRescan: sel.isApiRequestingRescanUserPayments,
      amountOfCreditsAddedOnRescan: sel.amountOfCreditsAddedOnRescan
    },
    {
      onRescan: act.onRescanUserPayments,
      onResetRescan: act.onResetRescanUserPayments
    }
  );

  const {
    onRescan,
    onResetRescan,
    errorRescan,
    isLoadingRescan,
    amountOfCreditsAddedOnRescan
  } = fromRedux;

  useEffect(
    function resetResecanOnUnmount() {
      return () => {
        if (amountOfCreditsAddedOnRescan !== undefined) {
          onResetRescan();
        }
      };
    },
    [onResetRescan, amountOfCreditsAddedOnRescan]
  );

  const onRescanUserCredits = useCallback(() => {
    onRescan(userID);
  }, [onRescan, userID]);

  return {
    onRescanUserCredits,
    errorRescan,
    isLoadingRescan,
    amountOfCreditsAddedOnRescan
  };
}
