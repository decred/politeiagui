import { useEffect, useState } from "react";
import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";
import * as sel from "src/selectors";

function usePolicy() {
  const policy = useSelector(sel.policy);
  const loading = useSelector(sel.isApiRequestingPolicy);
  const onFetchPolicy = useAction(act.onGetPolicy);
  const [error, setError] = useState();
  useEffect(
    function handleSetValidationSchemaFromPolicy() {
      if (!policy) {
        onFetchPolicy().catch((e) => {
          setError(e);
        });
      }
    },
    [policy, onFetchPolicy]
  );
  return { policy, loading, error };
}

export default usePolicy;
