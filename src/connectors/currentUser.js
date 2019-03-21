import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

const currentUserConnector = connect(
  sel.selectorMap({
    loggedInAsEmail: sel.loggedInAsEmail,
    loggedInAsUsername: sel.loggedInAsUsername,
    isAdmin: sel.isAdmin,
    error: sel.apiLogoutError,
    userPaywallStatus: sel.getUserPaywallStatus,
    userCanExecuteActions: sel.userCanExecuteActions,
    proposalCredits: sel.proposalCredits,
    lastLoginTime: sel.lastLoginTimeFromMeResponse,
    sessionMaxAge: sel.sessionMaxAge,
    loggedInAsUserId: sel.userid,
    isCMS: sel.isCMS
  }),
  dispatch =>
    bindActionCreators(
      {
        onLogout: act.onLogout,
        handleLogout: act.handleLogout,
        openModal: act.openModal
      },
      dispatch
    )
);

export default currentUserConnector;
