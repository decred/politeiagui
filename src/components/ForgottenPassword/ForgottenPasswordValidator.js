import { emailValidator } from "../../validators";

const validate = values => {
  const errors = {};

  if (!emailValidator(values.email)) {
    errors.global = "Invalid email address";
  }

  return errors;
};

export default validate;
