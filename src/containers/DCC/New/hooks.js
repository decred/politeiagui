import { useAction, useSelector } from "src/redux";
import * as act from "src/actions";
import * as sel from "src/selectors";
import {
  DCC_FULL_USER_CONTRACTOR_TYPES,
  CONTRACTOR_TYPE_NOMINEE
} from "../constants";
import useAPIAction from "src/hooks/utils/useAPIAction";

export function useNewDcc() {
  const onFetchUsers = useAction(act.onFetchCmsUsers);
  const onSubmitDcc = useAction(act.onSaveNewDcc);

  const fullUsersSelector = sel.makeGetUsersByContractorTypes(
    DCC_FULL_USER_CONTRACTOR_TYPES
  );
  const nomineeUsersSelector = sel.makeGetUsersByContractorTypes(
    CONTRACTOR_TYPE_NOMINEE
  );

  const fullUsers = useSelector(fullUsersSelector);
  const nomineeUsers = useSelector(nomineeUsersSelector);

  const users = {
    full: fullUsers,
    nominee: nomineeUsers
  };

  const [loading, error] = useAPIAction(onFetchUsers);

  return {
    loading,
    error,
    onSubmitDcc,
    users
  };
}
