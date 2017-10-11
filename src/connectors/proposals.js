import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    items: sel.vettedProposals,
    error: sel.vettedProposalsError,
    isLoading: sel.vettedProposalsIsRequesting
  }),
  dispatch => bindActionCreators({
    onFetchData: act.onFetchVetted
  }, dispatch)
);
