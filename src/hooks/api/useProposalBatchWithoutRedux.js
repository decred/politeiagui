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
  useEffect(() => {
    if (tokens) {
      Promise.all([
        fetchPropsoals && api.proposalsBatch(csrf, tokens),
        fetchVoteSummary && api.proposalsBatchVoteSummary(csrf, tokens)
      ]).then((res) => {
        const proposals =
          fetchPropsoals && res.find((res) => res && res.proposals).proposals;
        const summaries =
          fetchVoteSummary && res.find((res) => res && res.summaries).summaries;
        setProposalsWithVoteSummaries([proposals, summaries]);
      });
    }
  }, [tokens, csrf, fetchPropsoals, fetchVoteSummary]);
  return proposalsWithVoteSummaries;
}
