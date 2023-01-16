import React, { useState } from "react";
import { Text, TextInput } from "pi-ui";
import styles from "./styles.module.css";
import { ModalConfirm } from "../Modal";

const ConfirmReason = ({ message, onChange }) => {
  const [value, setValue] = useState("");
  return (
    <div>
      <Text>{message}</Text>
      <TextInput
        id="reason"
        name="reason"
        label="Reason"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onBlur={(e) => {
          onChange(e.target.value);
        }}
      />
    </div>
  );
};

export const ModalConfirmWithReason = ({
  onClose,
  title = "Confirm Action",
  message = "Please, provide a reason for this action.",
  show,
  onSubmit,
  ...props
}) => {
  const [reason, setReason] = useState();
  function handleSubmit() {
    onSubmit(reason);
  }
  return (
    <ModalConfirm
      {...{ onClose, title, show, ...props }}
      className={styles.modalContent}
      message={<ConfirmReason message={message} onChange={setReason} />}
      onSubmit={handleSubmit}
    />
  );
};
