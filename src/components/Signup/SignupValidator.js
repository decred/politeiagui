const validate = values => {
  const errors = {};
  if (!values.email || !values.password || !values.password_verify) {
    errors.global = "All fields are required";
  }

  if (values.password !== values.password_verify) {
    errors.global = "Passwords do not match";
  }

  if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.global = "Invalid email address";
  }

  return errors;
};

export default validate;
