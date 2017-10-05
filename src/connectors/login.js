import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

const loginConnector = connect(
  sel.selectorMap({
    email: sel.email,
    loggedInAs: sel.loggedInAs,
    isShowingSignup: sel.isShowingSignup,
    newUserResponse: sel.newUserResponse
  }),
  dispatch => bindActionCreators({
    onLogin: act.onLogin,
    onSignup: act.onSignup,
    onResetNewUser: act.onResetNewUser
  }, dispatch)
);

export default loginConnector;
