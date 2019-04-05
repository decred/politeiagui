import { SubmissionError } from "redux-form";
import { isRequiredValidator } from "./util";

const emptyInvoiceField = values =>
  !isRequiredValidator(values.month) ||
  !isRequiredValidator(values.year) ||
  !isRequiredValidator(values.name && values.name.trim()) ||
  !isRequiredValidator(values.location && values.location.trim()) ||
  !isRequiredValidator(values.contact && values.contact.trim()) ||
  !isRequiredValidator(values.rate) ||
  !isRequiredValidator(values.address && values.address.trim());

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
  // const errors = validateCsv(values.csv);
  // if ("" + errors) {
  //   throw new SubmissionError({
  //     _error: "Malformed CSV."
  //   });
  // }

  return null;
};

const synchronousValidation = values => {
  const errors = {};
  errors._error = "Errors found";
  if (emptyInvoiceField(values)) errors.csv = "You must fill all fields";
  if (!errors.csv) errors._error = null;
  return errors;
};

export { validate, synchronousValidation };
