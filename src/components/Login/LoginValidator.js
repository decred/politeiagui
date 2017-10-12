const validate = values => {
  const errors = {};
  if (!values.email || !values.password) {
    errors.global = "All fields are required";
  }

  return errors;
};

export default validate;
