import { SubmissionError } from "redux-form";
import {
  emailValidator,
  isRequiredValidator,
  passwordVerifyValidator,
  lengthValidator
} from "./util";

const validate = (policy, values, isCMS) => {
  if (isCMS) {
    if (
      !isRequiredValidator(values.email) ||
      !isRequiredValidator(values.verificationtoken) ||
      !isRequiredValidator(values.username) ||
      !isRequiredValidator(values.password) ||
      !isRequiredValidator(values.password_verify)
    ) {
      throw new SubmissionError({ _error: "All fields are required" });
    }

    if (!lengthValidator(values.password, policy.minpasswordlength)) {
      throw new SubmissionError({
        _error:
          "Your password must be at least " +
          policy.minpasswordlength +
          " characters."
      });
    }
    if (
      !lengthValidator(
        values.username,
        policy.minusernamelength,
        policy.maxusernamelength
      )
    ) {
      throw new SubmissionError({
        _error:
          "Your username must be at least " +
          policy.minusernamelength +
          " and less than " +
          policy.maxusernamelength +
          "."
      });
    }

    if (!passwordVerifyValidator(values.password, values.password_verify)) {
      throw new SubmissionError({ _error: "Passwords do not match" });
    }

    if (!emailValidator(values.email)) {
      throw new SubmissionError({ _error: "Invalid email address" });
    }
  } else {
    if (
      !isRequiredValidator(values.email) ||
      !isRequiredValidator(values.password) ||
      !isRequiredValidator(values.password_verify)
    ) {
      throw new SubmissionError({ _error: "All fields are required" });
    }

    if (!lengthValidator(values.password, policy.minpasswordlength)) {
      throw new SubmissionError({
        _error:
          "Your password must be at least " +
          policy.minpasswordlength +
          " characters."
      });
    }

    if (!passwordVerifyValidator(values.password, values.password_verify)) {
      throw new SubmissionError({ _error: "Passwords do not match" });
    }

    if (!emailValidator(values.email)) {
      throw new SubmissionError({ _error: "Invalid email address" });
    }
  }
};

export default validate;
