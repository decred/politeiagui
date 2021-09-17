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

const ModalSetBillingStatus = ({
  onClose,
  onSubmit,
  title,
  show,
  successMessage,
  successTitle
}) => {
  const [success, setSuccess] = useState(false);
  const typeOptions = useMemo(
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
      }>
      {!success ? (
        <FormWrapper
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmitSetBillingStatus}>
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

            return (
              <Form onSubmit={handleSubmit}>
                {errors && errors.global && (
                  <ErrorMessage>{errors.global.toString()}</ErrorMessage>
                )}
                <SelectField
                  name="billingStatus"
                  onChange={handleSelectFiledChange("billingStatus")}
                  options={typeOptions}
                />
                <TextInput
                  label="Reason"
                  type="number"
                  value={values.reason}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.reason && errors.reason}
                />
                <Actions className="no-padding-bottom">
                  <Button
                    loading={isSubmitting}
                    kind={isValid ? "primary" : "disabled"}
                    type="submit">
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
