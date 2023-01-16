import React from "react";
import { useWatch } from "react-hook-form";
import { Text } from "pi-ui";
import { ModalForm, NumberInput, Payment } from "@politeiagui/common-ui";
import styles from "./styles.module.css";

const CreditsForm = ({ address }) => {
  const { credits } = useWatch("credits");
  return (
    <>
      <div className={styles.credits}>
        <div className={styles.input}>
          <Text>How many credits do you want to buy?</Text>
          <NumberInput name="credits" id="credits-input" />
        </div>
        <Text color="gray">Each proposal credit costs 0.1 DCR</Text>
      </div>
      <Payment address={address} value={credits / 10 || 0} />
    </>
  );
};

const CreditsModal = ({ address, onClose, show }) => {
  return (
    <ModalForm
      title="Purchase Proposal Credits"
      show={show}
      onClose={onClose}
      data-testid="credits-modal"
    >
      <CreditsForm address={address} />
    </ModalForm>
  );
};

export default CreditsModal;
