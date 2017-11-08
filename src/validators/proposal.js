import { forEach } from "lodash";
import { SubmissionError } from "redux-form";
import { isFileValid } from "../components/ProposalImages/helpers";
import { isRequiredValidator } from "./util";

const validate = (values, dispatch, props) => {
  if (!isRequiredValidator(values.name) || !isRequiredValidator(values.description)) {
    throw new SubmissionError({ _error: "All fields are required" });
  }

  if (values.files) {
    if(values.files.length > props.policy.maximages) {
      throw new SubmissionError({ _error: "Only 5 attachments are allowed" });
    }

    forEach(values.files, (file) => {
      if (!isFileValid(file, props.policy)) {
        throw new SubmissionError({ _error: "One of the file exceed the max image size or the mime types is invalid" });
      }
    });
  }
};

export default validate;
