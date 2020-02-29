import { useMemo } from "react";
import { useAction, useSelector } from "src/redux";
import * as act from "src/actions";
import * as sel from "src/selectors";
import { DCC_OPPOSE_ACTION, DCC_SUPPORT_ACTION } from "../constants";
import useAPIAction from "src/hooks/utils/useAPIAction";
import { isUserValidContractor } from "../helpers";

export const useDccActions = (dccToken) => {
  const onSupportOpposeDcc = useAction(act.onSupportOpposeDcc);

  const onFetchUsers = useAction(act.onFetchCmsUsers);
  const user = useSelector(sel.currentCmsUser);
  const userID = useSelector(sel.currentUserID);
  const [loading, error] = useAPIAction(onFetchUsers, null, !user);

  const onSupportDcc = () => onSupportOpposeDcc(dccToken, DCC_SUPPORT_ACTION);
  const onOpposeDcc = () => onSupportOpposeDcc(dccToken, DCC_OPPOSE_ACTION);

  const isContractor = useMemo(() => user && isUserValidContractor(user), [
    user
  ]);

  return {
    onSupportDcc,
    onOpposeDcc,
    loading,
    userID,
    error,
    isContractor
  };
};
