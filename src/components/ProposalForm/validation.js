import {
  buildRegexFromSupportedChars,
  minLengthMessage,
  maxLengthMessage,
  exactLengthMessage,
  invalidMessage
} from "src/utils/validation";

import {
  PROPOSAL_TYPE_RFP,
  PROPOSAL_TYPE_RFP_SUBMISSION,
  CENSORSHIP_TOKEN_LENGTH
} from "src/constants";

export const proposalValidation =
  ({ namesupportedchars, namelengthmax, namelengthmin }) =>
  (values) => {
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
      namesupportedchars,
      namelengthmin,
      namelengthmax
    );
    if (nameErrors) errors.name = nameErrors;

    // description validation
    if (!values.description) {
      errors.description = "Required";
    }

    return errors;
  };

const validateRfpSubmissionToken = (rfpLink) => {
  if (!rfpLink) {
    return "Required";
  }
  const tokenRegex = /[^0-9a-f]/g;
  if (rfpLink.match(tokenRegex)) {
    return invalidMessage("Token", ["a-f", "0-9"]);
  }
  if (rfpLink.trim().length !== CENSORSHIP_TOKEN_LENGTH) {
    return exactLengthMessage("token", CENSORSHIP_TOKEN_LENGTH);
  }
};

const validateProposalName = (
  name,
  namesupportedchars,
  namelengthmin,
  namelengthmax
) => {
  if (!name) {
    return "Required";
  }
  const nameRegex = buildRegexFromSupportedChars(namesupportedchars);
  if (!name.match(nameRegex)) {
    return invalidMessage("name", namesupportedchars);
  }
  if (name.trim().length < namelengthmin) {
    return minLengthMessage("name", namelengthmin);
  }
  if (name.trim().length > namelengthmax) {
    return maxLengthMessage("name", namelengthmax);
  }
};
