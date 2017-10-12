import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

const currentUserConnector = connect(
  sel.selectorMap({
    loggedInAs: sel.loggedInAs,
    isAdmin: sel.isAdmin,
  }),
  dispatch => bindActionCreators({
    onLogout: act.onLogout
  }, dispatch)
);

export default currentUserConnector;
