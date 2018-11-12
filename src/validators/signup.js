import { SubmissionError } from "redux-form";
import {
  emailValidator,
  isRequiredValidator,
  passwordVerifyValidator,
  lengthValidator
} from "./util";

const validate = (policy, values) => {
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
};

export default validate;
