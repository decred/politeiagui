import { useEffect, useState } from "react";
import * as act from "src/actions";
import * as sel from "src/selectors";
import { useAction, useSelector } from "src/redux";
import {
  requestResendEmailValidationSchema,
  urlParamsValidationSchema
} from "./validation";
import { getQueryStringValues } from "src/lib/queryString";

export function useRequestResendVerificationEmail() {
  const currentUserResendVerificationToken = useSelector(
    sel.currentUserResendVerificationToken
  );

  const onResendVerificationEmail = useAction(
    act.onResendVerificationEmailConfirm
  );
  const resetResendVerificationEmail = useAction(
    act.resetResendVerificationEmail
  );

  const validationSchema = requestResendEmailValidationSchema();
  useEffect(() => {
    return function cleanUp() {
      resetResendVerificationEmail();
    };
  }, [resetResendVerificationEmail]);
  return {
    validationSchema,
    onResendVerificationEmail,
    currentUserResendVerificationToken
  };
}

export function useVerifyUserEmail() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const onVerify = useAction(act.onVerifyNewUser);

  // validate url parameters for email and verification token and verify user
  useEffect(() => {
    const schema = urlParamsValidationSchema();

    async function validateUrlParamsAndVerifyUser() {
      try {
        setLoading(true);
        const { email, verificationtoken, username } = getQueryStringValues();
        const valid = await schema.isValid({
          username,
          email,
          verificationtoken
        });
        if (!valid) {
          throw new Error("Invalid email or verification token");
        }
        await onVerify(email, verificationtoken, username);
        setLoading(false);
        setSuccess(true);
      } catch (error) {
        setLoading(false);
        setError(error);
      }
    }

    validateUrlParamsAndVerifyUser();
  }, [onVerify]);

  return {
    success,
    loading,
    error
  };
}
