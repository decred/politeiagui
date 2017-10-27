import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

const passwordResetConnector = connect(
  sel.selectorMap({
    passwordResetResponse: sel.passwordResetResponse,
    isRequesting: sel.isApiRequestingPasswordReset,
  }),
  {
    resetPasswordReset: act.resetPasswordReset,
    onPasswordResetRequest: act.onPasswordResetRequest,
  }
);

export default passwordResetConnector;
