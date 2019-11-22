import { useEffect } from "react";
import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";
import * as sel from "src/selectors";

function usePolicy() {
  const policy = useSelector(sel.policy);
  const loading = useSelector(sel.isApiRequestingPolicy);
  const onFetchPolicy = useAction(act.onGetPolicy);

  useEffect(
    function handleSetValidationSchemaFromPolicy() {
      if (!policy) {
        onFetchPolicy();
      }
    },
    [policy, onFetchPolicy]
  );

  return { policy, loading };
}

export default usePolicy;
