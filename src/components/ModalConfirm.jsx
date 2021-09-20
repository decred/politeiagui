import { Button, Icon, Modal, Text, useTheme, getThemeProperty } from "pi-ui";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import FormWrapper from "src/components/FormWrapper";

const ModalConfirm = ({
  show,
  onClose,
  onSubmit,
  title,
  message,
  successTitle,
  successMessage,
  onCloseSuccess
}) => {
  const [success, setSuccess] = useState(false);

  const { theme } = useTheme();
  const successIconBgColor = getThemeProperty(
    theme,
    "success-icon-background-color"
  );
  const iconCheckmarkColor = getThemeProperty(
    theme,
    "success-icon-checkmark-color"
  );

  const onSubmitForm = async (
    _,
    { resetForm, setFieldError, setSubmitting }
  ) => {
    try {
      await onSubmit();
      resetForm();
      setSuccess(true);
    } catch (e) {
      setFieldError("global", e);
      setSubmitting(false);
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
      style={{ width: "600px" }}
      title={(success && successTitle) || title}
      show={show}
      onClose={success && onCloseSuccess ? onCloseSuccess : onClose}
      iconComponent={
        !success ? (
          <Icon type="info" size={26} />
        ) : (
          <Icon
            type="checkmark"
            iconColor={iconCheckmarkColor}
            backgroundColor={successIconBgColor}
            size={26}
          />
        )
      }>
      {!success && (
        <FormWrapper initialValues={{}} onSubmit={onSubmitForm}>
          {({
            Form,
            Actions,
            ErrorMessage,
            handleSubmit,
            errors,
            isSubmitting
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
      {success && (
        <>
          {successMessage}
          <div className="justify-right margin-top-m">
            <Button
              onClick={onCloseSuccess || onClose}
              data-testid="close-confirm-msg">
              Ok
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

ModalConfirm.propTypes = {
  title: PropTypes.string,
  message: PropTypes.node,
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onCloseSuccess: PropTypes.func,
  onSubmit: PropTypes.func,
  successTitle: PropTypes.string,
  successMessage: PropTypes.node
};

ModalConfirm.defaultProps = {
  title: "Confirm Action",
  message: "Are you sure?"
};

export default React.memo(ModalConfirm);
