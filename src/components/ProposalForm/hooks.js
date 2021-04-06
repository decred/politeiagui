import usePolicy from "src/hooks/api/usePolicy";
import { useAction } from "src/redux";
import * as act from "src/actions";
import { proposalValidation } from "./validation";

export function useProposalForm() {
  const { policyPi } = usePolicy();
  const onFetchProposalsBatchWithoutState = useAction(
    act.onFetchProposalsBatchWithoutState
  );
  return {
    proposalFormValidation: policyPi && proposalValidation(policyPi),
    onFetchProposalsBatchWithoutState,
    policy: policyPi
  };
}
