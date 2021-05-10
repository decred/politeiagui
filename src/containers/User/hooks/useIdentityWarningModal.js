import { useState } from "react";
import useModelContext from "src/hooks/utils/useModalContext";
import ModalIdentityWarning from "src/components/ModalIdentityWarning";

export default function useIdentityWarningModal({ asyncSubmit, isCms }) {
  const [handleOpenModal, handleCloseModal] = useModelContext();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const onConfirm =
    (values, { setSubmitting, resetForm, setFieldError }) =>
    async () => {
      handleCloseModal();
      try {
        await asyncSubmit(values);
        setSubmitting(false);
        setEmail(values.email);
        setUsername(values.username);
        resetForm();
      } catch (e) {
        setSubmitting(false);
        setFieldError("global", e);
      }
    };

  const onCancel =
    (_, { setSubmitting }) =>
    () => {
      setSubmitting(false);
      handleCloseModal();
    };

  const onSubmit = (...args) => {
    handleOpenModal(ModalIdentityWarning, {
      title: "Before you sign up",
      confirmMessage: "I understand, sign me up",
      onClose: onCancel(...args),
      onConfirm: onConfirm(...args),
      isCms
    });
  };

  return {
    handleSubmitAction: onSubmit,
    email,
    username
  };
}
