import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    loggedInAs: sel.loggedInAs,
    isAdmin: sel.isAdmin,
    proposals: sel.userProposals,
    error: sel.userProposalsError,
    isLoading: sel.userProposalsIsRequesting
  }),
  dispatch =>
    bindActionCreators(
      {
        onFetchData: act.onFetchUserProposals
      },
      dispatch
    )
);
