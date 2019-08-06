import { Button, Modal, Text } from "pi-ui";
import PropTypes from "prop-types";
import React from "react";
import FormWrapper from "src/componentsv2/FormWrapper";

const ModalConfirm = ({ show, onClose, onSubmit, title, message }) => {
  const onSubmitForm = async (
    _,
    { resetForm, setSubmitting, setFieldError }
  ) => {
    try {
      await onSubmit();
      resetForm();
      setSubmitting(false);
      window.setTimeout(onClose, 200);
    } catch (e) {
      setSubmitting(false);
      setFieldError("global", e);
    }
  };
  return (
    <Modal
      style={{ maxWidth: "500px" }}
      title={title}
      show={show}
      onClose={onClose}
    >
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
    </Modal>
  );
};

ModalConfirm.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func
};

ModalConfirm.defaultProps = {
  title: "Confirm Action",
  message: "Are you sure?"
};

export default ModalConfirm;
