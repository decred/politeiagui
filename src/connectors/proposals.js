import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { or } from "../lib/fp";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    loggedInAs: sel.loggedInAs,
    isAdmin: sel.isAdmin,
    proposals: sel.vettedProposals,
    isLoading: or(sel.vettedProposalsIsRequesting, sel.isApiRequestingActiveVotes),
    error: or(sel.vettedProposalsError, sel.activeVotesError),
    activeVotes: sel.activeVotes,
    header: () => "Active Proposals"
  }),
  dispatch => bindActionCreators({
    onFetchData: act.onFetchVetted,
    onChangeStatus: act.onSubmitStatusProposal,
    onFetchActiveVotes: act.onFetchActiveVotes
  }, dispatch)
);
