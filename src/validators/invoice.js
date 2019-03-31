import { SubmissionError } from "redux-form";
import { isRequiredValidator } from "./util";
import { isComment, splitColumn, splitLine } from "../helpers";
const LINE_LENGTH = 6;

const validateLineLength = (line, linenumber) => {
  if (line.length < LINE_LENGTH) {
    return `Line ${linenumber} is too short`;
  }
  if (line.length > LINE_LENGTH) {
    return `Line ${linenumber} is too long`;
  }
  return null;
};

const validateNumberFields = (field, column, linenumber) => {
  if (Number.isNaN(+field)) {
    return `Field on ${linenumber}:${column} should be a Number`;
  }
  return null;
};

const validateLine = (line, linenumber) => {
  linenumber++;
  if (isComment(line)) return null;
  const lengthError = validateLineLength(line, linenumber);
  if (lengthError) return lengthError;
  const hoursError = validateNumberFields(line[4], 4, linenumber);
  if (hoursError) return hoursError;
  const costError = validateNumberFields(line[5], 5, linenumber);
  if (costError) return costError;
};

const validateCsv = csv => {
  if (!csv) {
    return { error: "Could not parse empty csv" };
  }
  const linesContent = splitLine(csv).map(splitColumn);
  const errors = linesContent.map(validateLine);

  return errors;
};

const emptyInvoiceField = values =>
  !isRequiredValidator(values.csv && values.csv.trim()) ||
  !isRequiredValidator(values.month) ||
  !isRequiredValidator(values.year);

const validate = (values, dispatch, props) => {
  if (emptyInvoiceField(values)) {
    throw new SubmissionError({
      _error: "Your invoice must have a month, a year and an input."
    });
  }
  if (props.keyMismatch) {
    throw new SubmissionError({
      _error:
        "Your local key does not match the one on the server.  Please generate a new one under account settings."
    });
  }
  const errors = validateCsv(values.csv);
  if ("" + errors) {
    throw new SubmissionError({
      _error: "Malformed CSV."
    });
  }

  return null;
};

const synchronousValidation = values => {
  const errors = {};
  errors._error = "Errors found";
  if (emptyInvoiceField(values)) errors.csv = "You must fill all fields";
  else {
    const errorsPerLine = validateCsv(values.csv);
    if (errorsPerLine) {
      for (const error of errorsPerLine) {
        if (error) {
          errors.csv = error;
          break;
        }
      }
    } else {
      errors.csv = null;
    }
  }
  if (!errors.csv) errors._error = null;
  return errors;
};

export { validate, synchronousValidation };
