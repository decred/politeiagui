import { useMemo } from "react";
import * as act from "src/actions";
import useThrowError from "src/hooks/utils/useThrowError";
import { useAction, useSelector } from "src/redux";
import useAPIAction from "src/hooks/utils/useAPIAction";
import * as sel from "src/selectors";

export default function useUserDetail(userID) {
  const userSelector = useMemo(() => sel.makeGetUserByID(userID), [userID]);
  const user = useSelector(userSelector);
  const isAdmin = useSelector(sel.currentUserIsAdmin);
  const currentUserID = useSelector(sel.currentUserID);
  const onFetchUser = useAction(act.onFetchUser);
  const userMissingData = !user || (user && !user.identities);
  const needsFetch = !!userID && userMissingData;
  const args = useMemo(() => [userID], [userID]);
  const [loading, error] = useAPIAction(onFetchUser, args, needsFetch);

  useThrowError(error);

  return { user, isAdmin, loading, currentUserID };
}
