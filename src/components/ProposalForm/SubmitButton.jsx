import React from "react";
import { Button } from "pi-ui";

const SubmitButton = ({ isSubmitting, disableSubmit, isValid }) => (
  <Button
    type="submit"
    kind={!isValid || disableSubmit ? "disabled" : "primary"}
    loading={isSubmitting}
  >
    Submit
  </Button>
);

export default SubmitButton;
