import { useMemo } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { or } from "src/lib/fp";
import { useSelector, useAction } from "src/redux";
import useAPIAction from "src/hooks/utils/useAPIAction";
import useThrowError from "src/hooks/utils/useThrowError";

export function usePublicProposals() {
  const proposals = useSelector(sel.proposalsByToken);
  const allByStatus = useSelector(sel.allByStatus);
  const errorSelector = useMemo(
    () => or(sel.apiProposalsBatchError, sel.apiPropVoteStatusError),
    []
  );
  const error = useSelector(errorSelector);

  const onFetchProposalsBatch = useAction(act.onFetchProposalsBatch);
  const onFetchTokenInventory = useAction(act.onFetchTokenInventory);

  const [isLoadingTokenInventory, errorTokenInventory] = useAPIAction(
    onFetchTokenInventory
  );

  const anyError = errorTokenInventory || error;

  useThrowError(anyError);

  return {
    proposals,
    onFetchProposalsBatch,
    isLoadingTokenInventory,
    proposalsTokens: allByStatus
  };
}
