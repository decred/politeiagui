import React, { useState } from "react";
import { useDraftProposals } from "./hooks";
import DraftProposal from "src/componentsv2/Proposal/DraftProposal";
import useBooleanState from "src/hooks/utils/useBooleanState";
import ModalConfirm from "src/componentsv2/ModalConfirm";
import HelpMessage from "src/componentsv2/HelpMessage";

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
  const drafts = !!draftProposals ?  Object.values(draftProposals)
  .filter(draft => !!draft.draftId) : [];
  return (
    <>
      {!!drafts.length ?
        drafts.map(draft => (
            <DraftProposal
              key={`draft-${draft.draftId}`}
              onDelete={handleOpenDeleteDraftModal}
              draft={draft}
            />
          )) : <HelpMessage>No drafts available</HelpMessage>}
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
