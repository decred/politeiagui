import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

const resendVerificationEmailConnector = connect(
  sel.selectorMap({
    resendVerificationEmailResponse: sel.resendVerificationEmailResponse,
    isRequesting: sel.isApiRequestingResendVerificationEmail,
    isShowingConfirmation: sel.isShowingSignupConfirmation
  }),
  {
    onResendVerificationEmail: act.onResendVerificationEmail,
    onResendVerificationEmailConfirm: act.onResendVerificationEmailConfirm
  }
);

export default resendVerificationEmailConnector;
