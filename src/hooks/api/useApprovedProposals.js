import { useEffect, useState } from "react";
import { isEmpty } from "src/helpers";
// import { values, flatten, uniq, flow } from "lodash/fp";
import useProposalsBatch from "./useProposalsBatch";
import { difference, keys } from "lodash";

const PAGE_SIZE = 20;

export default function useApprovedProposals(initialTokens) {
  // const {
  //   isLoadingTokenInventory,
  //   proposals: proposalsByToken,
  //   proposalsTokens,
  //   onFetchProposalsBatch
  // } = useProposalsBatch();

  // const [remainingTokens, setRemaining] = useState(
  //   getRemainingTokens(proposalsTokens.approved, proposalsByToken)
  // );

  // const requestParams = useMemo(() => [proposalsTokens.approved, false], [
  //   proposalsTokens
  // ]);

  // const needsFetch = useMemo(
  //   () =>
  //     isEmpty(proposalsByToken) &&
  //     proposalsTokens &&
  //     proposalsTokens.approved &&
  //     proposalsTokens.approved.length,
  //   [proposalsByToken, proposalsTokens]
  // );

  // const [loading, error] = useAPIAction(
  //   onFetchProposalsBatch,
  //   requestParams,
  //   needsFetch
  // );

  // const isLoading = loading || isLoadingTokenInventory;

  // const onFetchProposalsBatchByTokensRemaining = useCallback(
  //   (tokens, limit) => {
  //     const newRemainingTokens = getRemainingTokens(
  //       tokens,
  //       proposalsByToken,
  //       limit
  //     );

  //     if (!isEmpty(newRemainingTokens)) {
  //       onFetchProposalsBatch(newRemainingTokens, false);
  //       setRemaining(newRemainingTokens);
  //     }
  //   },
  //   [onFetchProposalsBatch, proposalsByToken, setRemaining]
  // );

  // useEffect(
  //   function fetchProposalsByInitialTokens() {
  //     if (!isEmpty(initialTokens) && !isLoading && !isEmpty(proposalsByToken)) {
  //       onFetchProposalsBatchByTokensRemaining(initialTokens);
  //     }
  //   },
  //   [
  //     isLoading,
  //     proposalsByToken,
  //     initialTokens,
  //     onFetchProposalsBatchByTokensRemaining
  //   ]
  // );

  // const onFetchRemainingProposalsBatch = useCallback(
  //   (limit) => {
  //     onFetchProposalsBatchByTokensRemaining(remainingTokens, limit);
  //   },
  //   [remainingTokens, onFetchProposalsBatchByTokensRemaining]
  // );

  // return {
  //   proposals: !isEmpty(proposalsByToken)
  //     ? Object.values(proposalsByToken)
  //     : [],
  //   proposalsByToken,
  //   isLoading: loading || isLoadingTokenInventory,
  //   error,
  //   remainingTokens,
  //   onFetchRemainingProposalsBatch
  // };
  const [tokensLeft, setTokensLeft] = useState(initialTokens);
  const { proposals, proposalsTokens } = useProposalsBatch(tokensLeft);

  useEffect(() => {
    const tokLeft =
      proposalsTokens.approved &&
      difference(proposalsTokens.approved, keys(proposals)).splice(
        0,
        PAGE_SIZE - 1
      );
    setTokensLeft(tokLeft);
  }, [proposalsTokens, proposals]);

  useEffect(() => {}, []);

  const isLoading = isEmpty(proposals) || !proposalsTokens.approved;

  // console.log("Proposals", proposals, isLoading);
  return {
    proposals: Object.values(proposals),
    proposalsByToken: proposals,
    isLoading,
    remainingTokens: []
  };
}
