import * as act from "src/actions";
import * as sel from "src/selectors";
import { useAction, useSelector } from "src/redux";
import { useLoaderContext } from "src/containers/Loader";

export function useEditProposal() {
  const onEditProposal = useAction(act.onEditProposal);
  const politeiaQuiesced = useSelector(sel.politeiaQuiesced);
  const { currentUser } = useLoaderContext();
  return { onEditProposal, currentUser, politeiaQuiesced };
}
