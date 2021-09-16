import React, { useState, useEffect } from "react";
import FormWrapper from "src/components/FormWrapper";
import {
  Button,
  Modal,
  TextInput,
  RadioButtonGroup,
  Icon,
  useTheme,
  getThemeProperty
} from "pi-ui";
import PropTypes from "prop-types";
import { useLoaderContext } from "src/containers/Loader";
import { validationSchema } from "./validation";
import usePolicy from "src/hooks/api/usePolicy";
import { isRfpReadyToVote } from "src/containers/Proposal/helpers";
import { VOTE_TYPE_STANDARD, VOTE_TYPE_RUNOFF } from "src/constants";

const getRoundedAverage = (a, b) => Math.round((a + b) / 2);

const getBlockDurationArray = (min, max) => [
  min,
  getRoundedAverage(min, max),
  max
];

const getDurationOptions = (isTesnet, min, max) => {
  const blockDuration = isTesnet ? 2 : 5;
  return getBlockDurationArray(min, max).map((nb) => {
    const durationInDays = Math.round((nb * blockDuration) / 60 / 24);
    return {
      value: nb,
      label: `${
        durationInDays === 0 ? "less than a day" : `${durationInDays} days`
      } (${nb} blocks)`
    };
  });
};

const ModalStartVote = ({
  show,
  onClose,
  onSubmit,
  title,
  successMessage,
  successTitle,
  proposal,
  voteType
}) => {
  const [success, setSuccess] = useState(false);
  const { apiInfo } = useLoaderContext();
  const { theme } = useTheme();
  const {
    policyTicketVote: { linkbyperiodmin, votedurationmin, votedurationmax }
  } = usePolicy();
  const successIconBgColor = getThemeProperty(
    theme,
    "success-icon-background-color"
  );
  const iconCheckmarkColor = getThemeProperty(
    theme,
    "success-icon-checkmark-color"
  );
  const onSubmitStartVote = async (
    values,
    { resetForm, setFieldError, setSubmitting }
  ) => {
    try {
      const { linkby } = proposal;
      const isRfp = !!linkby;
      if (
        isRfp &&
        voteType === VOTE_TYPE_STANDARD &&
        !isRfpReadyToVote(linkby, linkbyperiodmin)
      ) {
        const days = linkbyperiodmin / (24 * 3600);
        throw Error(
          `RFP deadline should meet the minimum period to start voting which is about ${days} days from when the vote starts`
        );
      }
      await onSubmit(values);
      resetForm();
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

  const initialValues = {
    duration: getBlockDurationArray(votedurationmin, votedurationmax)[0],
    quorumPercentage: 20,
    passPercentage: 60
  };
  const isInitialValid = validationSchema(apiInfo.tesnet).isValidSync(
    initialValues
  );

  return (
    <Modal
      style={{ width: "600px" }}
      title={(success && successTitle) || title}
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
      {!success && (
        <FormWrapper
          initialValues={initialValues}
          validationSchema={validationSchema(apiInfo.testnet)}
          isInitialValid={isInitialValid}
          onSubmit={onSubmitStartVote}>
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
            errors,
            isSubmitting,
            touched
          }) => {
            const handleChangeDuration = (v) =>
              setFieldValue("duration", v.value);

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
                  options={getDurationOptions(
                    apiInfo.testnet,
                    votedurationmin,
                    votedurationmax
                  )}
                  value={values.duration}
                  onChange={handleChangeDuration}
                />
                <Actions className="no-padding-bottom">
                  <Button
                    loading={isSubmitting}
                    kind={isValid ? "primary" : "disabled"}
                    type="submit">
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
  successMessage: PropTypes.node,
  voteType: PropTypes.oneOf([VOTE_TYPE_STANDARD, VOTE_TYPE_RUNOFF]).isRequired
};

ModalStartVote.defaultProps = {
  title: "Start Proposal Vote"
};

export default ModalStartVote;
