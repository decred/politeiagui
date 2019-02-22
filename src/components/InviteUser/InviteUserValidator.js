import { emailValidator, isRequiredValidator } from "../../validators/util";
import { SubmissionError } from "redux-form";

const validate = values => {
  if (!isRequiredValidator(values.email)) {
    throw new SubmissionError({ _error: "All fields are required" });
  }
  if (!emailValidator(values.email)) {
    throw new SubmissionError({ _error: "Invalid email address" });
  }
};

export default validate;
