import { isRequiredValidator, passwordVerifyValidator } from "../../validators";

const validate = values => {
  const errors = {};
  if (!isRequiredValidator(values.existingPassword) || !isRequiredValidator(values.password) || !isRequiredValidator(values.password_verify)) {
    errors.global = "All fields are required";
  }

  if (!passwordVerifyValidator(values.password, values.password_verify)) {
    errors.global = "Passwords do not match";
  }

  return errors;
};

export default validate;
