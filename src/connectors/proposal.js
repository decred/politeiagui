import { connect } from "preact-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    proposal: sel.proposal,
    error: sel.proposalError,
    isLoading: sel.proposalIsRequesting
  }),
  dispatch => bindActionCreators({
    onFetchData: act.onFetchProposal
  }, dispatch)
);
