import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    isAdmin: sel.isAdmin,
    proposals: sel.censoredProposals,
    error: sel.vettedProposalsError,
    isLoading: sel.vettedProposalsIsRequesting
  }),
  dispatch =>
    bindActionCreators(
      {
        onFetchData: act.onFetchUnvetted
      },
      dispatch
    )
);
