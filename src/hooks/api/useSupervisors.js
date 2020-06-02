import * as sel from "src/selectors";
import * as act from "src/actions";
import { useAction, useSelector } from "src/redux";
import { CONTRACTOR_TYPE_SUPERVISOR } from "src/containers/DCC";
import useAPIAction from "src/hooks/utils/useAPIAction";

export default function useSupervisors() {
  const onFetchUsers = useAction(act.onFetchCmsUsers);
  const supervisors = useSelector(
    sel.makeGetUsersByContractorTypes(CONTRACTOR_TYPE_SUPERVISOR)
  );
  const [loading, error] = useAPIAction(onFetchUsers);

  return { supervisors, loading, error };
}
