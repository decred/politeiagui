import { useEffect, useState } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import usePolicy from "src/hooks/api/usePolicy";
import { useSelector, useAction } from "src/redux";
import {
  resetValidationSchema,
  requestResetValidationSchema,
  urlParamsValidationSchema
} from "./validation";
import { getQueryStringValues } from "src/lib/queryString";

function useValidationSchemaFromPolicy(schemaFn) {
  const [validationSchema, setValidationSchema] = useState(null);
  const { policy } = usePolicy();

  // Set the validation shcema once the policy has been fetched
  useEffect(() => {
    if (policy) {
      const schema = schemaFn(policy);
      setValidationSchema(schema);
    }
  }, [policy, schemaFn]);

  return validationSchema;
}

export function useResetPassword() {
  const requestResetResponse = useSelector(sel.currentUserResetPassword);
  const onResetPassword = useAction(act.onResetPassword);
  const validationSchema = useValidationSchemaFromPolicy(
    requestResetValidationSchema
  );

  return { onResetPassword, validationSchema, requestResetResponse };
}

export function useVerifyResetPassword() {
  const [initialValues, setInitialValues] = useState({});
  const [invalidParamsError, setInvalidParamsError] = useState(false);

  const onVerifyResetPassword = useAction(act.onVerifyResetPassword);

  const resetPasswordValidationSchema = useValidationSchemaFromPolicy(
    resetValidationSchema
  );
  const urlValidationSchema = useValidationSchemaFromPolicy(
    urlParamsValidationSchema
  );

  // validate url parameters for email and verification token
  useEffect(() => {
    async function validateUrlParams(schema) {
      const { username, verificationtoken } = getQueryStringValues();
      const valid = await schema.isValid({
        username,
        verificationtoken
      });
      if (!valid) {
        setInvalidParamsError("Invalid email, username or verification token");
        return;
      }
      const initialValues = {
        username: username || "",
        verificationtoken: verificationtoken || "",
        newpassword: "",
        verify_password: ""
      };
      setInitialValues(initialValues);
    }

    if (urlValidationSchema) {
      validateUrlParams(urlValidationSchema);
    }
  }, [urlValidationSchema]);

  return {
    onVerifyResetPassword,
    validationSchema: resetPasswordValidationSchema,
    initialValues,
    invalidParamsError
  };
}
