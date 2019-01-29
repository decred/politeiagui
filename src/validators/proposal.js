import { SubmissionError } from "redux-form";
import { isFileValid } from "../components/ProposalImages/helpers";
import {
  isRequiredValidator,
  proposalNameValidator,
  validateURL
} from "./util";

function checkProposalName(props, values) {
  const name = values.name.trim();
  return (
    (props.policy.minproposalnamelength &&
      name.length < props.policy.minproposalnamelength) ||
    (props.policy.maxproposalnamelength &&
      name.length > props.policy.maxproposalnamelength) ||
    (props.policy.proposalnamesupportedchars &&
      !proposalNameValidator(name, props.policy.proposalnamesupportedchars))
  );
}

function checkProposalSummary(props, values) {
  const summary = values.summary.trim();
  return (
    (props.policy.minproposalsummarylength &&
      summary.length < props.policy.minproposalsummarylength) ||
    (props.policy.maxproposalsummarylength &&
      summary.length > props.policy.maxproposalsummarylength)
  );
}

const validate = (values, dispatch, props) => {
  if (
    !isRequiredValidator(values.name && values.name.trim()) ||
    !isRequiredValidator(values.description) ||
    !isRequiredValidator(values.summary)
  ) {
    throw new SubmissionError({
      _error: "You must provide a proposal name, description, and summary."
    });
  }

  if (checkProposalName(props, values)) {
    throw new SubmissionError({
      _error:
        `The proposal name must be between ${
          props.policy.minproposalnamelength
        } and ${props.policy.maxproposalnamelength} characters long ` +
        `and only contain the following characters: ${props.policy.proposalnamesupportedchars.join(
          " "
        )}`
    });
  }

  if (checkProposalSummary(props, values)) {
    throw new SubmissionError({
      _error: `The proposal summary must be between ${
        props.policy.minproposalsummarylength
      } and ${props.policy.maxproposalsummarylength} characters long `
    });
  }

  validateURL(values.description);

  if (values.files) {
    if (values.files.length > props.policy.maximages) {
      throw new SubmissionError({
        _error: `Only ${props.policy.maximages} attachments are allowed.`
      });
    }

    const errors = values.files.reduce((acc, file) => {
      const fileValidation = isFileValid(file, props.policy);
      if (!fileValidation.valid) {
        return [...acc, fileValidation.errorMsg];
      }
      return acc;
    }, []);

    if (errors && errors.length > 0) {
      throw new SubmissionError({
        _error: errors.length > 1 ? errors : errors[0]
      });
    }
  }
  if (props.keyMismatch) {
    throw new SubmissionError({
      _error:
        "Your local key does not match the one on the server.  Please generate a new one under account settings."
    });
  }
};

const synchronousValidation = (values, props) => {
  const errors = {};
  errors._error = "Errors found";
  if (!isRequiredValidator(values.name && values.name.trim())) {
    errors.name = "You must provide a proposal name.";
  } else if (props.policy && checkProposalName(props, values)) {
    errors.name =
      "The proposal name must be between 8 and 80 characters long and only contain the following characters: a-z A-Z 0-9 & . , : ; - @ + # / \\ ^ _ ` ( ) ! [ ].";
  } else if (!isRequiredValidator(values.description)) {
    errors.description = "You must provide a description.";
  } else if (!isRequiredValidator(values.summary)) {
    errors.summary = "You must provide a summary.";
  } else if (props.policy && checkProposalSummary(props, values)) {
    errors.summary =
      "The proposal sumary must be between 10 and 255 characters long.";
  } else {
    errors._error = null;
  }
  return errors;
};

const warn = (values, props) => {
  const warnings = {};
  if (props.policy) {
    const nameLengthLimit = props.policy.maxproposalnamelength - 11;
    const summaryLengthLimit = props.policy.maxproposalsummarylength - 11;
    if (values.name && values.name.trim().length > nameLengthLimit) {
      warnings.name = `The proposal name is close to the limit of ${
        props.policy.maxproposalnamelength
      } characters. Current Length: ${values.name.length}.`;
    }
    if (values.summary && values.summary.trim().length > summaryLengthLimit) {
      warnings.summary = `The proposal summary is close to the limit of ${
        props.policy.maxproposalsummarylength
      } characters. Current Length: ${values.summary.length}.`;
    }
  }
  return warnings;
};

export { validate, synchronousValidation, warn };
