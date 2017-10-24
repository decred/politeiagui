import { passwordVerifyValidator } from "../../validators";

const validate = values => {
  const errors = {};

  if (!passwordVerifyValidator(values.password, values.password_verify)) {
    errors.global = "Passwords do not match";
  }

  return errors;
};

export default validate;
