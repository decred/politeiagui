import * as act from "src/actions";
import { useAction } from "src/redux";
import { useLoaderContext } from "src/Appv2/Loader";

export function useNewProposal() {
  const onSubmitProposal = useAction(act.onSaveNewProposalV2);
  const { currentUser } = useLoaderContext();
  return { onSubmitProposal, currentUser };
}
