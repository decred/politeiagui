import { SubmissionError } from "redux-form";
import { emailValidator, isRequiredValidator } from "./util";

const validate = values => {
  if (
    !isRequiredValidator(values.email) ||
    !isRequiredValidator(values.password)
  ) {
    throw new SubmissionError({ _error: "All fields are required" });
  }

  if (!emailValidator(values.email)) {
    throw new SubmissionError({ _error: "Invalid email address" });
  }
};

export default validate;
