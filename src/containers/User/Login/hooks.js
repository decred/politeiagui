import { useEffect, useState } from "react";
import * as act from "src/actions";
import { useRedux } from "src/redux";
import usePolicy from "src/hooks/api/usePolicy";
import { loginValidationSchema } from "./validation";

const mapDispatchToProps = {
  onLogin: act.onLogin
};

export function useLogin(ownProps) {
  const fromRedux = useRedux(ownProps, {}, mapDispatchToProps);
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

  return { ...fromRedux, validationSchema, loadingPolicy };
}
