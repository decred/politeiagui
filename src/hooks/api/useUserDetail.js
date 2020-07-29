import { useMemo } from "react";
import * as act from "src/actions";
import { useAction, useSelector } from "src/redux";
import useAPIAction from "src/hooks/utils/useAPIAction";
import * as sel from "src/selectors";
import useThrowError from "../utils/useThrowError";

export default function useUserDetail(userID) {
  const isCMS = useSelector(sel.isCMS);
  const currentUserID = useSelector(sel.currentUserID);
  const isPublicCms = isCMS && !currentUserID;
  const uid = !isPublicCms ? userID || currentUserID : undefined;
  const userSelector = useMemo(() => sel.makeGetUserByID(uid), [uid]);
  const user = useSelector(userSelector);
  const isAdmin = useSelector(sel.currentUserIsAdmin);
  const onFetchUser = useAction(act.onFetchUser);
  const userMissingData = !user || (user && !user.identities);
  const needsFetch = !!uid && userMissingData;
  const args = [uid];
  const [loading, error] = useAPIAction(onFetchUser, args, needsFetch);

  useThrowError(error);

  return { user, isAdmin, loading, currentUserID, isCMS };
}
