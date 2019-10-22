import * as sel from "src/selectors";
import * as act from "src/actions";
import { useRedux } from "src/redux";
import useTokenInventory from "src/hooks/api/useTokenInventory";
import useThrowError from "src/hooks/utils/useThrowError";

const mapStateToProps = {
  proposals: sel.proposalsByToken,
  error: sel.apiProposalsBatchError
};

const mapDispatchToProps = {
  onFetchProposalsBatch: act.onFetchProposalsBatch
};

export function useUnvettedProposals(ownProps) {
  const { proposals, error, ...fromRedux } = useRedux(
    ownProps,
    mapStateToProps,
    mapDispatchToProps
  );

  const [
    tokenInventory,
    errorTokenInventory,
    loadingTokenInventory
  ] = useTokenInventory();

  const anyError = errorTokenInventory || error;

  useThrowError(anyError);

  return {
    proposals,
    proposalsTokens: tokenInventory,
    loadingTokenInventory,
    ...fromRedux
  };
}
