import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

const currentUserConnector = connect(
  sel.selectorMap({
    loggedInAsEmail: sel.loggedInAsEmail,
    loggedInAsUsername: sel.loggedInAsUsername,
    isAdmin: sel.isAdmin,
    userPaywallStatus: sel.getUserPaywallStatus,
    userCanExecuteActions: sel.userCanExecuteActions,
    proposalCredits: sel.proposalCredits
  }),
  dispatch => bindActionCreators({
    onLogout: act.onLogout,
    openModal: act.openModal
  }, dispatch)
);

export default currentUserConnector;
