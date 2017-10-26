import { passwordVerifyValidator } from "../../validators";
import { SubmissionError } from "redux-form";

const validate = values => {
  if (!passwordVerifyValidator(values.password, values.password_verify)) {
    throw new SubmissionError({ _error: "Passwords do not match" });
  }
};

export default validate;
