import { useEffect } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useRedux } from "src/redux";
import useTokenInventory from "src/hooks/api/useTokenInventory";

const mapStateToProps = {
  proposals: sel.proposalsWithVoteStatus
};

const mapDispatchToProps = {
  onFetchProposalsBatch: act.onFetchProposalsBatch
};

export function usePublicProposals(ownProps) {
  const { proposals, onFetchProposalsBatch } = useRedux(
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
    onFetchProposalsBatch,
    loadingTokenInventory,
    proposalsTokens: tokenInventory
  };
}
