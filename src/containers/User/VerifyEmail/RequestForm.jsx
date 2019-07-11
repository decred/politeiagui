import { Button, TextInput } from "pi-ui";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import DevelopmentOnlyContent from "src/componentsv2/DevelopmentOnlyContent";
import EmailSentMessage from "src/componentsv2/EmailSentMessage";
import FormWrapper from "src/componentsv2/FormWrapper";
import ModalIdentityWarning from "src/componentsv2/ModalIdentityWarning";
import { useRequestResendVerificationEmail } from "./hooks";

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

  async function onSubmit(...args) {
    setModalOpen(true);
    setOnModalConfirm(() => onConfirm(...args));
    setOnModalCancel(() => onCancel(...args));
  }

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
        onSubmit={onSubmit}
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
                id="email"
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
