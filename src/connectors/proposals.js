import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    loggedInAs: sel.loggedInAs,
    isAdmin: sel.isAdmin,
    proposals: sel.vettedProposals,
    error: sel.vettedProposalsError,
    isLoading: sel.vettedProposalsIsRequesting,
    header: () => "Vetted Proposals"
  }),
  dispatch => bindActionCreators({
    onFetchData: act.onFetchVetted,
    onChangeStatus: act.onSubmitStatusProposal
  }, dispatch)
);
