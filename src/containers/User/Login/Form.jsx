import React from "react";
import { TextInput, Button } from "pi-ui";
import FormWrapper from "src/componentsv2/FormWrapper";
import { useLogin } from "./hooks";

const LoginForm = () => {
  const { onLogin, validationSchema } = useLogin();
  return (
    <FormWrapper
      initialValues={{
        email: "",
        password: ""
      }}
      loading={!validationSchema}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm, setSubmitting, setFieldError }) => {
        try {
          await onLogin(values);
          setSubmitting(false);
          resetForm();
        } catch (e) {
          setSubmitting(false);
          setFieldError("global", e);
        }
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
            label="Email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && errors.email}
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
          <Actions>
            <Link to="/user/request-reset-password" className="margin-right-l">
              Reset Password
            </Link>
            <Button loading={isSubmitting} kind="primary" type="submit">
              Login
            </Button>
          </Actions>
          <Footer>
            <Link to="/user/privacy-policy" gray>
              Privacy Policy
            </Link>
            <div>
              Don't have an account? <Link to="/user/signup">Create here!</Link>
            </div>
          </Footer>
        </Form>
      )}
    </FormWrapper>
  );
};

export default LoginForm;
