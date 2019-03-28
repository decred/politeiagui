import { SubmissionError } from "redux-form";
import { isRequiredValidator } from "./util";

const emptyInvoiceField = values =>
  !isRequiredValidator(values.csv && values.csv.trim()) ||
  !isRequiredValidator(values.month && values.month.trim()) ||
  !isRequiredValidator(values.year && values.year.trim());

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
};

const synchronousValidation = values => {
  const errors = {};
  errors._error = "Errors found";
  if (emptyInvoiceField(values)) errors.csv = "You must fill all fields";
  else {
    errors._error = null;
  }
  return errors;
};

export { validate, synchronousValidation };
