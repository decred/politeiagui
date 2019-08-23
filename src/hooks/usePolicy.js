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

  /*
    Currently pi policy only allows 1 md file to be attached to a proposal.
    It corresponds to the index file, so a proposal can only accept image
    attachments until this policy changes.
  */
  return {
    policy: {
      ...policy,
      validmimetypes:
        policy && policy.validmimetypes.filter(m => m.startsWith("image/"))
    },
    loading
  };
}

export default usePolicy;
