import { useState, useEffect } from "react";
import * as api from "src/lib/api";
import * as sel from "src/selectors";
import { useSelector } from "src/redux";

export default function useProposalBatchWithoutRedux(
  tokens,
  fetchPropsoals = true,
  fetchVoteSummary = true
) {
  const csrf = useSelector(sel.csrf);
  const [proposalsWithVoteSummaries, setProposalsWithVoteSummaries] = useState(
    null
  );
  const [isRequesting, setIsRequesting] = useState(false);
  useEffect(() => {
    const fetchProposals = async () => {
      const res = await Promise.all([
        fetchPropsoals && api.proposalsBatch(csrf, tokens),
        fetchVoteSummary && api.proposalsBatchVoteSummary(csrf, tokens)
      ]);
      const proposals =
        fetchPropsoals && res.find((res) => res && res.proposals).proposals;
      const summaries =
        fetchVoteSummary && res.find((res) => res && res.summaries).summaries;
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

    csrf,
    fetchPropsoals,
    fetchVoteSummary,
    proposalsWithVoteSummaries
  ]);
  return proposalsWithVoteSummaries || [[]];
}
