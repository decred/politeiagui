import { Button, Text, TextInput, H2, P } from "pi-ui";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import DevelopmentOnlyContent from "src/components/DevelopmentOnlyContent";
import EmailSentMessage from "src/components/EmailSentMessage";
import FormWrapper from "src/components/FormWrapper";
import { useSignup } from "./hooks";
import useIdentityWarningModal from "../hooks/useIdentityWarningModal";

const SignupForm = () => {
  const {
    onSignup,
    initialValues,
    signupResponse,
    validationSchema,
    enableAdminInvite,
    isCms
  } = useSignup();

  const { handleSubmitAction, email, username } = useIdentityWarningModal({
    asyncSubmit: onSignup,
    isCms: isCms
  });

  const signupSuccess = !!email;

  return (
    <>
      <FormWrapper
        initialValues={initialValues}
        loading={!validationSchema}
        validationSchema={validationSchema}
        onSubmit={handleSubmitAction}
      >
        {({
          Form,
          Title,
          Actions,
          Footer,
          Link,
          ErrorMessage,
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          errors,
          touched,
          isSubmitting
        }) =>
          !signupSuccess ? (
            <Form onSubmit={handleSubmit}>
              <Title>Create a new account</Title>
              {errors && errors.global && (
                <ErrorMessage>{errors.global.toString()}</ErrorMessage>
              )}
              <TextInput
                label="Email"
                id="signupemail"
                name="email"
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email}
              />
              <TextInput
                label="Username"
                id="username"
                name="username"
                autoComplete="username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.username && errors.username}
              />

              <TextInput
                id="signuppassword"
                label="Password"
                type="password"
                name="password"
                autoComplete="new-password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && errors.password}
              />
              <TextInput
                id="verify_password"
                label="Verify Password"
                type="password"
                name="verify_password"
                autoComplete="new-password"
                value={values.verify_password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.verify_password && errors.verify_password}
              />
              {enableAdminInvite && (
                <TextInput
                  label="Verification Token"
                  id="verificationtoken"
                  name="verificationtoken"
                  value={values.verificationtoken}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.verificationtoken && errors.verificationtoken}
                />
              )}
              <Actions>
                <Link to="/user/resend-verification-email">
                  Resend verification email
                </Link>
                <Button type="submit" loading={isSubmitting}>
                  Sign up
                </Button>
              </Actions>
              <Footer className="justify-right">
                <Text>
                  Already have an account? <Link to="/user/login">Log in!</Link>
                </Text>
              </Footer>
            </Form>
          ) : !enableAdminInvite ? (
            <EmailSentMessage
              title="Please check your inbox to verify your registration"
              email={email}
              bulletPoints={[
                "The verification link needs to be opened with the same browser that you used to sign up.",
                <>
                  Make sure you don’t already have an account on Politeia with
                  this email address. If you do, you should{" "}
                  <Link to="/user/request-reset-password">
                    reset your password
                  </Link>{" "}
                  instead.
                </>
              ]}
            />
          ) : (
            <>
              <H2>Account created successfully</H2>
              <P style={{ marginTop: "2rem" }}>
                You may <Link to="/user/login">login</Link> to your account now.
              </P>
            </>
          )
        }
      </FormWrapper>
      <DevelopmentOnlyContent
        show={signupResponse && signupResponse.verificationtoken}
      >
        <RouterLink
          to={`/user/verify?email=${email}&verificationtoken=${
            signupResponse && signupResponse.verificationtoken
          }&username=${username}
          `}
        >
          Verify email
        </RouterLink>
      </DevelopmentOnlyContent>
    </>
  );
};

export default SignupForm;
