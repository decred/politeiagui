import React, { useState, useEffect } from "react";
import { Button, Modal, TextInput } from "pi-ui";
import PropTypes from "prop-types";
import FormWrapper from "src/componentsv2/FormWrapper";
import * as Yup from "yup";
import ActionSuccess from "src/componentsv2/ActionSuccess";

const ModalConfirmWithReason = ({
  show,
  onClose,
  onSubmit,
  subject,
  title,
  reasonLabel,
  successMessage
}) => {
  const [success, setSuccess] = useState(false);
  const onSubmitReason = async (
    values,
    { resetForm, setSubmitting, setFieldError }
  ) => {
    try {
      await onSubmit(values.reason);
      resetForm();
      setSubmitting(false);
      setSuccess(true);
    } catch (e) {
      setSubmitting(false);
      setFieldError("global", e);
    }
  };
  useEffect(() => {
    if (!show) {
      setTimeout(() => setSuccess(false), 500);
    }
  }, [show]);
  return (
    <Modal
      style={{ maxWidth: "500px" }}
      title={title}
      show={show}
      onClose={onClose}
    >
      {!success && (
        <FormWrapper
          initialValues={{
            reason: ""
          }}
          validationSchema={Yup.object().shape({
            reason: Yup.string().required("Required")
          })}
          onSubmit={onSubmitReason}
        >
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
                label={reasonLabel}
                name="reason"
                id={`reason-for-${subject}`}
                type="text"
                value={values.reason}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.reason && errors.reason}
              />
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

ModalConfirmWithReason.propTypes = {
  title: PropTypes.string,
  reasonLabel: PropTypes.string,
  subject: PropTypes.string.isRequired,
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  successMessage: PropTypes.string
};

ModalConfirmWithReason.defaultProps = {
  title: "Confirm Action",
  reasonLabel: "Reason"
};

export default ModalConfirmWithReason;
