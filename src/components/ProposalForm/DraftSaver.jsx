import React, { useEffect, useState } from "react";
import { Button } from "pi-ui";
import { FormikConsumer } from "formik";
import { useDraftProposals } from "src/containers/Proposal/User/hooks";
import { getQueryStringValue, setQueryStringValue } from "src/lib/queryString";
import {
  replaceBlobsByDigestsAndGetFiles,
  replaceImgDigestByBlob
} from "src/helpers";

const DraftSaver = ({
  values,
  setValues,
  dirty,
  submitSuccess,
  mapBlobToFile,
  setTouched
}) => {
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
    const { description, files } = replaceBlobsByDigestsAndGetFiles(
      values.description,
      mapBlobToFile
    );
    const newFiles = [...values.files, ...files];
    const id = onSave({ draftId, ...values, files: newFiles, description });
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
          files,
          type,
          description,
          rfpDeadline,
          rfpLink,
          startDate,
          endDate,
          amount,
          domain
        } = foundDraftProposal;
        const { text, markdownFiles } = replaceImgDigestByBlob(
          { description, files },
          mapBlobToFile
        );
        const filteredFiles = files.filter(
          (file) => !markdownFiles.includes(file)
        );
        const newValues = {
          name,
          description: text,
          files: filteredFiles,
          type,
          rfpDeadline,
          rfpLink,
          startDate,
          endDate,
          amount,
          domain
        };
        setValues(newValues);
        setTouched(newValues);
      }
    },
    [draftProposals, dirty, draftId, setValues, mapBlobToFile, setTouched]
  );
  return (
    <Button
      type="button"
      kind={saving || !canSaveDraft ? "disabled" : "secondary"}
      loading={saving}
      onClick={handleSave}
    >
      {saved ? "Saved ✓" : "Save Draft"}
    </Button>
  );
};

const Wrapper = (props) => {
  return (
    <FormikConsumer>
      {(formikProps) => {
        return <DraftSaver {...{ ...props, ...formikProps }} />;
      }}
    </FormikConsumer>
  );
};

export default Wrapper;
