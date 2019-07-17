import { useEffect, useState } from "react";
import usePolicy from "src/hooks/usePolicy";
import { proposalValidationSchema } from "./validation";

export function useProposalForm() {
  const { policy } = usePolicy();
  const [validationSchema, setValidationSchema] = useState(
    policy ? proposalValidationSchema(policy) : null
  );

  useEffect(
    function handleSetValidationSchemaFromPolicy() {
      if (!!policy && !validationSchema) {
        setValidationSchema(proposalValidationSchema(policy));
      }
    },
    [policy, validationSchema]
  );

  return { validationSchema, policy };
}
