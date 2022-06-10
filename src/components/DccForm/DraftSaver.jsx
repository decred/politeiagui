import React, { useEffect, useState } from "react";
import { Button } from "pi-ui";
import { FormikConsumer } from "formik";
import { useDraftDccs } from "src/containers/DCC/User/hooks";
import useQueryString from "src/hooks/utils/useQueryString";
import delay from "lodash/delay";

const DraftSaver = ({ values, setValues, submitSuccess }) => {
  const [draftId, setDraftId] = useQueryString("draft");
  const {
    draftDccs,
    onDeleteDraftDcc: onDelete,
    onSaveDraftDcc: onSave
  } = useDraftDccs();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const canSaveDraft = values && !!values.type && !!values.nomineeid && !saved;

  const executeFakeLoading = () => {
    setSaving(true);
    delay(() => {
      setSaved(true);
      setSaving(false);
    }, 300);
  };

  const handleSave = () => {
    const id = onSave({ id: draftId, ...values });
    // first time saving this draft
    if (!draftId) {
      setDraftId(id);
    }
    executeFakeLoading();
  };

  useEffect(
    function resetSaved() {
      setSaved(false);
    },
    [values, setSaved]
  );

  useEffect(
    function handleSubmitSuccess() {
      if (submitSuccess && draftId) {
        onDelete(draftId);
      }
    },
    [submitSuccess, draftId, onDelete]
  );

  useEffect(
    function handleInitializeFormFromDraft() {
      const foundDraftDcc = draftDccs && draftId && draftDccs[draftId];
      if (foundDraftDcc) {
        setValues(foundDraftDcc);
      }
    },
    [draftDccs, draftId, setValues]
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
