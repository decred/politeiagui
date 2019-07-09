import { SubmissionError } from "redux-form";
import { emailValidator, isRequiredValidator } from "./util";

const validate = values => {
  if (
    !isRequiredValidator(values.username) ||
    !isRequiredValidator(values.password)
  ) {
    throw new SubmissionError({ _error: "All fields are required" });
  }

  if (emailValidator(values.username)) {
    throw new SubmissionError({ _error: "Username must be used to login" });
  }
};

export default validate;
