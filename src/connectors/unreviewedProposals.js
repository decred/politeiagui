import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    isAdmin: sel.isAdmin,
    proposals: sel.unreviewedProposals,
    error: sel.vettedProposalsError,
    isLoading: sel.vettedProposalsIsRequesting
  }),
  dispatch =>
    bindActionCreators(
      {
        onFetchData: act.onFetchUnvetted,
        onSetProposalStatus: act.onSetProposalStatus
      },
      dispatch
    )
);
