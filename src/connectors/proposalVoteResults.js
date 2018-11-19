import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    proposalVoteResults: sel.apiPropVoteResultsResponse,
    isLoading: sel.isApiRequestingPropVoteResults,
    error: sel.apiPropVoteStatusError
  }),
  dispatch =>
    bindActionCreators(
      {
        onFetchProposalVoteResults: act.onFetchProposalVoteResults
      },
      dispatch
    )
);
