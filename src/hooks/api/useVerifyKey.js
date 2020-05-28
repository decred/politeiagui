import * as act from "src/actions";
import { useAction, useSelector } from "src/redux";
import * as sel from "src/selectors";

export default function useVerifyKey() {
  const userPubkey = useSelector(sel.currentUserPublicKey);
  const currentUserEmail = useSelector(sel.currentUserEmail);
  const keyMismatch = useSelector(sel.keyMismatch);
  const verifyUserKey = useSelector(sel.currentUserVerifiedKey);
  const verifyUserKeyError = useSelector(sel.verifyUserKeyError);

  const onVerifyUserKey = useAction(act.onVerifyUserKey);
  const keyMismatchAction = useAction(act.keyMismatch);

  const isCMS = useSelector(sel.isCMS);

  return {
    userPubkey,
    currentUserEmail,
    keyMismatch,
    verifyUserKey,
    verifyUserKeyError,
    onVerifyUserKey,
    keyMismatchAction,
    isCMS
  };
}
