import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

const actions = connect(
  sel.selectorMap({
    loggedInAs: sel.loggedInAs,
    email: sel.email,
    userid: sel.userid,
    isAdmin: sel.isAdmin,
    userHasPaid: sel.userHasPaid,
    userCanExecuteActions: sel.userCanExecuteActions,
    lastSubmitted: sel.getLastSubmittedProposal,
    setStatusProposalToken: sel.setStatusProposalToken,
    setStatusProposalError: sel.setStatusProposalError
  }),
  {
    onChangeStatus: act.onSubmitStatusProposal,
    onStartVote: act.onStartVote,
  }
);

export default actions;
