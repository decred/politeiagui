import * as sel from "src/selectors";
import * as act from "src/actions";
// import { or } from "src/lib/fp";
import { useRedux } from "src/redux";

const mapStateToProps = {
  user: sel.currentUser,
  userPubkey: sel.currentUserPublicKey,
  currentUserEmail: sel.currentUserEmail,
  currentUserID: sel.currentUserID,
  lastLoginTime: sel.currentUserLastLoginTime,
  keyMismatch: sel.getKeyMismatch,
  apiError: sel.apiError,
  userCanExecuteActions: sel.userCanExecuteActions,
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
  onPollUserPayment: act.onPollUserPayment,
  onUserProposalCredits: act.onUserProposalCredits,
  localLogout: act.handleLogout
};

export function useLoader(ownProps) {
  const fromRedux = useRedux(ownProps, mapStateToProps, mapDispatchToProps);
  return fromRedux;
}
