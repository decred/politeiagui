import React, { useCallback } from "react";
import { withRouter } from "react-router-dom";
import { TextInput, Button } from "pi-ui";
import FormWrapper from "src/components/FormWrapper";
import { useResetPassword } from "./hooks";

const RequestForm = ({ history }) => {
  const { validationSchema, onResetPassword } = useResetPassword();
  const onSubmit = useCallback(
    async (values, { setSubmitting, setFieldError }) => {
      try {
        const token = await onResetPassword(values);

        setSubmitting(false);
        history.push(
          `/user/reset-password-message?username=${values.username}${
            token && token.verificationtoken
              ? `&verificationtoken=${token.verificationtoken}`
              : ""
          }`
        );
      } catch (e) {
        setSubmitting(false);
        setFieldError("global", e);
      }
    },
    [onResetPassword, history]
  );
  return (
    <>
      <FormWrapper
        initialValues={{
          username: "",
          email: ""
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}>
        {({
          Form,
          Title,
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
            <Title>Reset Password</Title>
            {errors && errors.global && (
              <ErrorMessage>{errors.global.toString()}</ErrorMessage>
            )}
            <TextInput
              label="Username"
              id="username"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.username && errors.username}
            />
            <TextInput
              label="Email"
              id="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && errors.email}
            />
            <Actions>
              <Button loading={isSubmitting} type="submit">
                Reset Password
              </Button>
            </Actions>
          </Form>
        )}
      </FormWrapper>
    </>
  );
};

export default withRouter(RequestForm);
