import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

const loginFormConnector = connect(
  sel.selectorMap({
    email: sel.email,
    isApiRequestingLogin: sel.isApiRequestingLogin,
    apiLoginError: sel.apiLoginError
  }),
  dispatch => bindActionCreators({
    onSetEmail: act.onSetEmail,
    onShowSignup: act.onShowSignup
  }, dispatch)
);

export default loginFormConnector;
