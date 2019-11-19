import { useEffect, useState } from "react";
import * as act from "src/actions";
import { useAction } from "src/redux";
import usePolicy from "src/hooks/api/usePolicy";
import { loginValidationSchema } from "./validation";

export function useLogin() {
  const onLogin = useAction(act.onLogin);
  const { policy, loading: loadingPolicy } = usePolicy();
  const [validationSchema, setValidationSchema] = useState(
    policy ? loginValidationSchema(policy) : null
  );

  useEffect(
    function handleSetValidationSchemaFromPolicy() {
      if (!!policy && !validationSchema) {
        setValidationSchema(loginValidationSchema(policy));
      }
    },
    [policy, validationSchema]
  );

  return { onLogin, validationSchema, loadingPolicy };
}
