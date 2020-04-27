import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";
import * as sel from "src/selectors";

export default function useUserIdentity() {
  const userPubkey = useSelector(sel.currentUserPublicKey);
  const currentUserID = useSelector(sel.currentUserID);
  const currentUserUsername = useSelector(sel.currentUserUsername);
  const currentUserEmail = useSelector(sel.currentUserEmail);
  const identityImportError = useSelector(sel.identityImportError);
  const identityImportSuccess = useSelector(sel.identityImportSuccess);
  const keyMismatch = useSelector(sel.keyMismatch);
  const updateUserKeyToken = useSelector(sel.currentUserKeyVerificationToken);
  const updateUserKeyError = useSelector(sel.updateUserKeyError);
  const shouldAutoVerifyKey = useSelector(sel.shouldAutoVerifyKey);

  const keyMismatchAction = useAction(act.keyMismatch);
  const onIdentityImported = useAction(act.onIdentityImported);
  const onUpdateUserKey = useAction(act.onUpdateUserKey);

  return {
    userPubkey,
    currentUserID,
    currentUserUsername,
    currentUserEmail,
    identityImportError,
    identityImportSuccess,
    keyMismatch,
    updateUserKeyToken,
    updateUserKeyError,
    shouldAutoVerifyKey,
    keyMismatchAction,
    onIdentityImported,
    onUpdateUserKey
  };
}
