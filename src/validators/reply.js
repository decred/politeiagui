import { SubmissionError } from "redux-form";
import { isRequiredValidator, validateURL } from "./util";

const validate = ({ values, keyMismatch }, policy) => {
  if (!isRequiredValidator(values.comment)) {
    throw new SubmissionError({ _error: "A comment body is required" });
  }

  if (
    policy.maxcommentlength &&
    values.comment.length > policy.maxcommentlength
  ) {
    throw new SubmissionError({
      _error: `The comment must be less than ${
        policy.maxcommentlength
      } characters long`
    });
  }
  validateURL(values.comment);

  if (keyMismatch) {
    throw new SubmissionError({
      _error:
        "Your local key does not match the one on the server.  Please generate a new one under account settings."
    });
  }
};

export default validate;
