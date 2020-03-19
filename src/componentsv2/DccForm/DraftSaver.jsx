import React, { useEffect, useState } from "react";
import { Button } from "pi-ui";
import { FormikConsumer } from "formik";
import { useDraftDccs } from "src/containers/DCC/User/hooks";
import { getQueryStringValue, setQueryStringValue } from "src/lib/queryString";

const DraftSaver = ({ values, setValues, submitSuccess, nomineeUsername }) => {
  const [draftId, setDraftId] = useState(getQueryStringValue("draft"));
  const {
    draftDccs,
    onDeleteDraftDcc: onDelete,
    onSaveDraftDcc: onSave
  } = useDraftDccs();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const canSaveDraft = values && !!values.type && !!nomineeUsername && !saved;

  const executeFakeLoading = () => {
    setSaving(true);
    setTimeout(() => {
      setSaved(true);
      setSaving(false);
    }, 300);
  };

  const handleSave = () => {
    const id = onSave({ id: draftId, nomineeUsername, ...values });
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
      const foundDraftDcc =
        !!draftDccs && draftId && draftDccs[draftId];
      if (foundDraftDcc) {
        const {
          type,
          nomineeid,
          statement,
          domain,
          contractortype,
          draftId
        } = foundDraftDcc;
        setValues({
          type,
          nomineeid,
          statement,
          domain,
          contractortype,
          draftId
        });
      }
    },
    [draftDccs, draftId, setValues]
  );
  return (
    <Button
      type="button"
      width={150}
      kind={saving || !canSaveDraft ? "disabled" : "secondary"}
      loading={saving}
      onClick={handleSave}>
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
