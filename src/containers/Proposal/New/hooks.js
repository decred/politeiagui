import * as act from "src/actions";
import * as sel from "src/selectors";
import { useAction, useSelector } from "src/redux";
import { useLoaderContext } from "src/containers/Loader";

export function useNewProposal() {
  const politeiaQuiesced = useSelector(sel.politeiaQuiesced);
  const onSubmitProposal = useAction(act.onSaveNewProposal);
  const { currentUser } = useLoaderContext();
  return { onSubmitProposal, currentUser, politeiaQuiesced };
}
