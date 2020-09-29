import { useState, useEffect } from "react";
import * as act from "src/actions";
import { useAction } from "src/redux";
import { PROPOSAL_STATE_VETTED } from "src/constants";

export default function useProposalBatchWithoutRedux(
  tokens,
  fetchProposals = true,
  fetchVoteSummary = true
) {
  const onFetchProposalsBatchWithoutState = useAction(
    act.onFetchProposalsBatchWithoutState
  );
  const [proposalsWithVoteSummaries, setProposalsWithVoteSummaries] = useState(
    null
  );
  const resetData = () => setProposalsWithVoteSummaries(null);
  const [isRequesting, setIsRequesting] = useState(false);
  useEffect(() => {
    const onFetchProposals = async () => {
      const [proposals, summaries] = await onFetchProposalsBatchWithoutState(
        tokens.map((token) => ({ token })),
        PROPOSAL_STATE_VETTED,
        fetchProposals,
        fetchVoteSummary
      );
      setProposalsWithVoteSummaries([proposals, summaries]);
      setIsRequesting(false);
    };

    if (tokens && !proposalsWithVoteSummaries && !isRequesting) {
      setIsRequesting(true);
      onFetchProposals();
    }
  }, [
    tokens,
    isRequesting,
    onFetchProposalsBatchWithoutState,
    fetchProposals,
    fetchVoteSummary,
    proposalsWithVoteSummaries
  ]);
  return { data: proposalsWithVoteSummaries || [[]], resetData };
}
