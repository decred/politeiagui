import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

const signupNextConnector = connect(
  sel.selectorMap({
    email: sel.newUserEmail,
    isTestnet: sel.isTestNet,
    verificationToken: sel.verificationToken,
    isRequestingVerifyNewUser: sel.isApiRequestingVerifyNewUser,
  }),
  dispatch => bindActionCreators({
    onResetNewUser: act.onResetNewUser,
  }, dispatch)
);

export default signupNextConnector;

