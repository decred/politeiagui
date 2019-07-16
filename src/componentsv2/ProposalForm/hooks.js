import { useEffect, useState } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useRedux } from "src/redux";
import { proposalValidationSchema } from "./validation";

const mapStateToProps = {
  policy: sel.policy
};

const mapDispatchToProps = {
  onGetPolicy: act.onGetPolicy
};

export function useProposalForm(ownProps) {
  const { policy, ...fromRedux } = useRedux(
    ownProps,
    mapStateToProps,
    mapDispatchToProps
  );

  const [validationSchema, setValidationSchema] = useState(
    policy ? proposalValidationSchema(policy) : null
  );

  useEffect(
    function handleSetValidationSchemaFromPolicy() {
      if (!policy) {
        fromRedux.onGetPolicy();
      } else if (!validationSchema) {
        setValidationSchema(proposalValidationSchema(policy));
      }
    },
    [policy]
  );

  return { ...fromRedux, validationSchema, policy };
}
