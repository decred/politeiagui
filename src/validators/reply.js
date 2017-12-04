import { SubmissionError } from "redux-form";
import { isRequiredValidator } from "./util";

const validate = (values, policy) => {
  if (!isRequiredValidator(values.comment)) {
    throw new SubmissionError({ _error: "A comment body is required" });
  }

  if (policy.maxcommentlength && (values.comment.length > policy.maxcommentlength)) {
    throw new SubmissionError({
      _error: `The comment must be less than ${policy.maxcommentlength} characters long`
    });
  }
};

export default validate;

