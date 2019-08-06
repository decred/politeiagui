import { useEffect } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useRedux } from "src/redux";
import useTokenInventory from "src/hooks/api/useTokenInventory";

const mapStateToProps = {
  proposals: sel.unvettedProposals
};

const mapDispatchToProps = {
  onFetchProposalsBatch: act.onFetchProposalsBatch
};

export function useUnvettedProposals(ownProps) {
  const { proposals, ...fromRedux } = useRedux(
    ownProps,
    mapStateToProps,
    mapDispatchToProps
  );

  const [
    tokenInventory,
    errorTokenInventory,
    loadingTokenInventory
  ] = useTokenInventory();

  const anyError = errorTokenInventory;

  useEffect(() => {
    if (anyError) {
      throw anyError;
    }
  }, [anyError]);

  return {
    proposals,
    proposalsTokens: tokenInventory,
    loadingTokenInventory,
    ...fromRedux
  };
}
