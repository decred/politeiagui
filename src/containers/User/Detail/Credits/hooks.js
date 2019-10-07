import { useCallback, useEffect, useRef, useMemo } from "react";
import * as act from "src/actions";
import * as sel from "src/selectors";
import useInterval from "src/hooks/utils/useInterval";
import usePaywall from "src/hooks/api/usePaywall";
import { useRedux } from "src/redux";

const mapStateToProps = {
  proposalPaywallAddress: sel.proposalPaywallAddress,
  proposalCreditPrice: sel.proposalCreditPrice,
  proposalPaywallError: sel.proposalPaywallError,
  isApiRequestingProposalPaywall: sel.isApiRequestingProposalPaywall,
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
  user: sel.user,
  isAdmin: sel.isAdmin,
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
  const { userid } = ownProps;
  const creditsSelector = useMemo(() => sel.makeGetUnspentUserCredits(userid), [
    userid
  ]);
  const creditsPurchasesSelector = useMemo(
    () => sel.makeGetUserCreditsPurchasesByTx(userid),
    [userid]
  );
  const mapStateToPropsWithCredits = useMemo(
    () => ({
      ...mapStateToProps,
      proposalCreditsUnspent: creditsSelector,
      proposalCreditsPurchases: creditsPurchasesSelector
    }),
    [creditsSelector, creditsPurchasesSelector]
  );
  const {
    onPurchaseProposalCredits,
    onUserProposalCredits,
    onFetchProposalPaywallPayment,
    isApiRequestingProposalPaywall,
    isApiRequestingUserProposalCredits,
    user,
    isAdmin,
    loggedInAsUserId,
    pollingCreditsPayment,
    toggleCreditsPaymentPolling,
    proposalPaymentReceived,
    toggleProposalPaymentReceived,
    proposalPaywallAddress,
    proposalPaywallPaymentTxid,
    proposalPaywallPaymentAmount,
    proposalPaywallPaymentConfirmations,
    proposalCreditsUnspent,
    proposalCreditPrice,
    proposalCreditsPurchases
  } = useRedux(ownProps, mapStateToPropsWithCredits, mapDispatchToProps);
  const proposalCredits = proposalCreditsUnspent.length;
  const { isPaid } = usePaywall();
  const proposalCreditsFetched = proposalCredits !== null;
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

  return {
    proposalCreditPrice,
    isAdmin,
    user,
    isApiRequestingUserProposalCredits,
    proposalCredits,
    proposalCreditsPurchases,
    loggedInAsUserId,
    proposalPaywallAddress,
    proposalPaywallPaymentConfirmations,
    proposalPaywallPaymentTxid,
    proposalPaywallPaymentAmount,
    toggleCreditsPaymentPolling,
    pollingCreditsPayment,
    proposalPaymentReceived,
    toggleProposalPaymentReceived
  };
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
  const mapStateToProps = useMemo(
    () => ({
      errorRescan: sel.apiRescanUserPaymentsError,
      isLoadingRescan: sel.isApiRequestingRescanUserPayments,
      amountOfCreditsAddedOnRescan: sel.amountOfCreditsAddedOnRescan
    }),
    []
  );
  const mapDispatchToProps = useMemo(
    () => ({
      onRescan: act.onRescanUserPayments,
      onResetRescan: act.onResetRescanUserPayments
    }),
    []
  );

  const {
    onRescan,
    onResetRescan,
    errorRescan,
    isLoadingRescan,
    amountOfCreditsAddedOnRescan
  } = useRedux({}, mapStateToProps, mapDispatchToProps);

  useEffect(() => {
    if (amountOfCreditsAddedOnRescan !== undefined) {
      setTimeout(() => onResetRescan(), 3000);
    }
  }, [amountOfCreditsAddedOnRescan, onResetRescan]);

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
