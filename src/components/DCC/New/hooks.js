import { useState, useCallback, useEffect } from "react";
import {
  CMS_USER_TYPES,
  CMS_DOMAINS,
  DCC_TYPE_REVOCATION
} from "../../../constants";
import {
  getQueryStringValue,
  setQueryStringValue
} from "../../../lib/queryString";

// remove supervisor option since it ir not available for new dcc
const typeOptions = CMS_USER_TYPES.reduce((acc, curr, index) => {
  if (curr === "Supervisor") return [...acc];
  return [...acc, { label: curr, value: index }];
}, []);

// format domain options to select form field
const domainOptions = CMS_DOMAINS.map((d, i) => ({ label: d, value: i }));

export const useNewDCC = ({
  onSubmitDCC,
  onSaveDraftDCC,
  newToken,
  history,
  error
}) => {
  const [draftId, setDraftId] = useState(getQueryStringValue("draft"));
  const [requestDone, setRequestDone] = useState(false);

  const [formValues, setFormValues] = useState({
    nomineeid: "",
    dccstatement: "",
    dccdomain: 0,
    dcctype: 0,
    contractortype: 0
  });

  const [savedDraft, setSavedDraft] = useState(false);
  const [fakeLoadingDraft, setFakeLoadingDraft] = useState(false);
  const [isRevocation, setIsRevocation] = useState(false);

  useEffect(
    function updateURLForDraftID() {
      if (draftId) {
        setQueryStringValue("draft", draftId);
      }
    },
    [draftId]
  );

  const handleChangeInput = useCallback(
    name => ({ target: { value: v } }) => {
      setFormValues({
        ...formValues,
        [name]: v
      });
    },
    [formValues, setFormValues]
  );

  useEffect(
    function handleDCCTypeChanges() {
      if (formValues.dcctype === DCC_TYPE_REVOCATION) {
        setIsRevocation(true);
      }
    },
    [formValues.dcctype, setIsRevocation]
  );

  const handleSaveDCCDraft = useCallback(
    event => {
      event && event.preventDefault();
      const {
        nomineeid,
        dccstatement,
        dccdomain,
        dcctype,
        contractortype
      } = formValues;
      const id = onSaveDraftDCC({
        type: dcctype,
        nomineeid: nomineeid,
        statement: dccstatement,
        domain: dccdomain,
        contractortype: contractortype,
        draftId
      });
      setFakeLoadingDraft(true);
      setTimeout(() => {
        setSavedDraft(true);
        setFakeLoadingDraft(false);
        setDraftId(id);
      }, 300);
    },
    [
      onSaveDraftDCC,
      formValues,
      setSavedDraft,
      setFakeLoadingDraft,
      setDraftId,
      draftId
    ]
  );

  useEffect(() => {
    if (requestDone && !error && newToken) {
      setTimeout(() => {
        history.push(`/dcc/${newToken}`);
      }, 300);
    }
  }, [error, newToken, history, requestDone]);

  const handleSubmitDCC = useCallback(
    async event => {
      event && event.preventDefault();
      const {
        nomineeid,
        dccstatement,
        dccdomain,
        dcctype,
        contractortype
      } = formValues;
      await onSubmitDCC({
        type: +dcctype,
        nomineeid: nomineeid,
        statement: dccstatement,
        domain: +dccdomain,
        contractortype: +contractortype
      });
      setRequestDone(true);
    },
    [onSubmitDCC, formValues]
  );

  return {
    handleSubmitDCC,
    handleChangeInput,
    handleSaveDCCDraft,
    domainOptions,
    typeOptions,
    requestDone,
    formValues,
    savedDraft,
    fakeLoadingDraft,
    isRevocation
  };
};
