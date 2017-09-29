import { connect } from "preact-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

const currentUserConnector = connect(
  sel.selectorMap({
    loggedInAs: sel.loggedInAs
  }),
  dispatch => bindActionCreators({
    onLogout: act.onLogout
  }, dispatch)
);

export default currentUserConnector;
