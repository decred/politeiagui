import React, { useState, useEffect, useMemo } from "react";
import { P, Button, Modal, TextInput, Icon } from "pi-ui";
import PropTypes from "prop-types";
import CheckboxField from "src/components/CheckboxField";
import FormWrapper from "src/components/FormWrapper";
import * as Yup from "yup";
import { useInviteContractor } from "./hooks";

const ModalInviteContractor = ({ show, onClose }) => {
  const [success, setSuccess] = useState(false);
  const { onInviteContractor } = useInviteContractor();

  const onInvite = async (
    values,
    { resetForm, setFieldError, setSubmitting }
  ) => {
    try {
      await onInviteContractor(values);
      resetForm();
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
            email: "",
            isTemp: false
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email("Invalid email").required("Required"),
            isTemp: Yup.boolean()
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
            isSubmitting,
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
              <CheckboxField name="isTemp" label="Temporary Invite" />
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
