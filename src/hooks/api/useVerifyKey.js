import * as act from "src/actions";
import { useRedux } from "src/redux";
import * as sel from "src/selectors";

const mapStateToProps = {
  verifyUserKey: sel.verifyUserKey,
  apiMeResponse: sel.apiMeResponse,
  loggedInAsEmail: sel.loggedInAsEmail,
  verifyUserKeyError: sel.verifyUserKeyError,
  keyMismatch: sel.getKeyMismatch,
  userPubkey: sel.userPubkey
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
