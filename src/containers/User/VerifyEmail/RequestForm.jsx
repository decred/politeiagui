import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TextInput, Button } from "pi-ui";
import FormWrapper from "src/componentsv2/FormWrapper";
import EmailSentMessage from "src/componentsv2/EmailSentMessage";
import ModalIdentityWarning from "src/componentsv2/ModalIdentityWarning";
import { useRequestResendVerificationEmail } from "./hooks";
import DevelopmentOnlyContent from "src/componentsv2/DevelopmentOnlyContent";

const RequestVerificationEmailForm = () => {
  const {
    validationSchema,
    onResendVerificationEmail,
    resendVerificationEmailResponse: response
  } = useRequestResendVerificationEmail();
  const [onModalConfirm, setOnModalConfirm] = useState(() => () => null);
  const [onModalCancel, setOnModalCancel] = useState(() => () => null);
  const [email, setEmail] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const success = !!email;

  const onConfirm = (
    values,
    { setSubmitting, resetForm, setFieldError }
  ) => async () => {
    setModalOpen(false);
    try {
      await onResendVerificationEmail(values);
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
        title={"Before you continue"}
        confirmMessage="I understand, continue"
        onClose={onModalCancel}
        onConfirm={onModalConfirm}
      />
      <FormWrapper
        initialValues={{
          email: ""
        }}
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
                name="email"
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
            <EmailSentMessage title="Please check your inbox for your verification email" />
          )
        }
      </FormWrapper>
      <DevelopmentOnlyContent show={response && response.verificationtoken}>
        <Link
          to={`/user/verify-email?email=${email}&verificationtoken=${response &&
            response.verificationtoken}`}
        >
          Verify email
        </Link>
      </DevelopmentOnlyContent>
    </>
  );
};

export default RequestVerificationEmailForm;
