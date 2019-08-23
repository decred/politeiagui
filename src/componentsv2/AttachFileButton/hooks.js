import { useState } from "react";

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
