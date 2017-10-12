import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";
import { or } from "../lib/fp";

const loginFormConnector = connect(
  sel.selectorMap({
    isApiRequestingLogin: or(sel.isApiRequestingInit, sel.isApiRequestingLogin),
    apiLoginError: sel.apiLoginError
  }),
  dispatch => bindActionCreators({
    onSetEmail: act.onSetEmail,
  }, dispatch)
);

export default loginFormConnector;
