import React, { useState, useEffect } from "react";
import {
  P,
  Button,
  Modal,
  TextInput,
  Icon,
  getThemeProperty,
  useTheme
} from "pi-ui";
import PropTypes from "prop-types";
import FormWrapper from "src/components/FormWrapper";
import * as Yup from "yup";

const ModalConfirmWithReason = ({
  show,
  onClose,
  onSubmit,
  subject,
  title,
  reasonLabel,
  successMessage,
  successTitle,
  onCloseSuccess
}) => {
  const [success, setSuccess] = useState(false);

  const onSubmitReason = async (
    values,
    { resetForm, setFieldError, setSubmitting }
  ) => {
    try {
      await onSubmit(values.reason);
      resetForm();
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

  const { theme } = useTheme();
  const successIconBgColor = getThemeProperty(
    theme,
    "success-icon-background-color"
  );
  const iconCheckmarkColor = getThemeProperty(
    theme,
    "success-icon-checkmark-color"
  );

  return (
    <Modal
      style={{ width: "600px" }}
      title={(success && successTitle) || title}
      show={show}
      onClose={success && onCloseSuccess ? onCloseSuccess : onClose}
      iconComponent={
        !success ? (
          <Icon type={"info"} size={26} />
        ) : (
          <Icon
            type={"checkmark"}
            size={26}
            iconColor={iconCheckmarkColor}
            backgroundColor={successIconBgColor}
          />
        )
      }>
      {!success && (
        <P style={{ marginBottom: "20px" }}>
          Please, provide a reason for this action.
        </P>
      )}
      {!success && (
        <FormWrapper
          initialValues={{
            reason: ""
          }}
          validationSchema={Yup.object().shape({
            reason: Yup.string().required("Required")
          })}
          onSubmit={onSubmitReason}>
          {({
            Form,
            Actions,
            ErrorMessage,
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            errors,
            touched,
            isSubmitting
          }) => (
            <Form onSubmit={handleSubmit}>
              {errors && errors.global && (
                <ErrorMessage>{errors.global.toString()}</ErrorMessage>
              )}
              <TextInput
                data-testid="reason"
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
                <Button
                  data-testid="reason-confirm"
                  loading={isSubmitting}
                  type="submit">
                  Confirm
                </Button>
              </Actions>
            </Form>
          )}
        </FormWrapper>
      )}
      {success && (
        <>
          {successMessage}
          <div className="justify-right margin-top-m">
            <Button
              data-testid="reason-confirm-success"
              onClick={onCloseSuccess || onClose}>
              Ok
            </Button>
          </div>
        </>
      )}
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
  successTitle: PropTypes.string,
  successMessage: PropTypes.node
};

ModalConfirmWithReason.defaultProps = {
  title: "Confirm Action",
  reasonLabel: "Reason"
};

export default React.memo(ModalConfirmWithReason);
