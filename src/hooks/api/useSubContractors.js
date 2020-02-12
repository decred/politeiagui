import { useEffect } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useAction, useSelector } from "src/redux";

function useSubContractors() {
  const subContractors = useSelector(sel.subContractors);
  const onFetchUserSubcontractors = useAction(act.onFetchUserSubcontractors);

  useEffect(
    function handleFetchSubContractors() {
      if (!subContractors) {
        onFetchUserSubcontractors();
      }
    },
    [subContractors, onFetchUserSubcontractors]
  );

  return { subContractors };
}

export default useSubContractors;
