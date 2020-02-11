import { useState, useCallback, useMemo } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useAction, useSelector } from "src/redux";
import useAPIAction from "src/hooks/utils/useAPIAction";
import useThrowError from "src/hooks/utils/useThrowError";
import { DCC_STATUS_ACTIVE } from "src/containers/DCC/constants";

export function useDccs() {
  const [status, setStatus] = useState(DCC_STATUS_ACTIVE);

  const dccsByStatus = useSelector(sel.dccsByStatus);
  const onLoadDccsByStatus = useAction(act.onLoadDccsByStatus);

  const requestParams = useMemo(() => [status], [status]);

  const [loading, error] = useAPIAction(onLoadDccsByStatus, requestParams);

  const dccs = useMemo(() => dccsByStatus && dccsByStatus[status], [
    dccsByStatus,
    status
  ]);

  const handleTabChange = useCallback(
    (tabIndex) => {
      setStatus(tabIndex + 1);
    },
    [setStatus]
  );

  useThrowError(error);

  return { dccs, loading, status, handleTabChange };
}
