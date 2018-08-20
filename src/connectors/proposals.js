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
    proposals: sel.getVettedFilteredProposals,
    proposalCounts: sel.getVettedProposalFilterCounts,
    isLoading: or(sel.vettedProposalsIsRequesting, sel.isApiRequestingPropsVoteStatus),
    error: or(sel.vettedProposalsError, sel.apiPropsVoteStatusError),
    filterValue: sel.getPublicFilterValue,
    header: () => LIST_HEADER_PUBLIC,
    emptyProposalsMessage: sel.getVettedEmptyProposalsMessage
  }),
  dispatch => bindActionCreators({
    onFetchData: act.onFetchVetted,
    onChangeStatus: act.onSubmitStatusProposal,
    onFetchProposalsVoteStatus: act.onFetchProposalsVoteStatus,
    onChangeFilter: act.onChangePublicFilter
  }, dispatch)
);
