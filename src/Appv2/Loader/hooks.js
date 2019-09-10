import * as sel from "src/selectors";
import * as act from "src/actions";
// import { or } from "src/lib/fp";
import { useRedux } from "src/redux";

const mapStateToProps = {
  userPubkey: sel.userPubkey,
  loggedInAsEmail: sel.loggedInAsEmail,
  keyMismatch: sel.getKeyMismatch,
  apiError: sel.apiError,
  user: sel.apiMeResponse,
  loggedInAsUserId: sel.userid,
  userCanExecuteActions: sel.userCanExecuteActions,
  lastLoginTime: sel.lastLoginTimeFromLoginResponse,
  onboardViewed: sel.onboardViewed,
  identityImportSuccess: sel.identityImportSuccess,
  isCMS: sel.isCMS,
  apiInfo: sel.apiInitResponse
};

const mapDispatchToProps = {
  onRequestApiInfo: act.requestApiInfo,
  keyMismatchAction: act.keyMismatch,
  openModal: act.openModal,
  onRequestCurrentUser: act.onRequestMe,
  confirmWithModal: act.confirmWithModal,
  setOnboardAsViewed: act.setOnboardAsViewed,
  onLoadDraftProposals: act.onLoadDraftProposals,
  localLogout: act.handleLogout
};

export function useLoader(ownProps) {
  const fromRedux = useRedux(ownProps, mapStateToProps, mapDispatchToProps);
  return fromRedux;
}
