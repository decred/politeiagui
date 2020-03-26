import { useState, useCallback, useMemo, useEffect } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useAction, useSelector, useStoreSubscribe } from "src/redux";
import useAPIAction from "src/hooks/utils/useAPIAction";
import useThrowError from "src/hooks/utils/useThrowError";
import { DCC_STATUS_ACTIVE, sortDccsByTimestamp } from "src/containers/DCC";
import { handleSaveAppDraftDccs } from "src/lib/local_storage";

export function useDccs() {
  const [status, setStatus] = useState(DCC_STATUS_ACTIVE);

  const dccsByStatus = useSelector(sel.dccsByStatus);
  const onFetchDccs = useAction(act.onFetchDccsByStatus);

  const [loading, error] = useAPIAction(onFetchDccs);

  const dccs = useMemo(() => {
    const unorderedDccs = dccsByStatus && dccsByStatus[status];
    const sortedDccs = sortDccsByTimestamp(unorderedDccs);
    return sortedDccs;
  }, [dccsByStatus, status]);

  const handleTabChange = useCallback(
    (tabIndex) => {
      setStatus(tabIndex + 1);
    },
    [setStatus]
  );

  useThrowError(error);

  return { dccs: dccs || [], loading, status, handleTabChange };
}

export function useDraftDccs() {
  const onLoadDraftDccs = useAction(act.onLoadDraftDccs);
  const onSaveDraftDcc = useAction(act.onSaveDraftDcc);
  const onDeleteDraftDcc = useAction(act.onDeleteDraftDcc);

  const draftDccs = useSelector(sel.draftDccs);

  const [unsubscribe] = useState(useStoreSubscribe(handleSaveAppDraftDccs));

  useEffect(() => {
    if (!draftDccs) {
      onLoadDraftDccs();
    }
  }, [onLoadDraftDccs, draftDccs]);

  useEffect(
    function unsubscribeFromStore() {
      return unsubscribe;
    },
    [unsubscribe]
  );

  return {
    onLoadDraftDccs,
    draftDccs,
    onSaveDraftDcc,
    onDeleteDraftDcc
  };
}
