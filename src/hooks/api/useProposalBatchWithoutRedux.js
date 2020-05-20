import { useState, useEffect } from "react";
import * as act from "src/actions";
import { useAction } from "src/redux";

export default function useProposalBatchWithoutRedux(
  tokens,
  fetchPropsoals = true,
  fetchVoteSummary = true
) {
  const onFetchProposalsBatchWithoutState = useAction(
    act.onFetchProposalsBatchWithoutState
  );
  const [proposalsWithVoteSummaries, setProposalsWithVoteSummaries] = useState(
    null
  );
  const [isRequesting, setIsRequesting] = useState(false);
  useEffect(() => {
    const fetchProposals = async () => {
      const [proposals, summaries] = await onFetchProposalsBatchWithoutState(
        tokens,
        fetchProposals,
        fetchVoteSummary
      );
      setProposalsWithVoteSummaries([proposals, summaries]);
      setIsRequesting(false);
    };

    if (tokens && !proposalsWithVoteSummaries && !isRequesting) {
      setIsRequesting(true);
      fetchProposals();
    }
  }, [
    tokens,
    isRequesting,
    onFetchProposalsBatchWithoutState,
    fetchPropsoals,
    fetchVoteSummary,
    proposalsWithVoteSummaries
  ]);
  return proposalsWithVoteSummaries || [[]];
}
