import { useEffect, useState } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useRedux } from "src/redux";
import { signupValidationSchema } from "./validation";
import { useConfig } from "src/Config";
import { getQueryStringValues } from "src/lib/queryString";

const mapStateToProps = {
  policy: sel.policy,
  signupResponse: sel.apiNewUserResponse
};

const mapDispatchToProps = {
  onGetPolicy: act.onGetPolicy,
  onCreateNewUser: act.onCreateNewUser,
  onCreateNewUseFromAdminInvitation: act.onCreateNewUserCMS,
  onResetSignup: act.onResetNewUser
};

export function useSignup(ownProps) {
  const { policy, ...fromRedux } = useRedux(
    ownProps,
    mapStateToProps,
    mapDispatchToProps
  );
  const { enableAdminInvite } = useConfig();
  const [validationSchema, setValidationSchema] = useState(
    policy ? signupValidationSchema(policy, enableAdminInvite) : null
  );

  useEffect(
    function handleSetValidationSchemaFromPolicy() {
      if (!policy) {
        fromRedux.onGetPolicy();
      } else if (!validationSchema) {
        setValidationSchema(signupValidationSchema(policy, enableAdminInvite));
      }
    },
    [policy]
  );

  // Switch between signup methods accordingly to the config 'enableAdminInvite'
  const onSignup = enableAdminInvite
    ? fromRedux.onCreateNewUseFromAdminInvitation
    : fromRedux.onCreateNewUser;

  useEffect(() => {
    return function resetSignup() {
      fromRedux.onResetSignup();
    };
  }, []);

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
