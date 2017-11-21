import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import { or } from "../lib/fp";

export default connect(
  sel.selectorMap({
    proposals: sel.unvettedProposals,
    error: sel.unvettedProposalsError,
    isLoading: or(sel.unvettedProposalsIsRequesting, sel.setStatusProposalIsRequesting)
  }),
  {
    onFetchData: act.onFetchUnvetted,
  }
);
