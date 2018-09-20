import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as act from "../actions";
import * as sel from "../selectors";

export default connect(
  sel.selectorMap({
    userPubkey: sel.userPubkey,
    loggedInAsEmail: sel.loggedInAsEmail,
    keyMismatch: sel.getKeyMismatch,
    apiError: sel.apiError,
    userCanExecuteActions: sel.userCanExecuteActions,
    lastLoginTime: sel.lastLoginTimeFromLoginResponse,
    onboardViewed: sel.onboardViewed
  }),
  dispatch => bindActionCreators({
    onInit: act.requestApiInfo,
    keyMismatchAction: act.keyMismatch,
    openModal: act.openModal,
    setOnboardAsViewed: act.setOnboardAsViewed,
    onLoadDraftProposals: act.onLoadDraftProposals,
    onLoadPaymentPollingQueue: act.onLoadPaymentPollingQueue
  }, dispatch)
);
