import { SubmissionError } from "redux-form";
import { isRequiredValidator } from "./util";

const validate = values => {
  if (!isRequiredValidator(values.censorship)) {
    throw new SubmissionError({ _error: "Please enter a censorship token" });
  }
};

export default validate;
