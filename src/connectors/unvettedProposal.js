import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    proposals: sel.unvettedProposals,
    error: sel.unvettedProposalsError,
  }),
  {
    onFetchUnvetted: act.onFetchUnvetted,
    onSubmitStatusProposal: act.onSubmitStatusProposal
  }
);
