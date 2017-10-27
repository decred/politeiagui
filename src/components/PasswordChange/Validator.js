import { SubmissionError } from "redux-form";
import { isRequiredValidator, passwordVerifyValidator } from "../../validators";

const validate = values => {
  if (!isRequiredValidator(values.existingPassword) || !isRequiredValidator(values.password) || !isRequiredValidator(values.password_verify)) {
    throw new SubmissionError({ _error: "All fields are required" });
  }

  if (!passwordVerifyValidator(values.password, values.password_verify)) {
    throw new SubmissionError({ _error: "Passwords do not match" });
  }
};

export default validate;
