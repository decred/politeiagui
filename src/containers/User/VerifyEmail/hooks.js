import { useEffect, useState } from "react";
import * as act from "src/actions";
import * as sel from "src/selectors";
import { useRedux } from "src/redux";
import {
  requestResendEmailValidationSchema,
  urlParamsValidationSchema
} from "./validation";
import { getQueryStringValues } from "src/lib/queryString";

const mapStateToProps = {
  resendVerificationEmailResponse: sel.resendVerificationEmailResponse
};

const mapDispatchToProps = {
  onVerify: act.onVerifyNewUser,
  onResendVerificationEmail: act.onResendVerificationEmailConfirm,
  resetResendVerificationEmail: act.resetResendVerificationEmail
};

export function useRequestResendVerificationEmail(ownProps) {
  const {
    onResendVerificationEmail,
    resendVerificationEmailResponse,
    resetResendVerificationEmail
  } = useRedux(ownProps, mapStateToProps, mapDispatchToProps);
  const validationSchema = requestResendEmailValidationSchema();
  useEffect(() => {
    return function cleanUp() {
      resetResendVerificationEmail();
    };
  }, [resetResendVerificationEmail]);
  return {
    validationSchema,
    onResendVerificationEmail,
    resendVerificationEmailResponse
  };
}

export function useVerifyUserEmail(ownProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const { onVerify } = useRedux(ownProps, mapStateToProps, mapDispatchToProps);

  // validate url parameters for email and verification token and verify user
  useEffect(() => {
    const schema = urlParamsValidationSchema();

    async function validateUrlParamsAndVerifyUser() {
      try {
        setLoading(true);
        const { email, verificationtoken } = getQueryStringValues();
        const valid = await schema.isValid({ email, verificationtoken });
        if (!valid) {
          throw new Error("Invalid email or verification token");
        }
        await onVerify(email, verificationtoken);
        setLoading(false);
        setSuccess(true);
      } catch (error) {
        setLoading(false);
        setError(error);
      }
    }

    validateUrlParamsAndVerifyUser();
  }, []);

  return {
    success,
    loading,
    error
  };
}
