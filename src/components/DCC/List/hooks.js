import { useState, useCallback, useEffect } from "react";
import { DCC_STATUS_DRAFTS } from "../../../constants";

export const useListDCC = ({
  onFetchDCCsByStatus,
  dccs,
  onForceFetchDCCs,
  onLoadDraftDCCs,
  drafts,
  loggedInAsEmail,
  confirmWithModal,
  onDeleteDraftDCC
}) => {
  const [loadingDCCs, setLoadingDCCs] = useState(true);
  const [orderedDCCs, setOrderedDCCs] = useState([]);
  const [status, setStatus] = useState(1);

  const onRefreshDCCs = useCallback(() => {
    setLoadingDCCs(true);
    onForceFetchDCCs(status);
    setTimeout(() => {
      setLoadingDCCs(false);
    }, 300);
  }, [onForceFetchDCCs, status, setLoadingDCCs]);

  const onDeleteDraft = useCallback(
    (id) => {
      onDeleteDraftDCC(id);
    },
    [onDeleteDraftDCC]
  );

  useEffect(
    function onChangeStatus() {
      async function onFetchData() {
        setLoadingDCCs(true);
        await onFetchDCCsByStatus(status);
        // force timeout
        setTimeout(() => {
          setLoadingDCCs(false);
        }, 300);
      }
      if (status !== DCC_STATUS_DRAFTS) {
        onFetchData();
      }
      onLoadDraftDCCs(loggedInAsEmail);
    },
    [
      status,
      onFetchDCCsByStatus,
      setLoadingDCCs,
      onLoadDraftDCCs,
      loggedInAsEmail
    ]
  );

  useEffect(() => {
    const resetDCCs = () => {
      setOrderedDCCs([]);
    };
    if (dccs && dccs[status] && dccs[status].length > 0) {
      setOrderedDCCs(dccs[status].sort((a, b) => b.timestamp - a.timestamp));
    } else if (dccs && dccs[status] && dccs[status].length === 0) {
      resetDCCs();
    }
  }, [dccs, setOrderedDCCs, status]);

  const handleStatusChange = useCallback(
    (s) => {
      setStatus(s);
    },
    [setStatus]
  );

  return {
    loadingDCCs,
    orderedDCCs,
    handleStatusChange,
    status,
    onRefreshDCCs,
    drafts,
    onDeleteDraft,
    confirmWithModal
  };
};
