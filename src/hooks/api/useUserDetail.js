import { useMemo } from "react";
import * as act from "src/actions";
import { useAction, useSelector } from "src/redux";
import useAPIAction from "src/hooks/utils/useAPIAction";
import * as sel from "src/selectors";

export default function useUserDetail(userID) {
  const meUserID = useSelector(sel.userid);
  const uid = userID || meUserID;
  const userSelector = useMemo(() => sel.makeGetUserByID(uid), [uid]);
  const user = useSelector(userSelector);
  const isAdmin = useSelector(sel.currentUserIsAdmin);
  const currentUserID = useSelector(sel.currentUserID);
  const onFetchUser = useAction(act.onFetchUser);
  const userMissingData = !user || (user && !user.identities);
  const needsFetch = !!uid && userMissingData;
  const args = [uid];
  const [loading] = useAPIAction(onFetchUser, args, needsFetch);

  return { user, isAdmin, loading, currentUserID };
}
