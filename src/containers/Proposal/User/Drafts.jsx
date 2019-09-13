import React, { useState, useCallback } from "react";
import { Text } from "pi-ui";
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

  const handleOpenDeleteDraftModal = useCallback(
    draftID => {
      setTargetDraftID(draftID);
      openDeleteModal();
    },
    [setTargetDraftID, openDeleteModal]
  );

  const handleDeleteDraft = useCallback(() => {
    onDeleteDraftProposal(targetDraftID);
    setTargetDraftID("");
  }, [onDeleteDraftProposal, setTargetDraftID, targetDraftID]);

  const drafts = !!draftProposals
    ? Object.values(draftProposals).filter(draft => !!draft.draftId)
    : [];

  return (
    <>
      {!!drafts.length ? (
        drafts.map(draft => (
          <DraftProposal
            key={`draft-${draft.draftId}`}
            onDelete={handleOpenDeleteDraftModal}
            draft={draft}
          />
        ))
      ) : (
        <HelpMessage>No drafts available</HelpMessage>
      )}
      <ModalConfirm
        title={"Delete draft proposal"}
        message="Are you sure you want to delete this draft?"
        successTitle="Draft proposal deleted"
        successMessage={
          <Text>The draft proposal has been successfully deleted!</Text>
        }
        show={showDeleteDraftModal}
        onClose={closeDeleteModal}
        onSubmit={handleDeleteDraft}
      />
    </>
  );
};

export default Drafts;
