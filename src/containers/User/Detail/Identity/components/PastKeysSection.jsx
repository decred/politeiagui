import React from "react";
import { classNames, Text, Button, P, Modal } from "pi-ui";
import styles from "../Identity.module.css";
import IdentityList from "./IdentityList";
import useModalContext from "src/hooks/utils/useModalContext";

function KeysModal({ pastIdentities, ...props }) {
  return (
    <Modal {...props}>
      <IdentityList full identities={pastIdentities} />
    </Modal>
  );
}

export default ({ pastIdentities }) => {
  const [handleOpenModal, handleCloseModal] = useModalContext(false);

  const handleOpenKeysModal = () => {
    handleOpenModal(KeysModal, {
      onClose: handleCloseModal,
      title: "Past public keys",
      pastIdentities
    });
  };

  return pastIdentities ? (
    <>
      <Text
        weight="semibold"
        className={classNames(
          styles.block,
          styles.fieldHeading,
          "margin-bottom-s",
          "margin-top-l"
        )}
      >
        Past public keys
      </Text>
      <P>
        {pastIdentities.length !== 0
          ? "List of inactive public keys your account has had in the past."
          : "This account only had one active public key until now."}
      </P>
      {pastIdentities.length !== 0 && (
        <Button size="sm" kind="primary" onClick={handleOpenKeysModal}>
          Show all
        </Button>
      )}
    </>
  ) : null;
};
