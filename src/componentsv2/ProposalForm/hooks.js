import { useState, useCallback } from "react";
import usePolicy from "src/hooks/api/usePolicy";
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
  const openFullImageModal = useCallback(
    (f) => {
      setShowFullImageModal(f);
    },
    [setShowFullImageModal]
  );
  const closeFullImageModal = useCallback(() => {
    setShowFullImageModal(false);
  }, [setShowFullImageModal]);
  return {
    showFullImageModal,
    openFullImageModal,
    closeFullImageModal
  };
}
