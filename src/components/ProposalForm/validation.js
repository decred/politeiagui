import {
  buildRegexFromSupportedChars,
  minLengthMessage,
  maxLengthMessage,
  exactLengthMessage,
  maxFileSizeMessage,
  invalidMessage,
  maxFilesExceededMessage,
  validMimeTypesMessage
} from "src/utils/validation";

import {
  PROPOSAL_TYPE_RFP,
  PROPOSAL_TYPE_RFP_SUBMISSION,
  CENSORSHIP_TOKEN_LENGTH
} from "src/constants";

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

  // type validation
  if (!values.type) {
    errors.type = "Required";
  }

  // RFP deadline validation
  if (values.type === PROPOSAL_TYPE_RFP && !values.rfpDeadline) {
    errors.rfpDeadline = "Required";
  }

  // RFP submission token validation
  if (values.type === PROPOSAL_TYPE_RFP_SUBMISSION) {
    const rfpLinkErrors = validateRfpSubmissionToken(values.rfpLink);
    if (rfpLinkErrors) errors.rfpLink = rfpLinkErrors;
  }

  // name validation
  const nameErrors = validateProposalName(
    values.name,
    proposalnamesupportedchars,
    minproposalnamelength,
    maxproposalnamelength
  );
  if (nameErrors) errors.name = nameErrors;

  // description validation
  if (!values.description) {
    errors.description = "Required";
  }

  // files validation
  const [validatedFiles, filesErrors] = validateProposalFiles(
    values.files,
    validmimetypes,
    maximages,
    maximagesize,
    maxmdsize
  );
  if (filesErrors) errors.files = filesErrors;
  values.files = validatedFiles;
  return errors;
};

/**
 * validates proposal files
 * currently pi policy only allows 1 md file to be attached to a proposal
 * it corresponds to the index file, so a proposal can only accept image
 * attachments until this policy changes
 * @param {Array} files provided files
 * @param {Array} validmimetypes valid mime types
 * @param {Number} maximages max number of images
 * @param {Number} maximagesize max image file size
 * @param {Number} maxmdsize max .md file size
 */
const validateProposalFiles = (
  files,
  validmimetypes,
  maximages,
  maximagesize,
  maxmdsize
) => {
  const validMimeTypes = validmimetypes.filter((m) => m.startsWith("image/"));
  const validatedFiles = [];
  let errors = [];
  if (files && files.length > maximages) {
    errors.push(maxFilesExceededMessage(maximages));
    return [files, errors];
  }
  for (const file of files) {
    if (!validMimeTypes.includes(file.mime)) {
      errors.push(validMimeTypesMessage(validMimeTypes));
    } else if (
      (file.mime.startsWith("image/") && file.size > maximagesize) ||
      (file.mime.startsWith("text/") && file.size > maxmdsize)
    ) {
      errors.push(maxFileSizeMessage());
    } else {
      validatedFiles.push(file);
    }
  }

  if (errors.length === 0) errors = null;

  return [validatedFiles, errors];
};

const validateRfpSubmissionToken = (rfpLink) => {
  if (!rfpLink) {
    return "Required";
  }
  const tokenRegex = /[0-9a-f]+/g;
  if (!rfpLink.match(tokenRegex)) {
    return invalidMessage("Token", ["a-f", "0-9"]);
  }
  if (rfpLink.trim().length !== CENSORSHIP_TOKEN_LENGTH) {
    return exactLengthMessage("token", CENSORSHIP_TOKEN_LENGTH);
  }
};

const validateProposalName = (
  name,
  proposalnamesupportedchars,
  minproposalnamelength,
  maxproposalnamelength
) => {
  if (!name) {
    return "Required";
  }
  const nameRegex = buildRegexFromSupportedChars(proposalnamesupportedchars);
  if (!name.match(nameRegex)) {
    return invalidMessage("name", proposalnamesupportedchars);
  }
  if (name.trim().length < minproposalnamelength) {
    return minLengthMessage("name", minproposalnamelength);
  }
  if (name.trim().length > maxproposalnamelength) {
    return maxLengthMessage("name", maxproposalnamelength);
  }
};
