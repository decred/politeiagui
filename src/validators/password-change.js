import { SubmissionError } from "redux-form";
import {
  isRequiredValidator,
  passwordVerifyValidator,
  lengthValidator
} from "./util";

const validate = (values, policy) => {
  if (
    !isRequiredValidator(values.existingPassword) ||
    !isRequiredValidator(values.newPassword) ||
    !isRequiredValidator(values.newPasswordVerify)
  ) {
    throw new SubmissionError({ _error: "All fields are required" });
  }

  if (!passwordVerifyValidator(values.newPassword, values.newPasswordVerify)) {
    throw new SubmissionError({ _error: "Passwords do not match" });
  }

  if (!lengthValidator(values.newPassword, policy.minpasswordlength)) {
    throw new SubmissionError({
      _error:
        "Your new password must be at least " +
        policy.minpasswordlength +
        " characters."
    });
  }
};

export default validate;
