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
  requestResetResponse: sel.resetPasswordResponse
};

const mapDispatchToProps = {
  onVerifyResetPassword: act.onVerifyResetPassword,
  onResetPassword: act.onResetPassword,
  onGetPolicy: act.onGetPolicy
};

function useValidationSchemaFromPolicy(schemaFn) {
  const [validationSchema, setValidationSchema] = useState(null);

  const { policy, onGetPolicy } = useRedux(
    {},
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
      const schema = schemaFn(policy);
      setValidationSchema(schema);
    }
  }, [policy]);

  return validationSchema;
}

export function useResetPassword(ownProps) {
  const { onResetPassword, requestResetResponse } = useRedux(
    ownProps,
    mapStateToProps,
    mapDispatchToProps
  );
  const validationSchema = useValidationSchemaFromPolicy(
    requestResetValidationSchema
  );
  return { onResetPassword, validationSchema, requestResetResponse };
}

export function useVerifyResetPassword(ownProps) {
  const [initialValues, setInitialValues] = useState({});
  const [invalidParamsError, setInvalidParamsError] = useState(false);
  const { onVerifyResetPassword } = useRedux(
    ownProps,
    mapStateToProps,
    mapDispatchToProps
  );

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
