import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";


const userBadgeConnector = connect(
  sel.selectorMap({
    userPaywallStatus: sel.getUserPaywallStatus
  }),
  dispatch => bindActionCreators({
  }, dispatch)
);

export default userBadgeConnector;
