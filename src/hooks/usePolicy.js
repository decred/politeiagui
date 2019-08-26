import { useEffect } from "react";
import * as act from "src/actions";
import { useRedux } from "src/redux";
import * as sel from "src/selectors";

const mapStateToProps = {
  policy: sel.policy,
  loading: sel.isApiRequestingPolicy
};

const mapDispatchToProps = {
  onGetPolicy: act.onGetPolicy
};

function usePolicy() {
  const { onGetPolicy, policy, loading } = useRedux(
    {},
    mapStateToProps,
    mapDispatchToProps
  );

  useEffect(
    function handleSetValidationSchemaFromPolicy() {
      if (!policy) {
        onGetPolicy();
      }
    },
    [policy, onGetPolicy]
  );

  return { policy, loading };
}

export default usePolicy;
