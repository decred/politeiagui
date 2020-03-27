import usePolicy from "src/hooks/api/usePolicy";
import { proposalValidation } from "./validation";

export function useProposalForm() {
  const { policy } = usePolicy();

  return {
    proposalFormValidation: policy && proposalValidation(policy),
    policy
  };
}
