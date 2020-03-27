import * as act from "src/actions";
import { useAction } from "src/redux";
import { useLoaderContext } from "src/containers/Loader";

export function useEditProposal() {
  const onEditProposal = useAction(act.onEditProposal);
  const { currentUser } = useLoaderContext();
  return { onEditProposal, currentUser };
}
