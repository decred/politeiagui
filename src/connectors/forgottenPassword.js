import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

const forgottenPasswordConnector = connect(
  sel.selectorMap({
    forgottenPasswordResponse: sel.forgottenPasswordResponse,
    isRequesting: sel.isApiRequestingForgottenPassword,
  }),
  {
    resetForgottenPassword: act.resetForgottenPassword,
    onForgottenPasswordRequest: act.onForgottenPasswordRequest,
  }
);

export default forgottenPasswordConnector;
