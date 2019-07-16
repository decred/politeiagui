import { Button, Link as UILink, Text, TextInput } from "pi-ui";
import React, { useState } from "react";
import FormWrapper from "src/componentsv2/FormWrapper";
import ModalPrivacyPolicy from "src/componentsv2/ModalPrivacyPolicy";
import { useLogin } from "./hooks";

const LoginForm = () => {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const { onLogin, validationSchema } = useLogin();

  async function onSubmit(values, { resetForm, setSubmitting, setFieldError }) {
    try {
      await onLogin(values);
      setSubmitting(false);
      resetForm();
    } catch (e) {
      setSubmitting(false);
      setFieldError("global", e);
    }
  }

  return (
    <>
      <FormWrapper
        initialValues={{
          username: "",
          password: ""
        }}
        loading={!validationSchema}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
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
          isSubmitting,
          errors,
          touched
        }) => (
          <Form onSubmit={handleSubmit}>
            <Title>Log in</Title>
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
              id="password"
              label="Password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && errors.password}
            />
            <Actions>
              <Link to="/user/request-reset-password">Reset Password</Link>
              <Button loading={isSubmitting} kind="primary" type="submit">
                Login
              </Button>
            </Actions>
            <Footer>
              <UILink
                gray
                onClick={() => setShowPrivacyPolicy(true)}
                customComponent={props => (
                  <Text style={{ cursor: "pointer" }} {...props}>
                    {" "}
                    Privacy Policy
                  </Text>
                )}
              />
              <Text>
                Don't have an account?{" "}
                <Link to="/user/signup">Create here!</Link>
              </Text>
            </Footer>
          </Form>
        )}
      </FormWrapper>
      <ModalPrivacyPolicy
        show={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
      />
    </>
  );
};

export default LoginForm;
