import {
  Button,
  Modal,
  TextInput,
  Icon,
  getThemeProperty,
  useTheme
} from "pi-ui";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import FormWrapper from "src/components/FormWrapper";
import HiddenUsernameField from "src/components/HiddenUsernameField";
import { isEmpty } from "src/helpers";

const ModalChangePassword = ({
  show,
  onClose,
  validationSchema,
  onChangePassword
}) => {
  const [success, setSuccess] = useState(false);
  const onSubmitChangePassword = async (
    values,
    { resetForm, setSubmitting, setFieldError }
  ) => {
    try {
      await onChangePassword(values);
      resetForm();
      setSubmitting(false);
      setSuccess(true);
    } catch (e) {
      setSubmitting(false);
      setFieldError("global", e);
    }
  };

  useEffect(() => {
    setSuccess(false);
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
      title={success ? "Password successfully changed" : "Change Password"}
      iconComponent={
        success && (
          <Icon
            type={"checkmark"}
            size={26}
            iconColor={iconCheckmarkColor}
            backgroundColor={successIconBgColor}
          />
        )
      }
      show={show}
      onClose={onClose}
    >
      {!success && (
        <FormWrapper
          initialValues={{
            existingPassword: "",
            newPassword: "",
            newPasswordVerify: ""
          }}
          onSubmit={onSubmitChangePassword}
          loading={!validationSchema}
          validationSchema={validationSchema}
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
          }) => {
            const canSubmit =
              values.existingPassword &&
              values.newPassword &&
              values.newPasswordVerify &&
              isEmpty(errors);
            return (
              <Form onSubmit={handleSubmit}>
                {errors && errors.global && (
                  <ErrorMessage>{errors.global.toString()}</ErrorMessage>
                )}
                <HiddenUsernameField />
                <TextInput
                  label="Current Password"
                  id="existingPassword"
                  type="password"
                  autoComplete="current-password"
                  value={values.existingPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.existingPassword && errors.existingPassword}
                />
                <TextInput
                  label="New Password"
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  value={values.newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.newPassword && errors.newPassword}
                />
                <TextInput
                  label="Verify Password"
                  id="newPasswordVerify"
                  type="password"
                  autoComplete="new-password"
                  value={values.newPasswordVerify}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.newPasswordVerify && errors.newPasswordVerify}
                />
                <Actions className="no-padding-bottom">
                  <Button
                    loading={isSubmitting}
                    kind={canSubmit ? "primary" : "disabled"}
                    type="submit"
                  >
                    Change Password
                  </Button>
                </Actions>
              </Form>
            );
          }}
        </FormWrapper>
      )}
      {success && (
        <>
          {"Your password was successfully changed!"}
          <div className="justify-right margin-top-m">
            <Button onClick={onClose}>Ok</Button>
          </div>
        </>
      )}
    </Modal>
  );
};

ModalChangePassword.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onChangePassword: PropTypes.func,
  validationSchema: PropTypes.object
};

export default ModalChangePassword;
