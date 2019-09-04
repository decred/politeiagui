import { Button, Modal, Text, TextInput } from "pi-ui";
import PropTypes from "prop-types";
import React, { useState } from "react";
import ReactFileReader from "react-file-reader";
import FormWrapper from "src/componentsv2/FormWrapper";
import { INVALID_FILE, INVALID_KEY_PAIR, LOAD_KEY_FAILED, PUBLIC_KEY_MISMATCH } from "src/constants";
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

const onSelectFiles = (setFileError, setFieldValue) => ({ base64 }) => {
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

const onSubmitFiles = (onIdentityImported, userPubkey, loggedInAsEmail, json, setFileError) => {
  try {
    auditIdentity(json, userPubkey, setFileError);
    pki
      .importKeys(loggedInAsEmail, json)
      .then(() => {
        onIdentityImported("Successfully imported identity");
      })
      .catch(e => {
        onIdentityImported(null, LOAD_KEY_FAILED);
        throw e;
      });
  } catch (e) {
    onIdentityImported(null, e);
    throw e;
  }
};

const ModalImportIdentity = ({
  show,
  onClose,
  validationSchema
}) => {
  const { onIdentityImported, userPubkey, loggedInAsEmail } = useUserIdentity();
  const [fileError, setFileError] = useState(null);
  const onSubmitNewIdentity = (
    values,
    { resetForm, setSubmitting, setFieldError }
  ) => {
    try {
      onSubmitFiles(onIdentityImported, userPubkey, loggedInAsEmail, values, setFileError);
      resetForm();
      setSubmitting(false);
    } catch (e) {
      setSubmitting(false);
      setFieldError("global", e);
    }
  };
  return (
    <Modal title="Import Identity" show={show} onClose={onClose}>
      <FormWrapper
        initialValues={{
          publicKey: "",
          secretKey: ""
        }}
        onSubmit={onSubmitNewIdentity}
        validationSchema={validationSchema}
      >
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
            values.publicKey && values.secretKey && isEmpty(errors) && !fileError;
          return (
            <Form onSubmit={handleSubmit}>
              {errors && errors.global && (
                <ErrorMessage>{errors.global.toString()}</ErrorMessage>
              )}
              {fileError && (
                <ErrorMessage>{fileError.toString()}</ErrorMessage>
              )}
              <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <ReactFileReader
                  base64
                  handleFiles={onSelectFiles(setFileError, setFieldValue)}
                  multipleFiles={false}
                  fileTypes="json"
                >
                  <Button type="button">
                    Upload json identity file
                  </Button>
                </ReactFileReader>
                <Text className="margin-top-l margin-bottom-m" color="grayDark">Or paste in your own</Text>
              </div>
              <TextInput
                id="publicKey"
                label="Public key" name="publicKey"
                value={values.publicKey}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <TextInput
                id="secretKey"
                label="Private key" name="secretKey"
                value={values.secretKey}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Actions>
                <Button
                  loading={isSubmitting}
                  kind={canSubmit ? "primary" : "disabled"}
                  type="submit"
                >
                  Submit Identity
                </Button>
              </Actions>
            </Form>
          );
        }}
      </FormWrapper>
    </Modal>
  );
};

ModalImportIdentity.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  handleSubmit: PropTypes.func,
  validationSchema: PropTypes.object
};

export default ModalImportIdentity;
