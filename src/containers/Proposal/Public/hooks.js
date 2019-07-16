import { useEffect } from "react";
import { or } from "src/lib/fp";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useRedux } from "src/redux";

const mapStateToProps = {
  loggedInAsEmail: sel.loggedInAsEmail,
  proposals: sel.proposalsWithVoteStatus,
  isLoading: or(
    sel.isApiRequestingPropsVoteStatus,
    sel.isApiRequestingLastBlockHeight
  ),
  loadingTokenInventory: sel.apiTokenInventoryIsRequesting,
  error: or(
    sel.vettedProposalsError,
    sel.apiPropsVoteStatusError,
    sel.apiTokenInventoryError
  ),
  proposalsTokens: sel.apiTokenInventoryResponse,
  getVoteStatus: sel.getPropVoteStatus
};

const mapDispatchToProps = {
  onFetchVettedByTokens: act.onFetchVettedByTokens,
  onFetchTokenInventory: act.onFetchTokenInventory,
  onFetchProposalsVoteStatus: act.onFetchProposalsVoteStatus
};

export function usePublicProposals(ownProps) {
  const fromRedux = useRedux(ownProps, mapStateToProps, mapDispatchToProps);
  if (fromRedux.error) throw fromRedux.error;

  useEffect(() => {
    fromRedux.onFetchTokenInventory();
  }, []);

  return fromRedux;
}
