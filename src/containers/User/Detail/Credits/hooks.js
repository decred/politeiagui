import { useCallback, useEffect, useRef, useMemo } from "react";
import * as act from "src/actions";
import * as sel from "src/selectors";
import usePaywall from "src/hooks/api/usePaywall";
import { useSelector, useAction } from "src/redux";
import useModalContext from "src/hooks/utils/useModalContext";
import ModalBuyProposalCredits from "src/components/ModalBuyProposalCredits";
import ModalPayPaywall from "src/components/ModalPayPaywall";

export function useCredits(userID) {
  const isApiRequestingProposalPaywall = useSelector(
    sel.isApiRequestingProposalPaywall
  );
  const isApiRequestingUserProposalCredits = useSelector(
    sel.isApiRequestingUserProposalCredits
  );
  const proposalPaywallAddressSelector = useMemo(
    () => sel.makeGetPaywallAddress(userID),
    [userID]
  );
  const proposalCreditPriceSelector = useMemo(
    () => sel.makeGetPaywallCreditPrice(userID),
    [userID]
  );
  const proposalPaywallPaymentTxidSelector = useMemo(
    () => sel.makeGetPaywallTxid(userID),
    [userID]
  );
  const proposalPaywallPaymentAmountSelector = useMemo(
    () => sel.makeGetPaywallAmount(userID),
    [userID]
  );
  const proposalPaywallPaymentConfirmationsSelector = useMemo(
    () => sel.makeGetPaywallConfirmations(userID),
    [userID]
  );
  const paywallFaucetTxidSelector = useMemo(
    () => sel.makeGetPaywallFaucetTxid(userID),
    [userID]
  );
  const creditsSelector = useMemo(
    () => sel.makeGetUnspentUserCredits(userID),
    [userID]
  );
  const creditsPurchasesSelector = useMemo(
    () => sel.makeGetUserCreditsPurchasesByTx(userID),
    [userID]
  );
  const proposalPaywallAddress = useSelector(proposalPaywallAddressSelector);
  const proposalCreditPrice = useSelector(proposalCreditPriceSelector);
  const proposalPaywallPaymentTxid = useSelector(
    proposalPaywallPaymentTxidSelector
  );
  const proposalPaywallPaymentAmount = useSelector(
    proposalPaywallPaymentAmountSelector
  );
  const proposalPaywallPaymentConfirmations = useSelector(
    proposalPaywallPaymentConfirmationsSelector
  );
  const proposalCreditsUnspent = useSelector(creditsSelector);
  const proposalCreditsPurchases = useSelector(creditsPurchasesSelector);
  const paywallFaucetTxid = useSelector(paywallFaucetTxidSelector);

  const pollingCreditsPayment = useSelector(sel.pollingCreditsPayment);
  const reachedCreditsPaymentPollingLimit = useSelector(
    sel.reachedCreditsPaymentPollingLimit
  );
  const proposalPaymentReceived = useSelector(sel.proposalPaymentReceived);
  const isAdmin = useSelector(sel.currentUserIsAdmin);
  const currentUserID = useSelector(sel.currentUserID);

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
  const { isPaid, paywallEnabled, creditsEnabled } = usePaywall(userID);
  const proposalCredits = proposalCreditsUnspent.length;
  const proposalCreditsFetched = proposalCredits !== null;
  const isUserPageOwner = currentUserID === userID;
  const shouldFetchPurchaseProposalCredits =
    creditsEnabled &&
    isPaid &&
    !!userID &&
    isUserPageOwner &&
    !proposalCreditPrice &&
    !isApiRequestingProposalPaywall;
  const shouldPollPaywallPayment =
    paywallEnabled &&
    isPaid &&
    isUserPageOwner &&
    proposalPaywallPaymentTxid !== "" &&
    !pollingCreditsPayment &&
    !reachedCreditsPaymentPollingLimit;
  const shouldFetchProposalCredits =
    isPaid &&
    userID &&
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

  return {
    proposalCreditPrice,
    isAdmin,
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
    clearProposalPaymentPollingPointer,
    paywallFaucetTxid
  };
}

export function usePollProposalCreditsPayment() {
  const currentUserID = useSelector(sel.currentUserID);
  const proposalPaywallPaymentTxidSelector = useMemo(
    () => sel.makeGetPaywallTxid(currentUserID),
    [currentUserID]
  );
  const proposalPaywallPaymentTxid = useSelector(
    proposalPaywallPaymentTxidSelector
  );
  const onFetchProposalPaywallDetails = useAction(
    act.onFetchProposalPaywallDetails
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
      onFetchProposalPaywallDetails();
    }
    prevProposalPaywallPaymentTxid.current = proposalPaywallPaymentTxid;
  }, [
    pollingCreditsPayment,
    proposalPaywallPaymentTxid,
    toggleProposalPaymentReceived,
    toggleCreditsPaymentPolling,
    onUserProposalCredits,
    onFetchProposalPaywallDetails
  ]);

  return {};
}

export function useRescanUserCredits(userID) {
  const errorRescan = useSelector(sel.apiRescanUserPaymentsError);
  const isLoadingRescan = useSelector(sel.isApiRequestingRescanUserPayments);
  const amountOfCreditsAddedOnRescanSelector = useMemo(
    () => sel.makeGetCreditsAddedOnRescan(userID),
    [userID]
  );
  const amountOfCreditsAddedOnRescan = useSelector(
    amountOfCreditsAddedOnRescanSelector
  );

  const onRescan = useAction(act.onRescanUserPayments);
  const onResetRescan = useAction(act.onResetRescanUserPayments);

  useEffect(() => {
    if (amountOfCreditsAddedOnRescan !== null) {
      setTimeout(() => onResetRescan(userID), 3000);
    }
  }, [amountOfCreditsAddedOnRescan, onResetRescan, userID]);

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

export function useUserPaymentModals(user) {
  const userID = user && user.userid;
  const {
    proposalCreditPrice,
    proposalPaywallAddress,
    proposalPaywallPaymentTxid,
    toggleCreditsPaymentPolling,
    onPollProposalPaywallPayment,
    toggleProposalPaymentReceived
  } = useCredits(userID);

  const [handleOpenModal, handleCloseModal] = useModalContext();

  const onStartPollingPayment = () => {
    toggleCreditsPaymentPolling(true);
    onPollProposalPaywallPayment(false);
  };

  const customCloseProposalCreditsModal = () => {
    toggleProposalPaymentReceived(false);
    handleCloseModal();
  };

  const handleOpenPaywallModal = () => {
    handleOpenModal(ModalPayPaywall, {
      title: "Complete your registration",
      onClose: handleCloseModal
    });
  };

  const handleOpenBuyCreditsModal = () => {
    handleOpenModal(ModalBuyProposalCredits, {
      title: "Purchase Proposal Credits",
      price: proposalCreditPrice,
      address: proposalPaywallAddress,
      startPollingPayment: onStartPollingPayment,
      initialStep: proposalPaywallPaymentTxid ? 1 : 0,
      onClose: customCloseProposalCreditsModal,
      userID
    });
  };
  return {
    handleOpenPaywallModal,
    handleOpenBuyCreditsModal,
    handleCloseModal
  };
}
