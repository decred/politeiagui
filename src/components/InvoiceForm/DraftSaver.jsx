import React, { useEffect, useState } from "react";
import { Button } from "pi-ui";
import { FormikConsumer } from "formik";
import { useDraftInvoices } from "src/containers/Invoice/User/hooks";
import { getQueryStringValue, setQueryStringValue } from "src/lib/queryString";
import omit from "lodash/omit";

const DraftSaver = ({ values, setValues, submitSuccess }) => {
  const [draftId, setDraftId] = useState(getQueryStringValue("draft"));
  const {
    draftInvoices,
    onDeleteDraftInvoice: onDelete,
    onSaveDraftInvoice: onSave
  } = useDraftInvoices();
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
      const foundDraftInvoice =
        !!draftInvoices && draftId && draftInvoices[draftId];
      if (foundDraftInvoice) {
        const values = foundDraftInvoice;
        setValues(omit(values, "timestamp"));
      }
    },
    [draftInvoices, draftId, setValues]
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
