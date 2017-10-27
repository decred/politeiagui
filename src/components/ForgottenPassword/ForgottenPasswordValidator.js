import { SubmissionError } from "redux-form";
import { emailValidator } from "../../validators";

const validate = values => {
  if (!emailValidator(values.email)) {
    throw new SubmissionError({ _error: "Invalid email address" });
  }
};

export default validate;
