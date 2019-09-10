import * as act from "src/actions";
import { MANAGE_USER_EXPIRE_UPDATE_KEY_VERIFICATION } from "src/constants";
import { useRedux } from "src/redux";
import * as sel from "src/selectors";

const mapStateToProps = {
  userPubkey: sel.userPubkey,
  user: sel.user,
  apiMeResponse: sel.apiMeResponse,
  loggedInAsUserId: sel.userid,
  identityImportError: sel.identityImportError,
  identityImportSuccess: sel.identityImportSuccess,
  keyMismatch: sel.getKeyMismatch,
  updateUserKey: sel.updateUserKey,
  updateUserKeyError: sel.updateUserKeyError,
  shouldAutoVerifyKey: sel.shouldAutoVerifyKey,
  verificationToken: sel.verificationToken,
  loggedInAsUsername: sel.loggedInAsUsername,
  loggedInAsEmail: sel.loggedInAsEmail,
  isApiRequestingUpdateUserKey: sel.isApiRequestingUpdateUserKey,
  isApiRequestingMarkUpdateKeyAsExpired: state =>
    sel.isApiRequestingManageUser(state) &&
    sel.manageUserAction(state) === MANAGE_USER_EXPIRE_UPDATE_KEY_VERIFICATION
};
const mapDispatchToProps = {
  keyMismatchAction: act.keyMismatch,
  onIdentityImported: act.onIdentityImported,
  updateMe: act.updateMe,
  onUpdateUserKey: act.onUpdateUserKey
};

export default function useUserIdentity(ownProps) {
  const fromRedux = useRedux(ownProps, mapStateToProps, mapDispatchToProps);

  return fromRedux;
}
