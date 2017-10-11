const validate = values => {
  const errors = {};
  console.log(values);
  if (!values.name || !values.description) {
    errors.global = "All fields are required";
  }

  return errors;
};

export default validate;
