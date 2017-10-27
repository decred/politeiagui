import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

const signupFormConnector = connect(
  sel.selectorMap({
    newUserResponse: sel.newUserResponse,
    isRequesting: sel.isApiRequestingNewUser,
  }),
  { onSignup: act.onSignup, onResetNewUser: act.onResetNewUser }
);

export default signupFormConnector;
