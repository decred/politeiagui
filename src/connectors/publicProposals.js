import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { or } from "../lib/fp";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    loggedInAsEmail: sel.loggedInAsEmail,
    proposals: sel.apiVettedProposals,
    isLoading: or(
      sel.apiTokenInventoryIsRequesting,
      sel.isApiRequestingPropsVoteStatus
    ),
    error: or(
      sel.vettedProposalsError,
      sel.apiPropsVoteStatusError,
      sel.apiTokenInventoryError
    ),
    filterValue: sel.getPublicFilterValue,
    emptyProposalsMessage: sel.getVettedEmptyProposalsMessage,
    getVoteStatus: sel.getPropVoteStatus,
    proposalsTokens: sel.apiTokenInventoryResponse,
    tokenInventoryFetched: sel.tokenInventoryFetched
  }),
  dispatch =>
    bindActionCreators(
      {
        onFetchVettedByTokens: act.onFetchVettedByTokens,
        onFetchTokenInventory: act.onFetchTokenInventory,
        onFetchProposalsVoteStatus: act.onFetchProposalsVoteStatus
      },
      dispatch
    )
);
