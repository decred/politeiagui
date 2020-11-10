import { useEffect, useState, useMemo } from "react";
import useProposalsBatch from "./useProposalsBatch";
import { difference, keys } from "lodash";

const PAGE_SIZE = 20;

export default function useApprovedProposals(initialTokens) {
  const [remainingTokens, setRemainingTokens] = useState(initialTokens);
  const { proposals, proposalsTokens, loading, verifying } = useProposalsBatch(
    remainingTokens,
    {
      fetchRfpLinks: false,
      fetchVoteSummaries: false
    }
  );

  const isLoading = loading || verifying;

  useEffect(() => {
    if (!isLoading) {
      const tokens =
        proposalsTokens.approved &&
        difference(proposalsTokens.approved, keys(proposals)).splice(
          0,
          PAGE_SIZE
        );
      setRemainingTokens(tokens);
    }
  }, [proposals, proposalsTokens.approved, isLoading]);

  const nonRfpProposals = useMemo(
    () => proposals && Object.values(proposals).filter((p) => !p.linkby),
    [proposals]
  );

  return {
    proposals: Object.values(proposals),
    proposalsByToken: proposals,
    nonRfpProposals,
    isLoading,
    remainingTokens
  };
}
