import { useEffect, useMemo } from "react";
import { useSelector, useAction } from "src/redux";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { isClosedProposal } from "../helpers";

export default function useBillingStatusChanges({ token }) {
  const proposalSelector = useMemo(
    () => sel.makeGetProposalByToken(token),
    [token]
  );
  const proposal = useSelector(proposalSelector);
  const proposalSummaries = useSelector(sel.proposalSummariesByToken);
  const proposalSummary = proposalSummaries[token];
  const isClosed = isClosedProposal(proposalSummary);
  const hasBillingStatusChanges = !!proposal?.billingstatuschanges?.length;
  const onFetchBillingStatusChanges = useAction(
    act.onFetchBillingStatusChanges
  );
  const loadingBillingStatusChanges = useSelector(
    sel.isApiRequestingBatchProposalSummary
  );
  const fetchBillingStatusChanges =
    isClosed && !loadingBillingStatusChanges && !hasBillingStatusChanges;

  useEffect(() => {
    if (fetchBillingStatusChanges) onFetchBillingStatusChanges(token);
  }, [
    fetchBillingStatusChanges,
    hasBillingStatusChanges,
    loadingBillingStatusChanges,
    onFetchBillingStatusChanges,
    token
  ]);
}
