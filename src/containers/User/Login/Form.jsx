import { Button, Link as UILink, Text, TextInput, classNames } from "pi-ui";
import PropTypes from "prop-types";
import React, { useCallback, useState } from "react";
import { withRouter } from "react-router-dom";
import FormWrapper from "src/components/FormWrapper";
import ModalPrivacyPolicy from "src/components/ModalPrivacyPolicy";
import styles from "./LoginForm.module.css";
import { useLogin } from "./hooks";

const LoginForm = ({
  hideTitle,
  onLoggedIn,
  redirectToPrivacyPolicyRoute,
  history,
  emailId,
  passwordId
}) => {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const { onLogin, validationSchema } = useLogin();

  const onSubmit = useCallback(
    async (values, { resetForm, setSubmitting, setFieldError }) => {
      try {
        await onLogin(values);
        setSubmitting(false);
        resetForm();
        onLoggedIn && onLoggedIn();
      } catch (e) {
        setSubmitting(false);
        setFieldError("global", e);
      }
    },
    [onLogin, onLoggedIn]
  );

  function handleOnPrivacyPolicyClick() {
    if (redirectToPrivacyPolicyRoute) {
      history.push("/user/privacy-policy");
    } else {
      setShowPrivacyPolicy(true);
    }
  }

  return (
    <>
      <FormWrapper
        initialValues={{
          email: "",
          password: ""
        }}
        loading={!validationSchema}
        validationSchema={validationSchema}
        onSubmit={onSubmit}>
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
            {!hideTitle && <Title>Log in</Title>}
            {errors && errors.global && (
              <ErrorMessage>{errors.global.toString()}</ErrorMessage>
            )}
            <TextInput
              id={emailId}
              label="Email"
              name="email"
              autoComplete="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && errors.email}
            />
            <TextInput
              id={passwordId}
              label="Password"
              type="password"
              name="password"
              autoComplete="current-password"
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
                onClick={handleOnPrivacyPolicyClick}
                customComponent={({ className, ...props }) => (
                  <Text
                    className={classNames(className, styles.privacyPolicyTxt)}
                    {...props}>
                    {" "}
                    Privacy Policy
                  </Text>
                )}
              />
              <Text className={styles.createAccounTxt}>
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

LoginForm.propTypes = {
  hideTitle: PropTypes.bool,
  onLoggedIn: PropTypes.func,
  emailId: PropTypes.string,
  passwordId: PropTypes.string
};

LoginForm.defaultProps = {
  emailId: "loginemail",
  passwordId: "loginpassword"
};

export default withRouter(LoginForm);
