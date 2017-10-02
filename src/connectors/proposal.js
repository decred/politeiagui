import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import { arg } from "../lib/fp";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    token: compose(get(["match", "params", "token"]), arg(1)),
    proposal: sel.proposal,
    error: sel.proposalError,
    isLoading: sel.proposalIsRequesting
  }),
  dispatch => bindActionCreators({
    onFetchData: act.onFetchProposal
  }, dispatch)
);
