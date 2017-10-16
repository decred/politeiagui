const validate = values => {
  const errors = {};
  if (!values.name || !values.description) {
    errors.global = "All fields are required";
  }

  console.log("values", values);

  if (values.files && values.files.length > 5) {
    errors.global = "Only 5 attachments are allowed";
  }

  return errors;
};

export default validate;
