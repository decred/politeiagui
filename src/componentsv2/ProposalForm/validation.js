import {
  buildRegexFromSupportedChars,
  minLengthMessage,
  maxLengthMessage,
  maxFileSizeMessage,
  invalidMessage,
  maxFilesExceededMessage,
  validMimeTypesMessage
} from "src/utils/validation";

export const proposalValidation = ({
  proposalnamesupportedchars,
  maxproposalnamelength,
  minproposalnamelength,
  validmimetypes,
  maximages,
  maximagesize,
  maxmdsize
}) => values => {
  const errors = {};

  if (!values) {
    values = {
      name: "",
      description: "",
      files: []
    };
  }

  // Name value validation
  const regex = buildRegexFromSupportedChars(proposalnamesupportedchars);
  if (values.name.length < minproposalnamelength) {
    errors.name = minLengthMessage("name", minproposalnamelength);
  }
  if (values.name.length > maxproposalnamelength) {
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
  const validMimeTypes = validmimetypes.filter(m => m.startsWith("image/"));
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

  return errors;
};
