import { useEffect, useState } from "react";
import * as act from "src/actions";
import { useConfig } from "src/containers/Config";
import { getQueryStringValues } from "src/lib/queryString";
import { useRedux } from "src/redux";
import usePolicy from "src/hooks/api/usePolicy";
import * as sel from "src/selectors";
import { signupValidationSchema } from "./validation";

const mapStateToProps = {
  signupResponse: sel.apiNewUserResponse
};

const mapDispatchToProps = {
  onCreateNewUser: act.onCreateNewUser,
  onCreateNewUseFromAdminInvitation: act.onCreateNewUserCMS,
  onResetSignup: act.onResetNewUser
};

export function useSignup(ownProps) {
  const { onResetSignup, ...fromRedux } = useRedux(
    ownProps,
    mapStateToProps,
    mapDispatchToProps
  );
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
    ? fromRedux.onCreateNewUseFromAdminInvitation
    : fromRedux.onCreateNewUser;

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
    ...fromRedux,
    validationSchema,
    onSignup,
    enableAdminInvite,
    initialValues
  };
}
