import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

const forgottenPasswordConnector = connect(
  sel.selectorMap({
    resetPasswordResponse: sel.resetPasswordResponse,
    isRequesting: sel.isApiRequestingForgottenPassword
  }),
  {
    onForgottenPasswordRequest: act.onForgottenPasswordRequest,
    onResetPassword: act.onResetPassword
  }
);

export default forgottenPasswordConnector;
