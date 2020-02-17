import { useAction, useSelector } from "src/redux";
import * as act from "src/actions";
import * as sel from "src/selectors";
import { CONTRACTOR_TYPE_NOMINEE } from "../constants";
import useAPIAction from "src/hooks/utils/useAPIAction";

export function useNewDcc() {
  const onFetchUsers = useAction(act.onFetchCmsUsers);
  const onSubmitDcc = useAction(act.onSaveNewDcc);

  const [loading, error] = useAPIAction(onFetchUsers);

  const user = useSelector(sel.currentCmsUser);

  const nomineeUsersSelector = sel.makeGetUsersByContractorTypes(
    CONTRACTOR_TYPE_NOMINEE
  );

  const fullUsers = useSelector(sel.usersByCurrentDomain);
  const nomineeUsers = useSelector(nomineeUsersSelector);

  const users = {
    full: fullUsers,
    nominee: nomineeUsers
  };

  return {
    loading,
    error,
    onSubmitDcc,
    users,
    user
  };
}
