import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

const passwordResetConnector = connect(
  sel.selectorMap({
    verifyResetPasswordResponse: sel.verifyResetPasswordResponse,
    isRequesting: sel.isApiRequestingPasswordReset,
    policy: sel.policy
  }),
  {
    resetPasswordReset: act.resetPasswordReset,
    onPasswordResetRequest: act.onPasswordResetRequest,
    onVerifyResetPassword: act.onVerifyResetPassword,
    onFetchData: act.onGetPolicy
  }
);

export default passwordResetConnector;
