import React from "react";
import { Button, Link, Text } from "pi-ui";
import styles from "./styles.module.css";
import { InfoCard } from "../../../components";
import {
  IdentityCreateModal,
  IdentityDescription,
  IdentityImportModal,
  IdentityInactivePubkeysModal,
  useModal,
} from "@politeiagui/common-ui";
import { downloadJSON } from "@politeiagui/core/downloads";
import isEmpty from "lodash/isEmpty";
// Mock User
import { user } from "./_mock";

const TextHighlighted = ({ text }) => (
  <Text
    backgroundColor="blueLighter"
    monospace
    className={styles.textHighlight}
  >
    {text}
  </Text>
);

const TextUuidMessage = () => (
  <span>
    <Text>
      Unique 16-byte UUID, as defined in{" "}
      <Link
        target="_blank"
        href="https://tools.ietf.org/html/rfc4122"
        rel="noreferrer"
      >
        RFC 4122
      </Link>
      , used to identify your user.
    </Text>
  </span>
);

function UserIdentity({ userid }) {
  const activePubkey = user.identities.find((i) => i.isactive).pubkey;
  const inactivePubkeys = user.identities.filter((i) => !i.isactive);

  const [open] = useModal();

  function handleCreateIdentity() {
    open(IdentityCreateModal, {
      onSubmit: () => {
        console.log("Create Identity...");
      },
    });
  }
  function handleImportIdentity() {
    open(IdentityImportModal, {
      onSubmit: ({ publicKey, secretKey }) => {
        console.log("Import Identity...", { publicKey, secretKey });
      },
    });
  }
  function handleDownloadIdentity() {
    const mockIdentity = {
      publicKey: "abcdefghik",
      secretKey: "secret.abdoaibsoi",
    };
    downloadJSON(mockIdentity, "politeia-pki");
  }
  function handleShowPastPubkeys() {
    open(IdentityInactivePubkeysModal, { keys: inactivePubkeys });
  }

  return (
    <>
      <InfoCard title="Manage Identity" data-testid="user-identity-manage">
        <IdentityDescription />
        <div data-testid="user-identity-manage-buttons">
          <Button size="sm" onClick={handleCreateIdentity}>
            Create new Identity
          </Button>
          <Button size="sm" onClick={handleImportIdentity}>
            Import Identity
          </Button>
          <Button size="sm" onClick={handleDownloadIdentity}>
            Download Identity
          </Button>
        </div>
      </InfoCard>
      {activePubkey && (
        <InfoCard
          title="Active Public Key"
          data-testid="user-identity-active-pubkey"
        >
          <TextHighlighted text={activePubkey} />
        </InfoCard>
      )}
      {!isEmpty(inactivePubkeys) && (
        <InfoCard
          title="Past Public Keys"
          data-testid="user-identity-past-pubkeys"
        >
          <Text>
            List of inactive public keys your account has had in the past.
          </Text>
          <div>
            <Button size="sm" onClick={handleShowPastPubkeys}>
              Show All
            </Button>
          </div>
        </InfoCard>
      )}
      <InfoCard title="User ID" data-testid="user-identity-userid">
        <TextUuidMessage />
        <TextHighlighted text={userid} />
      </InfoCard>
    </>
  );
}

export default UserIdentity;
