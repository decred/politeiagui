import React, { useState } from "react";
import { useDraftProposals } from "./hooks";
import DraftProposal from "src/componentsv2/Proposal/DraftProposal";
import useBooleanState from "src/hooks/utils/useBooleanState";
import ModalConfirm from "src/componentsv2/ModalConfirm";

const Drafts = () => {
  const { draftProposals, onDeleteDraftProposal } = useDraftProposals();
  const [targetDraftID, setTargetDraftID] = useState("");
  const [
    showDeleteDraftModal,
    openDeleteModal,
    closeDeleteModal
  ] = useBooleanState(false);
  function handleOpenDeleteDraftModal(draftID) {
    setTargetDraftID(draftID);
    openDeleteModal();
  }
  function handleDeleteDraft() {
    onDeleteDraftProposal(targetDraftID);
    setTargetDraftID("");
  }
  return (
    <>
      {!!draftProposals &&
        Object.values(draftProposals)
          .filter(draft => !!draft.draftId)
          .map(draft => (
            <DraftProposal
              key={`draft-${draft.draftId}`}
              onDelete={handleOpenDeleteDraftModal}
              draft={draft}
            />
          ))}
      <ModalConfirm
        title={"Delete draft proposal"}
        message="Are you sure you want to delete this draft?"
        show={showDeleteDraftModal}
        onClose={closeDeleteModal}
        onSubmit={handleDeleteDraft}
      />
    </>
  );
};

export default Drafts;
