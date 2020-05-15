import React from "react";
import { Button, classNames } from "pi-ui";
import { useFormikContext } from "formik";
import isEmpty from "lodash/isEmpty";
import styles from "../FormWrapper.module.css";

const SubmitButton = ({ className }) => {
  const { isSubmitting, errors, isValid } = useFormikContext();

  return (
    <Button
      type="submit"
      loading={isSubmitting && isEmpty(errors)}
      kind={!isValid ? "disabled" : "primary"}
      className={classNames(className, styles.submitButton)}>
      Submit
    </Button>
  );
};

export default SubmitButton;
