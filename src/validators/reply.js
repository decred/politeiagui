import { SubmissionError } from "redux-form";
import { isRequiredValidator } from "./util";

const validate = values => {
  if (!isRequiredValidator(values.comment)) {
    throw new SubmissionError({ _error: "A comment body is required" });
  }
};

export default validate;

