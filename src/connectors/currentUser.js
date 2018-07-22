import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

const currentUserConnector = connect(
  sel.selectorMap({
    loggedInAsEmail: sel.loggedInAsEmail,
    loggedInAsUsername: sel.loggedInAsUsername,
    isAdmin: sel.isAdmin,
    userCanExecuteActions: sel.userCanExecuteActions,
    proposalCredits: sel.proposalCredits,
    isApiRequestingUpdateProposalCredits: sel.isApiRequestingUpdateProposalCredits
  }),
  dispatch => bindActionCreators({
    onLogout: act.onLogout,
    onUpdateProposalCredits: act.onUpdateProposalCredits
  }, dispatch)
);

export default currentUserConnector;
