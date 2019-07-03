import { Button, Modal, TextInput } from "pi-ui";
import PropTypes from "prop-types";
import React from "react";
import FormWrapper from "src/componentsv2/FormWrapper";

const ModalConfirmWithReason = ({ show, onClose, onSubmit }) => {
  const onSubmitReason = async (
    values,
    { resetForm, setSubmitting, setFieldError }
  ) => {
    try {
      await onSubmit(values.reason);
      resetForm();
      setSubmitting(false);
      window.setTimeout(onClose, 200);
    } catch (e) {
      setSubmitting(false);
      setFieldError("global", e);
    }
  };
  return (
    <Modal title="Confirm Action" show={show} onClose={onClose}>
      <FormWrapper
        initialValues={{
          reason: ""
        }}
        onSubmit={onSubmitReason}>
        {({
          Form,
          Actions,
          ErrorMessage,
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          errors,
          touched
        }) => (
            <Form onSubmit={handleSubmit}>
              {errors && errors.global && (
                <ErrorMessage>{errors.global.toString()}</ErrorMessage>
              )}
              <TextInput
                label="Reason"
                name="reason"
                type="text"
                value={values.reason}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.reason && errors.reason}
              />
              <Actions>
                <Button loading={isSubmitting} kind={values.reason ? "primary" : "disabled"} type="submit">
                  Confirm
              </Button>
              </Actions>
            </Form>
          )}
      </FormWrapper>
    </Modal>
  );
};

ModalConfirmWithReason.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func
};

export default ModalConfirmWithReason;
