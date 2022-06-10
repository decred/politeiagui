import React, { useState, useCallback } from "react";
import { Button, TextInput } from "pi-ui";
import { Link } from "react-router-dom";
import DevelopmentOnlyContent from "src/components/DevelopmentOnlyContent";
import EmailSentMessage from "src/components/EmailSentMessage";
import FormWrapper from "src/components/FormWrapper";
import { useRequestResendVerificationEmail } from "./hooks";

const RequestVerificationEmailForm = () => {
  const { validationSchema, onResendVerificationEmail } =
    useRequestResendVerificationEmail();

  const [email, setEmail] = useState();
  const [devToken, setDevToken] = useState();

  const handleSubmitAction = useCallback(
    async (values, { setSubmitting, resetForm, setFieldError }) => {
      try {
        const response = await onResendVerificationEmail(values);
        setSubmitting(false);
        setEmail(values.email);
        setDevToken(response && response.verificationtoken);
        resetForm();
      } catch (error) {
        setFieldError("global", error);
      }
    },
    [setEmail, onResendVerificationEmail]
  );

  const success = !!email;

  return (
    <>
      <FormWrapper
        initialValues={{
          username: "",
          email: ""
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmitAction}
      >
        {({
          Form,
          Title,
          Actions,
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          errors,
          touched
        }) =>
          !success ? (
            <Form onSubmit={handleSubmit}>
              <Title>Resend Verification Email</Title>
              <TextInput
                label="Username"
                id="username"
                autoComplete="username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.username && errors.username}
              />
              <TextInput
                label="Email"
                id="email"
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email}
              />
              <Actions>
                <Button type="submit">Resend</Button>
              </Actions>
            </Form>
          ) : (
            <EmailSentMessage
              title="Please check your inbox for your verification email"
              email={email}
            />
          )
        }
      </FormWrapper>
      <DevelopmentOnlyContent show={devToken}>
        <Link to={`/user/verify?email=${email}&verificationtoken=${devToken}`}>
          Verify email
        </Link>
      </DevelopmentOnlyContent>
    </>
  );
};

export default RequestVerificationEmailForm;
