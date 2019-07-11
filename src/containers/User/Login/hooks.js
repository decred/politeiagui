import { useEffect, useState } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useRedux } from "src/redux";
import { loginValidationSchema } from "./validation";

const mapStateToProps = {
  policy: sel.policy,
  loadingPolicy: sel.isApiRequestingPolicy
};

const mapDispatchToProps = {
  onLogin: act.onLogin,
  onGetPolicy: act.onGetPolicy
};

export function useLogin(ownProps) {
  const { policy, ...fromRedux } = useRedux(
    ownProps,
    mapStateToProps,
    mapDispatchToProps
  );
  const [validationSchema, setValidationSchema] = useState(
    policy ? loginValidationSchema(policy) : null
  );

  useEffect(
    function handleSetValidationSchemaFromPolicy() {
      if (!policy) {
        fromRedux.onGetPolicy();
      } else if (!validationSchema) {
        setValidationSchema(loginValidationSchema(policy));
      }
    },
    [policy]
  );

  return { ...fromRedux, validationSchema };
}
