import { useMemo } from "react";
import * as sel from "src/selectors";
import { useSelector } from "src/redux";
import {
  PAYWALL_STATUS_LACKING_CONFIRMATIONS,
  PAYWALL_STATUS_PAID,
  PAYWALL_STATUS_WAITING
} from "src/constants";
import { convertAtomsToDcr } from "src/utils";

const getProposalCreditsPaymentStatus = (numOfConfirmations, txid) => {
  if (!txid) {
    return PAYWALL_STATUS_WAITING;
  }
  if (numOfConfirmations < 2) {
    return PAYWALL_STATUS_LACKING_CONFIRMATIONS;
  }
  return PAYWALL_STATUS_PAID;
};

export default function useProposalCreditsPaymentInfo(userID) {
  const proposalPaywallPaymentConfirmationsSelector = useMemo(
    () => sel.makeGetPaywallConfirmations(userID),
    [userID]
  );
  const proposalPaywallPaymentTxidSelector = useMemo(
    () => sel.makeGetPaywallTxid(userID),
    [userID]
  );
  const proposalPaywallPaymentConfirmations = useSelector(
    proposalPaywallPaymentConfirmationsSelector
  );
  const proposalPaywallPaymentTxid = useSelector(
    proposalPaywallPaymentTxidSelector
  );
  const isPollingCreditsPayment = useSelector(sel.pollingCreditsPayment);
  const proposalPaywallPaymentAmountSelector = useMemo(
    () => sel.makeGetPaywallAmount(userID),
    [userID]
  );
  const proposalPaywallPaymentAmount = useSelector(
    proposalPaywallPaymentAmountSelector
  );

  const status = getProposalCreditsPaymentStatus(
    proposalPaywallPaymentConfirmations,
    proposalPaywallPaymentTxid
  );

  return {
    status,
    isPollingCreditsPayment,
    amount: convertAtomsToDcr(proposalPaywallPaymentAmount)
  };
}
