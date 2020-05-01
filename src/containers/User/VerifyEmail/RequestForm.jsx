import { Button, TextInput } from "pi-ui";
import React from "react";
import { Link } from "react-router-dom";
import DevelopmentOnlyContent from "src/components/DevelopmentOnlyContent";
import EmailSentMessage from "src/components/EmailSentMessage";
import FormWrapper from "src/components/FormWrapper";
import { useRequestResendVerificationEmail } from "./hooks";
import useIdentityWarningModal from "../hooks/useIdentityWarningModal";

const RequestVerificationEmailForm = () => {
  const {
    validationSchema,
    onResendVerificationEmail,
    currentUserResendVerificationToken: response
  } = useRequestResendVerificationEmail();

  const { handleSubmitAction, email } = useIdentityWarningModal({
    asyncSubmit: onResendVerificationEmail
  });

  const success = !!email;

  return (
    <>
      <FormWrapper
        initialValues={{
          email: ""
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmitAction}>
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
      <DevelopmentOnlyContent show={response && response.verificationtoken}>
        <Link
          to={`/user/verify?email=${email}&verificationtoken=${
            response && response.verificationtoken
          }`}>
          Verify email
        </Link>
      </DevelopmentOnlyContent>
    </>
  );
};

export default RequestVerificationEmailForm;
