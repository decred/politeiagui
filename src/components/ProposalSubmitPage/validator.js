import { forEach } from "lodash";
import { SubmissionError } from "redux-form";
import { isFileValid } from "../ProposalImages/helpers";
import { isRequiredValidator } from "../../validators";

const validate = (values, policy) => {
  if (!isRequiredValidator(values.name) || !isRequiredValidator(values.description)) {
    throw new SubmissionError({ _error: "All fields are required" });
  }

  if (values.files) {
    if(values.files.length > policy.maximages) {
      throw new SubmissionError({ _error: "Only 5 attachments are allowed" });
    }

    forEach(values.files, (file) => {
      if (!isFileValid(file, policy)) {
        throw new SubmissionError({ _error: "One of the file exceed the max image size or the mime types is invalid" });
      }
    });
  }
};

export default validate;
