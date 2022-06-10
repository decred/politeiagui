import React, { useState, useMemo } from "react";
import {
  Modal,
  Button,
  TextInput,
  Icon,
  useTheme,
  getThemeProperty
} from "pi-ui";
import PropTypes from "prop-types";
import { validationSchema } from "./validation";
import FormWrapper from "src/components/FormWrapper";
import SelectField from "src/components/Select/SelectField";
import { getProposalBillingStatusOptionsForSelect } from "./helpers";
import { PROPOSAL_BILLING_STATUS_CLOSED } from "src/constants";
import styles from "./ModalSetBillingStatus.module.css";
import { useCrash, useModalContext } from "src/hooks";
import { isIdentityError } from "src/utils";

const StatusesExplanation = () => (
  <div>
    <div className="margin-y-m">
      <span className={styles.status}>Active</span> - the proposal is actively
      being billed against.
    </div>
    <div className="margin-y-m">
      <span className={styles.status}>Completed</span> - the deliverables have
      been completed and the proposal is no longer being billed against or the
      budget has been exausted and the proposal owner must request additional
      funds.
    </div>
    <div className="margin-y-m">
      <span className={styles.status}>Closed</span> - the proposal owner failed
      to deliver a finished work product and the ability to bill against the
      proposal is being closed.
    </div>
  </div>
);

const ModalSetBillingStatus = ({
  onClose,
  onSubmit,
  title,
  show,
  successMessage,
  successTitle
}) => {
  const [success, setSuccess] = useState(false);
  const [, handleCloseModal] = useModalContext();
  const crash = useCrash();

  const billingStatusOptions = useMemo(
    () => getProposalBillingStatusOptionsForSelect(),
    []
  );

  const initialValues = {
    billingStatus: null,
    reason: ""
  };

  const onSubmitSetBillingStatus = async (
    values,
    { resetForm, setFieldError, setSubmitting }
  ) => {
    try {
      await onSubmit(values);
      resetForm();
      setSuccess(true);
    } catch (e) {
      setSubmitting(false);
      setFieldError("global", e);
      if (isIdentityError(e)) {
        crash(e);
        handleCloseModal();
      }
    }
  };

  const { theme } = useTheme();
  const successIconBgColor = getThemeProperty(
    theme,
    "success-icon-background-color"
  );
  const iconCheckmarkColor = getThemeProperty(
    theme,
    "success-icon-checkmark-color"
  );

  return (
    <Modal
      style={{ width: "600px" }}
      title={success ? successTitle : title}
      show={show}
      onClose={onClose}
      iconComponent={
        !success ? (
          <Icon type="info" size={26} />
        ) : (
          <Icon
            type="checkmark"
            iconColor={iconCheckmarkColor}
            backgroundColor={successIconBgColor}
            size={26}
          />
        )
      }
    >
      {!success ? (
        <FormWrapper
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmitSetBillingStatus}
        >
          {({
            Form,
            Actions,
            ErrorMessage,
            values,
            isValid,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            setFieldTouched,
            errors,
            isSubmitting,
            touched
          }) => {
            const handleSelectFiledChange = (fieldName) => (option) => {
              setFieldTouched(fieldName, true);
              setFieldValue(fieldName, option.value);
            };

            const { billingStatus } = values;
            const isBillingStatusClosed =
              billingStatus === PROPOSAL_BILLING_STATUS_CLOSED;

            return (
              <Form onSubmit={handleSubmit}>
                {errors && errors.global && (
                  <ErrorMessage>{errors.global.toString()}</ErrorMessage>
                )}
                <SelectField
                  name="billingStatus"
                  placeholder="Billing Status"
                  className={styles.statusSelectWrapper}
                  onChange={handleSelectFiledChange("billingStatus")}
                  options={billingStatusOptions}
                  id="select-billing-status"
                />
                {isBillingStatusClosed && (
                  <TextInput
                    name="reason"
                    id="billing-status-reason"
                    label="Reason"
                    type="text"
                    value={values.reason}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.reason && errors.reason}
                  />
                )}
                <StatusesExplanation />
                <Actions className="no-padding-bottom">
                  <Button
                    data-testid="set-billing-status"
                    loading={isSubmitting}
                    kind={isValid ? "primary" : "disabled"}
                    type="submit"
                  >
                    Set Billing Status
                  </Button>
                </Actions>
              </Form>
            );
          }}
        </FormWrapper>
      ) : (
        <>
          {successMessage}
          <div className="justify-right margin-top-m">
            <Button onClick={onClose}>Ok</Button>
          </div>
        </>
      )}
    </Modal>
  );
};

ModalSetBillingStatus.propTypes = {
  title: PropTypes.string,
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  successTitle: PropTypes.string,
  successMessage: PropTypes.node
};

ModalSetBillingStatus.defaultProps = {
  title: "Set Billing Status"
};

export default ModalSetBillingStatus;
