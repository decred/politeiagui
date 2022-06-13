import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { TextInput, Button } from "pi-ui";
import FormWrapper from "src/components/FormWrapper";
import EmailSentMessage from "src/components/EmailSentMessage";
import { useResetPassword } from "./hooks";
import DevelopmentOnlyContent from "src/components/DevelopmentOnlyContent";

const RequestForm = () => {
  const { validationSchema, onResetPassword } = useResetPassword();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [verificationToken, setVerificationToken] = useState();
  const success = !!username && !!email;
  const onSubmit = useCallback(
    async (values, { setSubmitting, setFieldError }) => {
      try {
        const response = await onResetPassword(values);
        setSubmitting(false);
        setUsername(values.username);
        setEmail(values.email);
        setVerificationToken(response.verificationtoken);
      } catch (e) {
        setSubmitting(false);
        setFieldError("global", e);
      }
    },
    [onResetPassword]
  );
  return (
    <>
      <FormWrapper
        initialValues={{
          username: "",
          email: ""
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
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
          ) : (
            <EmailSentMessage
              email={email}
              title={"Please check your mailbox to reset your password"}
            />
          )
        }
      </FormWrapper>
      <DevelopmentOnlyContent show={verificationToken}>
        <Link
          to={`/user/password/reset?username=${username}&verificationtoken=${verificationToken}`}
        >
          Reset password
        </Link>
      </DevelopmentOnlyContent>
    </>
  );
};

export default RequestForm;
