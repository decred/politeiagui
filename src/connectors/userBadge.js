import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";

const userBadgeConnector = connect(
  sel.selectorMap({
    userPaywallStatus: sel.getUserPaywallStatus,
    loggedInAsEmail: sel.loggedInAsEmail
  }),
  dispatch => bindActionCreators({}, dispatch)
);

export default userBadgeConnector;
