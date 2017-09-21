import { connect } from "preact-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    proposals: sel.vettedProposals,
    error: sel.vettedProposalsError,
    isLoading: sel.vettedProposalsIsRequesting
  }),
  dispatch => bindActionCreators({
    onFetchData: act.onFetchVetted
  }, dispatch)
);
