import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

const passwordResetConnector = connect(
  sel.selectorMap({
    passwordResetResponse: sel.passwordResetResponse,
    isRequesting: sel.isApiRequestingPasswordReset,
    policy: sel.policy
  }),
  {
    resetPasswordReset: act.resetPasswordReset,
    onPasswordResetRequest: act.onPasswordResetRequest,
    onFetchData: act.onGetPolicy
  }
);

export default passwordResetConnector;
