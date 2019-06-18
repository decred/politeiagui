import React, { useState } from "react";
import { TextInput, Button } from "pi-ui";
import { Link as RouterLink } from "react-router-dom";
import ModalIdentityWarning from "src/componentsv2/ModalIdentityWarning";
import FormWrapper from "src/componentsv2/FormWrapper";
import EmailSentMessage from "src/componentsv2/EmailSentMessage";
import DevelopmentOnlyContent from "src/componentsv2/DevelopmentOnlyContent";
import { useSignup } from "./hooks";

const SignupForm = () => {
  const dumbFunc = () => null;
  const {
    onSignup,
    initialValues,
    signupResponse,
    validationSchema,
    enableAdminInvite
  } = useSignup();
  const [onModalConfirm, setOnModalConfirm] = useState(() => dumbFunc);
  const [onModalCancel, setOnModalCancel] = useState(() => dumbFunc);
  const [email, setEmail] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // We check that the email has been set to consider the signup as successful
  const signupSuccess = !!email;

  const onConfirm = (
    values,
    { setSubmitting, resetForm, setFieldError }
  ) => async () => {
    setModalOpen(false);
    try {
      await onSignup(values);
      setSubmitting(false);
      setEmail(values.email);
      resetForm();
    } catch (e) {
      setSubmitting(false);
      setFieldError("global", e);
    }
  };

  const onCancel = (_, { setSubmitting }) => () => {
    setSubmitting(false);
    setModalOpen(false);
  };

  return (
    <>
      <ModalIdentityWarning
        show={modalOpen}
        title={"Before you sign up"}
        confirmMessage="I understand, sign me up"
        onClose={onModalCancel}
        onConfirm={onModalConfirm}
      />
      <FormWrapper
        initialValues={initialValues}
        loading={!validationSchema}
        validationSchema={validationSchema}
        onSubmit={async (...args) => {
          setModalOpen(true);
          setOnModalConfirm(() => onConfirm(...args));
          setOnModalCancel(() => onCancel(...args));
        }}
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
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email}
              />
              <TextInput
                label="Username"
                name="username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.username && errors.username}
              />

              <TextInput
                id="password"
                label="Password"
                type="password"
                name="password"
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
                value={values.verify_password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.verify_password && errors.verify_password}
              />
              {enableAdminInvite && (
                <TextInput
                  label="Verification Token"
                  name="verificationtoken"
                  value={values.verificationtoken}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.verificationtoken && errors.verificationtoken}
                />
              )}
              <Actions>
                <Link
                  to="/user/resend-verification-email"
                  className="margin-right-l"
                >
                  Resend verification email
                </Link>
                <Button type="submit" loading={isSubmitting}>
                  Sign up
                </Button>
              </Actions>
              <Footer className="justify-right">
                <span>
                  Already have an account?{" "}
                  <Link className="margin-left-s" to="/user/login">
                    Log in!
                  </Link>
                </span>
              </Footer>
            </Form>
          ) : (
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
          )
        }
      </FormWrapper>
      <DevelopmentOnlyContent
        show={signupResponse && signupResponse.verificationtoken}
      >
        <RouterLink
          to={`/user/verify-email?email=${email}&verificationtoken=${signupResponse &&
            signupResponse.verificationtoken}`}
        >
          Verify email
        </RouterLink>
      </DevelopmentOnlyContent>
    </>
  );
};

export default SignupForm;
