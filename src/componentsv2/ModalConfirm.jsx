import { Button, getThemeProperty, Icon, Modal, Text, ThemeContext } from "pi-ui";
import PropTypes from "prop-types";
import React, { useEffect, useState, useContext } from "react";
import FormWrapper from "src/componentsv2/FormWrapper";

const ModalConfirm = ({
  show,
  onClose,
  onSubmit,
  title,
  message,
  successTitle,
  successMessage
}) => {
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmitForm = async (_, { resetForm, setFieldError }) => {
    setSubmitting(true);
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

  const { currentTheme } = useContext(ThemeContext);
  const colorGray = getThemeProperty(currentTheme, "color-gray");
  const colorPrimaryDark = getThemeProperty(currentTheme, "color-primary-dark");

  return (
    <Modal
      style={{ width: "600px" }}
      disableClose={isSubmitting}
      title={(success && successTitle) || title}
      show={show}
      onClose={onClose}
      iconComponent={
        !success ? (
          <Icon type={"info"} size={26} />
        ) : (
          <Icon
            type={"checkmark"}
            size={26}
            iconColor={colorPrimaryDark}
            backgroundColor={colorGray}
          />
        )
      }
    >
      {!success && (
        <FormWrapper initialValues={{}} onSubmit={onSubmitForm}>
          {({ Form, Actions, ErrorMessage, handleSubmit, errors }) => (
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
            <Button onClick={onClose}>Ok</Button>
          </div>
        </>
      )}
    </Modal>
  );
};

ModalConfirm.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  successTitle: PropTypes.string,
  successMessage: PropTypes.node
};

ModalConfirm.defaultProps = {
  title: "Confirm Action",
  message: "Are you sure?"
};

export default React.memo(ModalConfirm);
