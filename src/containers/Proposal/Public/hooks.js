import * as sel from "src/selectors";
import * as act from "src/actions";
import { or } from "src/lib/fp";
import { useRedux } from "src/redux";
import useTokenInventory from "src/hooks/api/useTokenInventory";
import useThrowError from "src/hooks/utils/useThrowError";

const mapStateToProps = {
  proposals: sel.proposalsByToken,
  error: or(sel.apiProposalsBatchError, sel.apiPropVoteStatusError)
};

const mapDispatchToProps = {
  onFetchProposalsBatch: act.onFetchProposalsBatch
};

export function usePublicProposals(ownProps) {
  const { proposals, onFetchProposalsBatch, error } = useRedux(
    ownProps,
    mapStateToProps,
    mapDispatchToProps
  );

  const [
    tokenInventory,
    errorTokenInventory,
    isLoadingTokenInventory
  ] = useTokenInventory();

  const anyError = errorTokenInventory || error;

  useThrowError(anyError);

  return {
    proposals,
    onFetchProposalsBatch,
    isLoadingTokenInventory,
    proposalsTokens: tokenInventory
  };
}
