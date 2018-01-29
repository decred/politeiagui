import { SubmissionError } from "redux-form";
import { isRequiredValidator, passwordVerifyValidator, passwordLengthValidator } from "./util";

const validate = (values, policy) => {
  if (!isRequiredValidator(values.existingPassword) || !isRequiredValidator(values.password) || !isRequiredValidator(values.password_verify)) {
    throw new SubmissionError({ _error: "All fields are required" });
  }

  if (!passwordVerifyValidator(values.password, values.password_verify)) {
    throw new SubmissionError({ _error: "Passwords do not match" });
  }

  if (!passwordLengthValidator(values.password, policy.passwordminchars)){
    throw new SubmissionError({ _error: "Your password must be at least "+policy.passwordminchars+" characters." });
  }
};

export default validate;
