import {
  buildRegexFromSupportedChars,
  minLengthMessage,
  maxLengthMessage,
  maxFileSizeMessage,
  invalidMessage,
  maxFilesExceededMessage,
  validMimeTypesMessage
} from "src/utils/validation";

import { PROPOSAL_TYPE_RFP, PROPOSAL_TYPE_RFP_SUBMISSION } from "src/constants";

export const proposalValidation = ({
  proposalnamesupportedchars,
  maxproposalnamelength,
  minproposalnamelength,
  validmimetypes,
  maximages,
  maximagesize,
  maxmdsize
}) => (values) => {
  const errors = {};
  console.log(values);
  if (!values) {
    values = {
      name: "",
      description: "",
      type: null,
      rfpLink: "",
      rfpDeadline: null,
      files: []
    };
  }

  // Propsaol type validation
  if (!values.type) {
    errors.type = "Required";
  }

  // RFP deadline validation
  if (values.type === PROPOSAL_TYPE_RFP && !values.rfpDeadline) {
    errors.rfpDeadline = "Required";
  }

  // RFP deadline validation
  if (values.type === PROPOSAL_TYPE_RFP_SUBMISSION && !values.rfpLink) {
    errors.rfpLink = "Required";
  }

  // Name value validation
  const regex = buildRegexFromSupportedChars(proposalnamesupportedchars);
  if (values.name.trim().length < minproposalnamelength) {
    errors.name = minLengthMessage("name", minproposalnamelength);
  }
  if (values.name.trim().length > maxproposalnamelength) {
    errors.name = maxLengthMessage("name", maxproposalnamelength);
  }
  if (!values.name.match(regex)) {
    errors.name = invalidMessage("name", proposalnamesupportedchars);
  }
  if (!values.name) {
    errors.name = "Required";
  }

  // Description value validation
  if (!values.description) {
    errors.description = "Required";
  }

  /*
    Files value validation

    Currently pi policy only allows 1 md file to be attached to a proposal.
    It corresponds to the index file, so a proposal can only accept image
    attachments until this policy changes.
  */
  const validMimeTypes = validmimetypes.filter((m) => m.startsWith("image/"));
  const validatedFiles = [];
  errors.files = [];

  for (const file of values.files) {
    if (validatedFiles.length > maximages - 1 || values.files > maximages - 1) {
      errors.files.push(maxFilesExceededMessage(maximages));
    } else if (!validMimeTypes.includes(file.mime)) {
      errors.files.push(validMimeTypesMessage(validMimeTypes));
    } else if (
      (file.mime.startsWith("image/") && file.size > maximagesize) ||
      (file.mime.startsWith("text/") && file.size > maxmdsize)
    ) {
      errors.files.push(maxFileSizeMessage());
    } else {
      validatedFiles.push(file);
    }
  }

  if (errors.files.length === 0) delete errors.files;

  values.files = validatedFiles;
  console.log(errors);
  return errors;
};
