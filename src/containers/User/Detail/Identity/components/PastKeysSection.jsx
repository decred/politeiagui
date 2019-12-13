import React from "react";
import { classNames, Text, Button, P, Modal } from "pi-ui";
import styles from "../Identity.module.css";
import useBooleanState from "src/hooks/utils/useBooleanState";
import IdentityList from "./IdentityList";

export default ({ pastIdentities }) => {
  const [
    showShowAllModal,
    openShowAllModal,
    closeShowAllModal
  ] = useBooleanState(false);
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
        <Button size="sm" kind="primary" onClick={openShowAllModal}>
          Show all
        </Button>
      )}
      <Modal
        show={showShowAllModal}
        onClose={closeShowAllModal}
        title="Past public keys"
      >
        <IdentityList full identities={pastIdentities} />
      </Modal>
    </>
  ) : null;
}
;
