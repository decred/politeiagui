import { passwordVerifyValidator } from "../../validators";
import { SubmissionError } from "redux-form";

const validate = values => {
  if (!passwordVerifyValidator(values.newPassword, values.newPasswordVerify)) {
    throw new SubmissionError({ _error: "Passwords do not match" });
  }
};

export default validate;
