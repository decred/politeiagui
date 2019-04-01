import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    proposals: sel.unvettedProposals,
    error: sel.unvettedProposalsError,
    isLoading: sel.unvettedProposalsIsRequesting
  }),
  {
    onFetchData: act.onFetchUnvetted,
    onSetProposalStatus: act.onSetProposalStatus
  }
);
