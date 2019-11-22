import * as sel from "src/selectors";
import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";

export function useLoader() {
  const user = useSelector(sel.currentUser);
  const apiInfo = useSelector(sel.apiInitResponse);
  const onRequestApiInfo = useAction(act.requestApiInfo);
  const onRequestCurrentUser = useAction(act.onRequestMe);
  const localLogout = useAction(act.handleLogout);
  const onPollUserPayment = useAction(act.onPollUserPayment);
  const onUserProposalCredits = useAction(act.onUserProposalCredits);
  const onGetPolicy = useAction(act.onGetPolicy);
  return {
    user,
    apiInfo,
    onRequestApiInfo,
    onRequestCurrentUser,
    localLogout,
    onPollUserPayment,
    onUserProposalCredits,
    onGetPolicy
  };
}
