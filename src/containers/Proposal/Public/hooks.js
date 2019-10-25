import * as sel from "src/selectors";
import * as act from "src/actions";
import { or } from "src/lib/fp";
import { useRedux } from "src/redux";
import useAPIAction from "src/hooks/utils/useAPIAction";
import useThrowError from "src/hooks/utils/useThrowError";

const mapStateToProps = {
  proposals: sel.proposalsByToken,
  allByStatus: sel.allByStatus,
  error: or(sel.apiProposalsBatchError, sel.apiPropVoteStatusError)
};

const mapDispatchToProps = {
  onFetchProposalsBatch: act.onFetchProposalsBatch,
  onFetchTokenInventory: act.onFetchTokenInventory
};

export function usePublicProposals(ownProps) {
  const {
    proposals,
    onFetchProposalsBatch,
    allByStatus,
    onFetchTokenInventory,
    error
  } = useRedux(ownProps, mapStateToProps, mapDispatchToProps);

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
