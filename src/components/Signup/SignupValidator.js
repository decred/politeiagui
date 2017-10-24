import { emailValidator, isRequiredValidator, passwordVerifyValidator } from "../../validators";

const validate = values => {
  const errors = {};
  if (!isRequiredValidator(values.email) || !isRequiredValidator(values.password) || !isRequiredValidator(values.password_verify)) {
    errors.global = "All fields are required";
  }

  if (!passwordVerifyValidator(values.password, values.password_verify)) {
    errors.global = "Passwords do not match";
  }

  if (!emailValidator(values.email)) {
    errors.global = "Invalid email address";
  }

  return errors;
};

export default validate;
