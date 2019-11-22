import React, { useState, useEffect } from "react";
import {
  P,
  Button,
  Modal,
  TextInput,
  Icon,
  useTheme,
  getThemeProperty
} from "pi-ui";
import PropTypes from "prop-types";
import FormWrapper from "src/componentsv2/FormWrapper";
import * as Yup from "yup";

const ModalConfirmWithReason = ({
  show,
  onClose,
  onSubmit,
  subject,
  title,
  reasonLabel,
  successMessage,
  successTitle
}) => {
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmitReason = async (values, { resetForm, setFieldError }) => {
    setSubmitting(true);
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

  const [theme] = useTheme();
  const colorGray = theme ? getThemeProperty(theme, "color-gray") : "";
  const colorPrimaryDark = theme ? getThemeProperty(theme, "color-primary-dark") : "";

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
