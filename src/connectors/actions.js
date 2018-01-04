import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

const actions = connect(
  sel.selectorMap({
    loggedInAs: sel.loggedInAs,
    email: sel.email,
    isAdmin: sel.isAdmin,
    setStatusProposalToken: sel.setStatusProposalToken,
    setStatusProposalError: sel.setStatusProposalError
  }),
  {
    onChangeStatus: act.onSubmitStatusProposal
  }
);

export default actions;
