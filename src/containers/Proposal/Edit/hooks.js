import * as act from "src/actions";
import { useAction } from "src/redux";
import { useLoaderContext } from "src/Appv2/Loader";

export function useEditProposal() {
  const onEditProposal = useAction(act.onEditProposalV2);
  const { currentUser } = useLoaderContext();
  return { onEditProposal, currentUser };
}
