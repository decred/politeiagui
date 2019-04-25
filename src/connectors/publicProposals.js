import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { or } from "../lib/fp";
import { LIST_HEADER_PUBLIC } from "../constants";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    loggedInAsEmail: sel.loggedInAsEmail,
    isAdmin: sel.isAdmin,
    proposals: sel.apiVettedProposals,
    vettedRes: sel.apiVettedResponse,
    proposalCounts: sel.getVettedProposalFilterCounts,
    isLoading: or(
      sel.vettedProposalsIsRequesting,
      sel.isApiRequestingPropsVoteStatus
    ),
    error: or(sel.vettedProposalsError, sel.apiPropsVoteStatusError),
    filterValue: sel.getPublicFilterValue,
    header: () => LIST_HEADER_PUBLIC,
    lastLoadedProposal: sel.lastLoadedVettedProposal,
    emptyProposalsMessage: sel.getVettedEmptyProposalsMessage,
    getVoteStatus: sel.getPropVoteStatus,
    proposalsTokens: sel.apiTokenInventoryResponse
  }),
  dispatch =>
    bindActionCreators(
      {
        onFetchData: act.onFetchVetted,
        onFetchVettedByTokens: act.onFetchVettedByTokens,
        onFetchTokenInventory: act.onFetchTokenInventory,
        onChangeStatus: act.onSetProposalStatus,
        onFetchProposalsVoteStatus: act.onFetchProposalsVoteStatus,
        onChangeFilter: act.onChangePublicFilter,
        onResetDateFilter: act.onResetDateFilter
      },
      dispatch
    )
);
