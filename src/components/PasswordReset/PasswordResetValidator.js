import { passwordVerifyValidator } from "../../validators";
import { lengthValidator } from "../../validators/util";
import { SubmissionError } from "redux-form";

const validate = (values, policy) => {
  if (!passwordVerifyValidator(values.newPassword, values.newPasswordVerify)) {
    throw new SubmissionError({ _error: "Passwords do not match" });
  }

  if (!lengthValidator(values.newPassword, policy.minpasswordlength)) {
    throw new SubmissionError({
      _error:
        "Your password must be at least " +
        policy.minpasswordlength +
        " characters."
    });
  }
};

export default validate;
