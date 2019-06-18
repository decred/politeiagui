import { useEffect, useState } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useRedux } from "src/redux";
import {
  resetValidationSchema,
  requestResetValidationSchema,
  urlParamsValidationSchema
} from "./validation";
import { getQueryStringValues } from "src/lib/queryString";

const mapStateToProps = {
  policy: sel.policy,
  requestResetResponse: sel.forgottenPasswordResponse
};

const mapDispatchToProps = {
  onResetPassword: act.onPasswordResetRequest,
  onRequestResetPassword: act.onForgottenPasswordRequest,
  onGetPolicy: act.onGetPolicy
};

export function useRequestResetPassword(ownProps) {
  const { onRequestResetPassword, requestResetResponse } = useRedux(
    ownProps,
    mapStateToProps,
    mapDispatchToProps
  );
  const validationSchema = requestResetValidationSchema();
  return { onRequestResetPassword, validationSchema, requestResetResponse };
}

export function useResetPassword(ownProps) {
  const [validationSchema, setValidationSchema] = useState(null);
  const [initialValues, setInitialValues] = useState({});
  const [invalidParamsError, setInvalidParamsError] = useState(false);
  const { onResetPassword, policy, onGetPolicy } = useRedux(
    ownProps,
    mapStateToProps,
    mapDispatchToProps
  );

  // Fetch policy
  useEffect(() => {
    if (!policy) {
      onGetPolicy();
    }
  }, []);

  // Set the validation shcema once the policy has been fetched
  useEffect(() => {
    if (policy) {
      const schema = resetValidationSchema(policy);
      setValidationSchema(schema);
    }
  }, [policy]);

  // validate url parameters for email and verification token
  useEffect(() => {
    const schema = urlParamsValidationSchema();

    async function validateUrlParams() {
      const { email, verificationtoken } = getQueryStringValues();
      const valid = await schema.isValid({ email, verificationtoken });
      if (!valid) {
        setInvalidParamsError("Invalid email or verification token");
        return;
      }
      const initialValues = {
        email: email || "",
        verificationtoken: verificationtoken || "",
        newpassword: "",
        verify_password: ""
      };
      setInitialValues(initialValues);
    }
    validateUrlParams();
  }, []);

  return {
    onResetPassword,
    validationSchema,
    initialValues,
    invalidParamsError
  };
}
