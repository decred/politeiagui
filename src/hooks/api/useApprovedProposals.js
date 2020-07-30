import { useMemo, useEffect, useCallback, useState } from "react";
import useAPIAction from "src/hooks/utils/useAPIAction";
import useProposalsBatch from "src/hooks/api/useProposalsBatch";
import { isEmpty } from "src/helpers";
import keys from "lodash/keys";

const PAGE_SIZE = 20;

const remainingTokensFilter = (proposals) => (token) =>
  !keys(proposals).some((proposalToken) => proposalToken === token);

const getRemainingTokens = (tokens = [], proposals = [], limit = 0) =>
  !limit
    ? tokens.filter(remainingTokensFilter(proposals))
    : tokens.filter(remainingTokensFilter(proposals)).slice(0, limit);

export default function useApprovedProposals(initialTokens = []) {
  const {
    isLoadingTokenInventory,
    proposals: proposalsByToken,
    proposalsTokens,
    onFetchProposalsBatch
  } = useProposalsBatch();

  const [remainingTokens, setRemaining] = useState(
    getRemainingTokens(proposalsTokens.approved, proposalsByToken)
  );

  const requestParams = useMemo(
    () => [proposalsTokens.approved.slice(0, PAGE_SIZE), false],
    [proposalsTokens]
  );

  const needsFetch = useMemo(
    () =>
      isEmpty(proposalsByToken) &&
      proposalsTokens &&
      proposalsTokens.approved &&
      proposalsTokens.approved.length,
    [proposalsByToken, proposalsTokens]
  );

  const [loading, error] = useAPIAction(
    onFetchProposalsBatch,
    requestParams,
    needsFetch
  );

  const isLoading = loading || isLoadingTokenInventory;

  const onFetchProposalsBatchByTokensRemaining = useCallback(
    (tokens, limit) => {
      const newRemainingTokens = getRemainingTokens(
        tokens,
        proposalsByToken,
        limit
      );

      if (!isEmpty(newRemainingTokens)) {
        onFetchProposalsBatch(newRemainingTokens, false);
        setRemaining(newRemainingTokens);
      }
    },
    [onFetchProposalsBatch, proposalsByToken, setRemaining]
  );

  useEffect(
    function fetchProposalsByInitialTokens() {
      if (!isEmpty(initialTokens) && !isLoading && !isEmpty(proposalsByToken)) {
        onFetchProposalsBatchByTokensRemaining(initialTokens);
      }
    },
    [
      isLoading,
      proposalsByToken,
      initialTokens,
      onFetchProposalsBatchByTokensRemaining
    ]
  );

  const onFetchRemainingProposalsBatch = useCallback(
    (limit) => {
      onFetchProposalsBatchByTokensRemaining(remainingTokens, limit);
    },
    [remainingTokens, onFetchProposalsBatchByTokensRemaining]
  );

  return {
    proposals: !isEmpty(proposalsByToken)
      ? Object.values(proposalsByToken)
      : [],
    proposalsByToken,
    isLoading: loading || isLoadingTokenInventory,
    error,
    remainingTokens,
    onFetchRemainingProposalsBatch,
    onFetchProposalsBatchByTokensRemaining
  };
}
