import { useState, useEffect } from "react";
import usePolicy from "./usePolicy";

export default function useValidationSchema(schemaCreator) {
  const { policy } = usePolicy();
  const [validationSchema, setValidationSchema] = useState(
    policy ? schemaCreator(policy) : null
  );

  useEffect(
    function handleSetValidationSchemaFromPolicy() {
      if (!!policy && !validationSchema) {
        setValidationSchema(schemaCreator(policy));
      }
    },
    [policy, validationSchema]
  );

  return validationSchema;
}
