import React from "react";
import { Button, Link, Text } from "pi-ui";
import UserDetails from "./Details";
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
    <UserDetails>
      <InfoCard title="Manage Identity">
        <IdentityDescription />
        <div>
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
        <InfoCard title="Active Public Key">
          <TextHighlighted text={activePubkey} />
        </InfoCard>
      )}
      <InfoCard title="Past Public Keys">
        <Text>
          List of inactive public keys your account has had in the past.
        </Text>
        <div>
          <Button size="sm" onClick={handleShowPastPubkeys}>
            Show All
          </Button>
        </div>
      </InfoCard>
      <InfoCard title="User ID">
        <TextUuidMessage />
        <TextHighlighted text={userid} />
      </InfoCard>
    </UserDetails>
  );
}

export default UserIdentity;
