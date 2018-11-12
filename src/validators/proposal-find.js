import { SubmissionError } from "redux-form";
import { isRequiredValidator } from "./util";

const validate = values => {
  if (!isRequiredValidator(values.censorship)) {
    throw new SubmissionError({ _error: "Please enter a censorship token" });
  }

  if (values.censorship.length !== 64) {
    throw new SubmissionError({
      _error: "Censorship tokens must be 64 characters long"
    });
  }
};

export default validate;
