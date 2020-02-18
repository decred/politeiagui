import * as act from "src/actions";
import { useAction } from "src/redux";

export function useEditProposal() {
  const onEditProposal = useAction(act.onEditProposalV2);

  return { onEditProposal };
}
