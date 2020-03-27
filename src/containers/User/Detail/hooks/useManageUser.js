import { useCallback, useMemo } from "react";
import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";
import * as sel from "src/selectors";

export default function useManageUser(manageUserAction, userID) {
  const onManageUser = useAction(act.onManageUser);
  const loadingSelector = useMemo(
    () => sel.makeIsApiRequestingManageUserByAction(manageUserAction),
    [manageUserAction]
  );
  const loading = useSelector(loadingSelector);

  const onManage = useCallback(
    (reason) => {
      onManageUser(userID, manageUserAction, reason);
    },
    [userID, manageUserAction, onManageUser]
  );

  return [onManage, loading];
}
