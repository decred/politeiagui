import * as act from "src/actions";
import { useAction } from "src/redux";
import { useLoaderContext } from "src/containers/Loader";

export function useNewProposal() {
  const onSubmitProposal = useAction(act.onSaveNewProposal);
  const { currentUser } = useLoaderContext();
  return { onSubmitProposal, currentUser };
}
