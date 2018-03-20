import { forEach } from "lodash";
import { SubmissionError } from "redux-form";
import { isFileValid } from "../components/ProposalImages/helpers";
import { isRequiredValidator, proposalNameValidator } from "./util";

const validate = (values, dispatch, props) => {
  if (!isRequiredValidator(values.name) || !isRequiredValidator(values.description)) {
    throw new SubmissionError({ _error: "You must provide both a proposal name and description." });
  }

  if ((props.policy.minnamelength && (values.name.length < props.policy.minnamelength)) ||
     (props.policy.maxnamelength && (values.name.length > props.policy.maxnamelength)) ||
     (props.policy.supportedcharacters && !proposalNameValidator(values.name, props.policy.supportedcharacters))) {
    throw new SubmissionError({
      _error: `The proposal name must be between ${props.policy.minnamelength} and ${props.policy.maxnamelength} characters long ` +
        `and only contain the following characters: ${props.policy.supportedcharacters.join(" ")}`
    });
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
  if (props.keyMismatch) {
    throw new SubmissionError({ _error: "Your local key does not match the one in our server, please generate a new one at profile settings." });
  }
};

export default validate;
