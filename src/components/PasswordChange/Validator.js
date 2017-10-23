const validate = values => {
  const errors = {};
  if (!values.existingPassword || !values.password || !values.password_verify) {
    errors.global = "All fields are required";
  }

  if (values.password !== values.password_verify) {
    errors.global = "Passwords do not match";
  }

  return errors;
};

export default validate;
