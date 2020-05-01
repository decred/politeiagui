import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TextInput, Button } from "pi-ui";
import FormWrapper from "src/components/FormWrapper";
import EmailSentMessage from "src/components/EmailSentMessage";
import { useResetPassword } from "./hooks";
import DevelopmentOnlyContent from "src/components/DevelopmentOnlyContent";

const RequestForm = () => {
  const {
    validationSchema,
    onResetPassword,
    requestResetResponse
  } = useResetPassword();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const success = !!username && !!email;
  return (
    <>
      <FormWrapper
        initialValues={{
          username: "",
          email: ""
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, setFieldError }) => {
          try {
            await onResetPassword(values);
            setSubmitting(false);
            setUsername(values.username);
            setEmail(values.email);
          } catch (e) {
            setSubmitting(false);
            setFieldError("global", e);
          }
        }}>
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
      <DevelopmentOnlyContent
        show={requestResetResponse && requestResetResponse.verificationtoken}>
        <Link
          to={`/user/password/reset?username=${username}&verificationtoken=${
            requestResetResponse && requestResetResponse.verificationtoken
          }`}>
          Reset password
        </Link>
      </DevelopmentOnlyContent>
    </>
  );
};

export default RequestForm;
