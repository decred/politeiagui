import { useEffect, useMemo } from "react";
import { useSelector, useAction } from "src/redux";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { isApprovedProposal } from "../helpers";

export default function useBillingStatusChanges({ token }) {
  const proposalSelector = useMemo(
    () => sel.makeGetProposalByToken(token),
    [token]
  );
  const proposal = useSelector(proposalSelector);
  const voteSummaries = useSelector(sel.voteSummariesByToken);
  const voteSummary = voteSummaries[token];
  const isApproved = isApprovedProposal(proposal, voteSummary);
  const hasBillingStatusMetadata = !!proposal?.billingStatusChangeMetadata;
  const onFetchBillingStatusChanges = useAction(
    act.onFetchBillingStatusChanges
  );
  const loadingBillingStatusChanges = useSelector(
    sel.isApiRequestingBatchProposalSummary
  );
  const fetchBillingStatusChanges =
    isApproved && !loadingBillingStatusChanges && !hasBillingStatusMetadata;

  useEffect(() => {
    if (fetchBillingStatusChanges) onFetchBillingStatusChanges(token);
  }, [
    fetchBillingStatusChanges,
    loadingBillingStatusChanges,
    onFetchBillingStatusChanges,
    token
  ]);
}
