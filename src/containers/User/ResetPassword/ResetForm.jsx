import { Button, H2, P, TextInput } from "pi-ui";
import React, { useState } from "react";
import FormWrapper from "src/components/FormWrapper";
import { useVerifyResetPassword } from "./hooks";

const SuccessContent = () => (
  <>
    <H2>Password reset completed</H2>
    <P style={{ marginTop: "2rem", marginBottom: 0 }}>
      Your password has been changed. You can now login with your new password.
    </P>
  </>
);

const ResetForm = () => {
  const [success, setSuccess] = useState(false);
  const {
    onVerifyResetPassword,
    validationSchema,
    initialValues,
    invalidParamsError
  } = useVerifyResetPassword();

  if (invalidParamsError) {
    throw invalidParamsError;
  }

  async function onSubmit(values, { setSubmitting, setFieldError, resetForm }) {
    try {
      await onVerifyResetPassword(values);
      setSubmitting(false);
      setSuccess(true);
      resetForm();
    } catch (e) {
      setSubmitting(false);
      setFieldError("global", e);
    }
  }

  return (
    <FormWrapper
      initialValues={initialValues}
      validationSchema={validationSchema}
      loading={!validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
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
      }) =>
        !success ? (
          <Form onSubmit={handleSubmit}>
            <Title>Reset Password</Title>
            {errors && errors.global && (
              <ErrorMessage>{errors.global.toString()}</ErrorMessage>
            )}
            <TextInput
              id="newpassword"
              label="Password"
              type="password"
              autoComplete="current-password"
              value={values.newpassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.newpassword && errors.newpassword}
            />
            <TextInput
              id="verify_password"
              label="Confirm Password"
              type="password"
              autoComplete="current-password"
              value={values.verify_password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.verify_password && errors.verify_password}
            />
            <Actions>
              <Button loading={isSubmitting} type="submit">
                Reset Password
              </Button>
            </Actions>
          </Form>
        ) : (
          <SuccessContent />
        )
      }
    </FormWrapper>
  );
};

export default ResetForm;
