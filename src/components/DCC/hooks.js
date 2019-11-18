import { useState, useCallback, useEffect } from "react";
import { CMS_USER_TYPES, CMS_DOMAINS } from "../../constants";
import {
  getQueryStringValue,
  setQueryStringValue
} from "../../lib/queryString";

// remove supervisor option since it ir not available for new dcc
const typeOptions = CMS_USER_TYPES.reduce((acc, curr, index) => {
  if (curr === "Supervisor") return [...acc];
  return [...acc, { label: curr, value: index }];
}, []);

// format domain options to select form field
const domainOptions = CMS_DOMAINS.map((d, i) => ({ label: d, value: i }));

export const useNewDCC = ({ onSubmitDCC, onSaveDraftDCC }) => {
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
    fakeLoadingDraft
  };
};

export const useListDCC = ({ onFetchDCCs, dccs }) => {
  const [loadingDCCs, setLoadingDCCs] = useState(true);
  const [orderedDCCs, setOrderedDCCs] = useState([]);
  const [status, setStatus] = useState(1);

  useEffect(() => {
    async function onFetchData() {
      setLoadingDCCs(true);
      await onFetchDCCs(status);
      setTimeout(() => {
        setLoadingDCCs(false);
      }, 300);
    }
    onFetchData();
  }, [status, onFetchDCCs, setLoadingDCCs]);

  useEffect(() => {
    const resetDCCs = () => {
      setOrderedDCCs([]);
    };

    if (dccs && dccs.length > 0) {
      setOrderedDCCs(dccs.sort((a, b) => b.timestamp - a.timestamp));
    } else if (dccs && dccs.length === 0) {
      resetDCCs();
    }
  }, [dccs, setOrderedDCCs]);

  const handleStatusChange = useCallback(
    s => {
      setStatus(s);
    },
    [setStatus]
  );

  return { loadingDCCs, orderedDCCs, handleStatusChange, status };
};
