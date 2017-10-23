const validate = values => {
  const errors = {};
  if (!values.censorship) {
    errors.global = "Please enter a censorship token";
  }

  return errors;
};

export default validate;
