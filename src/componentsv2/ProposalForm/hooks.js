import { useState } from "react";
import usePolicy from "src/hooks/usePolicy";
import { proposalValidation } from "./validation";

export function useProposalForm() {
  const { policy } = usePolicy();

  return {
    proposalFormValidation: policy && proposalValidation(policy),
    policy
  };
}

export function useFullImageModal() {
  const [showFullImageModal, setShowFullImageModal] = useState(false);
  const openFullImageModal = f => {
    setShowFullImageModal(f);
  };
  const closeFullImageModal = () => {
    setShowFullImageModal(false);
  };
  return {
    showFullImageModal,
    openFullImageModal,
    closeFullImageModal
  };
}
