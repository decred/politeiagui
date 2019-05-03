import { useEffect } from "react";

import { or } from "../../lib/fp";
import * as sel from "../../selectors";
import * as act from "../../actions";
import { useRedux } from "../../lib/redux";

const mapStateToProps = {
  loggedInAsEmail: sel.loggedInAsEmail,
  proposals: sel.apiVettedProposals,
  isLoading: or(
    sel.apiTokenInventoryIsRequesting,
    sel.isApiRequestingPropsVoteStatus,
    sel.isApiRequestingLastBlockHeight
  ),
  error: or(
    sel.vettedProposalsError,
    sel.apiPropsVoteStatusError,
    sel.apiTokenInventoryError
  ),
  filterValue: sel.getPublicFilterValue,
  emptyProposalsMessage: sel.getVettedEmptyProposalsMessage,
  proposalsTokens: sel.apiTokenInventoryResponse
};

const mapDispatchToProps = {
  onFetchVettedByTokens: act.onFetchVettedByTokens,
  onFetchTokenInventory: act.onFetchTokenInventory,
  onFetchProposalsVoteStatus: act.onFetchProposalsVoteStatus,
  onFetchLastBlockHeight: act.getLastBlockHeight
};

export function usePublicProposals(ownProps) {
  const fromRedux = useRedux(ownProps, mapStateToProps, mapDispatchToProps);
  if (fromRedux.error) throw fromRedux.error;

  useEffect(() => {
    fromRedux.onFetchProposalsVoteStatus();
    fromRedux.onFetchTokenInventory();
    fromRedux.onFetchLastBlockHeight();
  }, []);

  return fromRedux;
}
