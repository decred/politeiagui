import usePolicy from "src/hooks/api/usePolicy";
import { useAction } from "src/redux";
import * as act from "src/actions";
import { proposalValidation } from "./validation";

export function useProposalForm() {
  const { policy } = usePolicy();
  const onFetchProposalsBatch = useAction(act.onFetchProposalsBatch);
  return {
    proposalFormValidation: policy && proposalValidation(policy),
    onFetchProposalsBatch,
    policy
  };
}
