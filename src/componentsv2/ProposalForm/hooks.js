import { useState } from "react";
import usePolicy from "src/hooks/usePolicy";
import { proposalValidation } from "./validation";

export function useProposalForm() {
  const { policy } = usePolicy();
  // const [proposalFormValidation, setProposalFormValidation] = useState(
  //   policy ? proposalValidation(policy) : null
  // );

  // useEffect(
  //   function handleSetProposalFormValidationFromPolicy() {
  //     if (!!policy && !proposalFormValidation) {
  //       setProposalFormValidation(proposalValidation(policy));
  //     }
  //   },
  //   [policy, proposalFormValidation]
  // );

  return {
    proposalFormValidation: policy && proposalValidation(policy),
    policy
  };
}

export function useFullImageModal() {
  const [showFullImageModal, setShowFullImageModal] = useState(null);
  const openFullImageModal = f => {
    setShowFullImageModal(f);
  };
  const closeFullImageModal = () => {
    setShowFullImageModal(null);
  };
  return {
    showFullImageModal,
    openFullImageModal,
    closeFullImageModal
  };
}

export function useAttachFileModal() {
  const [showAttachFileModal, setShowAttachFileModal] = useState(false);
  const openAttachFileModal = () => {
    setShowAttachFileModal(true);
  };
  const closeAttachFileModal = () => {
    setShowAttachFileModal(false);
  };
  return {
    showAttachFileModal,
    openAttachFileModal,
    closeAttachFileModal
  };
}
