import React, { useState, useEffect, useMemo } from "react";
import { P, Button, Modal, TextInput, Icon } from "pi-ui";
import PropTypes from "prop-types";
import FormWrapper from "src/componentsv2/FormWrapper";
import * as Yup from "yup";
import { useInviteContractor } from "./hooks";

const ModalInviteContractor = ({ show, onClose }) => {
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const { onInviteContractor } = useInviteContractor();

  const onInvite = async (values, { resetForm, setFieldError }) => {
    setSubmitting(true);
    try {
      await onInviteContractor(values.email);
      resetForm();
      setSubmitting(false);
      setSuccess(true);
    } catch (e) {
      setSubmitting(false);
      setFieldError("global", e);
    }
  };
  useEffect(() => {
    if (!show) {
      setTimeout(() => setSuccess(false), 500);
    }
  }, [show]);

  const icon = useMemo(
    () =>
      !success ? (
        <Icon type={"mail"} size={26} />
      ) : (
        <Icon type={"mailCheck"} size={26} />
      ),
    [success]
  );

  return (
    <Modal
      style={{ width: "600px" }}
      disableClose={isSubmitting}
      title={success ? "Invite sent!" : "Invite Contractor"}
      show={show}
      onClose={onClose}
      iconComponent={icon}
    >
      {!success && (
        <P style={{ marginBottom: "20px" }}>
          Please, provide the email to where to send the invitation
        </P>
      )}
      {!success && (
        <FormWrapper
          initialValues={{
            reason: ""
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email("Invalid email")
              .required("Required")
          })}
          onSubmit={onInvite}
        >
          {({
            Form,
            Actions,
            ErrorMessage,
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            errors,
            touched
          }) => (
            <Form onSubmit={handleSubmit}>
              {errors && errors.global && (
                <ErrorMessage>{errors.global.toString()}</ErrorMessage>
              )}
              <TextInput
                label={"Email"}
                name="email"
                id={"email"}
                type="text"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email}
              />
              <Actions className="no-padding-bottom">
                <Button loading={isSubmitting} type="submit">
                  Invite
                </Button>
              </Actions>
            </Form>
          )}
        </FormWrapper>
      )}
      {success && (
        <>
          The invitation was sent to the provided email.
          <div className="justify-right margin-top-m">
            <Button onClick={onClose}>Ok</Button>
          </div>
        </>
      )}
    </Modal>
  );
};

ModalInviteContractor.propType = {
  show: PropTypes.bool,
  onClose: PropTypes.func
};

export default React.memo(ModalInviteContractor);
