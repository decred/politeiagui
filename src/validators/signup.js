import { SubmissionError } from "redux-form";
import { emailValidator, isRequiredValidator, passwordVerifyValidator, passwordLengthValidator } from "./util";

const validate = (policy, values) => {
  if (!isRequiredValidator(values.email) || !isRequiredValidator(values.password) || !isRequiredValidator(values.password_verify)) {
    throw new SubmissionError({ _error: "All fields are required" });
  }

  if (!passwordLengthValidator(values.password, policy.minpasswordlength)){
    throw new SubmissionError({ _error: "Password must be at least 8 digits." });
  }

  if (!passwordVerifyValidator(values.password, values.password_verify)) {
    throw new SubmissionError({ _error: "Passwords do not match" });
  }

  if (!emailValidator(values.email)) {
    throw new SubmissionError({ _error: "Invalid email address" });
  }
};

export default validate;
