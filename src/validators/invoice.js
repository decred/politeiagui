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

  return null;
};

const validateContractorName = name => {
  if (!name) {
    return "Name cannot be blank";
  }
  return null;
};

const validateContractorLocation = location => {
  if (!location) {
    return "Location cannot be blank";
  }
  return null;
};

const validateContractorContact = contact => {
  if (!contact) {
    return "Contact cannot be blank";
  }
  return null;
};

const validateContractorRate = rate => {
  if (!rate) {
    return "Rate cannot be blank";
  }
  if (+rate < 5 || +rate > 500) {
    return "Rate must be within the range of 5 to 500";
  }
  return null;
};

const validateContractorPaymentAddress = address => {
  if (!address) {
    return "Payment address cannot be blank";
  }
  return null;
};

const synchronousValidation = ({ name, location, contact, rate, address }) => {
  const errors = {
    name: validateContractorName(name),
    location: validateContractorLocation(location),
    contact: validateContractorContact(contact),
    rate: validateContractorRate(rate),
    address: validateContractorPaymentAddress(address)
  };

  return errors;
};

export { validate, synchronousValidation };
