import { Button, Modal, TextInput } from "pi-ui";
import PropTypes from "prop-types";
import React from "react";
import FormWrapper from "src/componentsv2/FormWrapper";
import { isEmpty } from "src/helpers";

const ModalChangePassword = ({ show, onClose, validationSchema, onChangePassword }) => {
  const onSubmitChangePassword = async (
    values,
    { resetForm, setSubmitting, setFieldError }
  ) => {
    try {
      await onChangePassword(values);
      resetForm();
      onClose();
      setSubmitting(false);
    } catch (e) {
      setSubmitting(false);
      setFieldError("global", e);
    }
  };
  return (
    <Modal title="Change Password" show={show} onClose={onClose}>
      <FormWrapper
        initialValues={{
          existingPassword: "",
          newPassword: "",
          newPasswordVerify: ""
        }}
        onSubmit={onSubmitChangePassword}
        loading={!validationSchema}
        validationSchema={validationSchema}>
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
          const canSubmit = values.existingPassword && values.newPassword && values.newPasswordVerify && isEmpty(errors);
          return (
            <Form onSubmit={handleSubmit}>
              {errors && errors.global && (
                <ErrorMessage>{errors.global.toString()}</ErrorMessage>
              )}
              <TextInput
                label="Current Password"
                name="existingPassword"
                type="password"
                value={values.existingPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.existingPassword && errors.existingPassword}
              />
              <TextInput
                label="New Password"
                name="newPassword"
                type="password"
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.newPassword && errors.newPassword}
              />
              <TextInput
                label="Verify Password"
                name="newPasswordVerify"
                type="password"
                value={values.newPasswordVerify}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.newPasswordVerify && errors.newPasswordVerify}
              />
              <Actions>
                <Button loading={isSubmitting} kind={canSubmit ? "primary" : "disabled"} type="submit">
                  Change Password
              </Button>
              </Actions>
            </Form>
          );
        }}
      </FormWrapper>
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
