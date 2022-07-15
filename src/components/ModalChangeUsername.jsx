import {
  Button,
  Modal,
  TextInput,
  Icon,
  useTheme,
  getThemeProperty
} from "pi-ui";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import FormWrapper from "src/components/FormWrapper";
import { isEmpty } from "src/helpers";

const ModalChangeUsername = ({
  show,
  onClose,
  validationSchema,
  onChangeUsername
}) => {
  const [newUsername, setNewUsername] = useState("");
  const success = !!newUsername;
  const onSubmitChangeUsername = async (
    values,
    { resetForm, setSubmitting, setFieldError }
  ) => {
    try {
      await onChangeUsername(values);
      resetForm();
      setSubmitting(false);
      setNewUsername(values.newUsername);
    } catch (e) {
      setSubmitting(false);
      setFieldError("global", e);
    }
  };

  useEffect(() => {
    setNewUsername("");
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
      title={success ? "Username successfully changed" : "Change Username"}
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
            newUsername: "",
            password: ""
          }}
          onSubmit={onSubmitChangeUsername}
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
              values.newUsername && values.password && isEmpty(errors);
            return (
              <Form onSubmit={handleSubmit}>
                {errors && errors.global && (
                  <ErrorMessage>{errors.global.toString()}</ErrorMessage>
                )}
                <TextInput
                  label="New Username"
                  id="newUsername"
                  type="text"
                  autoComplete="username"
                  value={values.newUsername}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.newUsername && errors.newUsername}
                />
                <TextInput
                  label="Password"
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && errors.password}
                />
                <Actions className="no-padding-bottom">
                  <Button
                    loading={isSubmitting}
                    kind={canSubmit ? "primary" : "disabled"}
                    type="submit"
                  >
                    Change Username
                  </Button>
                </Actions>
              </Form>
            );
          }}
        </FormWrapper>
      )}
      {success && (
        <>
          {`Your username was successfully changed! Now your username is "${newUsername}". `}
          <div className="justify-right margin-top-m">
            <Button onClick={onClose}>Ok</Button>
          </div>
        </>
      )}
    </Modal>
  );
};

ModalChangeUsername.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  handleSubmit: PropTypes.func,
  validationSchema: PropTypes.object
};

export default ModalChangeUsername;
