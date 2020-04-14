import React from "react";
import { Text } from "pi-ui";
import { useDraftProposals } from "./hooks";
import DraftProposal from "src/components/Proposal/DraftProposal";
import ModalConfirm from "src/components/ModalConfirm";
import HelpMessage from "src/components/HelpMessage";
import useModalContext from "src/hooks/utils/useModalContext";

const Drafts = () => {
  const { draftProposals, onDeleteDraftProposal } = useDraftProposals();

  const handleDeleteDraft = (draftID) => () => {
    onDeleteDraftProposal(draftID);
  };

  const drafts = draftProposals
    ? Object.values(draftProposals).filter((draft) => !!draft.draftId)
    : [];

  const [handleOpenModal, handleCloseModal] = useModalContext();

  const handleOpenDeleteDraftModal = (draftId) => () => {
    handleOpenModal(ModalConfirm, {
      title: "Delete draft proposal",
      message: "Are you sure you want to delete this draft?",
      successTitle: "Draft proposal deleted",
      successMessage: (
        <Text>The draft proposal has been successfully deleted!</Text>
      ),
      onClose: handleCloseModal,
      onSubmit: handleDeleteDraft(draftId)
    });
  };

  return (
    <>
      {drafts.length ? (
        drafts.map((draft) => (
          <DraftProposal
            key={`draft-${draft.draftId}`}
            onDelete={handleOpenDeleteDraftModal(draft.draftId)}
            draft={draft}
          />
        ))
      ) : (
        <HelpMessage>No drafts available</HelpMessage>
      )}
    </>
  );
};

export default Drafts;
