import { useCallback, useEffect, useRef, useMemo } from "react";
import * as act from "src/actions";
import * as sel from "src/selectors";
import usePaywall from "src/hooks/api/usePaywall";
import { useSelector, useAction } from "src/redux";

export function useCredits(userID) {
  const proposalPaywallAddress = useSelector(sel.proposalPaywallAddress);
  const proposalCreditPrice = useSelector(sel.proposalCreditPrice);
  const isApiRequestingProposalPaywall = useSelector(
    sel.isApiRequestingProposalPaywall
  );
  const isApiRequestingUserProposalCredits = useSelector(
    sel.isApiRequestingUserProposalCredits
  );
  const proposalPaywallPaymentTxid = useSelector(
    sel.apiProposalPaywallPaymentTxid
  );
  const proposalPaywallPaymentAmount = useSelector(
    sel.apiProposalPaywallPaymentAmount
  );
  const proposalPaywallPaymentConfirmations = useSelector(
    sel.apiProposalPaywallPaymentConfirmations
  );
  const pollingCreditsPayment = useSelector(sel.pollingCreditsPayment);
  const reachedCreditsPaymentPollingLimit = useSelector(
    sel.reachedCreditsPaymentPollingLimit
  );
  const proposalPaymentReceived = useSelector(sel.proposalPaymentReceived);
  const isAdmin = useSelector(sel.currentUserIsAdmin);
  const currentUserID = useSelector(sel.currentUserID);
  const user = useSelector(sel.currentUser);

  const creditsSelector = useMemo(() => sel.makeGetUnspentUserCredits(userID), [
    userID
  ]);
  const creditsPurchasesSelector = useMemo(
    () => sel.makeGetUserCreditsPurchasesByTx(userID),
    [userID]
  );

  const proposalCreditsUnspent = useSelector(creditsSelector);
  const proposalCreditsPurchases = useSelector(creditsPurchasesSelector);

  const onUserProposalCredits = useAction(act.onUserProposalCredits);
  const onPurchaseProposalCredits = useAction(
    act.onFetchProposalPaywallDetails
  );
  const onPollProposalPaywallPayment = useAction(
    act.onPollProposalPaywallPayment
  );
  const toggleCreditsPaymentPolling = useAction(
    act.toggleCreditsPaymentPolling
  );
  const toggleProposalPaymentReceived = useAction(
    act.toggleProposalPaymentReceived
  );
  const clearProposalPaymentPollingPointer = useAction(
    act.clearProposalPaymentPollingPointer
  );

  const proposalCredits = proposalCreditsUnspent.length;
  const { isPaid } = usePaywall();
  const proposalCreditsFetched = proposalCredits !== null;
  const isUserPageOwner = user && currentUserID === user.userid;
  const shouldFetchPurchaseProposalCredits =
    isPaid &&
    isUserPageOwner &&
    !proposalCreditPrice &&
    !isApiRequestingProposalPaywall;
  const shouldPollPaywallPayment =
    isPaid &&
    isUserPageOwner &&
    !pollingCreditsPayment &&
    !reachedCreditsPaymentPollingLimit;
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
    currentUserID,
    proposalPaywallAddress,
    proposalPaywallPaymentConfirmations,
    proposalPaywallPaymentTxid,
    proposalPaywallPaymentAmount,
    toggleCreditsPaymentPolling,
    pollingCreditsPayment,
    proposalPaymentReceived,
    toggleProposalPaymentReceived,
    onPollProposalPaywallPayment,
    shouldPollPaywallPayment,
    clearProposalPaymentPollingPointer
  };
}

export function usePollProposalCreditsPayment() {
  const proposalPaywallPaymentTxid = useSelector(
    sel.apiProposalPaywallPaymentTxid
  );
  const pollingCreditsPayment = useSelector(sel.pollingCreditsPayment);

  const onUserProposalCredits = useAction(act.onUserProposalCredits);
  const toggleCreditsPaymentPolling = useAction(
    act.toggleCreditsPaymentPolling
  );
  const toggleProposalPaymentReceived = useAction(
    act.toggleProposalPaymentReceived
  );

  const prevProposalPaywallPaymentTxid = useRef(null);

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
  const errorRescan = useSelector(sel.apiRescanUserPaymentsError);
  const isLoadingRescan = useSelector(sel.isApiRequestingRescanUserPayments);
  const amountOfCreditsAddedOnRescan = useSelector(
    sel.amountOfCreditsAddedOnRescan
  );

  const onRescan = useAction(act.onRescanUserPayments);
  const onResetRescan = useAction(act.onResetRescanUserPayments);

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
