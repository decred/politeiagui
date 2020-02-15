import * as act from "src/actions";
import { useAction } from "src/redux";

export function useNewProposal() {
  const onSubmitProposal = useAction(act.onSaveNewProposalV2);

  return { onSubmitProposal };
}
