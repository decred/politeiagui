import {
  Button,
  getThemeProperty,
  Icon,
  Modal,
  Text,
  TextInput,
  useTheme
} from "pi-ui";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import ReactFileReader from "react-file-reader";
import FormWrapper from "src/components/FormWrapper";
import {
  INVALID_FILE,
  INVALID_KEY_PAIR,
  LOAD_KEY_FAILED,
  PUBLIC_KEY_MISMATCH
} from "src/constants";
import { getJsonData, isEmpty } from "src/helpers";
import useUserIdentity from "src/hooks/api/useUserIdentity";
import * as pki from "src/lib/pki";

const auditIdentity = (keys, userPubkey, setFileError) => {
  // check that the pubkey matches with the server one
  if (keys.publicKey !== userPubkey) {
    throw new Error(PUBLIC_KEY_MISMATCH);
  }

  // check that the key pair is valid
  if (!pki.verifyKeyPair(keys)) {
    throw new Error(INVALID_KEY_PAIR);
  }

  setFileError(null);
};

const onSelectFiles =
  (setFileError, setFieldValue) =>
  ({ base64 }) => {
    try {
      const json = getJsonData(base64);
      if (!json || !json.publicKey || !json.secretKey)
        throw new Error(INVALID_FILE);
      setFieldValue("publicKey", json.publicKey);
      setFieldValue("secretKey", json.secretKey);
      setFileError(null);
    } catch (e) {
      console.error(e.stack);
      setFileError(e);
    }
  };

const ModalImportIdentity = ({
  show,
  onClose,
  validationSchema,
  successMessage,
  successTitle
}) => {
  const { onIdentityImported, userPubkey, currentUserID, keyMismatchAction } =
    useUserIdentity();
  const [fileError, setFileError] = useState(null);
  const [success, setSuccess] = useState(null);

  const onSubmitNewIdentity = async (
    values,
    { resetForm, setSubmitting, setFieldError }
  ) => {
    try {
      await auditIdentity(values, userPubkey, setFileError);
      await pki.importKeys(currentUserID, values).catch(() => {
        throw new Error(LOAD_KEY_FAILED);
      });
      resetForm();
      setSuccess(true);
      keyMismatchAction(false);
      setSubmitting(false);
      onIdentityImported("Successfully imported identity");
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
      title={success ? successTitle : "Import Identity"}
      show={show}
      onClose={onClose}
      style={{ width: "600px" }}
      iconComponent={
        success && (
          <Icon
            type={"checkmark"}
            size={26}
            iconColor={iconCheckmarkColor}
            backgroundColor={successIconBgColor}
          />
        )
      }>
      {!success ? (
        <FormWrapper
          initialValues={{
            publicKey: "",
            secretKey: ""
          }}
          onSubmit={onSubmitNewIdentity}
          validationSchema={validationSchema}>
          {({
            Form,
            Actions,
            ErrorMessage,
            values,
            handleChange,
            handleBlur,
            setFieldValue,
            handleSubmit,
            isSubmitting,
            errors
          }) => {
            const canSubmit =
              values.publicKey &&
              values.secretKey &&
              isEmpty(errors) &&
              !fileError;
            return (
              <Form onSubmit={handleSubmit}>
                {errors && errors.global && (
                  <ErrorMessage>{errors.global.toString()}</ErrorMessage>
                )}
                {fileError && (
                  <ErrorMessage>{fileError.toString()}</ErrorMessage>
                )}
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                  }}>
                  <ReactFileReader
                    base64
                    handleFiles={onSelectFiles(setFileError, setFieldValue)}
                    multipleFiles={false}
                    fileTypes="json">
                    <Button type="button">Upload json identity file</Button>
                  </ReactFileReader>
                  <Text
                    className="margin-top-l margin-bottom-m"
                    color="grayDark">
                    Or paste in your own
                  </Text>
                </div>
                <TextInput
                  id="publicKey"
                  label="Public key"
                  name="publicKey"
                  value={values.publicKey}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <TextInput
                  id="secretKey"
                  label="Private key"
                  name="secretKey"
                  value={values.secretKey}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Actions className="no-padding-bottom">
                  <Button
                    loading={isSubmitting}
                    kind={canSubmit ? "primary" : "disabled"}
                    type="submit">
                    Update Identity
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

ModalImportIdentity.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  handleSubmit: PropTypes.func,
  validationSchema: PropTypes.object,
  successTitle: PropTypes.string,
  successMessage: PropTypes.node
};

ModalImportIdentity.defaultProps = {
  successTitle: "Identity imported successfully",
  successMessage: "Your keys were imported successfully"
};

export default ModalImportIdentity;
