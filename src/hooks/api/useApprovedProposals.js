import { useMemo } from "react";
import useAPIAction from "src/hooks/utils/useAPIAction";
import useProposalsBatch from "src/hooks/api/useProposalsBatch";
import { isEmpty } from "src/helpers";

export default function useApprovedProposals() {
  const {
    isLoadingTokenInventory,
    proposals,
    proposalsTokens,
    onFetchProposalsBatch
  } = useProposalsBatch();

  const requestParams = useMemo(() => [proposalsTokens.approved, false], [
    proposalsTokens
  ]);

  const needsFetch = useMemo(
    () =>
      isEmpty(proposals) &&
      proposalsTokens &&
      proposalsTokens.approved &&
      proposalsTokens.approved.length,
    [proposals, proposalsTokens]
  );

  const [loading, error] = useAPIAction(
    onFetchProposalsBatch,
    requestParams,
    needsFetch
  );

  return {
    proposals: !isEmpty(proposals) ? Object.values(proposals) : [],
    proposalByToken: proposals,
    isLoading: loading || isLoadingTokenInventory,
    error,
    onFetchProposalsBatch,
    proposalsTokens: proposalsTokens.approved
  };
}
