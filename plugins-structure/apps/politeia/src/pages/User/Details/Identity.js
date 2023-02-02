import React from "react";
import { useSelector } from "react-redux";
import { Button, Link, Text } from "pi-ui";
import { downloadJSON } from "@politeiagui/core/downloads";
import { users } from "@politeiagui/core/user/users";
import { userAuth } from "@politeiagui/core/user/auth";
import {
  IdentityCreateModal,
  IdentityDescription,
  IdentityImportModal,
  IdentityInactivePubkeysModal,
  useModal,
} from "@politeiagui/common-ui";
import { InfoCard } from "../../../components";
import styles from "./styles.module.css";
import isEmpty from "lodash/isEmpty";

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

/**
 * ManageIdentitySection renders the Manage Identity section of the User Details
 * page. It allows the user to create, import, and download their identity.
 */
const ManageIdentitySection = () => {
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
  return (
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
  );
};

/**
 * PubkeysSection renders the active and past public keys of the user.
 */
const PubkeysSection = ({ user }) => {
  const [open] = useModal();
  const activePubkey = user.identities.find((i) => i.isactive).pubkey;
  const inactivePubkeys = user.identities.filter((i) => !i.isactive);
  function handleShowPastPubkeys() {
    open(IdentityInactivePubkeysModal, { keys: inactivePubkeys });
  }
  return (
    activePubkey && (
      <>
        <InfoCard
          title="Active Public Key"
          data-testid="user-identity-active-pubkey"
        >
          <TextHighlighted text={activePubkey} />
        </InfoCard>
        <InfoCard
          title="Past Public Keys"
          data-testid="user-identity-past-pubkeys"
        >
          <Text>
            List of inactive public keys your account has had in the past.
          </Text>
          <div>
            {!isEmpty(inactivePubkeys) ? (
              <Button size="sm" onClick={handleShowPastPubkeys}>
                Show All
              </Button>
            ) : (
              <Text color="gray">
                This account only had one active public key until now.
              </Text>
            )}
          </div>
        </InfoCard>
      </>
    )
  );
};

function UserIdentity({ userid }) {
  const user = useSelector((state) => users.selectById(state, userid));
  const currentUser = useSelector(userAuth.selectCurrent);
  const isOwner = currentUser && currentUser.userid === userid;

  return (
    <>
      {isOwner && <ManageIdentitySection />}
      <PubkeysSection user={user} />
      <InfoCard title="User ID" data-testid="user-identity-userid">
        <TextUuidMessage />
        <TextHighlighted text={userid} />
      </InfoCard>
    </>
  );
}

export default UserIdentity;
