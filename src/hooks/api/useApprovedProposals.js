import { useEffect, useState } from "react";
import { isEmpty } from "src/helpers";
import useProposalsBatch from "./useProposalsBatch";
import { difference, keys } from "lodash";

const PAGE_SIZE = 20;

export default function useApprovedProposals(initialTokens) {
  const [remainingTokens, setRemainingTokens] = useState(initialTokens);
  const { proposals, proposalsTokens } = useProposalsBatch(remainingTokens, {
    fetchRfpLinks: false,
    fetchVoteSummaries: false
  });

  useEffect(() => {
    const tokens =
      proposalsTokens.approved &&
      difference(proposalsTokens.approved, keys(proposals)).splice(
        0,
        PAGE_SIZE
      );
    setRemainingTokens(tokens);
  }, [proposalsTokens, proposals]);

  const isLoading = isEmpty(proposals) || !proposalsTokens.approved;

  return {
    proposals: Object.values(proposals),
    proposalsByToken: proposals,
    isLoading,
    remainingTokens
  };
}
