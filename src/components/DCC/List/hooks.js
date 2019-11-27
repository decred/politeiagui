import { useState, useCallback, useEffect } from "react";

export const useListDCC = ({ onFetchDCCsByStatus, dccs }) => {
  const [loadingDCCs, setLoadingDCCs] = useState(true);
  const [orderedDCCs, setOrderedDCCs] = useState([]);
  const [status, setStatus] = useState(1);

  useEffect(() => {
    async function onFetchData() {
      setLoadingDCCs(true);
      await onFetchDCCsByStatus(status);
      // force timeout
      setTimeout(() => {
        setLoadingDCCs(false);
      }, 300);
    }
    onFetchData();
  }, [status, onFetchDCCsByStatus, setLoadingDCCs]);

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
    s => {
      setStatus(s);
    },
    [setStatus]
  );

  return { loadingDCCs, orderedDCCs, handleStatusChange, status };
};
