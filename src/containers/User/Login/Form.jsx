import { Button, Link as UILink, Text, TextInput, classNames } from "pi-ui";
import PropTypes from "prop-types";
import React, { useCallback, useState } from "react";
import { withRouter } from "react-router-dom";
import FormWrapper from "src/components/FormWrapper";
import ModalPrivacyPolicy from "src/components/ModalPrivacyPolicy";
import styles from "./LoginForm.module.css";
import { useLogin } from "./hooks";
import useModalContext from "src/hooks/utils/useModalContext";
import { useConfig } from "src/containers/Config";
import VerifyTotp from "../Totp/Verify";
import { TOTP_MISSING_LOGIN_ERROR } from "src/constants";

const LoginForm = ({
  hideTitle,
  onLoggedIn,
  redirectToPrivacyPolicyRoute,
  history,
  emailId,
  passwordId,
  renderPrivacyPolicyModal
}) => {
  const { onLogin, validationSchema } = useLogin();
  const { enableAdminInvite } = useConfig();
  const [showTotp, setShowTotp] = useState(false);
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
        if (e.errorcode === TOTP_MISSING_LOGIN_ERROR) {
          setShowTotp(true);
        }
      }
    },
    [onLogin, onLoggedIn]
  );

  const [handleOpenModal, handleCloseModal] = useModalContext();

  const handleOpenPrivacyPolicyModal = () => {
    handleOpenModal(ModalPrivacyPolicy, {
      onClose: handleCloseModal
    });
  };

  function handleOnPrivacyPolicyClick() {
    if (redirectToPrivacyPolicyRoute) {
      history.push("/user/privacy-policy");
    } else if (renderPrivacyPolicyModal) {
      handleOpenPrivacyPolicyModal();
    }
  }

  return (
    <FormWrapper
      initialValues={{
        email: "",
        password: "",
        code: null
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
        touched,
        setFieldValue
      }) => {
        const handleChangeTotp = (code) => {
          setFieldValue("code", code);
        };
        return (
          <Form onSubmit={handleSubmit}>
            {!hideTitle && <Title>Log in</Title>}
            {errors && errors.global && (
              <ErrorMessage>{errors.global.toString()}</ErrorMessage>
            )}
            <TextInput
              id={emailId}
              label="Email"
              name="email"
              tabIndex={1}
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
              tabIndex={2}
              autoComplete="current-password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && errors.password}
            />
            <VerifyTotp
              className={classNames(styles.totp, !showTotp && styles.hide)}
              onType={handleChangeTotp}
              inputClassName={styles.totpInput}
              extended={false}
              tabIndex={3}
              title="Authenticator Code"
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
              {!enableAdminInvite && (
                <Text className={styles.createAccounTxt}>
                  Don't have an account?{" "}
                  <Link to="/user/signup">Create here!</Link>
                </Text>
              )}
            </Footer>
          </Form>
        );
      }}
    </FormWrapper>
  );
};

LoginForm.propTypes = {
  hideTitle: PropTypes.bool,
  onLoggedIn: PropTypes.func,
  emailId: PropTypes.string,
  passwordId: PropTypes.string,
  renderPrivacyPolicyModal: PropTypes.bool
};

LoginForm.defaultProps = {
  emailId: "loginemail",
  passwordId: "loginpassword",
  renderPrivacyPolicyModal: true
};

export default withRouter(LoginForm);
