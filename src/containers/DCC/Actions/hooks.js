import { useMemo } from "react";
import { useAction, useSelector } from "src/redux";
import { createContext, useContext, useCallback } from "react";
import * as act from "src/actions";
import * as sel from "src/selectors";
import useAPIAction from "src/hooks/utils/useAPIAction";
import { isUserValidContractor } from "../helpers";
import {
  DCC_OPPOSE_ACTION,
  DCC_SUPPORT_ACTION,
  DCC_STATUS_APPROVED,
  DCC_STATUS_REJECTED
} from "../constants";

export const adminDccsActionsContext = createContext();
export const useAdminDccActions = () => useContext(adminDccsActionsContext);

export const useDccActions = (dccToken) => {
  const onSupportOpposeDcc = useAction(act.onSupportOpposeDcc);

  const onFetchUsers = useAction(act.onFetchCmsUsers);
  const user = useSelector(sel.currentCmsUser);
  const userID = useSelector(sel.currentUserID);
  const [loading, error] = useAPIAction(onFetchUsers, null, !user);

  const onSupportDcc = () => onSupportOpposeDcc(dccToken, DCC_SUPPORT_ACTION);
  const onOpposeDcc = () => onSupportOpposeDcc(dccToken, DCC_OPPOSE_ACTION);

  const isContractor = useMemo(
    () => user && isUserValidContractor(user),
    [user]
  );

  return {
    onSupportDcc,
    onOpposeDcc,
    loading,
    userID,
    error,
    isContractor
  };
};

export const useAdminActions = () => {
  const onSetDccStatus = useAction(act.onSetDccStatus);

  const onApproveDcc = useCallback(
    (dcc) => (reason) =>
      onSetDccStatus(dcc.censorshiprecord.token, DCC_STATUS_APPROVED, reason),
    [onSetDccStatus]
  );

  const onRejectDcc = useCallback(
    (dcc) => (reason) =>
      onSetDccStatus(dcc.censorshiprecord.token, DCC_STATUS_REJECTED, reason),
    [onSetDccStatus]
  );

  return {
    onApproveDcc,
    onRejectDcc
  };
};
