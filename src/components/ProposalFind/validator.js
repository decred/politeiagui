import { isRequiredValidator } from "../../validators";

const validate = values => {
  const errors = {};
  if (!isRequiredValidator(values.censorship)) {
    errors.global = "Please enter a censorship token";
  }

  return errors;
};

export default validate;
