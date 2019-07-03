import { Button, Modal, TextInput } from "pi-ui";
import PropTypes from "prop-types";
import React from "react";
import FormWrapper from "src/componentsv2/FormWrapper";
import { isEmpty } from "src/helpers";

const ModalChangeUsername = ({ show, onClose, validationSchema, onChangeUsername }) => {
  const onSubmitChangeUsername = async (
    values,
    { resetForm, setSubmitting, setFieldError }
  ) => {
    try {
      await onChangeUsername(values);
      resetForm();
      setSubmitting(false);
      window.setTimeout(onClose, 200);
    } catch (e) {
      setSubmitting(false);
      setFieldError("global", e);
    }
  };
  return (
    <Modal title="Change Username" show={show} onClose={onClose}>
      <FormWrapper
        initialValues={{
          newUsername: "",
          password: ""
        }}
        onSubmit={onSubmitChangeUsername}
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
          const canSubmit = values.newUsername && values.password && isEmpty(errors);
          return (
            <Form onSubmit={handleSubmit}>
              {errors && errors.global && (
                <ErrorMessage>{errors.global.toString()}</ErrorMessage>
              )}
              <TextInput
                label="New Username"
                name="newUsername"
                type="text"
                value={values.newUsername}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.newUsername && errors.newUsername}
              />
              <TextInput
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && errors.password}
              />
              <Actions>
                <Button loading={isSubmitting} kind={canSubmit ? "primary" : "disabled"} type="submit">
                  Change Username
                </Button>
              </Actions>
            </Form>
          );
        }}
      </FormWrapper>
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
