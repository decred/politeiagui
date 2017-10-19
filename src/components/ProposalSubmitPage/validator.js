import { forEach } from "lodash";
import { isFileValid } from "../ProposalImages/helpers";

const validate = (values, { policy }) => {
  const errors = {};
  if (!values.name || !values.description) {
    errors.global = "All fields are required";
  }

  if (values.files) {
    if(values.files.length > policy.maximages) {
      errors.global = "Only 5 attachments are allowed";
    }

    forEach(values.files, (file) => {
      if (!isFileValid(file, policy)) {
        errors.global = "One of the file exceed the max image size or the mime types is invalid";
      }
    });
  }

  return errors;
};

export default validate;
