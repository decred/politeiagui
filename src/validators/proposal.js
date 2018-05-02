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
      throw new SubmissionError({ _error: "Only 5 attachments are allowed." });
    }

    const errors = values.files.reduce((acc, file) => {
      const fileValidation = isFileValid(file, props.policy);
      if (!fileValidation.valid) {
        return [...acc, fileValidation.errorMsg];
      }
      return acc;
    }, []);

    if (errors && errors.length > 0) {
      throw new SubmissionError({ _error: errors.length > 1 ? errors : errors[0] });
    }
  }
  if (props.keyMismatch) {
    throw new SubmissionError({ _error: "Your local key does not match the one on the server.  Please generate a new one under account settings." });
  }
};

export default validate;
