import { SubmissionError } from "redux-form";
import { isRequiredValidator, lengthValidator } from "./util";

const validate = (values, policy) => {
  if (
    !isRequiredValidator(values.password) ||
    !isRequiredValidator(values.newUsername)
  ) {
    throw new SubmissionError({ _error: "All fields are required" });
  }

  if (
    !lengthValidator(
      values.newUsername,
      policy.minusernamelength,
      policy.maxusernamelength
    )
  ) {
    throw new SubmissionError({
      _error:
        "Your username must be between " +
        policy.minusernamelength +
        " and " +
        policy.maxusernamelength +
        " characters."
    });
  }
};

export default validate;
