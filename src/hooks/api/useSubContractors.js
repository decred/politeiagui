import * as sel from "src/selectors";
import * as act from "src/actions";
import { useAction, useSelector } from "src/redux";
import { useAPIAction } from "src/hooks";

function useSubContractors() {
  const subContractors = useSelector(sel.subContractors);
  const onFetchUserSubcontractors = useAction(act.onFetchUserSubcontractors);
  const [loading, error] = useAPIAction(
    onFetchUserSubcontractors,
    [],
    !subContractors
  );
  return { subContractors, error, loading };
}

export default useSubContractors;
