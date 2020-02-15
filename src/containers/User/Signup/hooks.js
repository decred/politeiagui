import { useEffect, useState } from "react";
import * as act from "src/actions";
import { useConfig } from "src/Config";
import { getQueryStringValues } from "src/lib/queryString";
import { useSelector, useAction } from "src/redux";
import usePolicy from "src/hooks/api/usePolicy";
import * as sel from "src/selectors";
import { signupValidationSchema } from "./validation";

export function useSignup() {
  const signupResponse = useSelector(sel.apiNewUserResponse);

  const onCreateNewUser = useAction(act.onCreateNewUser);
  const onCreateNewUseFromAdminInvitation = useAction(act.onCreateNewUser);
  const onResetSignup = useAction(act.onResetNewUser);

  const { enableAdminInvite } = useConfig();
  const { policy } = usePolicy();
  const [validationSchema, setValidationSchema] = useState(
    policy ? signupValidationSchema(policy, enableAdminInvite) : null
  );

  useEffect(
    function handleSetValidationSchemaFromPolicy() {
      if (!!policy && !validationSchema) {
        setValidationSchema(signupValidationSchema(policy, enableAdminInvite));
      }
    },
    [policy, enableAdminInvite, validationSchema]
  );

  // Switch between signup methods accordingly to the config 'enableAdminInvite'
  const onSignup = enableAdminInvite
    ? onCreateNewUseFromAdminInvitation
    : onCreateNewUser;

  useEffect(() => {
    return function resetSignup() {
      onResetSignup();
    };
  }, [onResetSignup]);

  // Set intial values
  const { email, verificationtoken } = getQueryStringValues();
  const initialValues = {
    email: email || "",
    verificationtoken: verificationtoken || "",
    password: "",
    username: "",
    verify_password: ""
  };

  return {
    signupResponse,
    validationSchema,
    onSignup,
    enableAdminInvite,
    initialValues
  };
}
