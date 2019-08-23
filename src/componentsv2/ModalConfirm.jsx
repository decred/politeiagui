import React, { useState, useEffect } from "react";
import { Button, Modal, Text } from "pi-ui";
import PropTypes from "prop-types";
import FormWrapper from "src/componentsv2/FormWrapper";
import ActionSuccess from "src/componentsv2/ActionSuccess";

const ModalConfirm = ({
  show,
  onClose,
  onSubmit,
  title,
  message,
  successMessage,
  disableSuccessFeedback
}) => {
  const [success, setSuccess] = useState(false);
  const onSubmitForm = async (
    _,
    { resetForm, setSubmitting, setFieldError }
  ) => {
    try {
      await onSubmit();
      resetForm();
      setSubmitting(false);
      setSuccess(true);
    } catch (e) {
      setSubmitting(false);
      setFieldError("global", e);
    }
  };
  useEffect(
    function clearOnClose() {
      if (!show) {
        setTimeout(() => setSuccess(false), 500);
      }
    },
    [show]
  );
  return (
    <Modal
      style={{ maxWidth: "500px" }}
      title={title}
      show={show}
      onClose={onClose}
    >
      {!success && (
        <FormWrapper initialValues={{}} onSubmit={onSubmitForm}>
          {({
            Form,
            Actions,
            ErrorMessage,
            handleSubmit,
            isSubmitting,
            errors
          }) => (
            <Form onSubmit={handleSubmit}>
              {errors && errors.global && (
                <ErrorMessage>{errors.global.toString()}</ErrorMessage>
              )}
              <Text>{message}</Text>
              <Actions className="no-padding-bottom">
                <Button loading={isSubmitting} type="submit">
                  Confirm
                </Button>
              </Actions>
            </Form>
          )}
        </FormWrapper>
      )}
      <ActionSuccess show={success} successMessage={successMessage} />
    </Modal>
  );
};

ModalConfirm.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  successMessage: PropTypes.string
};

ModalConfirm.defaultProps = {
  title: "Confirm Action",
  message: "Are you sure?"
};

export default ModalConfirm;
