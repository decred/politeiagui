import * as sel from "src/selectors";
import * as act from "src/actions";
import { useRedux } from "src/redux";
import useAPIAction from "src/hooks/utils/useAPIAction";
import useThrowError from "src/hooks/utils/useThrowError";

const mapStateToProps = {
  proposals: sel.proposalsByToken,
  allByStatus: sel.allByStatus,
  error: sel.apiProposalsBatchError
};

const mapDispatchToProps = {
  onFetchProposalsBatch: act.onFetchProposalsBatch,
  onFetchTokenInventory: act.onFetchTokenInventory
};

export function useUnvettedProposals(ownProps) {
  const {
    proposals,
    error,
    allByStatus,
    onFetchTokenInventory,
    ...fromRedux
  } = useRedux(ownProps, mapStateToProps, mapDispatchToProps);

  const [loadingTokenInventory, errorTokenInventory] = useAPIAction(
    onFetchTokenInventory
  );

  const anyError = errorTokenInventory || error;

  useThrowError(anyError);

  return {
    proposals,
    proposalsTokens: allByStatus,
    loadingTokenInventory,
    ...fromRedux
  };
}
