import * as act from "src/actions";
import { useRedux } from "src/redux";
import * as sel from "src/selectors";

const mapStateToProps = {
  apiMeResponse: sel.currentUser,
  userPubkey: sel.currentUserPublicKey,
  loggedInAsEmail: sel.currentUserEmail,
  verifyUserKey: sel.verifyUserKey,
  verifyUserKeyError: sel.verifyUserKeyError,
  keyMismatch: sel.getKeyMismatch
};
const mapDispatchToProps = {
  onVerifyUserKey: act.onVerifyUserKey,
  updateMe: act.updateMe,
  keyMismatchAction: act.keyMismatch
};

export default function useVerifyKey(ownProps) {
  const fromRedux = useRedux(ownProps, mapStateToProps, mapDispatchToProps);

  return fromRedux;
}
