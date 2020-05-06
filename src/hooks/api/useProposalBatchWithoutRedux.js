import { useState, useEffect } from "react";
import * as api from "src/lib/api";
import * as sel from "src/selectors";
import { useSelector } from "src/redux";

export default function useProposalBatchWithoutRedux(tokens) {
  const csrf = useSelector(sel.csrf);
  const [proposalsWithVoteSummaries, setProposalsWithVoteSummaries] = useState(
    null
  );
  useEffect(() => {
    if (tokens) {
      Promise.all([
        api.proposalsBatch(csrf, tokens),
        api.proposalsBatchVoteSummary(csrf, tokens)
      ]).then((res) => {
        const proposals = res.find((res) => res && res.proposals).proposals;
        const summaries = res.find((res) => res && res.summaries).summaries;
        setProposalsWithVoteSummaries([proposals, summaries]);
      });
    }
  }, [tokens, csrf]);
  return proposalsWithVoteSummaries;
}
