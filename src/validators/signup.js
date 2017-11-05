import { SubmissionError } from "redux-form";
import { emailValidator, isRequiredValidator, passwordVerifyValidator } from "./util";

const validate = values => {
  if (!isRequiredValidator(values.email) || !isRequiredValidator(values.password) || !isRequiredValidator(values.password_verify)) {
    throw new SubmissionError({ _error: "All fields are required" });
  }

  if (!passwordVerifyValidator(values.password, values.password_verify)) {
    throw new SubmissionError({ _error: "Passwords do not match" });
  }

  if (!emailValidator(values.email)) {
    throw new SubmissionError({ _error: "Invalid email address" });
  }
};

export default validate;
