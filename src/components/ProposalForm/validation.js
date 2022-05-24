import {
  buildRegexFromSupportedChars,
  minLengthMessage,
  maxLengthMessage,
  exactLengthMessage,
  invalidMessage
} from "src/utils/validation";
import {
  convertObjectToUnixTimestamp,
  formatDateToInternationalString
} from "src/helpers";
import {
  PROPOSAL_TYPE_RFP,
  PROPOSAL_TYPE_RFP_SUBMISSION,
  CENSORSHIP_TOKEN_LENGTH
} from "src/constants";
import { usdFormatter, formatUnixTimestampToObj } from "src/utils";

export const proposalValidation =
  ({
    amountmin,
    amountmax,
    namesupportedchars,
    namelengthmax,
    namelengthmin,
    startdatemin
  }) =>
  (values) => {
    const errors = {};
    if (!values) {
      values = {
        name: "",
        amount: 0,
        startDate: null,
        endDate: null,
        domain: "",
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
    const isRFP = values.type === PROPOSAL_TYPE_RFP;
    if (isRFP && !values.rfpDeadline) {
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

    // Validate amount, start & end dates only if not dealing with
    // a RFP.
    if (!isRFP) {
      // amount validation
      if (!values.amount || values.amount.length < 2) {
        errors.amount = "Required";
      } else {
        // Valid amount is at least 2 chars long, as it includes the unit
        // as the first char.
        const amount = values.amount;
        if (amount.length >= 2) {
          const amountNumber = Number(amount.replace(/[^0-9.-]+/g, ""));
          if (
            isNaN(amountNumber) ||
            amountNumber < amountmin / 100 ||
            amountNumber > amountmax / 100
          ) {
            errors.amount = `Invalid amount, min is ${usdFormatter.format(
              amountmin / 100
            )}, max is ${usdFormatter.format(amountmax / 100)}`;
          }
        }
      }

      // start & end dates validations.
      const startdate = values.startDate;
      if (!startdate) {
        errors.startDate = "Please pick a start date";
      }
      const enddate = values.endDate;
      if (!enddate) {
        errors.endDate = "Please pick an end date";
      }

      // Ensure start date is bigger than policy start date min.
      let startdateTimestamp;
      if (startdate) {
        startdateTimestamp = convertObjectToUnixTimestamp(startdate, true);
        const minStartdateTimestamp =
          Math.round(new Date().getTime() / 1000) + startdatemin;
        const dateString = formatDateToInternationalString(
          formatUnixTimestampToObj(minStartdateTimestamp)
        );
        if (startdateTimestamp < minStartdateTimestamp) {
          errors.startDate = `Minimum possible start date is: ${dateString}`;
        }
      }

      // If both start & end dates provided, ensure start
      // date is smaller.
      if (startdate && enddate) {
        if (convertObjectToUnixTimestamp(enddate) <= startdateTimestamp) {
          errors.startDate = "Start date must be before end date";
          errors.endDate = "End date must be after start date";
        }
      }
    }

    // domain validation
    if (!values.domain) {
      errors.domain = "Required";
    }

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
