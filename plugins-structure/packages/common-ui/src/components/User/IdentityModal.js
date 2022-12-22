import React from "react";
import { useFormContext } from "react-hook-form";
import { Modal, TextHighlighted } from "pi-ui";
import {
  ErrorMessage,
  FileInput,
  Input,
  ModalConfirm,
  ModalForm,
  SubmitButton,
  getMarkdownSection,
} from "@politeiagui/common-ui";
import { decodeFileText } from "@politeiagui/core/downloads";
import styles from "./styles.module.css";
import instructions from "../../assets/copies/identity.md";

const UploadIdentityButton = () => {
  const { watch, setValue, setError, formState, clearErrors, resetField } =
    useFormContext();
  watch(async (data, { name }) => {
    if (name === "file") {
      try {
        const fileJson = await decodeFileText(data.file?.[0]);
        const { publicKey, secretKey } = JSON.parse(fileJson);
        // TODO: Validate publickey and secretkey!
        if (publicKey && secretKey) {
          resetField("file");
          setValue("publicKey", publicKey);
          setValue("secretKey", secretKey);
          clearErrors();
        }
      } catch (_) {
        setError("file");
      }
    }
  });
  return (
    <>
      {formState.errors.file && <ErrorMessage error="Invalid identity file." />}
      <div className={styles.identityFile}>
        <FileInput
          name="file"
          placeholder="Upload json identity file"
          accept="application/JSON"
        />
        or paste your own
      </div>
    </>
  );
};

export const IdentityImportModal = ({
  onClose,
  show,
  title = "Import identity",
  onSubmit = () => {},
}) => {
  return (
    <ModalForm
      onSubmit={({ publicKey, secretKey }) =>
        onSubmit({ publicKey, secretKey })
      }
      autoComplete="off"
      onClose={onClose}
      show={show}
      title={title}
    >
      <UploadIdentityButton />
      <Input name="publicKey" label="Public Key" id="pubkey-input" />
      <Input name="secretKey" label="Private Key" id="privkey-input" />
      <SubmitButton data-testid="identity-import-button">
        Update Identity
      </SubmitButton>
    </ModalForm>
  );
};

export const IdentityCreateModal = ({ onClose, show, onSubmit = () => {} }) => {
  return (
    <ModalConfirm
      onClose={onClose}
      show={show}
      title="Create New identity"
      message={getMarkdownSection(instructions, "## Create New Identity")}
      successTitle="Activate your identity"
      successMessage={getMarkdownSection(
        instructions,
        "## Activate your identity"
      )}
      onSubmit={onSubmit}
      confirmButtonText="Create New Identity"
    />
  );
};

export const IdentityInactivePubkeysModal = ({
  onClose,
  show,
  keys,
  title = "Inactive Public Keys",
}) => (
  <Modal onClose={onClose} show={show} title={title}>
    <ol className={styles.inactivePubkeys}>
      {keys.map((k, i) => (
        <li key={i}>
          <TextHighlighted id={k.pubkey}>{k.pubkey}</TextHighlighted>
        </li>
      ))}
    </ol>
  </Modal>
);
