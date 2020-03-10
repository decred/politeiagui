import React, { useEffect, useState } from "react";
import { Button } from "pi-ui";
import { useFormikContext } from "formik";
import { useDraftProposals } from "src/containers/Proposal/User/hooks";
import { getQueryStringValue, setQueryStringValue } from "src/lib/queryString";

const DraftSaver = ({ submitSuccess }) => {
  const { values, setValues, dirty } = useFormikContext();
  const [draftId, setDraftId] = useState(getQueryStringValue("draft"));
  const {
    draftProposals,
    onDeleteDraftProposal: onDelete,
    onSaveDraftProposal: onSave
  } = useDraftProposals();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const canSaveDraft = values && !!values.name && !saved;

  const executeFakeLoading = () => {
    setSaving(true);
    setTimeout(() => {
      setSaved(true);
      setSaving(false);
    }, 300);
  };

  const handleSave = () => {
    const id = onSave({ draftId, ...values });
    // first time saving this draft
    if (!draftId) {
      setDraftId(id);
    }
    executeFakeLoading();
  };

  useEffect(
    function updateURLForDraftID() {
      if (draftId) {
        setQueryStringValue("draft", draftId);
      }
    },
    [draftId]
  );

  useEffect(
    function resetSaved() {
      setSaved(false);
    },
    [values, setSaved]
  );

  useEffect(
    function handleSubmitSuccess() {
      if (submitSuccess && !!draftId) {
        onDelete(draftId);
      }
    },
    [submitSuccess, draftId, onDelete]
  );

  useEffect(
    function handleInitializeFormFromDraft() {
      const foundDraftProposal =
        !!draftProposals && draftId && draftProposals[draftId];
      if (foundDraftProposal && !dirty) {
        const {
          name,
          description,
          files,
          type,
          rfpDeadline,
          rfpLink
        } = foundDraftProposal;
        setValues({ name, description, files, type, rfpDeadline, rfpLink });
      }
    },
    [draftProposals, dirty, draftId, setValues]
  );
  return (
    <Button
      type="button"
      kind={saving || !canSaveDraft ? "disabled" : "secondary"}
      loading={saving}
      onClick={handleSave}>
      {saved ? "Saved ✓" : "Save Draft"}
    </Button>
  );
};

export default DraftSaver;
