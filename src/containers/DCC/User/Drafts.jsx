import React from "react";
import { Text } from "pi-ui";
import { useDraftDccs } from "./hooks";
import DraftDcc from "src/components/DCC/DraftDcc";
import ModalConfirm from "src/components/ModalConfirm";
import HelpMessage from "src/components/HelpMessage";
import useModalContext from "src/hooks/utils/useModalContext";
import { handleDeleteDraft } from "../helpers";

const Drafts = () => {
  const { draftDccs, onDeleteDraftDcc } = useDraftDccs();
  const [handleOpenModal, handleCloseModal] = useModalContext();

  const handleOpenDeleteDraftModal = (draftID) => () => {
    handleOpenModal(ModalConfirm, {
      title: "Delete draft DCC",
      message: "Are you sure you want to delete this draft?",
      successTitle: "Draft DCC deleted",
      successMessage: <Text>The draft DCC has been successfully deleted!</Text>,
      onClose: handleCloseModal,
      onSubmit: handleDeleteDraft(draftID, onDeleteDraftDcc)
    });
  };

  const drafts = draftDccs
    ? Object.values(draftDccs)
        .filter((draft) => !!draft.id)
        .sort((a, b) => b.timestamp - a.timestamp)
    : [];

  return (
    <div className="margin-top-m">
      {drafts.length ? (
        drafts.map((draft) => (
          <DraftDcc
            key={`draft-${draft.id}`}
            onDelete={handleOpenDeleteDraftModal(draft.id)}
            draft={draft}
          />
        ))
      ) : (
        <HelpMessage>No drafts available</HelpMessage>
      )}
    </div>
  );
};

export default Drafts;
