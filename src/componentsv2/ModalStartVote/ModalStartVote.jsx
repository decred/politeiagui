import React, { useState, useEffect, useContext } from "react";
import FormWrapper from "src/componentsv2/FormWrapper";
import {
  Button,
  Modal,
  TextInput,
  RadioButtonGroup,
  Icon,
  ThemeContext,
  getThemeProperty
} from "pi-ui";
import PropTypes from "prop-types";
import { useLoaderContext } from "src/Appv2/Loader";
import { validationSchema } from "./validation";

const preDefinedDurations = [2016, 2880, 4032];
const getDurationOptions = isTesnet => {
  const blockDuration = isTesnet ? 2 : 5;
  return preDefinedDurations.map(nb => ({
    value: nb,
    label: `${Math.round((nb * blockDuration) / 60 / 24)} days (${nb} blocks)`
  }));
};

const ModalStartVote = ({
  show,
  onClose,
  onSubmit,
  title,
  successMessage,
  successTitle
}) => {
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const { apiInfo } = useLoaderContext();
  const onSubmitChangePassword = async (
    values,
    { resetForm, setFieldError }
  ) => {
    setSubmitting(true);
    try {
      await onSubmit(values);
      resetForm();
      setSubmitting(false);
      setSuccess(true);
    } catch (e) {
      setSubmitting(false);
      setFieldError("global", e);
    }
  };
  useEffect(
    function clearOnClose() {
      if (!show) {
        setTimeout(() => setSuccess(false), 500);
      }
    },
    [show]
  );

  const { currentTheme } = useContext(ThemeContext);
  const colorGray = getThemeProperty(currentTheme, "color-gray");
  const colorPrimaryDark = getThemeProperty(currentTheme, "color-primary-dark");

  return (
    <Modal
      style={{ width: "600px" }}
      disableClose={isSubmitting}
      title={(success && successTitle) || title}
      show={show}
      onClose={onClose}
      iconComponent={
        !success ? (
          <Icon type={"info"} size={26} />
        ) : (
          <Icon
            type={"checkmark"}
            size={26}
            iconColor={colorPrimaryDark}
            backgroundColor={colorGray}
          />
        )
      }
    >
      {!success && (
        <FormWrapper
          initialValues={{
            duration: preDefinedDurations[0],
            quorumPercentage: 20,
            passPercentage: 60
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmitChangePassword}
        >
          {({
            Form,
            Actions,
            ErrorMessage,
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            errors,
            touched
          }) => {
            const canSubmit = true;
            function handleChangeDuration(v) {
              setFieldValue("duration", v.value);
            }
            return (
              <Form onSubmit={handleSubmit}>
                {errors && errors.global && (
                  <ErrorMessage>{errors.global.toString()}</ErrorMessage>
                )}
                <TextInput
                  label="Quorum Percentage"
                  id="quorumPercentage"
                  type="number"
                  value={values.quorumPercentage}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.quorumPercentage && errors.quorumPercentage}
                />
                <TextInput
                  label="Pass Percentage"
                  id="passPercentage"
                  type="number"
                  value={values.passPercentage}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.passPercentage && errors.passPercentage}
                />
                <RadioButtonGroup
                  label="Duration"
                  name="duration"
                  vertical
                  options={getDurationOptions(apiInfo.testnet)}
                  value={values.duration}
                  onChange={handleChangeDuration}
                />
                <Actions className="no-padding-bottom">
                  <Button
                    loading={isSubmitting}
                    kind={canSubmit ? "primary" : "disabled"}
                    type="submit"
                  >
                    Start Vote
                  </Button>
                </Actions>
              </Form>
            );
          }}
        </FormWrapper>
      )}
      {success && (
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

ModalStartVote.propTypes = {
  title: PropTypes.string,
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  successTitle: PropTypes.string,
  successMessage: PropTypes.node
};

ModalStartVote.defaultProps = {
  title: "Start Proposal Vote"
};

export default ModalStartVote;
