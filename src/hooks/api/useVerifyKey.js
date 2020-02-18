import * as act from "src/actions";
import { useAction, useSelector } from "src/redux";
import * as sel from "src/selectors";

export default function useVerifyKey() {
  const userPubkey = useSelector(sel.currentUserPublicKey);
  const currentUserEmail = useSelector(sel.currentUserEmail);
  const keyMismatch = useSelector(sel.getKeyMismatch);
  const verifyUserKey = useSelector(sel.verifyUserKey);
  const verifyUserKeyError = useSelector(sel.verifyUserKeyError);

  const onVerifyUserKey = useAction(act.onVerifyUserKey);
  const keyMismatchAction = useAction(act.keyMismatch);

  return {
    userPubkey,
    currentUserEmail,
    keyMismatch,
    verifyUserKey,
    verifyUserKeyError,
    onVerifyUserKey,
    keyMismatchAction
  };
}
