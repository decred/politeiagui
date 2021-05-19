import * as sel from "src/selectors";
import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";

export function useLoader() {
  const user = useSelector(sel.currentUser);
  const apiInfo = useSelector(sel.init);
  const onRequestApiInfo = useAction(act.requestApiInfo);
  const localLogout = useAction(act.handleLogout);
  const onPollUserPayment = useAction(act.onPollUserPayment);
  const onUserProposalCredits = useAction(act.onUserProposalCredits);

  return {
    user,
    apiInfo,
    onRequestApiInfo,
    localLogout,
    onPollUserPayment,
    onUserProposalCredits
  };
}
