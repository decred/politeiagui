import React, { useState, useCallback } from "react";
import { Text } from "pi-ui";
import { useDraftDccs } from "./hooks";
import DraftDcc from "src/components/DCC/DraftDcc";
import useBooleanState from "src/hooks/utils/useBooleanState";
import ModalConfirm from "src/components/ModalConfirm";
import HelpMessage from "src/components/HelpMessage";

const Drafts = () => {
  const { draftDccs, onDeleteDraftDcc } = useDraftDccs();
  const [targetDraftID, setTargetDraftID] = useState("");
  const [
    showDeleteDraftModal,
    openDeleteModal,
    closeDeleteModal
  ] = useBooleanState(false);

  const handleOpenDeleteDraftModal = useCallback(
    (draftID) => {
      setTargetDraftID(draftID);
      openDeleteModal();
    },
    [setTargetDraftID, openDeleteModal]
  );

  const handleDeleteDraft = useCallback(() => {
    onDeleteDraftDcc(targetDraftID);
    setTargetDraftID("");
  }, [onDeleteDraftDcc, setTargetDraftID, targetDraftID]);

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
            onDelete={handleOpenDeleteDraftModal}
            draft={draft}
          />
        ))
      ) : (
        <HelpMessage>No drafts available</HelpMessage>
      )}
      <ModalConfirm
        title={"Delete draft DCC"}
        message="Are you sure you want to delete this draft?"
        successTitle="Draft DCC deleted"
        successMessage={
          <Text>The draft DCC has been successfully deleted!</Text>
        }
        show={showDeleteDraftModal}
        onClose={closeDeleteModal}
        onSubmit={handleDeleteDraft}
      />
    </div>
  );
};

export default Drafts;
