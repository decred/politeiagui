import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import { arg } from "../lib/fp";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    userid: compose(get(["match", "params", "userid"]), arg(1)),
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
